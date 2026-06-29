import Link from "next/link";
import { Suspense } from "react";
import { BuilderFilters } from "~/components/builder-filters";
import { GradientAvatar } from "~/components/gradient-avatar";
import { InviteBuilderButton } from "~/components/invite-builder-button";
import { SearchBar } from "~/components/search-bar";
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
  searchParams: Promise<{
    skill?: string;
    interest?: string;
    goal?: string;
    q?: string;
  }>;
}) {
  const me = await requireProfile();
  const { skill, interest, goal, q } = await searchParams;
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
  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,username.ilike.%${q}%`,
    );
  }

  const { data } = await query.returns<Profile[]>();
  const builders = (data ?? []).filter((p) => p.id !== me.id);

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

      <Suspense fallback={<div className="h-10 rounded-md bg-muted/40 animate-pulse" />}>
        <SearchBar placeholder="Search by name…" />
      </Suspense>

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
              className="relative animate-rise gap-3 p-5 transition-shadow hover:shadow-md"
              style={{ animationDelay: `${Math.min(i, 8) * 60 + 80}ms` }}
            >
              <Link
                href={`/builders/${b.username}`}
                className="absolute inset-0 z-0 rounded-[inherit]"
                aria-label={`View ${b.first_name} ${b.last_name}'s profile`}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <GradientAvatar
                    name={`${b.first_name} ${b.last_name}`}
                    size={36}
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-semibold">
                        {b.first_name} {b.last_name}
                      </span>
                      {isActiveThisWeek(b.last_active_at) && (
                        <span className="pulse-ring size-1.5 rounded-full bg-success" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      @{b.username}
                    </span>
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

              {[b.activity_1, b.activity_2, b.activity_3]
                .filter(Boolean)
                .slice(0, 2)
                .map((act, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground line-clamp-2">
                    {act}
                  </p>
                ))}

              <div className="relative z-10 flex justify-end pt-1">
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
