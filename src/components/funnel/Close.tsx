"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/invite/types";
import { track } from "@/lib/analytics";
import { useCouple } from "@/lib/couple";
import { formatPrice, getPricing, TIER_COPY, useSelectedTier } from "./Choice";
import styles from "./Close.module.css";

/**
 * Section 7, The Close. The only call to action on the page.
 *
 * Checkout is Stripe's hosted page, reached by redirect. No card field renders
 * on this origin, which is what keeps PCI scope at SAQ A, and is why this
 * button's whole job is to ask the server for a URL and go there.
 *
 * Every failure here is shown, in words, next to the button that failed. A
 * checkout button that does nothing is the worst possible version of this
 * section, so there is no silent catch, no dead disabled state and no fake
 * session when the keys are absent. LESSONS.md R3 and R12.
 */

type Status =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "failed"; message: string };

/** The response body is a network boundary, so it is read defensively. */
function readCheckoutUrl(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const url = (payload as { url?: unknown }).url;
  /* Only an absolute Stripe redirect is a valid answer to this request. */
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}

function readErrorMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const error = (payload as { error?: unknown }).error;
  if (typeof error !== "object" || error === null) return null;
  const message = (error as { message?: unknown }).message;
  return typeof message === "string" && message.length > 0 ? message : null;
}

export function Close({ locale = "en" }: { locale?: Locale }) {
  const { tier } = useSelectedTier();
  const { couple, isSample } = useCouple();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  /*
   * The double submit gate. It lives in a ref rather than in state because the
   * handler reads it in the same tick it is set, and a render closure would
   * still be holding the previous value. R4.
   */
  const inFlight = useRef(false);

  const pricing = getPricing(locale);
  const copy = TIER_COPY[tier];

  const begin = useCallback(async () => {
    if (inFlight.current) return;

    /*
     * The names in storage are still the sample couple's, which means this
     * visitor never named themselves in The Mirror. Those names are what
     * provisions the invitation, so sending them would buy someone else's
     * wedding. Say so rather than substituting. R3.
     */
    if (isSample) {
      setStatus({
        kind: "failed",
        message:
          "Your invitation still carries the sample couple's names. Put yours into the preview above, then begin.",
      });
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "pending" });

    let payload: unknown;
    let ok: boolean;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, couple, locale }),
      });
      ok = response.ok;
      payload = await response.json().catch(() => null);
    } catch {
      /* Offline, or the request never landed. Nothing was charged. */
      inFlight.current = false;
      setStatus({
        kind: "failed",
        message: "Checkout could not be reached. Check your connection and try again.",
      });
      return;
    }

    const url = ok ? readCheckoutUrl(payload) : null;
    if (url === null) {
      inFlight.current = false;
      setStatus({
        kind: "failed",
        message:
          readErrorMessage(payload) ??
          "Checkout could not be opened. Nothing has been charged. Try again.",
      });
      return;
    }

    /* Fired here, with a real session in hand, so the metric counts departures. */
    track({ name: "checkout_started", tier });
    /* The gate stays closed. Navigation is under way and a second session
     * created during it would be a second order the buyer never asked for. */
    window.location.assign(url);
  }, [couple, isSample, locale, tier]);

  const pending = status.kind === "pending";

  return (
    <section id="close" className={styles.section} aria-labelledby="close-title">
      <div className={`wrap ${styles.inner}`}>
        <h2 id="close-title" className={`display ${styles.title}`}>
          Begin.
        </h2>

        {pricing === null ? (
          /* Matches The Choice: no confirmed price means no button to press. */
          <p className={styles.notice} role="status">
            Checkout for this language is not open yet, because its pricing is
            not confirmed.
          </p>
        ) : (
          <div className={styles.action}>
            <p className={styles.summary}>
              {copy.name}, {formatPrice(locale, pricing[tier])}.{" "}
              {copy.guests}
            </p>

            <button
              type="button"
              className={styles.button}
              onClick={() => {
                /* Fire and forget: every outcome is handled inside. */
                void begin();
              }}
              aria-busy={pending}
              /*
               * Never disabled. A button that stops responding without saying
               * why is the failure this section exists to avoid, so a second
               * press while pending is simply ignored below.
               */
              aria-disabled={pending}
            >
              {pending ? "Opening checkout" : `Begin ${copy.name}`}
            </button>

            {/* The line the whole price argument rests on. */}
            <p className={styles.pledge}>Priced once, not per guest.</p>

            {status.kind === "failed" ? (
              <p className={styles.error} role="alert">
                {status.message}
              </p>
            ) : null}

            <p className={styles.fine}>
              Payment is handled by Stripe. Card details never reach us.
            </p>
            <p className={styles.fine}>
              Stripe asks for an email address. Your invitation and your editor
              arrive there.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
