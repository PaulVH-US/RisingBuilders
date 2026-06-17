"use client";

import { deleteProject } from "~/app/projects/project-actions";
import { Button } from "~/components/ui/button";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(e) => {
        if (
          !confirm(
            "Delete this project? This removes the team space, members, and requests.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="project_id" value={projectId} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        Delete project
      </Button>
    </form>
  );
}
