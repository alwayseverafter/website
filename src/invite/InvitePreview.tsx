"use client";

import { useEffect, useState, type ReactElement } from "react";
import { useMinuteClock } from "./clock";
import { formatLong, formatShort, parseWeddingDate, remainingUntil } from "./datetime";
import { MESSAGES, type Messages } from "./i18n";
import { Opener, type DisplayName } from "./Opener";
import { Rule } from "./Ornament";
import { Reveal } from "./Reveal";
import { THEMES, themeVars } from "./themes";
import type { InvitePreviewProps, OpenerId } from "./types";
import styles from "./invite.module.css";

/**
 * The invitation renderer.
 *
 * One component, three sizes, eight themes, four openers. The prop contract in
 * `types.ts` is the seam the rest of the funnel is built against and it is not
 * widened here: everything below is derived from those five fields.
 *
 * R1 governs the whole file. Nothing reads the viewport. The frame is a size
 * container and every dimension inside it is expressed in `cqw`, `cqh` or
 * `cqmin`, because the same markup runs full page, as a card and as a 150px
 * tile, and `vh` resolving against the window is what made petals travel 1.58x
 * their frame in the previous product.
 *
 * R2: every rule lives in `invite.module.css`. Nothing here can reach a page
 * that embeds it.
 */
export function InvitePreview({
  couple,
  opener,
  locale,
  fit,
  arrived = false,
}: InvitePreviewProps): ReactElement {
  const theme = THEMES[couple.theme];
  const m = MESSAGES[locale];
  const parsed = parseWeddingDate(couple.date);

  /**
   * Which opener was opened, rather than whether one was.
   *
   * Switching the opener in The Styles has to put the cover back, or a visitor
   * who picks "envelope" is shown an invitation that is already open. Recording
   * the opener instead of a boolean makes that fall out of the derivation, with
   * no effect to resynchronise and no window in which the two disagree.
   */
  const [openedFor, setOpenedFor] = useState<OpenerId | null>(null);
  const opened = openedFor === opener;

  /* R3 and R12: a malformed date is a bug in whoever built the couple, and it
     announces itself in the console as well as on the page. */
  const fault = parsed.ok ? null : parsed.reason;
  useEffect(() => {
    if (fault !== null && process.env.NODE_ENV !== "production") {
      console.error(`InvitePreview: ${fault}`);
    }
  }, [fault]);

  if (!parsed.ok) {
    return (
      <div className={styles.frame} data-fit={fit} data-fault="true">
        <p className={styles.fault}>
          <strong>Invitation cannot render.</strong> {parsed.reason}
        </p>
      </div>
    );
  }

  const names = {
    a: toDisplayName(couple.a, m),
    b: toDisplayName(couple.b, m),
  };
  /* A 150px tile cannot hold "Samstag, 15. Dezember 2026" at a readable size,
     and shrinking it until it fits is how an invitation starts looking like a
     spreadsheet. The short form is the same fact, set to the space available. */
  const dateLabel =
    fit === "thumb" ? formatShort(parsed.at, locale) : formatLong(parsed.at, locale);

  const showCover = !arrived && hasCover(opener);
  const covered = showCover && !opened;

  return (
    <div
      className={styles.frame}
      style={themeVars(theme)}
      data-fit={fit}
      data-theme={theme.id}
      data-chrome={theme.chrome}
      data-lettering={theme.lettering}
      data-dark={theme.dark}
      lang={locale}
      role="group"
      aria-label={m.artefact(names.a.text, names.b.text)}
    >
      {/* R6: the texture is decoration and never the pointer target. */}
      <span className={styles.grain} data-surface={theme.surface} aria-hidden="true" />

      <div className={styles.scroll} inert={covered}>
        <Reveal motion={theme.motion}>
          <div className={styles.sheet}>
            <p className={styles.kicker}>{m.kicker}</p>
            <Rule id={theme.ornament} />
            <p className={styles.names}>
              <Name value={names.a} />
              <span className={styles.amp} aria-hidden="true">
                &amp;
              </span>
              <Name value={names.b} />
            </p>
            <Rule id={theme.ornament} />
            <p className={styles.date}>{dateLabel}</p>
            {fit === "thumb" ? null : <Countdown at={parsed.at} m={m} />}
          </div>
        </Reveal>
      </div>

      {showCover ? (
        <div className={styles.coverLayer} data-open={opened} hidden={opened}>
          <Opener
            opener={opener}
            theme={theme}
            names={names}
            dateLabel={dateLabel}
            m={m}
            interactive={fit !== "thumb"}
            onOpen={() => setOpenedFor(opener)}
          />
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- pieces -- */

/**
 * Whether an opener puts something between the guest and the invitation.
 *
 * Exhaustive by construction: a fifth opener fails to compile here rather than
 * silently getting no cover, which is the shape B1 took.
 */
function hasCover(opener: OpenerId): boolean {
  switch (opener) {
    case "veil":
    case "foil":
    case "envelope":
      return true;
    case "direct":
      return false;
  }
}

/**
 * A name the couple has not typed yet is shown, not hidden and not invented
 * (R12). The Mirror rebinds on every keystroke, so an empty field is a normal
 * intermediate state rather than an error, and it says so in place.
 */
function toDisplayName(raw: string, m: Messages): DisplayName {
  const text = raw.trim();
  return text.length === 0
    ? { text: m.unnamed, placeholder: true }
    : { text, placeholder: false };
}

function Name({ value }: { value: DisplayName }): ReactElement {
  return (
    <span className={styles.name} data-placeholder={value.placeholder}>
      {value.text}
    </span>
  );
}

/**
 * Days, hours and minutes to the wedding.
 *
 * The clock is read after mount and never during render. A server render and a
 * client's first paint happen at different instants, so reading `Date.now()`
 * during render guarantees a hydration mismatch on the most prominent number on
 * the page.
 */
function Countdown({ at, m }: { at: Date; m: Messages }): ReactElement | null {
  const now = useMinuteClock();

  if (now === null) {
    /* Reserves the band's height so the arrival does not jump a line when the
       numbers land one frame later. */
    return <div className={styles.countdown} aria-hidden="true" />;
  }

  const left = remainingUntil(at, now);
  if (left.elapsed) return null;
  if (left.days === 0) return <p className={styles.today}>{m.theDay}</p>;

  return (
    <div className={styles.countdown}>
      <Cell value={left.days} label={m.countdown.days} />
      <Cell value={left.hours} label={m.countdown.hours} />
      <Cell value={left.minutes} label={m.countdown.minutes} />
    </div>
  );
}

function Cell({ value, label }: { value: number; label: string }): ReactElement {
  return (
    <div className={styles.cell}>
      <span className={styles.cellNum}>{value}</span>
      <span className={styles.cellLabel}>{label}</span>
    </div>
  );
}
