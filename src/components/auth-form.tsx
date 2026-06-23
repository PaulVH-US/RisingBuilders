"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import {
  type AuthState,
  signIn,
  signInWithGoogle,
  signUp,
} from "~/app/auth-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const initialState: AuthState = { error: null };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.47 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);
  const oauthError = useSearchParams().get("error");

  return (
    <div className="flex flex-col gap-4">
      <form action={signInWithGoogle}>
        <Button
          type="submit"
          variant="outline"
          className="w-full gap-2"
          disabled={pending}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>

      {oauthError && (
        <p className="text-sm text-destructive" role="alert">
          {oauthError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

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
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
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
          {pending
            ? "Working…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
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
    </div>
  );
}
