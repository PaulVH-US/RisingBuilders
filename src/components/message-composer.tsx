"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import {
  type ProjectFormState,
  postMessage,
} from "~/app/projects/project-actions";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

const initialState: ProjectFormState = { error: null };

export function MessageComposer({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(
    postMessage,
    initialState,
  );
  const ref = useRef<HTMLFormElement>(null);

  // Clear the box after a successful post.
  useEffect(() => {
    if (!pending && !state.error) ref.current?.reset();
  }, [pending, state]);

  return (
    <form ref={ref} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="project_id" value={projectId} />
      <Textarea
        name="content"
        placeholder="Message your team…"
        maxLength={2000}
        rows={2}
        required
      />
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" size="sm" disabled={pending} className="self-end">
        <Send className="size-4" />
        {pending ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
