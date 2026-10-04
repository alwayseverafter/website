/**
 * Writes `docs/COVER-BRIEFS.md`: one art brief per listed style, ready to hand
 * to an image generation model.
 *
 * WHY generated rather than written: there are forty-seven of them and every
 * fact in a brief — the palette, the surface, the ornament, the opener — is
 * already stated once in `src/catalog/entries/<slug>.ts`. Typing them out a
 * second time would create a second source of truth that goes stale the first
 * time a palette is adjusted, which is the shape of R3. Re-run this instead.
 *
 * WHY briefs rather than scraped artwork: the designs these styles reinterpret
 * belong to The Digital Yes, whose terms reserve "base designs, code, and
 * graphic elements" and forbid redistribution. A brief is a description of a
 * direction — palette, texture, motif, mood — written in our own words, and
 * what comes back from a generator is original work we own. That is the same
 * line `docs/CATALOG-BUILD-INSTRUCTIONS.md` already draws for the prose.
 *
 * Run it:
 *
 *   npx esbuild scripts/gen-cover-briefs.ts --bundle --platform=node \
 *     --format=esm --outfile=/tmp/gen-cover-briefs.mjs
 *   node /tmp/gen-cover-briefs.mjs
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { SOURCE_NAMES } from "@/catalog/sources";
import type { Chrome, Lettering, Motion, Ornament, Surface } from "@/invite/themes";
import { THEMES } from "@/invite/themes";
import type { ThemeId } from "@/invite/types";
import { THEME_COPY, THEME_ORDER, kindOf } from "@/lib/seo";

/**
 * Each token, said in the words a generator can use.
 *
 * The token names are ours and mean nothing outside this codebase, so a brief
 * that said `surface: marble` would be handing the model a null string. These
 * are the one place a token becomes a sentence.
 */
const SURFACE: Record<Surface, string> = {
  grain: "a fine, even paper grain that stays visible at any size",
  marble: "soft marble veining at low contrast, like stone seen through paper",
  linen: "a woven linen tooth, clearly present but never coarse",
  plaster: "a chalky lime-plaster wash with soft, uneven mottling",
  none: "a perfectly flat ground with no texture at all",
};

const ORNAMENT: Record<Ornament, string> = {
  diamond: "one small diamond lozenge, drawn in a single hairline weight",
  tile: "a restrained geometric tile motif, repeating only along a margin",
  leaf: "sparse foliage drawn in line, set at the corners and never behind type",
  deco: "a spare Art Deco figure of stepped lines and fans, all one weight",
  weave: "an interlaced hairline weave, like a woven border",
  none: "no ornament at all — space and the ground do the whole job",
};

const CHROME: Record<Chrome, string> = {
  framed: "a hairline frame or inset panel holding the field",
  open: "no boxes and no frames; separation by space and hairlines only",
};

/** Lettering never draws type here. It sets how much air the field wants. */
const LETTERING: Record<Lettering, string> = {
  titlecase: "tight, warm proportions with a hint of metallic sheen in the accent",
  "tracked-caps": "airy and composed, with generous space and flat, even ink",
};

const MOTION: Record<Motion, string> = {
  veil: "a single sheet lifts from the centre outward",
  "fade-rise": "the content rises a few pixels as it fades up",
  none: "nothing moves; it is simply already there",
};

/**
 * What every brief forbids.
 *
 * Text first, because an image model sets lettering badly and because the
 * product paints the real names itself — a cover carrying baked-in type would
 * show one couple's names under every other couple's invitation. The last line
 * is the one that matters legally: a generator asked to match an existing
 * design will reproduce it, and a description is only clean if what comes back
 * is genuinely new.
 */
const CONSTRAINTS = [
  "No text, lettering, numerals, monograms or logos of any kind.",
  "No people, faces, hands or figures.",
  "No photographic stock imagery; this is flat, print-like artwork.",
  "Leave the central third quiet and uncluttered — type is set over it later.",
  "An original composition. Do not imitate or reconstruct any existing"
  + " invitation design, and do not reproduce another studio's artwork.",
];

function bullet(lines: readonly string[]): string {
  return lines.map((line) => `- ${line}`).join("\n");
}

/** The one paragraph a person pastes into a generator. */
function prompt(theme: ThemeId): string {
  const copy = THEME_COPY[theme];
  const t = THEMES[theme];
  const { paper, ink, muted, rule, accent } = copy.palette;

  return [
    `A portrait cover plate for a digital wedding ${kindOf(theme)} called`
    + ` "${copy.name}".`,
    `Ground: ${copy.spec.paper.toLowerCase()} (${paper}).`,
    `Ink: ${copy.spec.ink.toLowerCase()} (${ink}).`,
    `One accent colour only, ${accent}, used sparingly;`
    + ` secondary marks in ${muted} and hairlines in ${rule}.`,
    `Surface: ${SURFACE[t.surface]}.`,
    `Motif: ${ORNAMENT[t.ornament]}.`,
    `Composition: ${CHROME[t.chrome]}. The field is ${LETTERING[t.lettering]}.`,
    `Mood: ${copy.summary}`,
    `It is made for this: ${copy.whoItSuits[0] ?? ""}`,
    "Flat print-like artwork, generous empty space, 4:5 portrait.",
  ].join(" ");
}

function brief(theme: ThemeId, index: number): string {
  const copy = THEME_COPY[theme];
  const t = THEMES[theme];
  const source = SOURCE_NAMES[theme];

  return [
    `## ${index}. ${copy.name}`,
    "",
    `- **Slug:** \`${theme}\` → save the file as \`public/covers/${theme}.webp\``,
    `- **Product:** ${kindOf(theme)}`,
    source === undefined
      ? "- **Reinterprets:** nothing; an original style"
      : `- **Reinterprets:** the design known as "${source}" — for context only,`
      + " never as something to copy",
    `- **Palette:** paper \`${copy.palette.paper}\` · ink \`${copy.palette.ink}\``
    + ` · muted \`${copy.palette.muted}\` · rule \`${copy.palette.rule}\``
    + ` · accent \`${copy.palette.accent}\``,
    `- **Surface:** ${SURFACE[t.surface]}`,
    `- **Motif:** ${ORNAMENT[t.ornament]}`,
    `- **Composition:** ${CHROME[t.chrome]}`,
    `- **Field:** ${LETTERING[t.lettering]}`,
    "",
    "**What it is**",
    "",
    copy.whatItIs.join("\n\n"),
    "",
    "**Image prompt**",
    "",
    "```text",
    prompt(theme),
    "",
    ...CONSTRAINTS.map((line) => `- ${line}`),
    "```",
    "",
    "**Opening animation**",
    "",
    `- **Opener:** ${copy.openerName}`,
    `- **Arrival motion:** ${MOTION[t.motion]}`,
    "",
    copy.howItOpens.join("\n\n"),
    "",
    "```text",
    "An opening animation for a wedding invitation cover."
    + ` ${copy.howItOpens[0] ?? ""}`
    + ` Ground ${copy.palette.paper}, accent ${copy.palette.accent}.`
    + " Under two seconds, no bounce, no sparkle, no particles, no text.",
    "```",
    "",
  ].join("\n");
}

const HEAD = [
  "# Cover briefs",
  "",
  "One art brief per listed style, written to be pasted into an image",
  "generation model. Each carries the palette, the surface, the motif and the",
  "mood the style is already built from, plus the opening animation in case a",
  "motion model is used for the same style later.",
  "",
  "**Generated.** Every fact here is read from `src/catalog/entries/<slug>.ts`",
  "and `src/lib/seo.ts`. Do not edit this file — change the style and re-run",
  "`scripts/gen-cover-briefs.ts`, or the briefs and the styles will disagree.",
  "",
  "**Why briefs and not artwork.** These styles reinterpret designs belonging",
  "to The Digital Yes, whose terms reserve \"base designs, code, and graphic",
  "elements\" and forbid redistribution. Scraping their images and publishing",
  "them as our covers is what that forbids, and it would also promise a guest",
  "an illustration the renderer cannot paint. A brief describes a direction in",
  "our own words; what a generator returns from it is original work we own.",
  "That is the same line `docs/CATALOG-BUILD-INSTRUCTIONS.md` already draws",
  "for the prose. Source designs are named below for context only.",
  "",
  "**Every prompt forbids the same five things:**",
  "",
  bullet(CONSTRAINTS),
  "",
  "---",
  "",
  "",
].join("\n");

const body = THEME_ORDER.map((theme, i) => brief(theme, i + 1)).join("\n---\n\n");
const out = resolve(process.cwd(), "docs/COVER-BRIEFS.md");

writeFileSync(out, `${HEAD}${body}`, "utf8");
process.stdout.write(`wrote ${out} — ${THEME_ORDER.length} briefs\n`);
