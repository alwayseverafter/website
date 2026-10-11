"use client";

import { useCallback, useId, useRef, useState } from "react";
import { type Locale } from "@/invite/types";
import { track } from "@/lib/analytics";
import { useCouple } from "@/lib/couple";
import { TIER_COPY, useSelectedTier } from "./Choice";
import styles from "./Close.module.css";

/**
 * Section 7, The Close. The only call to action on the page.
 *
 * This section used to open Stripe Checkout. It no longer does, and no card
 * is taken anywhere on this site: a couple tells us what they want and we
 * answer them. The form is the product's front door, not a fallback behind
 * one, so there is no second branch here and no flag that could re-open a
 * payment path that no longer exists.
 *
 * Every failure is shown, in words, next to the field that failed. A form
 * that silently does nothing is the worst possible version of this section,
 * so there is no silent catch and no dead disabled state. LESSONS.md R3, R12.
 *
 * What the couple sends reaches two places: the `leads` table, so it survives
 * a bad mail day, and an alert to us, so someone knows to answer. The order
 * matters — see `src/app/api/lead/route.ts`.
 */

/**
 * Everything this section says. The tier's own name and its guest line come
 * from `TIER_COPY` in The Choice, so the two sections cannot disagree about
 * what a tier is called.
 *
 * The failure messages are in here rather than written at the throw site,
 * because a German visitor meeting an English apology has been failed twice.
 * A message the server sends is still shown as the server wrote it: that is a
 * real error, and inventing a translation for it would hide which one
 * occurred.
 */
type Copy = {
  title: string;
  lede: string;
  pledge: string;
  emailLabel: string;
  consent: string;
  privacyWord: string;
  send: string;
  sending: string;
  done: string;
  needConsent: string;
  failed: string;
  /** What happens next, said plainly. No date we cannot keep. */
  fineReply: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Begin.",
    lede:
      "Tell us where to reach you and we will write back about your invitation, "
      + "with the style and the date you chose noted beside it.",
    pledge: "Priced once, not per guest.",
    emailLabel: "Your email address",
    consent: "Yes, write to me about my invitation.",
    privacyWord: "What we store",
    send: "Send my details",
    sending: "Sending",
    done: "Sent. We will write back to you.",
    needConsent:
      "Tick the box and we will save it. Without it we may not write to you.",
    failed: "That did not send. Try again in a moment.",
    fineReply: "A person reads every one of these. No card is taken on this site.",
  },
  de: {
    title: "Beginnt.",
    lede:
      "Sagt uns, wie wir euch erreichen, und wir melden uns zu eurer Einladung — "
      + "mit dem Stil und dem Datum, die ihr gewählt habt.",
    pledge: "Einmal pro Hochzeit, nicht pro Gast.",
    emailLabel: "Eure E-Mail-Adresse",
    consent: "Ja, schreibt mir zu meiner Einladung.",
    privacyWord: "Was wir speichern",
    send: "Meine Angaben senden",
    sending: "Wird gesendet",
    done: "Gesendet. Wir melden uns bei euch.",
    needConsent:
      "Setzt das Häkchen, dann speichern wir sie. Ohne dürfen wir euch nicht schreiben.",
    failed: "Das wurde nicht gesendet. Versucht es gleich noch einmal.",
    fineReply:
      "Jede dieser Nachrichten liest ein Mensch. Auf dieser Seite wird keine Karte belastet.",
  },
};

type LeadStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "done" }
  | { kind: "failed"; message: string };

/** The response body is a network boundary, so it is read defensively. */
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
  const id = useId();

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [lead, setLead] = useState<LeadStatus>({ kind: "idle" });
  const leadInFlight = useRef(false);

  const copy = COPY[locale];
  const tierCopy = TIER_COPY[locale][tier];

  /**
   * Sends the address, along with whatever the preview already knows.
   *
   * Names are not required. A couple only has to be reachable, and refusing an
   * address because the preview above still shows the sample couple would lose
   * exactly the visitor this section exists to catch.
   *
   * When the store does still hold the sample, empty names are sent rather
   * than Max and Lena. A lead recorded as a couple who does not exist is worse
   * than one recorded as nameless, because only one of the two is honest about
   * what we know. R3.
   */
  const submit = useCallback(async () => {
    /* R4. Read in the tick it is set, so a render closure holds a stale one. */
    if (leadInFlight.current) return;

    if (!consent) {
      setLead({ kind: "failed", message: COPY[locale].needConsent });
      return;
    }

    leadInFlight.current = true;
    setLead({ kind: "pending" });

    let ok = false;
    let payload: unknown = null;
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          partnerA: isSample ? "" : couple.a,
          partnerB: isSample ? "" : couple.b,
          weddingDate: isSample ? null : couple.date,
          theme: couple.theme,
          locale,
          consent: true,
          /* Which of the two they were looking at when they asked. */
          tier,
          trap,
        }),
      });
      ok = response.ok;
      payload = await response.json().catch(() => null);
    } catch {
      leadInFlight.current = false;
      setLead({ kind: "failed", message: COPY[locale].failed });
      return;
    }

    leadInFlight.current = false;

    if (!ok) {
      /* A message the server wrote is shown as the server wrote it: it names
         which thing broke, and a translation invented here would hide it. R3.
         This is where "not connected yet" reaches the page if the database is
         unset, which is the one thing that must never fail silently. */
      setLead({
        kind: "failed",
        message: readErrorMessage(payload) ?? COPY[locale].failed,
      });
      return;
    }

    track({ name: "lead_captured" }, true);
    setLead({ kind: "done" });
  }, [consent, couple, email, isSample, locale, tier, trap]);

  return (
    <section id="close" className={styles.section} aria-labelledby="close-title">
      <div className={`wrap ${styles.inner}`}>
        <h2 id="close-title" className={`display ${styles.title}`}>
          {copy.title}
        </h2>

        <div className={styles.action}>
          {/* Which tier they chose, and who it is for. No price: nothing is
              sold on this page, and quoting one here would promise a number
              we have not yet agreed with them. */}
          <p className={styles.summary}>
            {tierCopy.name}. {tierCopy.guests}
          </p>

          <p className={styles.notice} role="status">
            {copy.lede}
          </p>

          <form
            className={styles.wait}
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            {/*
              The honeypot, exactly as The Mirror does it. Off screen rather
              than display:none, never tabbable, never autofilled. A filled
              one is a bot, and the server answers it 200 so it learns
              nothing about why it failed.
            */}
            <input
              className={styles.trap}
              type="text"
              name="company"
              value={trap}
              onChange={(event) => setTrap(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className={styles.waitRow}>
              <label className={styles.srOnly} htmlFor={`${id}-email`}>
                {copy.emailLabel}
              </label>
              <input
                id={`${id}-email`}
                className={styles.input}
                type="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailLabel}
                maxLength={320}
                autoComplete="email"
                spellCheck={false}
                enterKeyHint="send"
                required
              />
              <button
                type="submit"
                className={styles.button}
                aria-busy={lead.kind === "pending"}
              >
                {lead.kind === "pending" ? copy.sending : copy.send}
              </button>
            </div>

            <label className={styles.consent}>
              {/* Never pre-ticked. A pre-ticked box is not consent. */}
              <input
                type="checkbox"
                className={styles.check}
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                {copy.consent}{" "}
                <a
                  className={styles.privacy}
                  href={locale === "de" ? "/de/legal/privacy" : "/legal/privacy"}
                >
                  {copy.privacyWord}
                </a>
              </span>
            </label>

            {lead.kind === "done" ? (
              <p className={styles.leadDone} role="status">
                {copy.done}
              </p>
            ) : null}
            {lead.kind === "failed" ? (
              <p className={styles.error} role="alert">
                {lead.message}
              </p>
            ) : null}
          </form>

          {/* Still true, and still the line the whole argument rests on. */}
          <p className={styles.pledge}>{copy.pledge}</p>
          <p className={styles.fine}>{copy.fineReply}</p>
        </div>
      </div>
    </section>
  );
}
