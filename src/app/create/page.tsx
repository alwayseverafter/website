import type { Metadata } from "next";
import { Mark } from "@/components/Mark";
import { findDeliveryBySession } from "@/lib/db";
import { deliveryConfigured } from "@/lib/delivery";
import styles from "./Create.module.css";

/**
 * Where Stripe returns a buyer. Until this existed, `success_url` pointed at a
 * route that did not, and every customer who paid was redirected to a 404
 * having been charged.
 *
 * This page only reads. The webhook records, because a page that recorded
 * would do it twice for someone who refreshes and not at all for someone who
 * closes the tab, which is the more common of the two.
 *
 * Three states, and no fourth. The one that matters is the failure: a couple
 * who has paid and whose order did not appear must be told so, on the page,
 * with the reference that finds their payment. A spinner that never resolves
 * is the failure this project has already paid for once.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your order",
  /* A purchase is not a landing page. Keep it out of every index. */
  robots: { index: false, follow: false },
};

function money(minor: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

export default async function Create(
  { searchParams }: { searchParams: Promise<{ session?: string }> },
) {
  const { session } = await searchParams;

  if (!session) {
    return (
      <Shell title="Nothing to show here.">
        <p className={styles.body}>
          This page shows an order after a payment. It was opened without one,
          so there is nothing to look up. If you have just paid and landed
          here, the address in your receipt is the one to open.
        </p>
      </Shell>
    );
  }

  const found = await findDeliveryBySession(session);

  /* Whether this deployment can send mail at all. Read here, on the server,
     because it is this site's own configuration and nothing else knows it. */
  const emailPossible = deliveryConfigured();

  if (found.ok && found.data) {
    const { delivery, client } = found.data;
    const names = [client.partnerAName, client.partnerBName].filter(Boolean).join(" and ");

    return (
      <Shell title={names ? `${names}.` : "It is yours."}>
        <p className={styles.body}>
          Your order is recorded. Your names, your date and your style are held
          against it, so nothing needs typing again.
        </p>

        <dl className={styles.facts}>
          <div>
            <dt className={styles.factKey}>Reference</dt>
            <dd className={styles.factValue}>
              <span className={styles.mono}>{client.ref}</span>
            </dd>
          </div>
          <div>
            <dt className={styles.factKey}>What you bought</dt>
            <dd className={styles.factValue}>
              {delivery.productName}, {money(delivery.amountMinor, delivery.currency, delivery.locale)}
            </dd>
          </div>
          {delivery.weddingDate ? (
            <div>
              <dt className={styles.factKey}>Your date</dt>
              <dd className={styles.factValue}>{delivery.weddingDate}</dd>
            </div>
          ) : null}
        </dl>

        {/*
          No link to an invitation and no link to an editor, because nothing
          in this system renders one yet. Promising either here is the exact
          shape of the defect this page exists to close.
        */}
        <p className={styles.body}>
          We will be in touch with your invitation. If anything about the date
          or the names is wrong, write to us and we will correct it.
        </p>

        <p className={styles.fine}>
          {emailPossible
            ? "A confirmation is on its way to the address you gave Stripe. Keep this reference either way."
            : "Keep this reference. It is how we find your order."}
        </p>
      </Shell>
    );
  }

  /* Nothing recorded yet, or the database is having a moment. Both mean the
     webhook may still be in flight, and neither is the customer's problem. */
  if (found.ok || found.reason === "failed") {
    return (
      <Shell title="Your payment went through.">
        <p className={styles.body}>
          Your order is being recorded. This takes a few seconds, and it
          finishes whether or not this tab stays open.
        </p>
        <p className={styles.body} aria-live="polite">
          Refresh this page in a moment to see it.
        </p>
        <Reference session={session} />
      </Shell>
    );
  }

  /*
   * Paid, and this site is not finished being set up. R3 and R12: say which
   * variables are missing, to whoever is looking at the page, and give the
   * buyer the reference that finds their payment in one search.
   */
  return (
    <Shell title="Your payment went through, and something after it did not.">
      <p className={styles.body}>
        You have been charged and your order has not been recorded. That is our
        fault, not yours, and nothing further will be taken. Write to us with
        the reference below and we will finish it by hand.
      </p>
      <p className={styles.notice} role="alert">
        This site is not fully connected yet. Missing: {found.missing.join(", ")}.
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
          the page a person lands on holding a receipt.
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
