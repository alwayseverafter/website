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

/**
 * The tier names and their three lines, per locale.
 *
 * Keyed by locale first, because a tier name is copy rather than an id: a
 * German visitor who has pressed DE and is still reading "The Commission" has
 * been shown a control that does nothing (LESSONS.md R3). The German wording
 * is the wording `src/lib/i18n/de.ts` already uses for the same two tiers, so
 * the funnel and the legal pages call them the same thing.
 */
export const TIER_COPY: Record<Locale, Record<Tier, TierCopy>> = {
  en: {
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
  },
  de: {
    invitation: {
      name: "Die Einladung",
      delivery: "In einer Stunde online.",
      work: "Ihr baut sie. Eure Namen, euer Datum und euer Stil stehen schon darin, wenn ihr ankommt.",
      guests: "Beliebig viele Gäste.",
    },
    commission: {
      name: "Die Auftragsarbeit",
      delivery: "In achtundvierzig Stunden fertig.",
      work: "Unser Atelier baut sie nach einem kurzen Briefing. Ihr gebt sie frei, bevor ein einziger Gast sie sieht.",
      guests: "Beliebig viele Gäste.",
      constraint: "Zwölf im Monat. Ein Mensch baut jede einzelne.",
    },
  },
};

/** Everything the section says around the two tiers. */
type SectionCopy = {
  kicker: string;
  title: string;
  lede: string;
  legend: string;
  /** The visible state word on a card. Not read by assistive technology. */
  chosen: string;
  choose: string;
};

const SECTION_COPY: Record<Locale, SectionCopy> = {
  en: {
    kicker: "Price",
    title: "Two ways in.",
    lede: "One is yours to build. One we build for you.",
    legend: "Choose how your invitation is made",
    chosen: "Chosen",
    choose: "Choose",
  },
  de: {
    kicker: "Preis",
    title: "Zwei Wege hinein.",
    lede: "Einen baut ihr. Einen bauen wir für euch.",
    legend: "Wählt, wie eure Einladung entsteht",
    chosen: "Gewählt",
    choose: "Wählen",
  },
};

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

  const copy = SECTION_COPY[locale];
  const tiers = TIER_COPY[locale];

  return (
    <section
      id="choice"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="choice-title"
    >
      <div className={`wrap ${styles.inner}`}>
        <header className={styles.head}>
          <p className="kicker">{copy.kicker}</p>
          <h2 id="choice-title" className={`display ${styles.title}`}>
            {copy.title}
          </h2>
          <p className={`lede ${styles.lede}`}>{copy.lede}</p>
        </header>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{copy.legend}</legend>

          <div className={styles.tiers}>
            {TIER_ORDER.map((id) => {
              const tier_ = tiers[id];
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
                  <span className={`display ${styles.name}`}>{tier_.name}</span>
                  <span className={styles.line}>{tier_.delivery}</span>
                  <span className={styles.line}>{tier_.work}</span>
                  <span className={styles.line}>{tier_.guests}</span>
                  {tier_.constraint === undefined ? null : (
                    <span className={styles.constraint}>{tier_.constraint}</span>
                  )}
                  {/*
                   * The visible state word. The radio already carries the
                   * state for assistive technology, so this is hidden from it
                   * to avoid saying "chosen" twice, and exists so that the
                   * selection is not signalled by colour alone.
                   */}
                  <span className={styles.state} aria-hidden="true">
                    {isSelected ? copy.chosen : copy.choose}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
