"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";

export interface AuthState {
  error: string | null;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  // Send onboarded users to the feed, new ones to profile setup.
  // (profiles are readable by all authenticated users, so filter by own id.)
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", auth.user.id)
    .maybeSingle();
  revalidatePath("/", "layout");
  redirect(data ? "/projects" : "/onboarding");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  // Redirect the browser to Google's consent screen.
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
