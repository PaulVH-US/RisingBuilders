import Link from "next/link";
import { ProjectForm } from "~/components/project-form";
import { requireProfile } from "~/lib/auth";

export const metadata = { title: "New project · Rising Builders" };

export default async function NewProjectPage() {
  await requireProfile();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to projects
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Start a project
        </h1>
        <p className="text-sm text-muted-foreground">
          Post a small, concrete idea. Keep it tight so people can jump in fast.
        </p>
      </div>
      <ProjectForm />
    </main>
  );
}
