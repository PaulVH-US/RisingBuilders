import { WaitlistForm } from "~/components/waitlist-form";

export const metadata = {
  title: "Join the Waitlist | Rising Builders",
  description:
    "Get early access to Rising Builders, the project-first network for ambitious high school founders.",
};

export default function WaitlistPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-20">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-primary">
          Early access
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Be the first to build.
        </h1>
        <p className="text-lg text-muted-foreground">
          Rising Builders launches <strong className="text-foreground">July 1st</strong>. Drop your info below and we&apos;ll send you an email when your spot is ready.
        </p>
      </div>

      <WaitlistForm />
    </main>
  );
}
