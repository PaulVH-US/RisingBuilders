import { FolderKanban, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";
import { GradientAvatar } from "~/components/gradient-avatar";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { requireAdmin } from "~/lib/auth";
import { createClient } from "~/lib/supabase/server";

export const metadata = { title: "Admin · Rising Builders" };

interface AdminProfile {
  id: string;
  username: string;
  goal: string;
  skills: string[];
  created_at: string;
}

interface AdminProject {
  id: string;
  title: string;
  description: string;
  created_at: string;
  creator: { username: string } | null;
}

interface AdminMessage {
  id: string;
  content: string;
  created_at: string;
  author: { username: string } | null;
  project: { id: string; title: string } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminPage() {
  // Admin-only: redirects non-admins to the feed.
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: profileCount },
    { count: projectCount },
    { count: messageCount },
    { data: profileData },
    { data: projectData },
    { data: messageData },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id,username,goal,skills,created_at")
      .order("created_at", { ascending: false })
      .returns<AdminProfile[]>(),
    supabase
      .from("projects")
      .select(
        "id,title,description,created_at,creator:profiles!projects_creator_id_fkey(username)",
      )
      .order("created_at", { ascending: false })
      .returns<AdminProject[]>(),
    supabase
      .from("messages")
      .select(
        "id,content,created_at,author:profiles!messages_user_id_fkey(username),project:projects!messages_project_id_fkey(id,title)",
      )
      .order("created_at", { ascending: true })
      .returns<AdminMessage[]>(),
  ]);

  const profiles = profileData ?? [];
  const projects = projectData ?? [];
  const messages = messageData ?? [];

  // Group all discussions by their team space (project) for display.
  const spaces = new Map<string, { title: string; messages: AdminMessage[] }>();
  for (const m of messages) {
    if (!m.project) continue;
    const space = spaces.get(m.project.id) ?? {
      title: m.project.title,
      messages: [],
    };
    space.messages.push(m);
    spaces.set(m.project.id, space);
  }

  const stats = [
    { label: "Profiles", value: profileCount ?? 0, icon: Users },
    { label: "Projects", value: projectCount ?? 0, icon: FolderKanban },
    { label: "Discussions", value: messageCount ?? 0, icon: MessagesSquare },
  ];

  return (
    <main className="mx-auto flex max-w-3xl animate-rise flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Admin
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform overview across every builder, project, and team space.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-muted/60 p-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="size-4" />
              {label}
            </span>
            <p className="font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Profiles */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">
          All profiles ({profiles.length})
        </h2>
        <Card className="gap-0 py-0">
          {profiles.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i > 0 ? "border-t" : ""
              }`}
            >
              <GradientAvatar name={p.username} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">@{p.username}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.skills.length > 0 ? p.skills.join(", ") : "No skills yet"}
                </p>
              </div>
              <Badge variant="outline">{p.goal}</Badge>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(p.created_at)}
              </span>
            </div>
          ))}
        </Card>
      </section>

      {/* Projects */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">
          All projects ({projects.length})
        </h2>
        <Card className="gap-0 py-0">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className={`flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/50 ${
                i > 0 ? "border-t" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(p.created_at)}
                </span>
              </div>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {p.description}
              </p>
              <p className="text-xs text-muted-foreground">
                by @{p.creator?.username ?? "unknown"}
              </p>
            </Link>
          ))}
        </Card>
      </section>

      {/* Discussions across every team space */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">
          Team-space discussions
        </h2>
        <p className="-mt-2 text-sm text-muted-foreground">
          Private discussions from every project's team space.
        </p>
        {spaces.size === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No discussions yet.
          </p>
        ) : (
          [...spaces.entries()].map(([id, space]) => (
            <Card key={id} className="gap-3 py-4">
              <Link
                href={`/projects/${id}`}
                className="px-4 text-sm font-semibold hover:underline"
              >
                {space.title}
                <span className="ml-2 font-normal text-muted-foreground">
                  ({space.messages.length})
                </span>
              </Link>
              <div className="flex flex-col gap-3 px-4">
                {space.messages.map((m) => (
                  <div key={m.id} className="flex items-start gap-2">
                    <GradientAvatar
                      name={m.author?.username ?? "?"}
                      size={28}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          @{m.author?.username ?? "unknown"}
                        </span>{" "}
                        · {formatDate(m.created_at)}
                      </p>
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
