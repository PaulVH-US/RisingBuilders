import { BuilderFilters } from "~/components/builder-filters";
import { GradientAvatar } from "~/components/gradient-avatar";
import { InviteBuilderButton } from "~/components/invite-builder-button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { isActiveThisWeek, requireProfile } from "~/lib/auth";
import { GOAL_LABELS } from "~/lib/constants";
import { createClient } from "~/lib/supabase/server";
import type { Goal, Profile } from "~/lib/types";

export const metadata = { title: "Builders · Rising Builders" };

export default async function BuildersPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; interest?: string; goal?: string }>;
}) {
  const me = await requireProfile();
  const { skill, interest, goal } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("last_active_at", { ascending: false });

  if (skill) query = query.contains("skills", [skill]);
  if (interest) query = query.contains("interests", [interest]);
  if (goal === "start" || goal === "join" || goal === "explore") {
    query = query.eq("goal", goal as Goal);
  }

  const { data } = await query.returns<Profile[]>();
  const builders = (data ?? []).filter((p) => p.id !== me.id);

  // The current user's own projects power the "invite to project" picker.
  const { data: myProjects } = await supabase
    .from("projects")
    .select("id,title")
    .eq("creator_id", me.id)
    .order("created_at", { ascending: false })
    .returns<{ id: string; title: string }[]>();

  const projects = myProjects ?? [];

  return (
    <main className="mx-auto flex max-w-3xl animate-rise flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Builders
        </h1>
        <p className="text-sm text-muted-foreground">
          Find serious collaborators by skills and interests.
        </p>
      </div>

      <div className="animate-rise" style={{ animationDelay: "60ms" }}>
        <BuilderFilters skill={skill} interest={interest} goal={goal} />
      </div>

      {builders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No builders match these filters yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {builders.map((b, i) => (
            <Card
              key={b.id}
              className="animate-rise gap-3 p-5"
              style={{ animationDelay: `${Math.min(i, 8) * 60 + 80}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <GradientAvatar name={b.username} size={36} />
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-semibold">
                      @{b.username}
                    </span>
                    {isActiveThisWeek(b.last_active_at) && (
                      <span className="pulse-ring size-1.5 rounded-full bg-success" />
                    )}
                  </div>
                </div>
                <Badge variant="outline">{GOAL_LABELS[b.goal]}</Badge>
              </div>

              {b.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {b.skills.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}

              {b.interests.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Interested in {b.interests.join(", ")}
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                {b.linkedin_url ? (
                  <a
                    href={b.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium underline hover:text-foreground"
                  >
                    LinkedIn ↗
                  </a>
                ) : (
                  <span />
                )}
                <InviteBuilderButton
                  builderId={b.id}
                  builderUsername={b.username}
                  projects={projects}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
