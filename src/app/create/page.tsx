import type { Metadata } from "next";
import { Mark } from "@/components/Mark";
import { deliveryConfigured } from "@/lib/delivery";
import { inviteUrl, readProvisioned } from "@/lib/provision";
import styles from "./Create.module.css";

/**
 * Where Stripe returns a buyer. Until this existed, `success_url` pointed at a
 * route that did not, and every customer who paid was redirected to a 404.
 *
 * This page only reads. The webhook provisions, because a page that provisioned
 * would do it twice for someone who refreshes and not at all for someone who
 * closes the tab, which is the more common of the two.
 *
 * Three states, and no fourth. The one that matters is the failure: a couple
 * who has paid and whose invitation did not appear must be told so, on the
 * page, with the reference that finds their payment. A spinner that never
 * resolves is the failure this whole codebase has already paid for once, in B1.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your invitation",
  /* A purchase is not a landing page. Keep it out of every index. */
  robots: { index: false, follow: false },
};

type Search = { session?: string };

export default async function Create(
  { searchParams }: { searchParams: Promise<Search> },
) {
  const { session } = await searchParams;

  if (!session) {
    return (
      <Shell title="Nothing to show here.">
        <p className={styles.body}>
          This page shows an invitation after a payment. It was opened without
          one, so there is nothing to look up. If you have just paid and landed
          here, the address in your receipt is the one to open.
        </p>
      </Shell>
    );
  }

  const result = await readProvisioned(session);

  /* Whether this deployment can send mail at all. Read here, on the server,
     because it is this site's own configuration and nothing else knows it. */
  const emailPossible = deliveryConfigured();

  if (result.ok) {
    const guestUrl = inviteUrl(result.invite.slug);
    const names = [result.invite.partnerAName, result.invite.partnerBName]
      .filter(Boolean).join(" and ");

    return (
      <Shell title={names ? `${names}.` : "It is yours."}>
        <p className={styles.body}>
          Your invitation exists. Your names, your date and your style are
          already in it. The next thing it needs is your ceremony and your
          guests.
        </p>

        {result.invite.editorUrl ? (
          <a className={styles.primary} href={result.invite.editorUrl}>
            Open your editor
          </a>
        ) : (
          /* R3. The link could not be minted, so say that, rather than
             rendering a button that goes nowhere. Note what it does not say:
             that the link is in an email. This page cannot know that. */
          <p className={styles.notice} role="status">
            Your invitation was created, but the link into your editor could not
            be made just now. Write to us with the reference below and we will
            send you one.
          </p>
        )}

        {guestUrl ? (
          <p className={styles.body}>
            This is the address your guests will use, once you publish:
            <br />
            <span className={styles.mono}>{guestUrl}</span>
          </p>
        ) : null}

        {/*
          Said only when this site can actually send mail.
          
          It used to be unconditional, and RESEND_API_KEY ships empty, so on a
          first deploy every buyer was told their links were in an email that
          was never sent. A page cannot promise something another system did.
        */}
        <p className={styles.fine}>
          {emailPossible
            ? "We have also emailed these links to you. If nothing arrives within a few minutes, keep this page."
            : "Keep this page, or copy the links above. They are the only copy."}
        </p>
      </Shell>
    );
  }

  /*
   * "unavailable" is the product having a moment, and the webhook is very
   * likely still in flight. Telling a buyer their purchase broke because one
   * read returned a 503 is a false alarm delivered at the worst moment.
   */
  if (result.reason === "not_provisioned" || result.reason === "unavailable") {
    return (
      <Shell title="Your payment went through.">
        <p className={styles.body}>
          Your invitation is being prepared. This takes a few seconds, and it
          finishes whether or not this tab stays open. Your links arrive by
          email either way.
        </p>
        {/* Polite, so it is announced once when it changes rather than read
            over whatever the visitor is already listening to. */}
        <p className={styles.body} aria-live="polite">
          Refresh this page in a moment to see it.
        </p>
        <Reference session={session} />
      </Shell>
    );
  }

  /*
   * Paid, and something is wrong. Name it, and give them the reference that
   * finds the payment in one search. R3 and R12: an unfinished thing announces
   * itself rather than showing a spinner forever.
   */
  return (
    <Shell title="Your payment went through, and something after it did not.">
      <p className={styles.body}>
        You have been charged and your invitation has not been created. That is
        our fault, not yours, and nothing further will be taken. Write to us
        with the reference below and we will finish it by hand.
      </p>
      <p className={styles.notice} role="alert">
        {result.reason === "not_configured"
          ? `This site is not fully connected yet. Missing: ${result.missing.join(", ")}.`
          : `The product could not be reached (${result.detail}).`}
      </p>
      <Reference session={session} />
    </Shell>
  );
}

function Reference({ session }: { session: string }) {
  return (
    <p className={styles.fine}>
      Your reference: <span className={styles.mono}>{session}</span>
    </p>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <div className={`wrap ${styles.inner}`}>
        {/*
          The one page that carries the mark. The funnel's own chrome keeps the
          bare wordmark, per the brand spec, but this is not the funnel: it is
          the page a person lands on holding a receipt, and the arch is what
          they have just walked through.
        */}
        <span className={styles.mark}>
          <Mark size={34} />
        </span>
        <p className="kicker">Always Ever After</p>
        <h1 className={`display ${styles.title}`}>{title}</h1>
        {children}
      </div>
    </main>
  );
}
