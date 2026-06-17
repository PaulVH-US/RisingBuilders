"use client";

import Link from "next/link";
import { useActionState } from "react";
import { type AuthState, signIn, signUp } from "~/app/auth-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const initialState: AuthState = { error: null };

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@gmail.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••••"
          minLength={6}
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already a builder?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
