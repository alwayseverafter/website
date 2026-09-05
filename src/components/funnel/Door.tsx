"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Locale } from "@/invite/types";
import { track } from "@/lib/analytics";
import styles from "./Door.module.css";

/**
 * 0. The Door.
 *
 * A full viewport monochrome film of tall closed doors, paused on frame 0, and
 * one word. The visitor taps, the doors swing open, the camera pushes through,
 * and section 1 is waiting on the other side.
 *
 * The whole trick, from docs/opener-film.md: **frame 0 of the clip IS the
 * static first screen.** The still sits underneath the paused video at
 * identical size and object-fit, so starting playback changes nothing on
 * screen. Nothing is swapped and nothing re-lays out. If the two differ even
 * slightly a flash appears on tap, and that flash would undo the entire first
 * impression.
 *
 * Three things follow from that rule and are load bearing:
 *
 * 1. The still is a plain `<img>` inside a `<picture>`, not `next/image`. The
 *    optimiser would re-encode it to AVIF or WebP, and a re-encode is exactly
 *    the "differ even slightly" the rule forbids. It must be the same bytes
 *    ffmpeg pulled out of the finished clip.
 * 2. The still, not the video poster attribute, is what paints first. The
 *    `<picture>` picks the matching master by media query at parse time, with
 *    no JavaScript and therefore no hydration swap, so there is no flash on
 *    load either. It is also the LCP element: one 118 KB JPEG in the initial
 *    HTML at high priority.
 * 3. The video carries no `src` and no `poster` in the server markup. Both are
 *    attached on mount, to the master that matches the same media query. The
 *    video therefore cannot start downloading before the poster has, and until
 *    it has decoded frame 0 the video box is transparent and the still shows
 *    through.
 */

/** 9:16 master. Primary: 90% or more of this site's traffic is a phone. */
const FILM_PORTRAIT = "/tor-mobile.mp4";
const STILL_PORTRAIT = "/tor-mobile-poster.jpg";

/** 16:9 master, the fallback. See LANDSCAPE_MEDIA for where it earns its place. */
const FILM_LANDSCAPE = "/tor.mp4";
const STILL_LANDSCAPE = "/tor-poster.jpg";

/**
 * When the 16:9 master plays instead of the 9:16 one. Mirrored in
 * Door.module.css, which lays out the three regimes this splits the world into:
 *
 * A. taller than 3:4        full bleed, portrait master. Every phone held up.
 * B. wider, at least 600px  a centred 9:16 stage on a `--door` ground,
 *    tall                   portrait master. `object-fit: cover` on a 9:16 clip
 *                           at 1280x800 would show the middle ~35% of its
 *                           height and crop the dance floor away, so the gate
 *                           is deliberately not full bleed here
 *                           (docs/opener-film.md section 7). 1080x1920 in a
 *                           ~450px column is also sharper than 1280x720
 *                           stretched across a desktop.
 * C. wider, under 600px     full bleed, landscape master. This is the case the
 *    tall                   second master exists for: a rotated phone, where a
 *                           9:16 column at 390px of height would be a 219px
 *                           splinter of a 844px screen.
 *
 * The two height bounds meet at 599.98px so no viewport falls between them.
 */
const LANDSCAPE_MEDIA = "(min-aspect-ratio: 3 / 4) and (max-height: 599.98px)";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Both masters are 3.4s. Only ever used if the browser will not report it. */
const FILM_SECONDS = 3.4;

/**
 * The white bloom over the last frames, so the handover needs no white ending.
 *
 * 200, not 400, to match max-und-lena: `Opener.tsx` sets the bloom at
 * `hand - 200`, with the note "longer bloom would wash out the arrival it
 * exists to hand over from". Note that `docs/opener-film.md` says "~250ms" —
 * the shipped implementation is the authority here, and it uses 200.
 */
const BLOOM_MS = 200;

/**
 * How long before the clip ends the handover runs, matching max-und-lena's
 * `v.duration * 1000 - 80`. The film's final frame is therefore never shown:
 * the cut happens under the bloom while the doors are still moving, which is
 * what makes the arrival feel handed over rather than played out.
 */
const FILM_TAIL_MS = 80;

/** Max-und-lena's floor on the handover, so a stub clip still gets a beat. */
const HAND_MIN_MS = 400;

/** The veil fading off the arrival. Safety net only; `animationend` leads. */
const VEIL_MS = 700;

/**
 * closed   the still, the wordmark, one word
 * opening  the film is running
 * blooming the last BLOOM_MS, the film washing out to paper
 * arrived  the door is gone, a full white veil is dissolving off the invitation
 * gone     nothing left to render
 */
type Phase = "closed" | "opening" | "blooming" | "arrived" | "gone";

export type DoorProps = {
  locale?: Locale;
  /**
   * Locale lives above this component. The EN / DE pair renders only when a
   * handler is supplied, because a language switch that silently does nothing
   * is the shape of B1: a control that looks live and is not (LESSONS.md R3).
   */
  onLocaleChange?: (locale: Locale) => void;
};

export function Door({ locale = "en", onLocaleChange }: DoorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * R4. The authoritative phase is the ref, because every handler below reads
   * it. A handler reading `phase` out of the render closure sees the value from
   * the render it was created in, which is how B5 dropped the first move of a
   * gesture. The state exists only so a class name can change.
   */
  const phaseRef = useRef<Phase>("closed");
  const [phase, setPhase] = useState<Phase>("closed");

  /** R4 again. The identity of the pointer currently pressing, never state. */
  const pressRef = useRef<number | null>(null);
  const [pressed, setPressed] = useState(false);

  const timersRef = useRef<number[]>([]);

  const enter = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  /** R5. A ref that gates work is reset here, not merely emptied of effect. */
  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    track({ name: "door_shown" }, true);
  }, []);

  /**
   * Attach the master that matches the viewport, and keep it matched while the
   * door is still shut. Done here rather than in the markup because `media` on
   * a `<source>` inside a `<video>` was removed from browsers years ago, and
   * because picking in JavaScript during render would mean the server and the
   * client could disagree about which poster to paint.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia(LANDSCAPE_MEDIA);
    const apply = () => {
      /* Swapping the source mid film would restart it from frame 0. */
      if (phaseRef.current !== "closed") return;
      const src = query.matches ? FILM_LANDSCAPE : FILM_PORTRAIT;
      if (video.getAttribute("src") === src) return;
      /* Poster first, so the box never paints the wrong frame 0 for a beat. */
      video.poster = query.matches ? STILL_LANDSCAPE : STILL_PORTRAIT;
      video.src = src;
      video.load();
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  /** R5. Every gate this component holds is restored when it goes away. */
  useEffect(
    () => () => {
      clearTimers();
      pressRef.current = null;
    },
    [clearTimers],
  );

  const finish = useCallback(() => {
    if (phaseRef.current === "arrived" || phaseRef.current === "gone") return;
    clearTimers();
    videoRef.current?.pause();
    /*
     * The veil is already opaque when this runs, so the door can be taken out
     * of flow and the page put back to the top without either being seen.
     */
    window.scrollTo(0, 0);
    enter("arrived");
    /*
     * The veil unmounts on `animationend`. This is the belt and braces: an
     * animation that never starts would otherwise leave a white sheet over the
     * whole site, which is the worst failure this component has available.
     */
    after(VEIL_MS + 400, () => enter("gone"));
    /* Section 1 owns this id and is focusable, so the keyboard follows. */
    document.getElementById("arrival")?.focus({ preventScroll: true });
  }, [after, clearTimers, enter]);

  const open = useCallback(() => {
    if (phaseRef.current !== "closed") return;
    enter("opening");
    track({ name: "door_opened" }, true);

    const video = videoRef.current;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;

    if (!video || reduced) {
      /* Reduced motion: skip the film, render the arrived state directly. */
      finish();
      return;
    }

    const seconds =
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FILM_SECONDS;

    /*
     * The handover, on max-und-lena's clock: `max(400, duration - 80)`. It
     * leads now, where `ended` used to, because cutting on `ended` shows the
     * film's last frame and then hands over from a still. Cutting 80ms short
     * keeps the doors in motion under the bloom.
     */
    const hand = Math.max(HAND_MIN_MS, seconds * 1000 - FILM_TAIL_MS);

    after(Math.max(0, hand - BLOOM_MS), () => enter("blooming"));
    after(hand, finish);

    void video.play().catch((error: unknown) => {
      /*
       * R3: do not strand a visitor behind a door that will not open, and do
       * not hide the reason. The gate opens, loudly in development.
       */
      if (process.env.NODE_ENV === "development") {
        console.warn("[door] the film did not play, opening without it", error);
      }
      finish();
    });
  }, [after, enter, finish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    /* The backstop now, not the lead: `hand` fires 80ms earlier. `finish` is
       guarded on phase, so arriving here second is a no-op. */
    const onEnded = () => finish();
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [finish]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (phaseRef.current !== "closed") return;
    pressRef.current = event.pointerId;
    setPressed(true);
  }, []);

  /**
   * Bound to up, cancel and leave. `:active` is not usable here: iOS Safari
   * only honours it once a touch listener exists somewhere, and it survives a
   * `pointercancel` in some browsers, which is the same class of stuck state
   * that R6 was written about.
   */
  const endPress = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pressRef.current !== event.pointerId) return;
    pressRef.current = null;
    setPressed(false);
  }, []);

  if (phase === "gone") return null;

  const shut = phase === "closed";

  return (
    <>
      <section
        className={styles.root}
        data-phase={phase}
        hidden={phase === "arrived"}
        aria-label="The door"
      >
        <div className={styles.stage} aria-hidden="true">
          {/*
            R6: nothing decorative inside the interactive surface may become the
            pointer target. Dragging a native `<img>` fires `pointercancel`, and
            that is what killed the gesture last time.
          */}
          <picture className={styles.stillBox}>
            <source media={LANDSCAPE_MEDIA} srcSet={STILL_LANDSCAPE} />
            {/* A plain img, never next/image: this must be the exact bytes of
                frame 0. The optimiser would re-encode it and the poster would
                no longer match the clip. */}
            <img
              className={styles.still}
              src={STILL_PORTRAIT}
              alt=""
              width={1080}
              height={1920}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <video
            ref={videoRef}
            className={styles.film}
            playsInline
            muted
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
          />
        </div>

        <div className={styles.scrim} aria-hidden="true" />

        <nav className={styles.top} aria-label="Site">
          {onLocaleChange ? (
            <span className={styles.locales}>
              <button
                type="button"
                className={styles.topItem}
                aria-pressed={locale === "en"}
                onClick={() => onLocaleChange("en")}
              >
                EN
              </button>
              <span className={styles.slash} aria-hidden="true">
                /
              </span>
              <button
                type="button"
                className={styles.topItem}
                aria-pressed={locale === "de"}
                onClick={() => onLocaleChange("de")}
              >
                DE
              </button>
            </span>
          ) : (
            <span />
          )}
          <a className={styles.topItem} href="#styles">
            Styles
          </a>
        </nav>

        {/*
          The whole viewport is the tap target, which is as far past 44x44 as it
          is possible to go, and the visible word carries the focus ring.
        */}
        <button
          type="button"
          className={styles.trigger}
          data-pressed={pressed || undefined}
          onClick={open}
          onPointerDown={onPointerDown}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onPointerLeave={endPress}
          tabIndex={shut ? 0 : -1}
        >
          <span className={styles.markBlock} aria-hidden="true">
            <span className={styles.mark}>Always Ever After</span>
            <span className={styles.rule} />
          </span>
          <span className={styles.label}>Open</span>
        </button>

        <div className={styles.bloom} aria-hidden="true" />
      </section>

      {phase === "arrived" ? (
        <div
          className={styles.veil}
          aria-hidden="true"
          onAnimationEnd={() => enter("gone")}
        />
      ) : null}
    </>
  );
}

export default Door;
