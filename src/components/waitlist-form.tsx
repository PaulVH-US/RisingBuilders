"use client";

import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { submitWaitlist, type WaitlistState } from "~/app/waitlist/actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Intent = "start_project" | "join_project" | "explore";

const INTENTS: { value: Intent; label: string; description: string }[] = [
  {
    value: "start_project",
    label: "Start a project",
    description: "I have an idea and want to build a team around it",
  },
  {
    value: "join_project",
    label: "Join a project",
    description: "I want to contribute my skills to something already forming",
  },
  {
    value: "explore",
    label: "Just explore",
    description: "I want to see what's being built before committing",
  },
];

const DETAIL_LABELS: Record<Intent, string> = {
  start_project: "What do you want to build?",
  join_project: "What kind of project are you looking to join?",
  explore: "What made you interested in Rising Builders?",
};

const INITIAL_STATE: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(
    submitWaitlist,
    INITIAL_STATE,
  );
  const [intent, setIntent] = useState<Intent | null>(null);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="size-12 text-primary" />
        <h2 className="font-display text-2xl font-bold tracking-tight">
          You&apos;re on the list!
        </h2>
        <p className="max-w-sm text-muted-foreground">
          We&apos;ll reach out when Rising Builders opens. Keep building in the
          meantime.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {/* Name row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="first_name" required />
        <Field label="Last name" name="last_name" required />
      </div>

      {/* Email */}
      <Field label="Email address" name="email" type="email" required />

      {/* Intent */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">
          What brings you here? <span className="text-destructive">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {INTENTS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors",
                intent === opt.value
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name="intent"
                value={opt.value}
                className="sr-only"
                onChange={() => setIntent(opt.value)}
                required
              />
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-xs text-muted-foreground">
                {opt.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Optional details */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="details" className="text-sm font-medium">
          {intent ? DETAIL_LABELS[intent] : "Tell us more"}{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={3}
          placeholder="Share as much or as little as you like…"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Join the waitlist
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={name === "email" ? "email" : name.replace("_", "-")}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
