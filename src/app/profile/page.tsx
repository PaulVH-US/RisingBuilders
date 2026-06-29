import { updateProfile } from "~/app/profile-actions";
import { CountUp } from "~/components/count-up";
import { GradientAvatar } from "~/components/gradient-avatar";
import { ProfileForm } from "~/components/profile-form";
import { ProjectCard, type ProjectCardData } from "~/components/project-card";
import { Badge } from "~/components/ui/badge";
import { isActiveThisWeek, requireProfile } from "~/lib/auth";
import { GOAL_LABELS } from "~/lib/constants";
import { createClient } from "~/lib/supabase/server";

export const metadata = { title: "Your profile · Rising Builders" };

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

export default async function ProfilePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ count }, { data: projectData }] = await Promise.all([
    supabase
      .from("memberships")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase
      .from("projects")
      .select(
        "id,title,description,category_tags,skills_needed,commitment_level,creator:profiles!projects_creator_id_fkey(username,last_active_at),memberships(profile:profiles!memberships_user_id_fkey(username))",
      )
      .eq("creator_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<EmbeddedProject[]>(),
  ]);

  const myProjects: ProjectCardData[] = (projectData ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category_tags: p.category_tags,
    skills_needed: p.skills_needed,
    commitment_level: p.commitment_level,
    creatorUsername: p.creator?.username ?? profile.username,
    creatorActive: p.creator ? isActiveThisWeek(p.creator.last_active_at) : false,
    memberCount: p.memberships.length,
    memberUsernames: p.memberships
      .map((m) => m.profile?.username)
      .filter((u): u is string => Boolean(u)),
  }));

  const active = isActiveThisWeek(profile.last_active_at);

  return (
    <main className="mx-auto flex max-w-xl animate-rise flex-col gap-8 px-4 py-8">
      {/* Banner + avatar header */}
      <div>
        <div className="bg-rising h-28 rounded-2xl" />
        <div className="-mt-10 flex flex-col items-center gap-1 px-4 text-center">
          <GradientAvatar
            name={`${profile.first_name} ${profile.last_name}`}
            size={80}
            className="ring-4 ring-background"
          />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          <Badge variant="outline">{GOAL_LABELS[profile.goal]}</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/60 p-4">
          <p className="text-sm text-muted-foreground">Projects joined</p>
          <CountUp
            value={count ?? 0}
            className="font-display text-2xl font-semibold"
          />
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-muted/60 p-4">
          <p className="text-sm text-muted-foreground">Activity</p>
          <span className="flex items-center gap-2">
            {active && (
              <span className="pulse-ring size-2 rounded-full bg-success" />
            )}
            <span className="font-display text-lg font-semibold">
              {active ? "Active this week" : "Inactive"}
            </span>
          </span>
        </div>
      </div>

      {/* Your projects */}
      {myProjects.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold">Your projects</h2>
          <div className="flex flex-col gap-3">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">Edit profile</h2>
        <p className="text-sm text-muted-foreground">
          This is what other builders see when they find you.
        </p>
      </div>

      <ProfileForm
        action={updateProfile}
        defaults={profile}
        submitLabel="Save changes"
        showSaved
      />
    </main>
  );
}
