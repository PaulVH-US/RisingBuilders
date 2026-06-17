import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "~/components/auth-form";
import { BrandWordmark } from "~/components/brand-logo";
import { getUser } from "~/lib/auth";

export const metadata = { title: "Sign in · Rising Builders" };

export default async function LoginPage() {
  if (await getUser()) redirect("/projects");

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm animate-rise flex-col justify-center gap-8 px-4 py-12">
      <Link
        href="/"
        className="absolute left-4 top-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="mb-2">
          <BrandWordmark />
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to find collaborators and keep building.
        </p>
      </div>
      <AuthForm mode="login" />
    </main>
  );
}
