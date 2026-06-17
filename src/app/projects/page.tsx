import { Mail, Plus, Telescope } from "lucide-react";
import Link from "next/link";
import { respondToInvitation } from "~/app/projects/project-actions";
import { FeedFilters } from "~/components/feed-filters";
import { GradientAvatar } from "~/components/gradient-avatar";
import { ProjectCard, type ProjectCardData } from "~/components/project-card";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { isActiveThisWeek, requireProfile } from "~/lib/auth";
import { createClient } from "~/lib/supabase/server";

export const metadata = { title: "Projects · Rising Builders" };

interface EmbeddedProject {
  id: string;
  title: string;
  description: string;
  category_tags: string[];
  skills_needed: string[];
  commitment_level: ProjectCardData["commitment_level"];
  creator: { username: string; last_active_at: string } | null;
  memberships: { profile: { username: string } | null }[];
}

interface InvitationRow {
  id: string;
  project_id: string;
  message: string | null;
  project: {
    title: string;
    creator: { username: string } | null;
  } | null;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; skill?: string; commitment?: string }>;
}) {
  const me = await requireProfile();
  const { tag, skill, commitment } = await searchParams;

  const supabase = await createClient();

  // Invitations this builder has received and not yet answered.
  const { data: inviteData } = await supabase
    .from("invitations")
    .select(
      "id,project_id,message,project:projects!invitations_project_id_fkey(title,creator:profiles!projects_creator_id_fkey(username))",
    )
    .eq("user_id", me.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .returns<InvitationRow[]>();
  const invitations = inviteData ?? [];
  let query = supabase
    .from("projects")
    .select(
      "id,title,description,category_tags,skills_needed,commitment_level,creator:profiles!projects_creator_id_fkey(username,last_active_at),memberships(profile:profiles!memberships_user_id_fkey(username))",
    )
    .order("created_at", { ascending: false });

  if (tag) query = query.contains("category_tags", [tag]);
  if (skill) query = query.contains("skills_needed", [skill]);
  if (
    commitment === "low" ||
    commitment === "medium" ||
    commitment === "high"
  ) {
    query = query.eq("commitment_level", commitment);
  }

  const { data } = await query.returns<EmbeddedProject[]>();

  const projects: ProjectCardData[] = (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category_tags: p.category_tags,
    skills_needed: p.skills_needed,
    commitment_level: p.commitment_level,
    creatorUsername: p.creator?.username ?? "unknown",
    creatorActive: p.creator
      ? isActiveThisWeek(p.creator.last_active_at)
      : false,
    memberCount: p.memberships.length,
    memberUsernames: p.memberships
      .map((m) => m.profile?.username)
      .filter((u): u is string => Boolean(u)),
  }));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex animate-rise items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Discover projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Find a team to build with, or start your own.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      {invitations.length > 0 && (
        <section className="flex animate-rise flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="size-4 text-primary" />
            Invitations ({invitations.length})
          </h2>
          {invitations.map((inv) => (
            <Card key={inv.id} className="gap-2 p-3">
              <div className="flex items-center gap-2">
                <GradientAvatar
                  name={inv.project?.creator?.username ?? "?"}
                  size={28}
                />
                <p className="text-sm">
                  <span className="font-medium">
                    @{inv.project?.creator?.username ?? "someone"}
                  </span>{" "}
                  invited you to{" "}
                  <Link
                    href={`/projects/${inv.project_id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {inv.project?.title ?? "a project"}
                  </Link>
                </p>
              </div>
              {inv.message && (
                <p className="text-sm text-muted-foreground">{inv.message}</p>
              )}
              <div className="flex gap-2">
                <form action={respondToInvitation} className="flex-1">
                  <input type="hidden" name="invitation_id" value={inv.id} />
                  <input
                    type="hidden"
                    name="project_id"
                    value={inv.project_id}
                  />
                  <input type="hidden" name="decision" value="accept" />
                  <Button type="submit" size="sm" className="w-full">
                    Accept
                  </Button>
                </form>
                <form action={respondToInvitation} className="flex-1">
                  <input type="hidden" name="invitation_id" value={inv.id} />
                  <input
                    type="hidden"
                    name="project_id"
                    value={inv.project_id}
                  />
                  <input type="hidden" name="decision" value="decline" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Decline
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </section>
      )}

      <div className="animate-rise" style={{ animationDelay: "60ms" }}>
        <FeedFilters tag={tag} skill={skill} commitment={commitment} />
      </div>

      {projects.length === 0 ? (
        <div className="flex animate-rise flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Telescope className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            No projects match these filters yet.
          </p>
          {(tag || skill || commitment) && (
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">Clear filters</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(i, 8) * 60 + 100}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
