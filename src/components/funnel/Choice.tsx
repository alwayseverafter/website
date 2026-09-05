"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { Locale } from "@/invite/types";
import { track, type Tier } from "@/lib/analytics";
import styles from "./Choice.module.css";

/**
 * Section 6, The Choice.
 *
 * Two tiers, a hairline between them, and no badge on either. "Most popular"
 * and "best value" are conversion tactics from a different price bracket and
 * they cheapen a block that is asking for $249. The tiers are allowed to be
 * what they are.
 *
 * The competitive move lives in what is absent. Every serious competitor meters
 * by guest, which makes a couple sit at a kitchen table and cut people from
 * their wedding to save forty dollars. There is no meter here and no comparison
 * table either, because quiet luxury does not punch down. No competitor is
 * named on this site.
 *
 * The Commission's cap is real. A person builds each one, which is what the
 * $599 buys, and which is why there are twelve. A true limit is the strongest
 * premium signal available and it costs nothing, so it must never be faked. In
 * particular there is deliberately no "3 left this month" counter here: nothing
 * in this codebase knows the remaining capacity, and inventing it would be the
 * one thing that turns an honest constraint into a trick.
 *
 * Choosing is not buying. The button lives in The Close, one section down, so
 * the page carries a single call to action. The selection is shared through the
 * small store below rather than through a provider, so neither section needs
 * the page to wire them together.
 */

export const TIER_ORDER = ["invitation", "commission"] as const;

type TierCopy = {
  name: string;
  /** Delivery, in one line. */
  delivery: string;
  /** Who does the work. */
  work: string;
  /** The line that removes the meter. Said on both, because it is the point. */
  guests: string;
  /** Only The Commission has one, and it is true. */
  constraint?: string;
};

export const TIER_COPY: Record<Tier, TierCopy> = {
  invitation: {
    name: "The Invitation",
    delivery: "Live in an hour.",
    work: "You build it. Your names, your date and your style are already in place when you arrive.",
    guests: "Unlimited guests.",
  },
  commission: {
    name: "The Commission",
    delivery: "Ready in forty eight hours.",
    work: "Our studio builds it from a short brief. You approve it before a single guest sees it.",
    guests: "Unlimited guests.",
    constraint: "Twelve a month. A person builds each one.",
  },
};

type Money = { currency: string; amount: number };

/**
 * Prices are held as numbers and formatted at render, never written as "$249".
 * A hardcoded string cannot become euros, and German is a real locale here
 * rather than a translation layer.
 *
 * Only the locales whose prices are confirmed appear. A missing locale renders
 * a visible notice instead of a plausible wrong number, because a price is the
 * one thing on this page that must not be guessed. LESSONS.md R12.
 */
const PRICING: Partial<Record<Locale, Record<Tier, Money>>> = {
  en: {
    invitation: { currency: "USD", amount: 249 },
    commission: { currency: "USD", amount: 599 },
  },
};

const INTL_TAG: Record<Locale, string> = { en: "en-US", de: "de-DE" };

export function getPricing(locale: Locale): Record<Tier, Money> | null {
  return PRICING[locale] ?? null;
}

export function formatPrice(locale: Locale, money: Money): string {
  return new Intl.NumberFormat(INTL_TAG[locale], {
    style: "currency",
    currency: money.currency,
    /* Whole dollars. A trailing ".00" reads as a shopping cart. */
    maximumFractionDigits: 0,
  }).format(money.amount);
}

/* ── the selection ──────────────────────────────────────────────────────
 *
 * A module scoped external store, matching how `src/lib/couple.ts` models
 * localStorage. Two sibling sections need one value and neither owns the other,
 * so the alternative is a provider in `page.tsx`, which would make the page
 * responsible for a detail of the tier block. `useSyncExternalStore` gives the
 * server a fixed snapshot by construction, so this cannot hydrate mismatched.
 */

let selected: Tier = "invitation";
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Tier {
  return selected;
}

/** The Invitation is the self serve default, and the default is stated on the button. */
function getServerSnapshot(): Tier {
  return "invitation";
}

export function useSelectedTier(): { tier: Tier; select: (next: Tier) => void } {
  const tier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const select = useCallback((next: Tier) => {
    if (next === selected) return;
    selected = next;
    for (const listener of listeners) listener();
  }, []);
  return { tier, select };
}

/* ── the section ────────────────────────────────────────────────────────── */

export function Choice({ locale = "en" }: { locale?: Locale }) {
  const { tier, select } = useSelectedTier();
  const sectionRef = useRef<HTMLElement | null>(null);

  /* Fired once when the tier block is actually on screen, not when it mounts. */
  useEffect(() => {
    const el = sectionRef.current;
    if (el === null || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        track({ name: "tiers_viewed" }, true);
        /* One shot. Nothing below depends on continued observation. */
        observer.disconnect();
      },
      /* A third of the block visible is a read, not a scroll past. */
      { threshold: 0.33 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const pricing = getPricing(locale);

  return (
    <section
      id="choice"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="choice-title"
    >
      <div className={`wrap ${styles.inner}`}>
        <header className={styles.head}>
          <p className="kicker">Price</p>
          <h2 id="choice-title" className={`display ${styles.title}`}>
            Two ways in.
          </h2>
          <p className={`lede ${styles.lede}`}>
            One is yours to build. One we build for you.
          </p>
        </header>

        {pricing === null ? (
          /*
           * Unreachable while `en` is the only locale rendered. It exists so
           * that shipping `/de` without confirming euro amounts fails visibly
           * rather than charging one number and displaying another.
           */
          <p className={styles.notice} role="status">
            Pricing for this language is not confirmed yet, so it is not shown.
          </p>
        ) : (
          <fieldset className={styles.group}>
            <legend className={styles.legend}>
              Choose how your invitation is made
            </legend>

            <div className={styles.tiers}>
              {TIER_ORDER.map((id) => {
                const copy = TIER_COPY[id];
                const isSelected = tier === id;
                return (
                  <label
                    key={id}
                    className={styles.tier}
                    data-selected={isSelected ? "true" : "false"}
                  >
                    <input
                      className={styles.radio}
                      type="radio"
                      name="aea-tier"
                      value={id}
                      checked={isSelected}
                      onChange={() => select(id)}
                    />
                    <span className={`display ${styles.name}`}>{copy.name}</span>
                    <span className={styles.price}>
                      {formatPrice(locale, pricing[id])}
                    </span>
                    <span className={styles.line}>{copy.delivery}</span>
                    <span className={styles.line}>{copy.work}</span>
                    <span className={styles.line}>{copy.guests}</span>
                    {copy.constraint === undefined ? null : (
                      <span className={styles.constraint}>{copy.constraint}</span>
                    )}
                    {/*
                     * The visible state word. The radio already carries the
                     * state for assistive technology, so this is hidden from it
                     * to avoid saying "chosen" twice, and exists so that the
                     * selection is not signalled by colour alone.
                     */}
                    <span className={styles.state} aria-hidden="true">
                      {isSelected ? "Chosen" : "Choose"}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>
    </section>
  );
}
