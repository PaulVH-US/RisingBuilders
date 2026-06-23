import Link from "next/link";
import { signOut } from "~/app/auth-actions";
import { BrandWordmark } from "~/components/brand-logo";
import { NavLinks } from "~/components/nav-links";
import { Button } from "~/components/ui/button";
import { getProfile, getUser } from "~/lib/auth";

export async function Navbar() {
  const profile = await getProfile();
  // Distinguish "logged in but mid-onboarding" (user, no profile yet) from
  // "logged out" so the nav never shows Sign in / Sign up to a signed-in user.
  const isAuthed = profile ? true : Boolean(await getUser());

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href={profile ? "/projects" : isAuthed ? "/onboarding" : "/"}>
            <BrandWordmark />
          </Link>
          {profile && <NavLinks username={profile.username} />}
        </div>

        {isAuthed ? (
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        ) : (
          <Button asChild size="sm">
            <Link href="/waitlist">Join waitlist</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
