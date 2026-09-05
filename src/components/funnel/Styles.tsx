"use client";

import { useEffect, useId, useRef } from "react";
import { InvitePreview } from "@/invite/InvitePreview";
import { THEME_IDS, type Couple, type Locale, type ThemeId } from "@/invite/types";
import { SAMPLE, useCouple } from "@/lib/couple";
import { track } from "@/lib/analytics";
import styles from "./Styles.module.css";

/**
 * Section 4: The Styles.
 *
 * Eight themes, each a live render carrying the visitor's names rather than the
 * sample couple's. That is the whole trick: a card showing somebody else's
 * wedding is a swatch, and a card showing yours is a decision.
 *
 * Its job is to move the question from "do I want this" to "which one". A
 * visitor choosing between eight options they like has already answered the
 * first question.
 */

/**
 * Written out rather than derived from the id, so adding a theme to `THEME_IDS`
 * is a type error here rather than a card silently labelled "new theme 2".
 * These are proper nouns and do not translate.
 */
const THEME_NAMES: Record<ThemeId, string> = {
  "atelier-blanc": "Atelier Blanc",
  vicioso: "Vicioso",
  noir: "Noir",
  sable: "Sable",
  aurum: "Aurum",
  verdure: "Verdure",
  porcelain: "Porcelain",
  obsidian: "Obsidian",
};

type Copy = {
  heading: string;
  /** The page adopting their names. This is where the section earns its keep. */
  lede: (a: string, b: string) => string;
  /** Phone only. The peeking card is the affordance; this names it. */
  hint: string;
  legend: string;
  chosen: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    heading: "Eight styles.",
    lede: (a, b) => `Each one carrying ${a} and ${b}.`,
    hint: "Swipe to see them all.",
    legend: "Choose a style",
    chosen: "Chosen",
  },
  de: {
    heading: "Acht Stile.",
    lede: (a, b) => `Jeder mit ${a} und ${b}.`,
    hint: "Wischt, um alle zu sehen.",
    legend: "Stil wählen",
    chosen: "Gewählt",
  },
};

export function Styles({ locale = "en" }: { locale?: Locale }) {
  const { couple, update } = useCouple();
  const copy = COPY[locale];
  const id = useId();

  /* Same fallback as The Mirror, for the same reason: a card must never read
     "undefined and undefined". The visitor can see whose names these are. */
  const shownA = couple.a.trim() || SAMPLE.a;
  const shownB = couple.b.trim() || SAMPLE.b;

  /*
   * Bring the chosen card into view whenever the choice changes.
   *
   * Two cases, one fix. Arrow keys move between radios, but the radio itself is
   * a clipped one pixel sitting at the card's top corner, so the browser sees
   * something already on screen and scrolls nothing: measured, the third card
   * was selected off screen with no visible change. And a returning visitor
   * whose theme is the seventh would otherwise be shown the first card with
   * their choice hidden to the right, which reads as the choice having been
   * lost.
   *
   * Horizontal only, and never `scrollIntoView`: that would also move the page
   * vertically and drag the visitor down a funnel they did not ask to move
   * through. Measured from rects rather than `offsetLeft`, which is relative to
   * an offset parent this component does not control.
   */
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = scroller.current;
    if (!box) return;
    /* Above 48rem this is a grid with nothing to scroll. */
    if (box.scrollWidth <= box.clientWidth) return;
    const card = box.querySelector<HTMLElement>('[data-selected="true"]');
    if (!card) return;
    const pad = parseFloat(getComputedStyle(box).paddingLeft) || 0;
    const delta =
      card.getBoundingClientRect().left - box.getBoundingClientRect().left - pad;
    /* Sub-pixel rounding is not a reason to scroll. */
    if (Math.abs(delta) > 1) box.scrollLeft += delta;
  }, [couple.theme]);

  function onSelect(theme: ThemeId) {
    update({ theme });
    track({ name: "style_selected", theme });
  }

  return (
    <section id="styles" className={styles.styles} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <header className={styles.head}>
          <h2 id={`${id}-h`} className={`display ${styles.h}`}>
            {copy.heading}
          </h2>
          <p className={`lede ${styles.lede}`}>{copy.lede(shownA, shownB)}</p>
          <p className={styles.hint}>{copy.hint}</p>
        </header>

        {/*
          Real radios sharing a name, not a hand-rolled radiogroup. Arrow key
          navigation, roving focus, "3 of 8" in a screen reader and the browser
          scrolling the focused card into view all come free, and the last of
          those is what drives the carousel from a keyboard.
        */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>{copy.legend}</legend>

          <div className={styles.scroller} ref={scroller}>
            {THEME_IDS.map((theme) => {
              const selected = couple.theme === theme;
              const preview: Couple = { a: shownA, b: shownB, date: couple.date, theme };

              return (
                <label key={theme} className={styles.card} data-selected={selected}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name={`${id}-theme`}
                    value={theme}
                    checked={selected}
                    onChange={() => onSelect(theme)}
                  />
                  {/* Hidden from assistive tech: the theme name below is the
                      radio's accessible name, and eight repetitions of the same
                      couple and date underneath it is noise, not information. */}
                  <span className={styles.thumb} aria-hidden="true">
                    <InvitePreview
                      couple={preview}
                      opener="direct"
                      locale={locale}
                      fit="thumb"
                      arrived
                    />
                  </span>
                  <span className={styles.name}>{THEME_NAMES[theme]}</span>
                  {/* A word, not a tick. No icons, and colour alone is not a
                      state. Hidden from assistive tech because the radio's own
                      checked state already says it; this exists for the sighted
                      visitor who cannot rely on a darker hairline. The line is
                      always present so selecting a card reflows nothing. */}
                  <span className={styles.state} aria-hidden="true">
                    {selected ? copy.chosen : ""}
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
