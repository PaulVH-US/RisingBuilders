"use client";

import { useActionState } from "react";
import type { ProfileFormState } from "~/app/profile-actions";
import { TagInput } from "~/components/tag-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="Ada"
            defaultValue={defaults?.first_name ?? ""}
            autoComplete="given-name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Lovelace"
            defaultValue={defaults?.last_name ?? ""}
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <TagInput
        name="skills"
        label="Skills"
        placeholder="Type and press Enter or click Add"
        suggestions={SKILL_OPTIONS}
        defaultValue={defaults?.skills}
      />

      <TagInput
        name="interests"
        label="Interests"
        placeholder="Type and press Enter or click Add"
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

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-sm font-medium">Activities</span>
          <p className="mt-1 text-xs text-muted-foreground">
            Share up to 3 activities — clubs, projects, sports, jobs, anything
            you do. Max 300 characters each.
          </p>
        </div>
        {(
          [
            ["activity_1", defaults?.activity_1],
            ["activity_2", defaults?.activity_2],
            ["activity_3", defaults?.activity_3],
          ] as const
        ).map(([fieldName, defaultVal], i) => (
          <div key={fieldName} className="flex flex-col gap-2">
            <Label htmlFor={fieldName}>
              Activity {i + 1}{" "}
              {i > 0 && (
                <span className="text-muted-foreground">(optional)</span>
              )}
            </Label>
            <Textarea
              id={fieldName}
              name={fieldName}
              defaultValue={defaultVal ?? ""}
              placeholder={
                i === 0
                  ? "e.g. Founder of a climate-tech startup focused on food waste"
                  : i === 1
                    ? "e.g. Varsity debate captain, state finalist 2025"
                    : "e.g. Open-source contributor to pandas"
              }
              maxLength={300}
              rows={2}
            />
          </div>
        ))}
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
