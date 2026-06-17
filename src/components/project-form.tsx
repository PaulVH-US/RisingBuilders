"use client";

import { useActionState, useState } from "react";
import {
  createProject,
  type ProjectFormState,
} from "~/app/projects/project-actions";
import { TagInput } from "~/components/tag-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  CATEGORY_OPTIONS,
  COMMITMENT_OPTIONS,
  SKILL_OPTIONS,
} from "~/lib/constants";
import { cn } from "~/lib/utils";

const initialState: ProjectFormState = { error: null };
const MAX_DESC = 280;

export function ProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );
  const [desc, setDesc] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="StudyFlow"
          maxLength={120}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">One-line description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What are you building, in one sentence?"
          maxLength={MAX_DESC}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <p className="self-end text-xs text-muted-foreground">
          {desc.length}/{MAX_DESC}
        </p>
      </div>

      <TagInput
        name="category_tags"
        label="Category tags"
        placeholder="Add a category (e.g. education)"
        suggestions={CATEGORY_OPTIONS}
      />

      <TagInput
        name="skills_needed"
        label="Skills needed"
        placeholder="Add a skill (e.g. design)"
        suggestions={SKILL_OPTIONS}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Commitment level</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {COMMITMENT_OPTIONS.map((option, i) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm transition-colors",
                "hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent",
              )}
            >
              <input
                type="radio"
                name="commitment_level"
                value={option.value}
                defaultChecked={i === 1}
                className="sr-only"
              />
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Posting…" : "Post project"}
      </Button>
    </form>
  );
}
