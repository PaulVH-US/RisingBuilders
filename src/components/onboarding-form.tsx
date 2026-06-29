"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useActionState, useState } from "react";
import { createProfile, type ProfileFormState } from "~/app/profile-actions";
import { TagInput } from "~/components/tag-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { GOAL_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS } from "~/lib/constants";
import { cn } from "~/lib/utils";

const initialState: ProfileFormState = { error: null };
const STEPS = ["You", "Strengths", "Activities"];

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    createProfile,
    initialState,
  );
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const canAdvance = step !== 0 || (firstName.trim().length > 0 && lastName.trim().length > 0);

  return (
    <form
      action={formAction}
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

      {/* Step 1: name + goal */}
      <div hidden={step !== 0} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Ada"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Lovelace"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
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
          placeholder="Type and press Enter or click Add"
          suggestions={SKILL_OPTIONS}
        />
        <TagInput
          name="interests"
          label="Interests"
          placeholder="Type and press Enter or click Add"
          suggestions={INTEREST_OPTIONS}
        />
      </div>

      {/* Step 3: activities */}
      <div hidden={step !== 2} className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Share up to 3 activities — clubs, projects, sports, jobs, anything you
          do. Keep each to 300 characters.
        </p>
        {(["activity_1", "activity_2", "activity_3"] as const).map(
          (fieldName, i) => (
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
              <p className="text-right text-xs text-muted-foreground">
                max 300 characters
              </p>
            </div>
          ),
        )}
        <p className="text-sm text-muted-foreground">
          You can update your activities anytime from your profile.
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
