"use server";

import { createClient } from "~/lib/supabase/server";
import type { WaitlistIntent } from "~/lib/types";

export type WaitlistState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const VALID_INTENTS = new Set<WaitlistIntent>([
  "start_project",
  "join_project",
  "explore",
]);

export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const intentRaw = String(formData.get("intent") ?? "");
  const details = String(formData.get("details") ?? "").trim() || null;

  if (!firstName || !lastName) {
    return { status: "error", message: "First and last name are required." };
  }
  if (!email || !email.includes("@")) {
    return { status: "error", message: "A valid email address is required." };
  }
  if (!VALID_INTENTS.has(intentRaw as WaitlistIntent)) {
    return { status: "error", message: "Please select one of the options." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_submissions").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    intent: intentRaw as WaitlistIntent,
    details,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "That email is already on the waitlist.",
      };
    }
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return { status: "success" };
}
