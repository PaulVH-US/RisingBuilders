"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "~/lib/auth";
import { createClient } from "~/lib/supabase/server";
import type { Goal } from "~/lib/types";

export interface ProfileFormState {
  error: string | null;
}

const GOALS: Goal[] = ["start", "join", "explore"];

function parseForm(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const goalRaw = String(formData.get("goal") ?? "");
  const linkedinRaw = String(formData.get("linkedin_url") ?? "").trim();
  const skills = formData.getAll("skills").map(String);
  const interests = formData.getAll("interests").map(String);

  return {
    username,
    goal: (GOALS.includes(goalRaw as Goal) ? goalRaw : "explore") as Goal,
    linkedin_url: linkedinRaw || null,
    skills,
    interests,
  };
}

function validate(input: ReturnType<typeof parseForm>): string | null {
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(input.username)) {
    return "Username must be 3–20 characters: letters, numbers, or underscores.";
  }
  if (
    input.linkedin_url &&
    !/^https?:\/\/([\w-]+\.)?linkedin\.com\//i.test(input.linkedin_url)
  ) {
    return "LinkedIn link must be a valid linkedin.com URL.";
  }
  return null;
}

export async function createProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getUser();
  if (!user) redirect("/login");

  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    ...input,
    last_active_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is taken. Try another." };
    }
    return { error: error.message };
  }

  // Refresh the root layout so the navbar picks up the new profile
  // (Projects / Builders / @username) instead of the onboarding state.
  revalidatePath("/", "layout");
  redirect("/projects");
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getUser();
  if (!user) redirect("/login");

  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...input, last_active_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is taken. Try another." };
    }
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { error: null };
}
