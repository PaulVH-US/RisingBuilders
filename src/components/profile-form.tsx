"use client";

import { useActionState } from "react";
import type { ProfileFormState } from "~/app/profile-actions";
import { TagInput } from "~/components/tag-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { GOAL_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS } from "~/lib/constants";
import type { Profile } from "~/lib/types";
import { cn } from "~/lib/utils";

type Action = (
  state: ProfileFormState,
  formData: FormData,
) => Promise<ProfileFormState>;

interface ProfileFormProps {
  action: Action;
  defaults?: Profile | null;
  submitLabel: string;
  showSaved?: boolean;
}

const initialState: ProfileFormState = { error: null };

export function ProfileForm({
  action,
  defaults,
  submitLabel,
  showSaved = false,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const saved =
    showSaved && !pending && state.error === null && state !== initialState;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="adabuilds"
          defaultValue={defaults?.username}
          required
        />
        <p className="text-xs text-muted-foreground">
          3–20 characters: letters, numbers, underscores.
        </p>
      </div>

      <TagInput
        name="skills"
        label="Skills"
        placeholder="Add a skill (e.g. coding)"
        suggestions={SKILL_OPTIONS}
        defaultValue={defaults?.skills}
      />

      <TagInput
        name="interests"
        label="Interests"
        placeholder="Add an interest (e.g. AI)"
        suggestions={INTEREST_OPTIONS}
        defaultValue={defaults?.interests}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Your goal</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {GOAL_OPTIONS.map((option, i) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm transition-colors",
                "hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent",
              )}
            >
              <input
                type="radio"
                name="goal"
                value={option.value}
                defaultChecked={
                  defaults ? defaults.goal === option.value : i === 0
                }
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="linkedin_url">
          LinkedIn <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="linkedin_url"
          name="linkedin_url"
          type="url"
          inputMode="url"
          placeholder="https://linkedin.com/in/you"
          defaultValue={defaults?.linkedin_url ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          A lightweight way to show you're a serious builder.
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {saved && (
        <p
          className="text-sm text-emerald-600 dark:text-emerald-400"
          role="status"
        >
          Profile saved.
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
