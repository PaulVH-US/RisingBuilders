import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Rising Builders",
  description:
    "The terms that govern your use of Rising Builders.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 18, 2026
      </p>
      <p className="mt-4 text-muted-foreground">
        These Terms of Service (&quot;Terms&quot;) govern your use of Rising
        Builders (the &quot;app&quot;). By creating an account, you agree to
        these Terms and to our{" "}
        <a
          href="/privacy"
          className="text-primary underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Eligibility</h2>
        <p className="text-muted-foreground">
          Rising Builders is intended for users 13 years of age and older. By
          creating an account, you confirm that you meet this minimum age. If
          you are under 18, you confirm that your use of the app complies with
          any rules that apply to you (for example, a school&apos;s
          acceptable-use policy) and, where required by law, that you have a
          parent or guardian&apos;s permission to use it.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Your account</h2>
        <p className="text-muted-foreground">
          You&apos;re responsible for the accuracy of the information in your
          profile and for keeping your login credentials secure. You may not
          create an account for anyone other than yourself, impersonate
          another person, or share your account with others.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Acceptable use
        </h2>
        <p className="text-muted-foreground">
          Rising Builders exists to help students find teammates and
          collaborate on projects. When using the app, you agree not to:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Post false, misleading, or impersonating profile information.</li>
          <li>
            Harass, threaten, bully, or discriminate against other users.
          </li>
          <li>
            Post or send content that is obscene, hateful, or sexually
            explicit, or that promotes violence or illegal activity.
          </li>
          <li>
            Use the app to solicit money, sell products, or run unrelated
            commercial activity.
          </li>
          <li>
            Share another person&apos;s private information without their
            consent (doxxing).
          </li>
          <li>
            Attempt to access another user&apos;s account, scrape the
            app&apos;s data, or interfere with its normal operation.
          </li>
          <li>
            Post content that infringes someone else&apos;s copyright,
            trademark, or other rights (see &quot;Copyright&quot; below).
          </li>
        </ul>
        <p className="text-muted-foreground">
          We may remove content, suspend, or permanently terminate accounts
          that violate these rules, with or without notice, at our
          discretion.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          User-generated content
        </h2>
        <p className="text-muted-foreground">
          You retain ownership of the profile information, project
          descriptions, accomplishments, and chat messages you post
          (&quot;your content&quot;). By posting content, you grant Rising
          Builders a non-exclusive, worldwide, royalty-free license to host,
          store, display, and transmit it as needed to operate the app — for
          example, showing your profile to other signed-in users or
          delivering your chat messages to other project members.
        </p>
        <p className="text-muted-foreground">
          You&apos;re solely responsible for your content. We don&apos;t
          review content before it&apos;s posted, though we do review reports
          submitted through the app&apos;s reporting tools (see below) and may
          remove content or take action on an account as a result.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Reporting, blocking, and moderation
        </h2>
        <p className="text-muted-foreground">
          If you encounter content or a user that violates these Terms, use
          the in-app Report or Block tools. Reports are reviewed by us;
          blocking immediately prevents that user from contacting you or
          seeing your profile, and prevents you from seeing theirs. To keep
          these tools available for genuine issues, reports, blocks,
          invitations, and chat messages are each subject to reasonable weekly
          limits.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Copyright (DMCA)
        </h2>
        <p className="text-muted-foreground">
          We respect intellectual property rights and expect users to do the
          same. If you believe content on Rising Builders infringes your
          copyright, send a notice to our designated agent (see contact
          information below) that includes:
        </p>
        <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
          <li>Your contact information and signature (physical or electronic).</li>
          <li>
            A description of the copyrighted work you claim is infringed.
          </li>
          <li>
            The location of the allegedly infringing content within the app.
          </li>
          <li>
            A statement that you have a good-faith belief the use is
            unauthorized.
          </li>
          <li>
            A statement, under penalty of perjury, that the information in
            your notice is accurate and that you&apos;re authorized to act on
            the copyright owner&apos;s behalf.
          </li>
        </ol>
        <p className="text-muted-foreground">
          We&apos;ll respond to valid notices in accordance with the Digital
          Millennium Copyright Act, which may include removing the content
          and, for repeat infringers, terminating the account.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Account termination and deletion
        </h2>
        <p className="text-muted-foreground">
          You may delete your account at any time from Profile → Delete
          account. This permanently and immediately removes your profile and
          associated content, as described in our Privacy Policy. We may also
          suspend or terminate your account if you violate these Terms, and
          will delete any account we determine belongs to a user under 13.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Disclaimers</h2>
        <p className="text-muted-foreground">
          Rising Builders is provided &quot;as is,&quot; without warranties of
          any kind. We don&apos;t vet the students, projects, or content on
          the platform, and we&apos;re not responsible for the conduct of any
          user, on or off the app, or for the outcome of any project or
          collaboration you enter into through it. Use your own judgment when
          agreeing to work with someone you meet here, especially around
          sharing personal information or meeting in person.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Limitation of liability
        </h2>
        <p className="text-muted-foreground">
          To the fullest extent permitted by law, Rising Builders and its
          operators aren&apos;t liable for any indirect, incidental, or
          consequential damages arising from your use of the app, or for
          content posted by other users.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">
          Changes to these Terms
        </h2>
        <p className="text-muted-foreground">
          We may update these Terms from time to time. If we make material
          changes, we&apos;ll update the &quot;last updated&quot; date above
          and notify users in-app where appropriate. Continuing to use the
          app after changes take effect means you accept the updated Terms.
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold">Contact us</h2>
        <p className="text-muted-foreground">
          Questions about these Terms, or want to send a copyright notice?
          Contact us at{" "}
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
