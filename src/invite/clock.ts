"use client";

import { useSyncExternalStore } from "react";

/**
 * The wall clock, to the minute.
 *
 * A clock is an external system, not component state, and modelling it as one
 * gets three things right at once. The server has no clock, so it answers
 * `null` and the countdown renders its reserved space rather than a number that
 * the client would immediately contradict. The snapshot is quantized to the
 * minute, so it is referentially stable between ticks and React does not
 * re-render on every read. And the subscription is torn down with the
 * component, so no interval outlives the invitation that started it.
 */

const MINUTE = 60_000;

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, MINUTE);
  return () => clearInterval(id);
}

function snapshot(): number {
  return Math.floor(Date.now() / MINUTE) * MINUTE;
}

/* Null, not zero: "the server does not know what time it is" is a different
   fact from "it is the epoch", and the caller has to handle it either way. */
function serverSnapshot(): null {
  return null;
}

export function useMinuteClock(): number | null {
  return useSyncExternalStore<number | null>(subscribe, snapshot, serverSnapshot);
}
