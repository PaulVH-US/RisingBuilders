import { redirect } from "next/navigation";
import { OnboardingForm } from "~/components/onboarding-form";
import { getProfile, getUser } from "~/lib/auth";

export const metadata = { title: "Set up your profile · Rising Builders" };

export default async function OnboardingPage() {
  if (!(await getUser())) redirect("/login");
  if (await getProfile()) redirect("/projects");

  return (
    <main className="mx-auto flex max-w-xl animate-rise flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Set up your profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep it minimal. Just enough for teammates to know what you bring.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
