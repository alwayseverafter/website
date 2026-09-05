"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_IDS, type Couple, type ThemeId } from "@/invite/types";

/**
 * The couple a visitor has typed into The Mirror.
 *
 * Persisted so a returning visitor is greeted by their own invitation rather
 * than by the sample couple's. This is the only thing the funnel stores, it is
 * stored only in the visitor's browser, and it never leaves it until checkout.
 */

const KEY = "aea.couple";

export const SAMPLE: Couple = {
  a: "Max",
  b: "Lena",
  date: "2026-12-15",
  theme: "atelier-blanc",
};

function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}

/** Parses defensively: storage is user-writable and survives deploys. */
export function parseCouple(raw: string | null): Couple | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (typeof v !== "object" || v === null) return null;
    const o = v as Record<string, unknown>;
    if (typeof o.a !== "string" || typeof o.b !== "string") return null;
    if (typeof o.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(o.date)) return null;
    return {
      a: o.a.slice(0, 40),
      b: o.b.slice(0, 40),
      date: o.date,
      theme: isThemeId(o.theme) ? o.theme : SAMPLE.theme,
    };
  } catch {
    return null;
  }
}

export function useCouple() {
  /**
   * Starts at SAMPLE on both server and client, then adopts stored values in an
   * effect. Reading storage during render would desynchronise the two and
   * produce a hydration mismatch on the most important element on the page.
   */
  const [couple, setCouple] = useState<Couple>(SAMPLE);
  const [named, setNamed] = useState(false);

  useEffect(() => {
    const stored = parseCouple(
      typeof window === "undefined" ? null : window.localStorage.getItem(KEY),
    );
    if (stored) {
      setCouple(stored);
      setNamed(true);
    }
  }, []);

  const update = useCallback((patch: Partial<Couple>) => {
    setCouple((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* Private mode, or storage full. The page must still work. */
      }
      return next;
    });
    if (patch.a !== undefined || patch.b !== undefined) setNamed(true);
  }, []);

  return { couple, named, update, isSample: !named };
}
