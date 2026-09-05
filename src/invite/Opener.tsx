"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import type { Messages } from "./i18n";
import { useReducedMotion, useWillChange, prefersReducedMotion } from "./motion";
import type { Theme } from "./themes";
import type { OpenerId } from "./types";
import { Ornament, Rule } from "./Ornament";
import styles from "./invite.module.css";

/**
 * The four openers.
 *
 * An opener is the thing between a guest and the invitation. It is the whole
 * product demo, so it is never substituted: `Opener` switches exhaustively on
 * the union and there is no `default` branch to fall into. B1 was exactly that
 * fall-through, a guest who chose "tor" silently got "veil", and it shipped.
 *
 * Timing follows the brand: 600ms for ordinary transitions, 1500ms for the one
 * that is meant to feel slow. `prefers-reduced-motion: reduce` hands straight
 * over to the arrived state with no animation at all.
 */

/** A name as it will be painted, and whether it is standing in for one. */
export type DisplayName = {
  readonly text: string;
  /** True when the couple has not typed this name yet. Announced, never hidden. */
  readonly placeholder: boolean;
};

export type OpenerProps = {
  readonly opener: OpenerId;
  readonly theme: Theme;
  readonly names: { readonly a: DisplayName; readonly b: DisplayName };
  readonly dateLabel: string;
  readonly m: Messages;
  /**
   * False at `thumb`. A thumbnail is a picture of an opener inside somebody
   * else's button, so it carries no controls of its own: nesting a button in a
   * button is invalid, and a 44px target does not fit a 150px tile anyway (R9).
   * The visitor still sees the opener they chose, which is what R3 is about.
   */
  readonly interactive: boolean;
  /** Called once the opener has finished leaving, never when it starts. */
  readonly onOpen: () => void;
};

const LEAVE_MS = 900;
const ENVELOPE_MS = 720;
const VEIL_MS = 1500;

export function Opener(props: OpenerProps): ReactElement | null {
  switch (props.opener) {
    case "veil":
      return <Veil {...props} />;
    case "foil":
      return <Foil {...props} />;
    case "envelope":
      return <Envelope {...props} />;
    case "direct":
      /* "direct" is the deliberate absence of a cover, so there is nothing to
         render. `InvitePreview` never mounts this layer for it; the case exists
         so that adding a fifth opener is a compile error here rather than a
         blank screen for whoever picked it. */
      return null;
  }
}

/* ---------------------------------------------------------------- names -- */

function CoverNames({ names }: { names: OpenerProps["names"] }): ReactElement {
  return (
    <p className={styles.coverNames}>
      <Name value={names.a} />
      <span className={styles.amp} aria-hidden="true">
        &amp;
      </span>
      <Name value={names.b} />
    </p>
  );
}

function Name({ value }: { value: DisplayName }): ReactElement {
  return (
    <span className={styles.name} data-placeholder={value.placeholder}>
      {value.text}
    </span>
  );
}

/**
 * Every opener leaves the same way once its own business is done: the cover
 * dissolves off the invitation underneath. Held in one hook so the three cannot
 * drift apart, and so the timer that hands over is cancelled on unmount rather
 * than firing into a component that is gone (R5).
 */
function useHandover(onOpen: () => void): {
  leaving: boolean;
  begin: (afterMs: number) => void;
} {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useRef(false);

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
      /* The gate is restored, not merely the timer cleared. R5. */
      done.current = false;
    };
  }, []);

  const begin = (afterMs: number) => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    const wait = prefersReducedMotion() ? 0 : afterMs;
    timer.current = setTimeout(onOpen, wait);
  };

  return { leaving, begin };
}

/* ----------------------------------------------------------------- veil -- */

/**
 * Two panels of gauze hung over the names. They part and lift together, which
 * is slower than feels right on first read and is correct: the wait is the
 * drama.
 */
function Veil({ theme, names, dateLabel, m, interactive, onOpen }: OpenerProps): ReactElement {
  const { leaving, begin } = useHandover(onOpen);
  const reduced = useReducedMotion();
  const { arm, disarm } = useWillChange();
  const gauzeRef = useRef<HTMLDivElement>(null);

  const lift = () => {
    arm(gauzeRef.current, "transform, opacity");
    begin(VEIL_MS);
  };

  return (
    <div className={styles.coverInner} data-leaving={leaving}>
      <div
        ref={gauzeRef}
        className={styles.gauze}
        data-lifted={leaving}
        aria-hidden="true"
        onTransitionEnd={() => disarm(gauzeRef.current)}
      >
        <span className={styles.gauzePanel} data-side="l" />
        <span className={styles.gauzePanel} data-side="r" />
      </div>

      <div className={styles.coverStack}>
        <Ornament id={theme.ornament} size={26} />
        <CoverNames names={names} />
        <Rule id={theme.ornament} />
        <p className={styles.coverDate}>{dateLabel}</p>
        {interactive ? (
          <button type="button" className={styles.btn} onClick={lift} disabled={leaving}>
            {reduced ? m.open : m.liftTheVeil}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- foil -- */

/**
 * Gold leaf, deliberately independent of the theme palette. A scratch panel
 * reads as foil only if it actually looks metallic, so obsidian's champagne and
 * verdure's brass are both wrong here: this is the same leaf on every theme.
 */
const GOLD: readonly (readonly [number, string])[] = [
  [0.0, "#8A6714"],
  [0.14, "#C9A227"],
  [0.28, "#F6E7A9"],
  [0.42, "#D4AF37"],
  [0.58, "#FFF6D0"],
  [0.72, "#C08F1E"],
  [0.86, "#EBD37C"],
  [1.0, "#9A7419"],
];

function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  for (const [stop, colour] of GOLD) grad.addColorStop(stop, colour);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  /* Brushed sheen, so the surface catches light rather than reading as flat. */
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#FFFDF0";
  ctx.lineWidth = 1;
  for (let x = -h; x < w + h; x += 7) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#4A3708";
  for (let i = 0; i < 400; i += 1) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
  ctx.restore();
}

function Foil({ theme, names, dateLabel, m, interactive, onOpen }: OpenerProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cleared, setCleared] = useState(false);
  const { leaving, begin } = useHandover(onOpen);
  const { arm, disarm } = useWillChange();

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx === null) return;

    /* Every gate the pointer handlers read lives here, in the effect's own
       scope, rather than in a ref that outlives it. That is R4 satisfied by
       construction (no handler reads a render closure) and R5 made moot (there
       is no cross-render gate left half-open by the dev double-invoke). */
    let painted = false;
    let scratching = false;
    let done = false;
    let last: { x: number; y: number } | null = null;
    let sinceSample = 0;
    let width = 0;
    let height = 0;

    const setup = (): boolean => {
      const rect = canvas.getBoundingClientRect();
      /* Container-query sizing means the box may still be settling on first
         paint. Bail, and let the ResizeObserver call back. */
      if (rect.width < 2 || rect.height < 2) return false;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      paintFoil(ctx, width, height);
      ctx.globalCompositeOperation = "destination-out";
      return true;
    };

    painted = setup();

    const ro = new ResizeObserver(() => {
      /* Never repaint over somebody's progress. Only size an unpainted panel. */
      if (!painted && !done) painted = setup();
    });
    ro.observe(canvas);

    const scratchedFraction = (): number => {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      let total = 0;
      /* Every 32nd pixel's alpha. Reading all of them on every move is what
         makes a scratch panel stutter on a phone. */
      for (let i = 3; i < data.length; i += 4 * 32) {
        total += 1;
        const alpha = data[i];
        if (alpha !== undefined && alpha < 24) clear += 1;
      }
      return total === 0 ? 0 : clear / total;
    };

    const finish = () => {
      if (done) return;
      done = true;
      arm(canvas, "opacity");
      setCleared(true);
    };

    const at = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const eraseTo = (p: { x: number; y: number }) => {
      const radius = Math.max(16, Math.min(width, height) * 0.11);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = radius * 2;
      ctx.beginPath();
      /* Stroke from the previous point, so a fast drag leaves no gaps. */
      ctx.moveTo(last === null ? p.x : last.x, last === null ? p.y : last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      last = p;
    };

    const down = (e: PointerEvent) => {
      if (done) return;
      if (!painted) painted = setup();
      e.preventDefault();
      scratching = true;
      last = null;
      sinceSample = 0;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* Capture is a convenience. Losing it costs precision, not function. */
      }
      eraseTo(at(e));
    };

    const move = (e: PointerEvent) => {
      if (!scratching || done) return;
      e.preventDefault();
      eraseTo(at(e));
      sinceSample += 1;
      /* Sampled periodically rather than on every move, so a slow steady
         scratch still completes without reading the whole buffer 60 times a
         second. */
      if (sinceSample >= 6) {
        sinceSample = 0;
        if (scratchedFraction() > 0.4) finish();
      }
    };

    const up = () => {
      if (!scratching || done) return;
      scratching = false;
      last = null;
      if (scratchedFraction() > 0.28) finish();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", up);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", up);
      disarm(canvas);
    };
  }, [interactive, arm, disarm]);

  return (
    <div className={styles.coverInner} data-leaving={leaving}>
      <div className={styles.coverStack}>
        <CoverNames names={names} />

        <div className={styles.foilWrap}>
          <div className={styles.foilUnder}>
            <Ornament id={theme.ornament} size={24} />
            <p className={styles.foilDate}>{dateLabel}</p>
          </div>
          {interactive ? (
            <canvas
              ref={canvasRef}
              className={styles.foilCanvas}
              data-cleared={cleared}
              aria-hidden="true"
              onTransitionEnd={() => disarm(canvasRef.current)}
            />
          ) : (
            /* A thumbnail gets the leaf as a still. Painting a canvas eight
               times over for tiles nobody can scratch is memory spent on
               nothing. R6: decorative, so it never takes the pointer. */
            <span className={styles.foilStill} aria-hidden="true" />
          )}
        </div>

        <p className={styles.hint}>{cleared ? m.revealed : m.scratchToReveal}</p>

        {interactive ? (
          /* Always present. A scratch panel is unusable with a keyboard or a
             screen reader, so the invitation must be reachable without it. */
          <button
            type="button"
            className={cleared ? styles.btn : styles.btnGhost}
            onClick={() => begin(LEAVE_MS)}
            disabled={leaving}
          >
            {m.open}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- envelope -- */

function Envelope({ theme, names, dateLabel, m, interactive, onOpen }: OpenerProps): ReactElement {
  const [open, setOpen] = useState(false);
  const { leaving, begin } = useHandover(onOpen);
  const { arm, disarm } = useWillChange();
  const flapRef = useRef<HTMLSpanElement>(null);

  /** One tap opens the flap and carries straight on into the invitation. */
  const openAndContinue = () => {
    if (open) return;
    setOpen(true);
    arm(flapRef.current, "transform");
    begin(ENVELOPE_MS + LEAVE_MS);
  };

  const envelope = (
    <>
      <span ref={flapRef} className={styles.envFlap} aria-hidden="true" />
      <span className={styles.envCard} aria-hidden="true">
        <span className={styles.envDate}>{dateLabel}</span>
      </span>
      <span className={styles.envSeal} aria-hidden="true">
        <Ornament id={theme.ornament} size={16} />
      </span>
    </>
  );

  return (
    <div className={styles.coverInner} data-leaving={leaving}>
      <div className={styles.coverStack}>
        <CoverNames names={names} />

        {interactive ? (
          <button
            type="button"
            className={styles.env}
            data-open={open}
            aria-label={m.tapToOpen}
            onClick={openAndContinue}
            onTransitionEnd={() => disarm(flapRef.current)}
          >
            {envelope}
          </button>
        ) : (
          <span className={styles.env} data-open="false" aria-hidden="true">
            {envelope}
          </span>
        )}

        <p className={styles.hint}>{m.tapToOpen}</p>
      </div>
    </div>
  );
}
