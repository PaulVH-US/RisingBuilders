"use client";

import { Check, Send, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";
import {
  inviteBuilder,
  type ProjectFormState,
} from "~/app/projects/project-actions";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

const initial: ProjectFormState = { error: null };

interface Props {
  builderId: string;
  builderUsername: string;
  projects: { id: string; title: string }[];
}

// Lets a project creator invite a builder to one of their projects with a note.
export function InviteBuilderButton({
  builderId,
  builderUsername,
  projects,
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(inviteBuilder, initial);

  if (projects.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        title="Create a project first to invite builders"
      >
        <UserPlus className="size-4" />
        Invite
      </Button>
    );
  }

  if (state.ok) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
        <Check className="size-4" />
        Invited @{builderUsername}
      </span>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="size-4" />
        Invite
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2 rounded-lg border p-3"
    >
      <input type="hidden" name="user_id" value={builderId} />
      <span className="text-xs font-medium">Invite @{builderUsername} to</span>
      <select
        name="project_id"
        defaultValue={projects[0].id}
        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
      <Textarea
        name="message"
        rows={2}
        maxLength={280}
        placeholder="Add a note (optional)"
      />
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          <Send className="size-4" />
          {pending ? "Sending…" : "Send invite"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
