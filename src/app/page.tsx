import { ArrowRight, Rocket, Search, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SunriseHero } from "~/components/sunrise-hero";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { getProfile } from "~/lib/auth";

export default async function Home() {
  // Onboarded builders skip the marketing page.
  if (await getProfile()) redirect("/projects");

  const steps = [
    {
      icon: Search,
      title: "Discover projects",
      body: "Browse a feed of real student builds and filter by the skills and interests that fit you.",
    },
    {
      icon: Users,
      title: "Form a team",
      body: "Request to join, get accepted, and land in a shared team space. No friction, no noise.",
    },
    {
      icon: Rocket,
      title: "Start building",
      body: "Skip the endless chatter. Move from idea to launch with people you trust.",
    },
  ];

  return (
    <main>
      <SunriseHero />

      <div className="mx-auto flex max-w-3xl flex-col gap-20 px-4 py-20">
        {/* How it works */}
        <section className="flex flex-col gap-6">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight">
            Action over discussion
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.title}
                className="gap-3 p-5 transition-transform hover:-translate-y-1"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="font-display font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-rising relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl p-10 text-center text-white">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Ideas stay ideas until a team forms.
          </h2>
          <p className="max-w-md text-white/85">
            Stop building alone. Find motivated peers with the right skills and
            start this week.
          </p>
          <Button
            asChild
            size="lg"
            className="border-0 bg-white text-primary hover:bg-white/90"
          >
            <Link href="/signup">
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
