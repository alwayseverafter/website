"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_LOCALE, HTML_LANG, readStoredLocale, storeLocale, type Locale,
} from "@/lib/i18n";
import { THEME_IDS, type ThemeId } from "@/invite/types";
import { useCouple } from "@/lib/couple";
import { Door } from "./Door";
import { Arrival } from "./Arrival";
import { Turn } from "./Turn";
import { Mirror } from "./Mirror";
import { Styles } from "./Styles";
import { Machine } from "./Machine";
import { Choice } from "./Choice";
import { Close } from "./Close";

/**
 * The funnel, assembled. Its order is the argument:
 *
 *   Door     make them tap
 *   Arrival  the product sells itself, wordlessly
 *   Turn     break the fourth wall
 *   Mirror   their names, no signup. The conversion engine.
 *   Styles   move the question from "do I want this" to "which one"
 *   Machine  answer the practical objection before it is voiced
 *   Choice   two tiers, no meter
 *   Close    one button
 *
 * Locale lives here because it is the one piece of state more than one section
 * needs, and because Door renders its EN / DE pair only when a real handler is
 * supplied. A switch that looks live and is not is the shape of B1.
 */

/**
 * Locale as an external store, matching `src/lib/couple.ts`. The server always
 * renders the default and the client adopts the stored value on hydration, so
 * the two snapshots differ by construction rather than by accident.
 */
let cache: Locale | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Locale {
  if (cache === null) cache = readStoredLocale() ?? DEFAULT_LOCALE;
  return cache;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function isThemeId(v: string | null): v is ThemeId {
  return v !== null && (THEME_IDS as readonly string[]).includes(v);
}

export function Funnel() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { update } = useCouple();

  const onLocaleChange = useCallback((next: Locale) => {
    cache = next;
    storeLocale(next);
    for (const l of listeners) l();
  }, []);

  /**
   * The document's language, kept in step with the switch.
   *
   * `layout.tsx` is a server component and renders `lang="en"` for every
   * visitor, so without this a visitor who presses DE gets German announced by
   * an English speech synthesiser and hyphenated by English rules. This is the
   * only place that knows the chosen locale, so it is the only place that can
   * say so. The legal pages need nothing like this: they know their locale at
   * request time and declare it on their own `<main>`, in `LegalPage.tsx`.
   */
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  /**
   * `/styles/[theme]` sends visitors back as `?theme=<id>&from=styles`, so a
   * couple who fell for one style on a search-landed page arrives with it
   * already chosen. Read once from the URL rather than through
   * `useSearchParams`, which would need a Suspense boundary around the door
   * and delay the only thing on the first screen.
   *
   * An unknown id is ignored rather than defaulted: the visitor keeps whatever
   * they had, which is the honest outcome of a bad link.
   */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("theme");
    if (isThemeId(wanted)) update({ theme: wanted });
  }, [update]);

  return (
    <>
      <Door locale={locale} onLocaleChange={onLocaleChange} />
      <Arrival locale={locale} />
      <Turn locale={locale} />
      <Mirror locale={locale} />
      <Styles locale={locale} />
      <Machine locale={locale} />
      <Choice locale={locale} />
      <Close locale={locale} />
    </>
  );
}
