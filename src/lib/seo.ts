import type { Couple, OpenerId, ThemeId } from "@/invite/types";
import { THEME_IDS } from "@/invite/types";

/**
 * Shared metadata and the editorial content behind /styles.
 *
 * WHY this file exists at all: the funnel is one cinematic page, which gives a
 * search engine almost nothing to index. The eight style pages are the entire
 * organic surface of the business, so their copy is a growth asset and belongs
 * in version control next to the types it is keyed on, not inline in a page
 * component where it would rot the moment a theme is added.
 *
 * WHY a Record keyed on the literal union rather than a lookup table: tsconfig
 * sets `noUncheckedIndexedAccess`, so an index signature would hand every call
 * site a `T | undefined` and invite exactly the silent fallback that R3 forbids.
 * A `Record<ThemeId, ...>` makes a missing theme a compile error instead.
 */

export const SITE_NAME = "Always Ever After";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** The Invitation tier. Quoted in Product structured data on every style page. */
export const PRICE = { amount: "249.00", currency: "USD" } as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Canonical path for a style page. One definition, used by page, sitemap and JSON-LD. */
export function themePath(theme: ThemeId): string {
  return `/styles/${theme}`;
}

/**
 * The colours a style page and its share image are drawn in.
 *
 * These are not the funnel's tokens. The chrome is Atelier and carries no
 * accent of its own; these values belong to the invitation being shown, and
 * they exist here only because an ImageResponse runs outside the document and
 * therefore cannot read a CSS custom property.
 */
export type ThemePalette = {
  /** Ground of the invitation itself. */
  paper: string;
  /** Text on that ground. */
  ink: string;
  /** One step back from ink. Kickers and meta. */
  muted: string;
  /** The single hairline weight, in this theme's colour. */
  rule: string;
  /** The one colour the theme is actually about. Used sparingly. */
  accent: string;
};

export type ThemeCopy = {
  /** Display name. Title case, no article. */
  name: string;
  /** One declarative line. Gallery caption and page lede. */
  summary: string;
  /** Under 60 characters of it lands in a SERP, so the style name comes first. */
  metaTitle: string;
  metaDescription: string;
  palette: ThemePalette;
  /** Which of the four openers this style ships with. */
  opener: OpenerId;
  /** Human name of that opener, for the spec list. */
  openerName: string;
  /**
   * The couple on the sample. Distinct per style, because eight pages showing
   * the same two names read as eight copies of one page, to a reader and to a
   * crawler alike.
   */
  sample: Omit<Couple, "theme">;
  /** Spec list. Facts get words, never icons. */
  spec: { paper: string; ink: string; faces: string };
  whatItIs: readonly string[];
  whoItSuits: readonly string[];
  typography: readonly string[];
  howItOpens: readonly string[];
};

export const THEME_COPY: Record<ThemeId, ThemeCopy> = {
  "atelier-blanc": {
    name: "Atelier Blanc",
    summary: "Paper white, one hairline, and a great deal of deliberately empty space.",
    metaTitle: "Atelier Blanc: a white letterpress wedding invitation as a link",
    metaDescription:
      "A paper white digital wedding invitation. Names in Italiana, one hairline, nothing else. See the full sample, then put your own names on it in a minute.",
    palette: {
      paper: "#FAF8F5",
      ink: "#131A26",
      muted: "#9AA1AC",
      rule: "#DCD8D2",
      accent: "#C9C2B8",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Elena", b: "Matthias", date: "2026-06-13" },
    spec: {
      paper: "Paper white",
      ink: "Near black, warm",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Atelier Blanc is the invitation with nothing on it. Paper white ground, near black ink, a single hairline under the names, and a great deal of space that has been left empty on purpose.",
      "It is the style the other seven are measured against, because it removes every variable except the two names and the date. Nothing in it is decorative. The rule under the names is one pixel and it is the only mark on the page that is not a letter.",
    ],
    whoItSuits: [
      "A city hall in the morning and a long lunch afterwards. A second wedding. A room with white walls and tall windows that you do not want an invitation competing with.",
      "It is also the calmest choice when the guest list runs across four generations, because there is nothing in it for anyone to hold an opinion about.",
    ],
    typography: [
      "The names are set in Italiana, a high contrast display face whose thin strokes read like an engraved plate. It appears at one size, large, and is never used for anything but the names.",
      "Everything else is Jost, small, uppercase, tracked wide, in the grey that sits one step back from black. Two faces, three sizes, one weight of rule. That is the whole specification.",
    ],
    howItOpens: [
      "The veil. A single sheet of paper white lifts from the centre outward over a second and a half, and the invitation is behind it. Nothing bounces and nothing sparkles.",
      "The pace is slower than a web animation usually is, which is the point, because the wait is the part that reads as expensive. On a phone set to reduce motion the veil does not play at all and the invitation is simply already open.",
    ],
  },

  vicioso: {
    name: "Vicioso",
    summary: "Deep wine on blush, with an ornamental hand that runs past the margin.",
    metaTitle: "Vicioso: an ornate wine and blush wedding invitation as a link",
    metaDescription:
      "The loud one. Deep wine ink on warm blush, names in an ornamental hand with strokes that break the margin. See the full sample invitation and send yours today.",
    palette: {
      paper: "#F4EBE7",
      ink: "#4A1220",
      muted: "#8E6A6E",
      rule: "#DBC5C1",
      accent: "#8A2436",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Isabel", b: "Tomás", date: "2027-05-22" },
    spec: {
      paper: "Warm blush",
      ink: "Deep wine",
      faces: "Ornamental display, Jost",
    },
    whatItIs: [
      "Vicioso is the loud one, and it is loud on purpose. Deep wine ink on a warm blush ground, with the names set in an ornamental hand whose entry and exit strokes run past the margin the rest of the invitation obeys.",
      "Where Atelier Blanc removes, Vicioso adds. It is the only style in the set that lets one letterform touch another, and the flourishes follow the letters they are attached to, so the two names sit differently on every invitation.",
    ],
    whoItSuits: [
      "An evening that starts late and has no stated end. A courtyard, a long table, more wine than seats. Weddings where the dancing is the schedule rather than an item on it.",
      "It rewards short given names, because a flourish needs somewhere to travel. Two long names will still set, but the ornament pulls in and the style loses some of its nerve.",
    ],
    typography: [
      "The names carry the whole design, so nothing else is allowed to be interesting. The display hand is high contrast with a steep pen angle, and it is used once, at one size, in wine.",
      "Every other line is Jost in the same wine at a fraction of its strength, uppercase and tracked very wide, so it reads as an engraved caption under a picture rather than as a second voice.",
    ],
    howItOpens: [
      "The envelope. The invitation arrives folded, and the flap turns back from the top over a second and a half before the card slides up into place.",
      "It is the most literal of the four openers and it suits this style precisely because the style is not subtle either. With reduced motion the card is already out and unfolded.",
    ],
  },

  noir: {
    name: "Noir",
    summary: "Matte black, silver ink, and no opener, because the black is the opener.",
    metaTitle: "Noir: a matte black wedding invitation, sent as one link",
    metaDescription:
      "Matte black ground, warm silver ink, no theatre. A digital wedding invitation for an evening event. See the full sample, then set it in your own names.",
    palette: {
      paper: "#0B0C0E",
      ink: "#F5F2ED",
      muted: "#8C8681",
      rule: "#2A2C30",
      accent: "#B9AFA2",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Camille", b: "Yves", date: "2026-11-07" },
    spec: {
      paper: "Matte black",
      ink: "Warm silver",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Noir is a matte black card with warm silver text on it. The black is not a background colour behind a design, it is the design, and everything else is kept at the smallest size that stays legible so the field of black is never broken.",
      "The silver is warm rather than blue, which is the difference between a black wedding invitation and a black concert ticket. It is the only style in the set with no rule under the names, because a hairline on that much black reads as a scratch.",
    ],
    whoItSuits: [
      "Evening weddings. A winter date. A city venue with low light and a bar rather than a barn. Couples who have already told their guests to wear black tie and want the invitation to say so without saying it.",
      "It is worth knowing that it will be the only black thing in a guest's inbox, which is most of why it works.",
    ],
    typography: [
      "Italiana at full size in warm silver, with the hairlines of the face doing the work that a rule does in the lighter styles. On a dark ground those thin strokes gain apparent weight, so the names are set one step smaller here than anywhere else in the set.",
      "Jost handles the date and the practical lines at a size close to the legibility floor. Read that as intent. Noir is not trying to tell you anything except who and when.",
    ],
    howItOpens: [
      "Direct. There is no opener, and that is a choice rather than an omission. The link opens on black, and the invitation is already there.",
      "Every other style spends a second and a half getting out of its own way. Noir starts where they finish, because a black screen on a phone in the evening is already the pause, and adding a curtain to a dark room does nothing.",
    ],
  },

  sable: {
    name: "Sable",
    summary: "Undyed linen, brown ink, and the texture of something posted rather than sent.",
    metaTitle: "Sable: a linen and brown ink wedding invitation as a link",
    metaDescription:
      "Undyed linen ground with warm brown ink, set to read like something posted rather than sent. See the full sample digital wedding invitation and make it yours.",
    palette: {
      paper: "#E9E0D3",
      ink: "#3B3229",
      muted: "#8C7C68",
      rule: "#CFC2AE",
      accent: "#A8927A",
    },
    opener: "envelope",
    openerName: "The envelope",
    sample: { a: "Nora", b: "Ilan", date: "2027-04-18" },
    spec: {
      paper: "Undyed linen",
      ink: "Warm brown",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Sable is set on an undyed linen ground with warm brown ink, at the one contrast ratio where text is comfortably readable and nothing looks printed on white.",
      "It is the most tactile style in the set. The ground carries a fine grain that holds at any size, so the invitation reads as a material rather than as a colour, which is the difference between a warm invitation and a beige one.",
    ],
    whoItSuits: [
      "Daytime. Outdoors. A long table under trees, a farmhouse, a coast in early season. Weddings where the dress code is a sentence rather than a phrase.",
      "It also does the quiet job of making a small guest list look intentional, because linen and brown are the colours of a thing made by hand rather than ordered by the hundred.",
    ],
    typography: [
      "Italiana on linen loses a little of its engraved edge and gains warmth, so the names are set slightly larger here than on paper white to hold their weight against the grain.",
      "Jost carries the date and the reply line in the same brown at reduced strength. There is no second colour anywhere in this style. Every mark on the invitation is the same ink at a different opacity.",
    ],
    howItOpens: [
      "The envelope. The flap turns back from the top and the card slides up, which is the closest any of the four openers comes to the thing this style is imitating.",
      "The motion runs a second and a half with no bounce at the end. Reduced motion skips the fold entirely and hands over the open card.",
    ],
  },

  aurum: {
    name: "Aurum",
    summary: "Gold on cream, engraved, formal, and the most traditional of the eight.",
    metaTitle: "Aurum: a gold and cream formal wedding invitation as a link",
    metaDescription:
      "Gold on cream, set like an engraved plate. The most formal of the eight styles, for black tie and a seated dinner. See the full sample invitation and send yours.",
    palette: {
      paper: "#FBF6EA",
      ink: "#2A2418",
      muted: "#9B8A63",
      rule: "#E2D5B6",
      accent: "#A98A3C",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Charlotte", b: "Henry", date: "2027-09-11" },
    spec: {
      paper: "Cream",
      ink: "Antique gold",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Aurum is gold on cream, set to the proportions of an engraved plate. It is the most traditional style in the set and it does not apologise for that, because formality is a service to a guest rather than a pose.",
      "The gold is antique rather than bright, closer to brass than to metallic yellow, which is what keeps it out of the territory of a gift shop. It appears twice: in the names, and in the single rule beneath them.",
    ],
    whoItSuits: [
      "Black tie. A seated dinner with a plan. A church, a cathedral, a hotel ballroom, a family that will read the invitation carefully and notice whether it was done properly.",
      "If a guest is going to book a hotel room and a flight because of this invitation, this is the style that tells them to.",
    ],
    typography: [
      "Italiana is at its most at home here, because the face was drawn from the same engraving tradition the style is quoting. It is set with wide side bearings so the names sit in the centre of a generous field rather than filling it.",
      "Jost is used for the date, the hour and the address in small tracked capitals. The address is present in this style and absent from most of the others, which is itself a formality signal.",
    ],
    howItOpens: [
      "The foil. A sheet of antique gold covers the invitation and the light travels across it once, left to right, before the sheet clears and the card is underneath.",
      "It is the slowest of the four openers at just under two seconds. That is a long time for a web page and about right for a wedding. Reduced motion drops the sheet and the sweep and shows the card.",
    ],
  },

  verdure: {
    name: "Verdure",
    summary: "Garden green on stone, drawn rather than photographed, with no opener at all.",
    metaTitle: "Verdure: a green garden wedding invitation, sent as one link",
    metaDescription:
      "Garden green on stone, with drawn foliage rather than stock photography. A digital wedding invitation for an outdoor day. See the full sample and make it yours.",
    palette: {
      paper: "#F4F3EC",
      ink: "#1E2E22",
      muted: "#6F8471",
      rule: "#CFD6C6",
      accent: "#4C6B4A",
    },
    opener: "direct",
    openerName: "Direct",
    sample: { a: "Sofia", b: "Arjun", date: "2027-06-05" },
    spec: {
      paper: "Stone",
      ink: "Garden green",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Verdure is deep garden green on a stone ground, with foliage drawn in line rather than photographed. There is no watercolour wash and no floral photograph, because both are what make a wedding invitation look bought.",
      "The drawing sits at the two lower corners and never behind the text. It is one weight of line, the same weight as the hairline in every other style, which is why it reads as part of the invitation rather than as an image placed on it.",
    ],
    whoItSuits: [
      "An outdoor day. A garden, a vineyard, a walled kitchen garden, a marquee on grass. Late spring and summer dates, where the invitation is the first green thing a guest sees of the wedding.",
      "It is the style most likely to match what the day actually looks like, which matters more than it sounds, because a guest compares the two later.",
    ],
    typography: [
      "Italiana in green rather than black is a smaller change than it sounds. The face has enough contrast that a mid tone still reads as ink, so the names hold at full size with no adjustment.",
      "Jost carries the date and the reply line in the same green at reduced strength. The stone ground is warm rather than grey, which is what keeps the green from turning clinical.",
    ],
    howItOpens: [
      "Direct. There is no opener. The link opens and the invitation is there, foliage and all.",
      "This is a considered choice for an outdoor wedding. A curtain lifting is an indoor gesture, and it fights a style whose whole subject is being outside already. Nothing is skipped under reduced motion here, because nothing moves in the first place.",
    ],
  },

  porcelain: {
    name: "Porcelain",
    summary: "Cool blue white, the finest rule in the set, and a veil that behaves like glaze.",
    metaTitle: "Porcelain: a cool blue white wedding invitation as a link",
    metaDescription:
      "Cool blue white with the finest hairline in the set, for a spring or winter wedding. See the full sample digital invitation, then set it in your own names.",
    palette: {
      paper: "#F2F5F6",
      ink: "#1B2A33",
      muted: "#8AA0AB",
      rule: "#D5DFE3",
      accent: "#7A97A6",
    },
    opener: "veil",
    openerName: "The veil",
    sample: { a: "Mei", b: "Jonah", date: "2027-03-27" },
    spec: {
      paper: "Cool blue white",
      ink: "Slate",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Porcelain is a cool blue white with slate ink, and it is the most delicate style in the set. Atelier Blanc is warm and quiet. Porcelain is cold and quiet, and the two are not interchangeable.",
      "The rule under the names is the same one pixel as everywhere else but drawn in a blue grey that sits close to the ground, so it registers as an edge rather than a line. That single decision is most of the style.",
    ],
    whoItSuits: [
      "Spring, or a winter wedding that is not trying to be cosy. A gallery, a glasshouse, a coastal light, a modern room with pale floors.",
      "It suits couples who liked Atelier Blanc but found it a degree too warm, and it is the only style in the set that looks correct next to a photograph taken on an overcast day.",
    ],
    typography: [
      "Italiana in slate on cool white gives the highest contrast of any style here, so the names are set with slightly more tracking to keep them from crowding.",
      "Jost is set in the blue grey rather than in slate, one step further back than the other styles push their secondary text. Porcelain asks you to look at the names and to notice everything else afterwards.",
    ],
    howItOpens: [
      "The veil, drawn in the same cool white as the ground so the lift reads as a glaze clearing rather than as a curtain moving.",
      "It runs a second and a half from the centre outward, with no bounce. Under reduced motion the veil never appears and the invitation is open on arrival.",
    ],
  },

  obsidian: {
    name: "Obsidian",
    summary: "Cool black glass with a blue sheen, and a foil sweep that behaves like light on stone.",
    metaTitle: "Obsidian: a black glass wedding invitation, sent as one link",
    metaDescription:
      "Cool black with a blue sheen and a sweep of light across it. The modern half of the two dark styles. See the full sample wedding invitation and send yours.",
    palette: {
      paper: "#101418",
      ink: "#E6EAF0",
      muted: "#7C8B9B",
      rule: "#262C34",
      accent: "#5C7A99",
    },
    opener: "foil",
    openerName: "The foil",
    sample: { a: "Priya", b: "Daniel", date: "2027-08-14" },
    spec: {
      paper: "Cool black",
      ink: "Cool white",
      faces: "Italiana, Jost",
    },
    whatItIs: [
      "Obsidian is the other dark style, and the distinction from Noir is worth stating because a thumbnail will not show it. Noir is matte, warm and cinematic. Obsidian is cool, blue and mineral, the black of volcanic glass rather than the black of a curtain.",
      "It carries the one blue accent in the entire set, used at the hairline and nowhere else. Everything else is a cool white that stays just short of pure white, because pure white on this ground vibrates on an OLED phone.",
    ],
    whoItSuits: [
      "A late summer evening, a rooftop, a modern venue with concrete and glass. Couples for whom black is a preference rather than a dress code.",
      "It is the most contemporary style here and the one most likely to be described by a guest as not looking like a wedding invitation, which for the right couple is the entire reason to choose it.",
    ],
    typography: [
      "Italiana in cool white, set at the same reduced size as Noir, because thin strokes gain apparent weight on a dark ground and the untreated size reads as too heavy.",
      "Jost sits in the blue grey rather than in white, so the practical lines recede into the ground and the names are the only thing at full strength. The blue hairline is the single mark that is neither ink nor ground.",
    ],
    howItOpens: [
      "The foil, in cool blue rather than gold. A sheet covers the invitation and one band of light travels across it before it clears.",
      "On this ground the sweep reads as light moving over polished stone, which is the effect the style is named for. Just under two seconds, no bounce, and skipped entirely under reduced motion.",
    ],
  },
};

/** Gallery and sitemap order. Kept as one list so it cannot drift. */
export const THEME_ORDER: readonly ThemeId[] = THEME_IDS;

/**
 * R3: an unknown slug must be refused, never resolved to a default theme. This
 * is the same class of bug as the `tor` opener silently rendering `veil`.
 */
export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

/** Every style except this one, for the cross links at the foot of a style page. */
export function otherThemes(theme: ThemeId): readonly ThemeId[] {
  return THEME_ORDER.filter((t) => t !== theme);
}

/** The sample couple in the shape the renderer wants. */
export function sampleCouple(theme: ThemeId): Couple {
  const { sample } = THEME_COPY[theme];
  return { ...sample, theme };
}

/**
 * Long form date, used in prose and in the share image. Fixed to UTC noon so a
 * build machine in any timezone renders the same day. The `T12:00:00Z` trick is
 * the same one the renderer uses; a bare `YYYY-MM-DD` parses as UTC midnight
 * and lands on the previous day west of Greenwich.
 */
export function formatSampleDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}
