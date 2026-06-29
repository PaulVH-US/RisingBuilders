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
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const goalRaw = String(formData.get("goal") ?? "");
  const skills = formData.getAll("skills").map(String);
  const interests = formData.getAll("interests").map(String);
  const activity1 = String(formData.get("activity_1") ?? "").trim() || null;
  const activity2 = String(formData.get("activity_2") ?? "").trim() || null;
  const activity3 = String(formData.get("activity_3") ?? "").trim() || null;

  return {
    first_name: firstName,
    last_name: lastName,
    goal: (GOALS.includes(goalRaw as Goal) ? goalRaw : "explore") as Goal,
    skills,
    interests,
    activity_1: activity1,
    activity_2: activity2,
    activity_3: activity3,
  };
}

function validate(input: ReturnType<typeof parseForm>): string | null {
  if (!input.first_name) return "First name is required.";
  if (!input.last_name) return "Last name is required.";
  for (const act of [input.activity_1, input.activity_2, input.activity_3]) {
    if (act && act.length > 300) {
      return "Each activity must be 300 characters or fewer.";
    }
  }
  return null;
}

async function generateUsername(
  supabase: Awaited<ReturnType<typeof createClient>>,
  firstName: string,
  lastName: string,
): Promise<string> {
  const base =
    `${firstName}${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 18) ||
    "builder";

  let candidate = base;
  for (let i = 1; i <= 20; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base.slice(0, 16)}${i}`;
  }
  return `${base}${Date.now()}`.slice(0, 20);
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
  const username = await generateUsername(supabase, input.first_name, input.last_name);

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username,
    ...input,
    last_active_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

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

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { error: null };
}
