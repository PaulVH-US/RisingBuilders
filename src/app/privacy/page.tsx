import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Rising Builders",
  description:
    "How Rising Builders collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-4 text-muted-foreground">
        Rising Builders helps builders find teammates and collaborate on
        projects. This policy explains what information we collect, why, and how
        you can control it.
      </p>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Information we collect
        </h2>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Account information:</strong> your
          email address and password, used to create and secure your account.
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Profile information:</strong> the
          name, username, accomplishments, skills, interests, and goals you
          enter. This is shown to other signed-in users so they can find and
          connect with you.
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">
            Project and collaboration content:
          </strong>{" "}
          projects you create or join, join requests, invitations, and team chat
          messages, which are visible to other members of the same project.
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">
            Builder Score and referrals:
          </strong>{" "}
          a score reflecting your activity, and your referral relationships if
          you use or share a referral code.
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Push notification token:</strong>{" "}
          if you enable notifications, we store a device token so we can deliver
          notifications about invitations, join requests, and project activity.
        </p>
        <p className="text-muted-foreground">
          We do not collect payment information, precise location, health data,
          or browsing history, and we do not use any third-party analytics or
          advertising SDKs.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          How we use this information
        </h2>
        <p className="text-muted-foreground">
          We use the information above only to operate the app&apos;s core
          functionality: creating your account, matching you with other builders
          and projects, delivering in-app and push notifications about your
          activity, and calculating your Builder Score.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          How we share information
        </h2>
        <p className="text-muted-foreground">
          Profile information and content you post (accomplishments, skills,
          interests, chat messages, join/invite messages) is visible to other
          signed-in users, by design, as part of the app&apos;s core
          social/collaboration functionality.
        </p>
        <p className="text-muted-foreground">
          Push notifications are delivered through Expo&apos;s push notification
          service, which receives only your device token and the notification
          text.
        </p>
        <p className="text-muted-foreground">
          We do not sell your information or share it with advertisers or data
          brokers.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Data retention and deletion
        </h2>
        <p className="text-muted-foreground">
          We keep your information for as long as your account exists. You can
          permanently delete your account at any time from Profile → Delete
          account. Deleting your account permanently removes your profile,
          projects, memberships, join requests, invitations, chat messages,
          referrals, and push token — this cannot be undone.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Reporting and blocking
        </h2>
        <p className="text-muted-foreground">
          If you encounter another user or message that violates our guidelines,
          you can report it or block the user from their profile screen. Reports
          are reviewed by our team; blocking hides that user from your directory
          and prevents them from inviting you or requesting to join your
          projects (and vice versa).
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Children&apos;s privacy
        </h2>
        <p className="text-muted-foreground">
          Rising Builders is not directed at children and we do not knowingly
          collect information from anyone under the age required to use the app
          in your jurisdiction.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Contact us</h2>
        <p className="text-muted-foreground">
          Questions about this policy or your data? Contact us at{" "}
          <a
            href="mailto:paul.vanhaetsdaele@gmail.com"
            className="text-primary underline underline-offset-4"
          >
            paul.vanhaetsdaele@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
