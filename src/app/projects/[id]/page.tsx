import { ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  leaveProject,
  removeMember,
  requestToJoin,
  respondToInvitation,
  respondToRequest,
  withdrawRequest,
} from "~/app/projects/project-actions";
import { CommitmentMeter } from "~/components/commitment-meter";
import { GradientAvatar } from "~/components/gradient-avatar";
import { MessageComposer } from "~/components/message-composer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { isActiveThisWeek, requireProfile } from "~/lib/auth";
import { createClient } from "~/lib/supabase/server";
import type { CommitmentLevel } from "~/lib/types";
import { cn, timeAgo } from "~/lib/utils";

import { AcceptRequestButton } from "./accept-request-button";
import { DeleteProjectButton } from "./delete-project-button";

interface ProjectRow {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category_tags: string[];
  skills_needed: string[];
  commitment_level: CommitmentLevel;
  created_at: string;
  creator: { username: string; linkedin_url: string | null } | null;
}

interface MemberRow {
  user_id: string;
  role: "owner" | "member";
  profile: {
    username: string;
    last_active_at: string;
    linkedin_url: string | null;
  } | null;
}

interface RequestRow {
  id: string;
  user_id: string;
  message: string | null;
  created_at: string;
  profile: { username: string; linkedin_url: string | null } | null;
}

interface MessageRow {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: { username: string } | null;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireProfile();
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      "id,creator_id,title,description,category_tags,skills_needed,commitment_level,created_at,creator:profiles!projects_creator_id_fkey(username,linkedin_url)",
    )
    .eq("id", id)
    .maybeSingle<ProjectRow>();

  if (!project) notFound();

  const { data: memberData } = await supabase
    .from("memberships")
    .select(
      "user_id,role,profile:profiles!memberships_user_id_fkey(username,last_active_at,linkedin_url)",
    )
    .eq("project_id", id)
    .order("role", { ascending: true })
    .returns<MemberRow[]>();

  const members = memberData ?? [];
  const isOwner = project.creator_id === me.id;
  const isMember = members.some((m) => m.user_id === me.id);

  const { data: myRequest } = await supabase
    .from("join_requests")
    .select("status")
    .eq("project_id", id)
    .eq("user_id", me.id)
    .maybeSingle<{ status: "pending" | "accepted" | "rejected" }>();

  // A pending invitation from the creator to this viewer (if any).
  const { data: myInvite } = await supabase
    .from("invitations")
    .select("id,message")
    .eq("project_id", id)
    .eq("user_id", me.id)
    .eq("status", "pending")
    .maybeSingle<{ id: string; message: string | null }>();

  let pendingRequests: RequestRow[] = [];
  if (isOwner) {
    const { data } = await supabase
      .from("join_requests")
      .select(
        "id,user_id,message,created_at,profile:profiles!join_requests_user_id_fkey(username,linkedin_url)",
      )
      .eq("project_id", id)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .returns<RequestRow[]>();
    pendingRequests = data ?? [];
  }

  let messages: MessageRow[] = [];
  if (isMember) {
    const { data } = await supabase
      .from("messages")
      .select(
        "id,user_id,content,created_at,author:profiles!messages_user_id_fkey(username)",
      )
      .eq("project_id", id)
      .order("created_at", { ascending: true })
      .returns<MessageRow[]>();
    messages = data ?? [];
  }

  let lastDay = "";

  return (
    <main className="mx-auto flex max-w-3xl animate-rise flex-col gap-6 px-4 py-8">
      <Link
        href="/projects"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <GradientAvatar name={project.creator?.username ?? "?"} size={48} />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {project.title}
              </h1>
              <CommitmentMeter level={project.commitment_level} />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>
                by{" "}
                <span className="font-medium text-foreground">
                  @{project.creator?.username ?? "unknown"}
                </span>
              </span>
              {project.creator?.linkedin_url && (
                <a
                  href={project.creator.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  LinkedIn
                </a>
              )}
              <span>· {timeAgo(project.created_at)}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">{project.description}</p>

        {(project.category_tags.length > 0 ||
          project.skills_needed.length > 0) && (
          <div className="flex flex-col gap-2">
            {project.skills_needed.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Skills needed:
                </span>
                {project.skills_needed.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
            {project.category_tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Tags:</span>
                {project.category_tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <JoinPanel
        isOwner={isOwner}
        isMember={isMember}
        status={myRequest?.status ?? null}
        invitation={myInvite}
        projectId={project.id}
      />

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        {/* Team space */}
        <section className="flex flex-col gap-3 md:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Team space
          </h2>
          {isMember ? (
            <Card className="gap-4 p-4">
              <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Kick things off below.
                  </p>
                ) : (
                  messages.map((m) => {
                    const label = dayLabel(m.created_at);
                    const showDivider = label !== lastDay;
                    lastDay = label;
                    const mine = m.user_id === me.id;
                    const author = m.author?.username ?? "unknown";
                    return (
                      <div key={m.id} className="flex flex-col gap-3">
                        {showDivider && (
                          <div className="flex items-center gap-2 py-1">
                            <Separator className="flex-1" />
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {label}
                            </span>
                            <Separator className="flex-1" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "flex items-end gap-2",
                            mine && "flex-row-reverse",
                          )}
                        >
                          <GradientAvatar name={author} size={28} />
                          <div
                            className={cn(
                              "flex max-w-[78%] flex-col gap-1",
                              mine && "items-end",
                            )}
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-medium">
                                @{author}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {timeAgo(m.created_at)}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                                mine
                                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                                  : "rounded-tl-sm bg-muted",
                              )}
                            >
                              {m.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <Separator />
              <MessageComposer projectId={project.id} />
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                The team space is visible to members. Join the project to see
                and post messages.
              </p>
            </Card>
          )}
        </section>

        {/* Sidebar: members + requests */}
        <aside className="flex flex-col gap-6 md:order-2">
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Members ({members.length})
            </h2>
            <div className="flex flex-col gap-2">
              {members.map((m) => (
                <div
                  key={m.user_id}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <GradientAvatar
                      name={m.profile?.username ?? "?"}
                      size={28}
                    />
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-medium">
                        @{m.profile?.username ?? "unknown"}
                      </span>
                      {m.role === "owner" && (
                        <Crown className="size-3.5 shrink-0 text-sunrise" />
                      )}
                      {m.profile &&
                        isActiveThisWeek(m.profile.last_active_at) && (
                          <span className="pulse-ring size-1.5 shrink-0 rounded-full bg-success" />
                        )}
                    </span>
                  </div>
                  {isOwner && m.user_id !== me.id && (
                    <form action={removeMember}>
                      <input
                        type="hidden"
                        name="project_id"
                        value={project.id}
                      />
                      <input type="hidden" name="member_id" value={m.user_id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="xs"
                        className="text-muted-foreground"
                      >
                        Remove
                      </Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </section>

          {isOwner && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Join requests ({pendingRequests.length})
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending requests.
                </p>
              ) : (
                pendingRequests.map((r) => (
                  <Card key={r.id} className="gap-2 p-3">
                    <div className="flex items-center gap-2">
                      <GradientAvatar
                        name={r.profile?.username ?? "?"}
                        size={28}
                      />
                      <span className="text-sm font-medium">
                        @{r.profile?.username ?? "unknown"}
                      </span>
                      {r.profile?.linkedin_url && (
                        <a
                          href={r.profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground underline hover:text-foreground"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                    {r.message && (
                      <p className="text-sm text-muted-foreground">
                        {r.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <AcceptRequestButton
                        requestId={r.id}
                        projectId={project.id}
                        requesterId={r.user_id}
                      />
                      <form action={respondToRequest} className="flex-1">
                        <input type="hidden" name="request_id" value={r.id} />
                        <input
                          type="hidden"
                          name="project_id"
                          value={project.id}
                        />
                        <input
                          type="hidden"
                          name="requester_id"
                          value={r.user_id}
                        />
                        <input type="hidden" name="decision" value="reject" />
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          Reject
                        </Button>
                      </form>
                    </div>
                  </Card>
                ))
              )}
            </section>
          )}

          {isOwner && <DeleteProjectButton projectId={project.id} />}
        </aside>
      </div>
    </main>
  );
}

function JoinPanel({
  isOwner,
  isMember,
  status,
  invitation,
  projectId,
}: {
  isOwner: boolean;
  isMember: boolean;
  status: "pending" | "accepted" | "rejected" | null;
  invitation: { id: string; message: string | null } | null;
  projectId: string;
}) {
  if (isOwner) return null;

  if (isMember) {
    return (
      <Card className="flex-row items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-muted-foreground">You're on this team.</p>
        <form action={leaveProject}>
          <input type="hidden" name="project_id" value={projectId} />
          <Button type="submit" variant="outline" size="sm">
            Leave
          </Button>
        </form>
      </Card>
    );
  }

  if (invitation) {
    return (
      <Card className="gap-3 border-l-4 border-l-primary p-4">
        <p className="text-sm font-medium">
          You've been invited to join this project.
        </p>
        {invitation.message && (
          <p className="text-sm text-muted-foreground">{invitation.message}</p>
        )}
        <div className="flex gap-2">
          <form action={respondToInvitation}>
            <input type="hidden" name="invitation_id" value={invitation.id} />
            <input type="hidden" name="project_id" value={projectId} />
            <input type="hidden" name="decision" value="accept" />
            <Button type="submit" size="sm">
              Accept invite
            </Button>
          </form>
          <form action={respondToInvitation}>
            <input type="hidden" name="invitation_id" value={invitation.id} />
            <input type="hidden" name="project_id" value={projectId} />
            <input type="hidden" name="decision" value="decline" />
            <Button type="submit" size="sm" variant="outline">
              Decline
            </Button>
          </form>
        </div>
      </Card>
    );
  }

  if (status === "pending") {
    return (
      <Card className="flex-row items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Your request is pending the creator's review.
        </p>
        <form action={withdrawRequest}>
          <input type="hidden" name="project_id" value={projectId} />
          <Button type="submit" variant="outline" size="sm">
            Withdraw
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card className="gap-3 border-l-4 border-l-primary p-4">
      <p className="text-sm font-medium">
        {status === "rejected"
          ? "Your previous request wasn't accepted. You can ask again."
          : "Want in? Send a request to join the team."}
      </p>
      <form action={requestToJoin} className="flex flex-col gap-2">
        <input type="hidden" name="project_id" value={projectId} />
        <Textarea
          name="message"
          placeholder="Optional: tell the creator how you'd help."
          maxLength={280}
          rows={2}
        />
        <Button type="submit" size="sm" className="self-start">
          Request to join
        </Button>
      </form>
    </Card>
  );
}
