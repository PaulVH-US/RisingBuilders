"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useActionState, useState } from "react";
import { createProfile, type ProfileFormState } from "~/app/profile-actions";
import { TagInput } from "~/components/tag-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { GOAL_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS } from "~/lib/constants";
import { cn } from "~/lib/utils";

const initialState: ProfileFormState = { error: null };
const STEPS = ["You", "Strengths", "Finish"];

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    createProfile,
    initialState,
  );
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");

  const canAdvance = step !== 0 || /^[a-zA-Z0-9_]{3,20}$/.test(username);

  return (
    <form
      action={formAction}
      // Multi-step form: only the explicit "Go to projects" button submits.
      // Block Enter so typing in a field (e.g. LinkedIn) never auto-submits
      // and skips the remaining steps.
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
      className="flex flex-col gap-6"
    >
      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i <= step ? "bg-rising" : "bg-muted",
              )}
            />
            <span
              className={cn(
                "text-xs",
                i === step
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: identity + goal */}
      <div hidden={step !== 0} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="adabuilds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            3–20 characters: letters, numbers, underscores.
          </p>
        </div>

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
                  defaultChecked={i === 0}
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
      </div>

      {/* Step 2: skills + interests */}
      <div hidden={step !== 1} className="flex flex-col gap-6">
        <TagInput
          name="skills"
          label="Skills"
          placeholder="Add a skill (e.g. coding)"
          suggestions={SKILL_OPTIONS}
        />
        <TagInput
          name="interests"
          label="Interests"
          placeholder="Add an interest (e.g. AI)"
          suggestions={INTEREST_OPTIONS}
        />
      </div>

      {/* Step 3: LinkedIn + finish */}
      <div hidden={step !== 2} className="flex flex-col gap-6">
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
          />
          <p className="text-xs text-muted-foreground">
            A lightweight way to show you're a serious builder.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          You can refine your skills, interests, and goal anytime from your
          profile.
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            key="next"
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            key="submit"
            type="submit"
            disabled={pending}
            className="bg-rising border-0 text-white hover:opacity-90"
          >
            {pending ? "Setting up…" : "Go to projects"}
          </Button>
        )}
      </div>
    </form>
  );
}
