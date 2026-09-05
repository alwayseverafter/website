"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_IDS, type Couple, type ThemeId } from "@/invite/types";

/**
 * The couple a visitor has typed into The Mirror.
 *
 * Persisted so a returning visitor is greeted by their own invitation rather
 * than by the sample couple's. This is the only thing the funnel stores, it is
 * stored only in the visitor's browser, and it never leaves it until checkout.
 *
 * Modelled as an external store rather than component state. localStorage *is*
 * an external store: it is mutable outside React, it is shared across tabs, and
 * it does not exist during server rendering. `useSyncExternalStore` is the only
 * hook that handles all three without tearing, and it gives the server a
 * different snapshot than the client by construction, so the most important
 * element on the page cannot hydrate mismatched.
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

/** Parses defensively: storage is user-writable and outlives any deploy. */
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

type Snapshot = { couple: Couple; named: boolean };

const SERVER_SNAPSHOT: Snapshot = { couple: SAMPLE, named: false };

/**
 * getSnapshot must return a referentially stable value while the underlying
 * string is unchanged, or React re-renders forever. Cache on the raw string.
 */
let cache: { raw: string | null; snapshot: Snapshot } = {
  raw: null,
  snapshot: SERVER_SNAPSHOT,
};

const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  /* Another tab writing the same key. Rare, and free to support. */
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    /* Private mode, or storage disabled. The page must still work. */
    return null;
  }
}

function getSnapshot(): Snapshot {
  const raw = read();
  if (raw !== cache.raw) {
    const parsed = parseCouple(raw);
    cache = {
      raw,
      snapshot: parsed ? { couple: parsed, named: true } : SERVER_SNAPSHOT,
    };
  }
  return cache.snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

export function useCouple() {
  const { couple, named } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const update = useCallback((patch: Partial<Couple>) => {
    const next = { ...getSnapshot().couple, ...patch };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* Storage unavailable. Hold it in the cache so the session still works. */
      cache = { raw: cache.raw, snapshot: { couple: next, named: true } };
    }
    emit();
  }, []);

  return { couple, named, update, isSample: !named };
}
