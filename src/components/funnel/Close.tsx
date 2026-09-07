"use client";

import { useCallback, useId, useRef, useState } from "react";
import { isSellableTheme, type Locale } from "@/invite/types";
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
 *
 * While Stripe's Prices are unset there is nothing to press, so the section
 * asks for an address instead and stores a lead against the tier they chose.
 * That is R12 rather than a hole in it: the section says in a couple's own
 * words that payment is not open yet, rather than presenting a button that
 * answers with the names of missing environment variables. A visitor who
 * arrived ready to spend $249 leaves a way to be told, which is the whole
 * point of shipping the funnel before the account is live.
 *
 * Nothing about the paid path changes. Set both Price IDs and this section is
 * a checkout button again, with no code change and no flag to remember.
 */

/**
 * Everything this section says. The tier's own name and its guest line come
 * from `TIER_COPY` in The Choice, so the two sections cannot disagree about
 * what a tier is called.
 *
 * The three failure messages are in here rather than written at the throw
 * site, because a German visitor meeting an English apology has been failed
 * twice. A message the server sends is still shown as the server wrote it:
 * that is a real error, and inventing a translation for it would hide which
 * one occurred.
 */
type Copy = {
  title: string;
  /** R12. No confirmed price for this locale means no button to press. */
  unpriced: string;
  begin: (tier: string) => string;
  pending: string;
  pledge: string;
  fineStripe: string;
  fineEmail: string;
  sampleNames: string;
  /** R3. A style they chose weeks ago that we no longer build. */
  unavailableStyle: string;
  unreachable: string;
  notOpened: string;

  /* ── the waiting list, shown while checkout is shut ─────────────────── */

  /** Says the thing plainly. No apology, no date we cannot keep. */
  waitTitle: string;
  waitLede: string;
  waitEmailLabel: string;
  waitConsent: string;
  privacyWord: string;
  waitSend: string;
  waitSending: string;
  waitDone: string;
  waitNeedConsent: string;
  waitFailed: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Begin.",
    unpriced:
      "Checkout for this language is not open yet, because its pricing is not confirmed.",
    begin: (tier) => `Begin ${tier}`,
    pending: "Opening checkout",
    pledge: "Priced once, not per guest.",
    fineStripe: "Payment is handled by Stripe. Card details never reach us.",
    fineEmail:
      "Stripe asks for an email address. Your invitation and your editor arrive there.",
    sampleNames:
      "Your invitation still carries the sample couple's names. Put yours into the preview above, then begin.",
    unavailableStyle:
      "The style saved on this device is not one we are building at the moment. Choose a style in the gallery, then begin.",
    unreachable:
      "Checkout could not be reached. Check your connection and try again.",
    notOpened:
      "Checkout could not be opened. Nothing has been charged. Try again.",
    waitTitle: "Payment is not open yet.",
    waitLede:
      "We are not taking cards yet. Leave your address and we will write to you the day we are, with the tier you chose noted beside it.",
    waitEmailLabel: "Your email address",
    waitConsent: "Yes, write to me when it opens.",
    privacyWord: "What we store",
    waitSend: "Tell me when it opens",
    waitSending: "Saving",
    waitDone: "Saved. We will write to you the day payment opens.",
    waitNeedConsent:
      "Tick the box and we will save it. Without it we may not write to you.",
    waitFailed: "That did not save. Try again in a moment.",
  },
  de: {
    title: "Beginnt.",
    unpriced:
      "Der Checkout für diese Sprache ist noch nicht offen, weil die Preise nicht feststehen.",
    begin: (tier) => `${tier} beginnen`,
    pending: "Checkout wird geöffnet",
    pledge: "Einmal pro Hochzeit, nicht pro Gast.",
    fineStripe:
      "Die Zahlung wickelt Stripe ab. Eure Kartendaten erreichen uns nie.",
    fineEmail:
      "Stripe fragt nach einer E-Mail-Adresse. Eure Einladung und euer Editor kommen dort an.",
    sampleNames:
      "Eure Einladung trägt noch die Namen des Beispielpaars. Tragt oben eure eigenen ein und beginnt dann.",
    unavailableStyle:
      "Der auf diesem Gerät gespeicherte Stil gehört nicht zu denen, die wir gerade bauen. Wählt einen Stil in der Galerie und beginnt dann.",
    unreachable:
      "Der Checkout war nicht erreichbar. Prüft eure Verbindung und versucht es noch einmal.",
    notOpened:
      "Der Checkout ließ sich nicht öffnen. Es wurde nichts abgebucht. Versucht es noch einmal.",
    waitTitle: "Die Zahlung ist noch nicht offen.",
    waitLede:
      "Wir nehmen noch keine Karten an. Hinterlasst eure Adresse, und wir schreiben euch an dem Tag, an dem es losgeht — mit der von euch gewählten Variante daneben.",
    waitEmailLabel: "Eure E-Mail-Adresse",
    waitConsent: "Ja, schreibt mir, sobald es losgeht.",
    privacyWord: "Was wir speichern",
    waitSend: "Sagt mir, wann es losgeht",
    waitSending: "Wird gespeichert",
    waitDone:
      "Gespeichert. Wir schreiben euch an dem Tag, an dem die Zahlung offen ist.",
    waitNeedConsent:
      "Setzt das Häkchen, dann speichern wir sie. Ohne dürfen wir euch nicht schreiben.",
    waitFailed: "Das wurde nicht gespeichert. Versucht es gleich noch einmal.",
  },
};

/**
 * Whether Stripe's Prices are configured, as far as a browser is allowed to
 * know.
 *
 * Read as literal source text, never through a computed key or a loop over
 * names: Next inlines `NEXT_PUBLIC_*` by matching the text, so anything
 * cleverer resolves to undefined in the bundle and would report checkout shut
 * on a site where it is open. Same rule as `src/lib/stripe.ts`.
 *
 * This is half the answer. The secret key is not public and must not be, so
 * `/api/checkout` still owns the authoritative check and the failure branch
 * below still handles it. This half exists so that a visitor is asked for an
 * address up front rather than after pressing a button that cannot work.
 *
 * Inlined at build time, so the server and the client compute the same value
 * and this cannot hydrate mismatched.
 */
const CHECKOUT_CONFIGURED =
  (process.env.NEXT_PUBLIC_STRIPE_PRICE_INVITATION ?? "").trim() !== "" &&
  (process.env.NEXT_PUBLIC_STRIPE_PRICE_COMMISSION ?? "").trim() !== "";

type Status =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "failed"; message: string };

/** The waiting list's own state. Separate from checkout's: they never overlap. */
type LeadStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "done" }
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

/**
 * The machine readable half of the same error.
 *
 * Read rather than matching on the message, because the message is prose meant
 * for a person and is expected to be rewritten; the code is the contract
 * `/api/checkout` and `/api/lead` both keep.
 */
function readErrorCode(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const error = (payload as { error?: unknown }).error;
  if (typeof error !== "object" || error === null) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && code.length > 0 ? code : null;
}

export function Close({ locale = "en" }: { locale?: Locale }) {
  const { tier } = useSelectedTier();
  const { couple, isSample } = useCouple();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const id = useId();

  /*
   * Shut until proven otherwise. Starts from the build time constant so the
   * first paint already asks for an address, and is also set by the failure
   * branch in `begin` for the case the browser cannot see: Prices present and
   * `STRIPE_SECRET_KEY` absent.
   */
  const [checkoutShut, setCheckoutShut] = useState(!CHECKOUT_CONFIGURED);

  /* The waiting list. Nothing here is touched while checkout is open. */
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [lead, setLead] = useState<LeadStatus>({ kind: "idle" });
  const leadInFlight = useRef(false);

  /*
   * The double submit gate. It lives in a ref rather than in state because the
   * handler reads it in the same tick it is set, and a render closure would
   * still be holding the previous value. R4.
   */
  const inFlight = useRef(false);

  const pricing = getPricing(locale);
  const copy = COPY[locale];
  const tierCopy = TIER_COPY[locale][tier];

  const begin = useCallback(async () => {
    if (inFlight.current) return;

    /*
     * The names in storage are still the sample couple's, which means this
     * visitor never named themselves in The Mirror. Those names are what
     * provisions the invitation, so sending them would buy someone else's
     * wedding. Say so rather than substituting. R3.
     */
    if (isSample) {
      setStatus({ kind: "failed", message: COPY[locale].sampleNames });
      return;
    }

    /*
     * A theme this device stored before the sellable list narrowed. The
     * request would be refused by `/api/checkout` with a message about names
     * and dates, which is true of the wrong field. Say which thing is wrong,
     * here, rather than sending them to a generic rejection. R3.
     */
    if (!isSellableTheme(couple.theme)) {
      setStatus({ kind: "failed", message: COPY[locale].unavailableStyle });
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
      setStatus({ kind: "failed", message: COPY[locale].unreachable });
      return;
    }

    const url = ok ? readCheckoutUrl(payload) : null;
    if (url === null) {
      inFlight.current = false;

      /*
       * The server has keys this browser cannot see, and it says they are
       * missing. Swap this section for the waiting list rather than reading a
       * list of environment variables out to a couple: that message names the
       * right thing to the wrong audience, and there is now somewhere useful
       * for them to go instead.
       */
      if (readErrorCode(payload) === "stripe_not_configured") {
        setCheckoutShut(true);
        setStatus({ kind: "idle" });
        return;
      }

      setStatus({
        kind: "failed",
        message: readErrorMessage(payload) ?? COPY[locale].notOpened,
      });
      return;
    }

    /* Fired here, with a real session in hand, so the metric counts departures. */
    track({ name: "checkout_started", tier });
    /* The gate stays closed. Navigation is under way and a second session
     * created during it would be a second order the buyer never asked for. */
    window.location.assign(url);
  }, [couple, isSample, locale, tier]);

  /**
   * Stores the address against the tier they chose.
   *
   * Names are not required here, unlike at checkout. Checkout must have them
   * because they provision the invitation; a lead only has to be reachable,
   * and refusing an address because the preview above still shows the sample
   * couple would lose exactly the visitor this path exists to catch.
   *
   * When the store does still hold the sample, empty names are sent rather
   * than Max and Lena. A lead recorded as a couple who does not exist is worse
   * than a lead recorded as nameless, because only one of the two is honest
   * about what we know. R3.
   */
  const askToBeTold = useCallback(async () => {
    /* R4. Read in the tick it is set, so a render closure holds a stale one. */
    if (leadInFlight.current) return;

    if (!consent) {
      setLead({ kind: "failed", message: COPY[locale].waitNeedConsent });
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
          /* The reason this row is worth more than an address alone. */
          tier,
          trap,
        }),
      });
      ok = response.ok;
      payload = await response.json().catch(() => null);
    } catch {
      leadInFlight.current = false;
      setLead({ kind: "failed", message: COPY[locale].waitFailed });
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
        message: readErrorMessage(payload) ?? COPY[locale].waitFailed,
      });
      return;
    }

    track({ name: "lead_captured" }, true);
    setLead({ kind: "done" });
  }, [consent, couple, email, isSample, locale, tier, trap]);

  const pending = status.kind === "pending";

  return (
    <section id="close" className={styles.section} aria-labelledby="close-title">
      <div className={`wrap ${styles.inner}`}>
        <h2 id="close-title" className={`display ${styles.title}`}>
          {copy.title}
        </h2>

        {pricing === null ? (
          /* Matches The Choice: no confirmed price means no button to press. */
          <p className={styles.notice} role="status">
            {copy.unpriced}
          </p>
        ) : checkoutShut ? (
          <div className={styles.action}>
            {/* The price stays. It is what makes the address worth having:
                these are people who read $249 and asked to be told anyway. */}
            <p className={styles.summary}>
              {tierCopy.name}, {formatPrice(locale, pricing[tier])}.{" "}
              {tierCopy.guests}
            </p>

            {/* R12. The unfinished thing announces itself, in a couple's words
                rather than in the names of environment variables. */}
            <p className={styles.notice} role="status">
              {copy.waitTitle} {copy.waitLede}
            </p>

            <form
              className={styles.wait}
              onSubmit={(event) => {
                event.preventDefault();
                void askToBeTold();
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
                  {copy.waitEmailLabel}
                </label>
                <input
                  id={`${id}-email`}
                  className={styles.input}
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.waitEmailLabel}
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
                  {lead.kind === "pending" ? copy.waitSending : copy.waitSend}
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
                  {copy.waitConsent}{" "}
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
                  {copy.waitDone}
                </p>
              ) : null}
              {lead.kind === "failed" ? (
                <p className={styles.error} role="alert">
                  {lead.message}
                </p>
              ) : null}
            </form>

            {/* Still true, and still the line the price argument rests on. */}
            <p className={styles.pledge}>{copy.pledge}</p>
          </div>
        ) : (
          <div className={styles.action}>
            <p className={styles.summary}>
              {tierCopy.name}, {formatPrice(locale, pricing[tier])}.{" "}
              {tierCopy.guests}
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
              {pending ? copy.pending : copy.begin(tierCopy.name)}
            </button>

            {/* The line the whole price argument rests on. */}
            <p className={styles.pledge}>{copy.pledge}</p>

            {status.kind === "failed" ? (
              <p className={styles.error} role="alert">
                {status.message}
              </p>
            ) : null}

            <p className={styles.fine}>{copy.fineStripe}</p>
            <p className={styles.fine}>{copy.fineEmail}</p>
          </div>
        )}
      </div>
    </section>
  );
}
