"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfile } from "~/lib/auth";
import { createClient } from "~/lib/supabase/server";
import type { CommitmentLevel } from "~/lib/types";

const COMMITMENTS: CommitmentLevel[] = ["low", "medium", "high"];

export interface ProjectFormState {
  error: string | null;
  ok?: boolean;
}

// Rejects keyboard-mash / placeholder text like "zzzzzz" or "asdfgh".
function looksLikeGibberish(text: string): boolean {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  if (words.length === 0) return true;
  // A single character repeated (zzzz, aaaa).
  if (words.some((w) => w.length >= 3 && /^(.)\1+$/.test(w))) return true;
  // Longer words with no vowel are almost always mashing (qwrtp, zxcvb).
  const longish = words.filter((w) => w.length >= 4);
  const noVowel = longish.filter((w) => !/[aeiouy]/.test(w));
  return longish.length > 0 && noVowel.length / longish.length > 0.5;
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// Keep the lightweight "active this week" signal fresh on meaningful actions.
async function touchActivity(userId: string) {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", userId);
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const commitmentRaw = String(formData.get("commitment_level") ?? "");
  const category_tags = formData.getAll("category_tags").map(String);
  const skills_needed = formData.getAll("skills_needed").map(String);

  if (!title || title.length > 120) {
    return { error: "Title is required (max 120 characters)." };
  }
  if (looksLikeGibberish(title)) {
    return {
      error: "Please give your project a real title, not random characters.",
    };
  }
  if (!description || description.length > 280) {
    return {
      error: "A one-line description is required (max 280 characters).",
    };
  }
  if (wordCount(description) < 5) {
    return { error: "Please write a description of at least 5 words." };
  }
  if (looksLikeGibberish(description)) {
    return {
      error: "Please write a real description, not random characters.",
    };
  }
  const commitment_level = (
    COMMITMENTS.includes(commitmentRaw as CommitmentLevel)
      ? commitmentRaw
      : "medium"
  ) as CommitmentLevel;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      creator_id: profile.id,
      title,
      description,
      category_tags,
      skills_needed,
      commitment_level,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create project." };
  }

  // Seed the creator as the owner member.
  await supabase
    .from("memberships")
    .insert({ project_id: data.id, user_id: profile.id, role: "owner" });

  await touchActivity(profile.id);
  redirect(`/projects/${data.id}`);
}

export async function requestToJoin(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const message = String(formData.get("message") ?? "").trim() || null;
  if (!projectId) return;

  const supabase = await createClient();
  await supabase
    .from("join_requests")
    .insert({ project_id: projectId, user_id: profile.id, message });

  await touchActivity(profile.id);
  revalidatePath(`/projects/${projectId}`);
}

export async function withdrawRequest(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const supabase = await createClient();
  await supabase
    .from("join_requests")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", profile.id);

  revalidatePath(`/projects/${projectId}`);
}

export async function respondToRequest(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const requestId = String(formData.get("request_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const requesterId = String(formData.get("requester_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!requestId || !projectId || !requesterId) return;

  const accepted = decision === "accept";
  const supabase = await createClient();

  // RLS ensures only the project creator can update the request.
  const { error } = await supabase
    .from("join_requests")
    .update({ status: accepted ? "accepted" : "rejected" })
    .eq("id", requestId);

  if (!error && accepted) {
    await supabase
      .from("memberships")
      .insert({ project_id: projectId, user_id: requesterId, role: "member" });
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function leaveProject(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const supabase = await createClient();
  await supabase
    .from("memberships")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", profile.id);

  revalidatePath(`/projects/${projectId}`);
}

export async function removeMember(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const memberId = String(formData.get("member_id") ?? "");
  const supabase = await createClient();
  // RLS allows the project creator to delete memberships.
  await supabase
    .from("memberships")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", memberId);

  revalidatePath(`/projects/${projectId}`);
}

export async function postMessage(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: null };
  if (content.length > 2000) return { error: "Message is too long." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ project_id: projectId, user_id: profile.id, content });

  if (error) return { error: error.message };

  await touchActivity(profile.id);
  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function deleteProject(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", projectId);

  redirect("/projects");
}

// A project creator invites a builder to join one of their projects.
export async function inviteBuilder(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const projectId = String(formData.get("project_id") ?? "");
  const userId = String(formData.get("user_id") ?? "");
  const message = String(formData.get("message") ?? "").trim() || null;
  if (!projectId) return { error: "Pick a project to invite them to." };
  if (!userId) return { error: "Could not find that builder." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("invitations")
    .insert({ project_id: projectId, user_id: userId, message });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already invited this builder to that project." };
    }
    return { error: error.message };
  }

  await touchActivity(profile.id);
  revalidatePath("/builders");
  return { error: null, ok: true };
}

// The invited builder accepts (joins) or declines an invitation.
export async function respondToInvitation(formData: FormData) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const invitationId = String(formData.get("invitation_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!invitationId || !projectId) return;

  const accepted = decision === "accept";
  const supabase = await createClient();

  // RLS ensures only the invited builder can update their invitation.
  const { error } = await supabase
    .from("invitations")
    .update({ status: accepted ? "accepted" : "declined" })
    .eq("id", invitationId);

  if (!error && accepted) {
    await supabase
      .from("memberships")
      .insert({ project_id: projectId, user_id: profile.id, role: "member" });
  }

  await touchActivity(profile.id);
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
}
