"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * One place that asks the operating system whether it wants movement.
 *
 * Two forms, because the two callers need different things. Handlers and
 * effects need the answer imperatively, at the instant of the gesture.
 * Components need it as reactive state that survives the user changing the
 * setting mid-session, and that is identical on the server and on the client's
 * first paint or they hydrate mismatched.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

/** Imperative form. Safe to call during SSR, where it answers `false`. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* The server has no media queries. Answering `false` there matches what the
   browser's own first paint does before any script runs, so hydration agrees
   and the effect that follows corrects it in the same frame. */
function serverSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, serverSnapshot);
}

/**
 * `will-change` is opt-in and never standing (R8). Twenty-eight petals held
 * compositor memory for the whole session in the previous product because the
 * hint was set in a stylesheet.
 *
 * Returns a pair: arm the hint when the animation starts, disarm it when the
 * transition ends. Both are safe to call with a detached or null element, and
 * disarming twice is harmless, which is what makes it safe to call from both a
 * `transitionend` handler and a cleanup.
 */
export function useWillChange(): {
  arm: (el: HTMLElement | null, value: string) => void;
  disarm: (el: HTMLElement | null) => void;
} {
  const arm = useCallback((el: HTMLElement | null, value: string) => {
    if (el !== null) el.style.willChange = value;
  }, []);
  const disarm = useCallback((el: HTMLElement | null) => {
    if (el !== null) el.style.willChange = "";
  }, []);
  return { arm, disarm };
}
