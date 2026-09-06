import type { Metadata } from "next";
import { Mark } from "@/components/Mark";
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
             rendering a button that goes nowhere. */
          <p className={styles.notice} role="status">
            Your invitation was created, but the link into your editor could not
            be made just now. It is in the email we sent you. If it has not
            arrived within a few minutes, write to us with the reference below.
          </p>
        )}

        {guestUrl ? (
          <p className={styles.body}>
            This is the address your guests will use, once you publish:
            <br />
            <span className={styles.mono}>{guestUrl}</span>
          </p>
        ) : null}

        <p className={styles.fine}>
          These links are in your email as well. This tab is not the only copy.
        </p>
      </Shell>
    );
  }

  if (result.reason === "not_provisioned") {
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
