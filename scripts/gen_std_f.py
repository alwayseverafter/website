#!/usr/bin/env python3
"""Write seven save-the-date entries, with the acceptance checks run first.

Every constraint `catalog.test.ts` enforces is asserted here, because failing
at generation names the field and failing in vitest names the file.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENTRIES = ROOT / "src" / "catalog" / "entries"
HEX = re.compile(r"^#[0-9A-F]{6}$")

OPENER_NAMES = {
    "veil": "The veil",
    "foil": "The foil",
    "envelope": "The envelope",
    "direct": "Direct",
}
FACES = {
    "editorial": "Italiana, Jost",
    "classic": "Cormorant Garamond, Jost",
    "garamond": "Cormorant Garamond throughout",
    "geometric": "Jost throughout",
}

TEMPLATE = '''import type {{ CatalogEntry }} from "@/catalog/types";

/**
 * {name}.
 *
{rationale}
 */
export const entry: CatalogEntry = {{
  id: "{slug}",
  kind: "save-the-date",
  draft: false,
  theme: {{
    dark: {dark},
    fonts: "{fonts}",
    ornament: "{ornament}",
    surface: "{surface}",
    motion: "{motion}",
    lettering: "{lettering}",
    chrome: "{chrome}",
    palette: {{
      bg: "{bg}",
      surface: "{surf}",
      ink: "{ink}",
      muted: "{muted}",
      accent: "{accent}",
      accentSoft: "{accent_soft}",
      rule: "{rule}",
      onAccent: "{on_accent}",
    }},
  }},
  copy: {{
    name: "{name}",
    summary: "{summary}",
    metaTitle: "{meta_title}",
    metaDescription: "{meta_description}",
    palette: {{
      paper: "{bg}",
      ink: "{ink}",
      muted: "{muted}",
      rule: "{rule}",
      accent: "{accent}",
    }},
    opener: "{opener}",
    openerName: "{opener_name}",
    sample: {{ a: "{a}", b: "{b}", date: "{date}" }},
    spec: {{
      paper: "{spec_paper}",
      ink: "{spec_ink}",
      faces: "{spec_faces}",
    }},
    whatItIs: [
{what_it_is}
    ],
    whoItSuits: [
{who_it_suits}
    ],
    typography: [
{typography}
    ],
    howItOpens: [
{how_it_opens}
    ],
  }},
  nameDe: "{name}",
}};
'''


def _channel(v):
    c = v / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def _lum(h):
    return (
        0.2126 * _channel(int(h[1:3], 16))
        + 0.7152 * _channel(int(h[3:5], 16))
        + 0.0722 * _channel(int(h[5:7], 16))
    )


def contrast(a, b):
    hi, lo = sorted((_lum(a), _lum(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def block(lines, slug, field):
    out = []
    for line in lines:
        assert len(line) >= 80, f"{slug}.{field}: paragraph {len(line)} chars"
        assert '"' not in line, f"{slug}.{field}: contains a double quote"
        out.append(f'      "{line}",')
    return "\n".join(out)


DESIGNS = [
    {
        "slug": "std-tourterelle",
        "name": "Tourterelle",
        "a": "Helena", "b": "Florian", "date": "2028-10-20",
        "dark": False, "fonts": "garamond", "ornament": "leaf", "surface": "linen",
        "motion": "fade-rise", "lettering": "titlecase", "chrome": "open", "opener": "direct",
        "pal": ("#F2F1EE", "#FFFFFF", "#2C2A26", "#7E7A72", "#8F8B80", "#E4E2DB", "#CFCCC3", "#FAF9F6"),
        "spec_paper": "Dove grey, warm", "spec_ink": "Soft black",
        "summary": "Dove grey on warm linen, two names and a count of the days between.",
        "meta_title": "Tourterelle: a dove-grey save the date as a link",
        "meta_description": "A dove-grey digital save the date. Two names, one date and a live countdown, set in Cormorant on warm linen. See the full sample and send yours.",
        "rationale": [
            "The quietest of the save the dates. Two birds became two names and a",
            "pair of leaf glyphs; everything else was removed, which is what a save",
            "the date is for.",
        ],
        "what_it_is": [
            "Tourterelle is a save the date and nothing more. Two names, one date, and a count of the days between now and it. There is no ceremony time, no venue and no practical line, because none of that is decided yet when this goes out.",
            "The ground is a warm dove grey with a linen tooth, and the only marks on it are a hairline and a small leaf at each end of it. The restraint is the product: a save the date that tried to say more would be an invitation sent a year early.",
        ],
        "who_it_suits": [
            "A couple who have set a date and booked nothing else, and who want the people they love to hold the day before anything else claims it.",
            "It suits a guest list that spans generations, because there is nothing in it to have an opinion about and nothing anyone needs to interpret.",
        ],
        "typography": [
            "Cormorant Garamond throughout, set light and large for the names and small for the date. One family means no contrast to manage, which is why the page reads as calm rather than as composed.",
            "The count of days is set in the same face at the small size, in the grey that sits one step back from the ink, so the number never competes with the two names above it.",
        ],
        "how_it_opens": [
            "Direct. There is no cover to lift and no envelope to tear: the save the date is simply there when the link opens, which suits a message whose whole content is a single date.",
            "The names and the rule rise a few pixels as the page settles, over about half a second. On a phone set to reduce motion nothing moves and the page is already at rest.",
        ],
    },
    {
        "slug": "std-grattage",
        "name": "Grattage",
        "a": "Iris", "b": "Gideon", "date": "2028-03-02",
        "dark": False, "fonts": "geometric", "ornament": "none", "surface": "none",
        "motion": "fade-rise", "lettering": "tracked-caps", "chrome": "open", "opener": "foil",
        "pal": ("#EDEEF0", "#FFFFFF", "#1E2226", "#6B7279", "#8C949C", "#DEE1E4", "#C3C8CD", "#FFFFFF"),
        "spec_paper": "Cool silver grey", "spec_ink": "Near black, cool",
        "summary": "Scratch silver over a cool grey ground, cleared by a band of light.",
        "meta_title": "Grattage: a scratch-panel save the date as a link",
        "meta_description": "A silver scratch-panel digital save the date. One band of light clears the foil to leave two names and a date. See the sample and send yours today.",
        "rationale": [
            "The scratch card, reduced to its one honest gesture: a silver layer and",
            "the moment it clears. No photograph is invented, because the renderer",
            "has no image layer to put one in.",
        ],
        "what_it_is": [
            "Grattage is a save the date behind a silver panel. The ground is a cool grey, the panel is a lighter silver over it, and when it clears there are two names, a date and the days remaining. That is the entire content.",
            "The source design hides a photograph under the foil. This one hides nothing but the date, which is the only thing a save the date actually withholds, and it is a better joke for being true.",
        ],
        "who_it_suits": [
            "Couples who find a formal save the date too solemn for something sent a year out, and who would rather their guests smile at a phone than file a card.",
            "It also suits a wedding in a modern venue, concrete or glass, where the silver and the tracked capitals will look like the building rather than against it.",
        ],
        "typography": [
            "Jost throughout, uppercase and tracked wide. A geometric sans is the only face here that reads as a machined surface rather than as paper, which is what the silver panel needs to sit on.",
            "The names are set larger than everything else but at the same weight, so the hierarchy comes from size and space alone and the page holds one tone of voice.",
        ],
        "how_it_opens": [
            "The foil. A silver sheet covers the save the date and a single band of light travels across it, left to right, before the sheet clears and the date is behind it.",
            "It runs just under two seconds and does not bounce. On a phone set to reduce motion the band does not play and the date is simply already visible, which loses the theatre and none of the information.",
        ],
    },
    {
        "slug": "std-palatine",
        "name": "Palatine",
        "a": "Juliette", "b": "Hendrik", "date": "2028-04-09",
        "dark": True, "fonts": "classic", "ornament": "deco", "surface": "none",
        "motion": "veil", "lettering": "tracked-caps", "chrome": "framed", "opener": "veil",
        "pal": ("#14110C", "#1D1913", "#F0E9DA", "#A09682", "#C6A664", "#272118", "#4C432F", "#14110C"),
        "spec_paper": "Near black, warm", "spec_ink": "Warm ivory",
        "summary": "Warm black and old gold, framed. The most formal of the save the dates.",
        "meta_title": "Palatine: a black and gold save the date as a link",
        "meta_description": "A formal digital save the date in warm black and old gold, names in Cormorant inside a gilt frame. See the full sample and put your own date on it.",
        "rationale": [
            "The grand register, held to save-the-date content. A frame, a gilt rule",
            "and two names: the formality is in the materials rather than in extra",
            "lines of text.",
        ],
        "what_it_is": [
            "Palatine is the formal one. A warm near-black ground, an old gold hairline framing the whole sheet, and two names in ivory at the centre of it with the date beneath them and the count of days below that.",
            "It is the only save the date here that uses a closed frame. A border is what a formal card has, and since this product carries so few words, the frame is doing the work that a second paragraph would do elsewhere.",
        ],
        "who_it_suits": [
            "A black tie wedding, an evening ceremony, a venue with a staircase in it. Couples who want the save the date to set the register of the day a year before anyone sees the invitation.",
            "It is also the right choice when the guest list is largely older, because a gilt frame on black reads as a card to that eye rather than as a web page.",
        ],
        "typography": [
            "Cormorant Garamond for the names, set in tracked capitals rather than title case, because caps on a dark ground hold their shape where a light italic would close up.",
            "Jost carries the date and the countdown, small, in the warm grey that sits between the ivory and the ground. Only the names are ever at full strength.",
        ],
        "how_it_opens": [
            "The veil. A sheet of warm black lifts from the centre outward over about a second and a half, and the framed save the date is behind it.",
            "The pace is slower than a web animation usually is, which is the point, because the wait is the part that reads as expensive. Under reduced motion the veil does not play and the sheet is already open.",
        ],
    },
    {
        "slug": "std-grattage-dentelle",
        "name": "Grattage Dentelle",
        "a": "Lena", "b": "Ignacio", "date": "2028-05-16",
        "dark": False, "fonts": "classic", "ornament": "weave", "surface": "linen",
        "motion": "fade-rise", "lettering": "titlecase", "chrome": "framed", "opener": "foil",
        "pal": ("#F8F5F0", "#FFFFFF", "#2B2723", "#857E74", "#A89C86", "#EBE5DA", "#D5CDBF", "#FFFDF9"),
        "spec_paper": "Ivory, soft", "spec_ink": "Warm near black",
        "summary": "A lace-woven frame in soft ivory, cleared by a pale sweep of light.",
        "meta_title": "Grattage Dentelle: a lace scratch save the date",
        "meta_description": "A soft ivory digital save the date framed in woven lace, cleared by a pale sweep of light. See the whole sample, then put your own date on it today.",
        "rationale": [
            "The same gesture as Grattage, in the opposite material. Where that one is",
            "machined silver on cool grey, this is woven thread on warm ivory, and the",
            "sweep is pale rather than metallic.",
        ],
        "what_it_is": [
            "Grattage Dentelle sets the same reveal inside a lace frame. The ground is a soft ivory with a linen tooth, the frame is drawn in a woven glyph repeated along a hairline, and the sweep that clears it is pale rather than silver.",
            "It carries the same three things every save the date here carries: two names, the date, and the days between. The lace is the whole difference, and the difference is deliberate rather than decorative.",
        ],
        "who_it_suits": [
            "A couple who like the reveal but not the scratch card, and who would rather the gesture arrived wrapped in something soft than in something metallic.",
            "It suits a spring or early summer date, a garden or an orangery, and a guest list that will read the lace as a reference rather than as a texture.",
        ],
        "typography": [
            "Cormorant Garamond for the names in title case, with its italic ampersand, which is the one letterform on the page allowed to be ornamental.",
            "Jost carries the date and the count, small and in the warm grey, so the only things at full strength are the two names and the woven rule beneath them.",
        ],
        "how_it_opens": [
            "The foil, in pale ivory rather than silver. A sheet covers the save the date and one band of soft light travels across it before it clears.",
            "On this ground the sweep reads as light moving across cloth rather than across metal. Under reduced motion it does not play at all and the save the date is simply already open.",
        ],
    },
    {
        "slug": "std-voile",
        "name": "Voile",
        "a": "Mirela", "b": "Joaquin", "date": "2028-06-23",
        "dark": False, "fonts": "garamond", "ornament": "weave", "surface": "plaster",
        "motion": "fade-rise", "lettering": "titlecase", "chrome": "open", "opener": "veil",
        "pal": ("#FAF7F7", "#FFFFFF", "#35303A", "#8B8490", "#BCA9C4", "#EDE5F0", "#DBD2DE", "#FFFCFE"),
        "spec_paper": "Palest blush white", "spec_ink": "Soft aubergine",
        "summary": "The palest blush, a soft lilac hairline, and no frame anywhere.",
        "meta_title": "Voile: a soft lace save the date as a link",
        "meta_description": "The palest digital save the date, in blush white with a soft lilac hairline and no frame at all. See the full sample and put your own date on it.",
        "rationale": [
            "The soft lace reading, and the open counterpart to Dentelle. No frame, no",
            "seal, no metal: separation is space and one lilac hairline. It is the",
            "lightest page in the catalogue.",
        ],
        "what_it_is": [
            "Voile is the softest of the three lace styles and the only one with no frame. The ground is the palest blush white over a plaster surface, and the single mark is a lilac hairline carrying a woven glyph at its centre.",
            "Two names, the date, the days remaining. Where Dentelle closes its content inside a border and Grattage Dentelle hides it behind a sweep, this one leaves everything in the open and relies on space to do the separating.",
        ],
        "who_it_suits": [
            "A morning ceremony, a room with a lot of daylight in it, a couple who find even a hairline frame too much structure for something sent this far ahead.",
            "It is also the calmest option when the save the date will be read mostly on phones in passing, because there is nothing in it that needs a second look.",
        ],
        "typography": [
            "Cormorant Garamond throughout, set light. One family at three sizes, which is the least typographic structure any style here uses, and the reason the page reads as a breath rather than as a card.",
            "The soft aubergine ink is warmer than black and keeps the palest ground from looking like an unstyled page. The lilac appears only at the hairline.",
        ],
        "how_it_opens": [
            "The veil. A sheet of blush white lifts from the centre outward over about a second and a half, which on this palette reads as fabric rather than as paper.",
            "Nothing bounces and nothing sparkles. On a phone set to reduce motion the veil does not play and the save the date is simply already open, which is the same page without the pause.",
        ],
    },
    {
        "slug": "std-dentelle",
        "name": "Dentelle",
        "a": "Nadia", "b": "Kasper", "date": "2028-07-05",
        "dark": False, "fonts": "editorial", "ornament": "diamond", "surface": "linen",
        "motion": "veil", "lettering": "tracked-caps", "chrome": "framed", "opener": "envelope",
        "pal": ("#F4F1EA", "#FFFFFF", "#241F1C", "#7C756C", "#7E2B2B", "#EADFD8", "#CFC5B6", "#FFF8F5"),
        "spec_paper": "Ivory linen", "spec_ink": "Near black, warm",
        "summary": "Ivory linen, tracked capitals, and one wax red seal holding it shut.",
        "meta_title": "Dentelle: a wax seal save the date as a link",
        "meta_description": "An editorial digital save the date on ivory linen, tracked capitals and one wax red seal. See the whole sample, then put your own date on it today.",
        "rationale": [
            "The editorial lace: the sharpest of the three, and the only one with a",
            "seal. Italiana in tracked capitals against one saturated wax red is what",
            "separates it from Voile, which is the same material played soft.",
        ],
        "what_it_is": [
            "Dentelle is the editorial one. Ivory linen ground, names in tracked capitals, a framed sheet, and a single wax red diamond where a seal would sit on a physical card.",
            "The red is the only saturated colour and it appears once. Everything else is ink, ground and a hairline, which is what keeps a framed layout from reading as a form rather than as stationery.",
        ],
        "who_it_suits": [
            "A couple who want the save the date to look like print rather than like a message, and a wedding whose invitation will be formal when it follows.",
            "It carries a long guest list well, because tracked capitals stay legible at the small sizes a forwarded screenshot ends up being read at.",
        ],
        "typography": [
            "Italiana for the names, a high contrast display face whose thin strokes read like an engraved plate, set here in capitals and tracked wide so the hairlines have air around them.",
            "Jost takes the date and the countdown, small and in the warm grey. Two faces, three sizes, one weight of rule, and one spot of red.",
        ],
        "how_it_opens": [
            "The envelope. A folded sheet unseals and opens outward, and the framed save the date is inside it, which is the gesture the wax seal is promising.",
            "It runs a little under two seconds. On a phone set to reduce motion the envelope does not animate and the save the date is simply already unfolded.",
        ],
    },
    {
        "slug": "std-cisne",
        "name": "Cisne",
        "a": "Olivia", "b": "Leon", "date": "2028-08-12",
        "dark": False, "fonts": "garamond", "ornament": "none", "surface": "marble",
        "motion": "fade-rise", "lettering": "titlecase", "chrome": "open", "opener": "direct",
        "pal": ("#F1F5F3", "#FFFFFF", "#1D2A26", "#667C74", "#6E9A8E", "#DDE9E4", "#C0D2CA", "#FFFFFF"),
        "spec_paper": "Still water green", "spec_ink": "Deep water green",
        "summary": "Still green water, no ornament at all, and a countdown that keeps moving.",
        "meta_title": "Cisne: a still-water save the date as a link",
        "meta_description": "A still-water digital save the date in green and white, with no ornament and a live countdown. See the full sample and put your own date on it.",
        "rationale": [
            "Swans on water, taken as the water rather than the birds. The companion",
            "invitation Cygne keeps the blue and the silver; this one goes green and",
            "drops the ornament entirely, so the two never read as one page.",
        ],
        "what_it_is": [
            "Cisne is drawn from still water rather than from what is on it. The ground is a pale green white over a marble surface, the ink is a deep water green, and there is no ornament anywhere on the page.",
            "What moves is the countdown. It is the only live thing in the style, and on a ground this quiet a number changing once a day is enough to make the page feel like it is waiting with you.",
        ],
        "who_it_suits": [
            "A lakeside or riverside wedding, a late summer date, and couples who want something cooler than cream without going to a true blue.",
            "It also suits a long engagement, because a green this desaturated does not date the message to a season the way a botanical or a bright blue would.",
        ],
        "typography": [
            "Cormorant Garamond throughout, set light and large. With no ornament on the page the letterforms are the only drawing, so the face carries more of the style here than anywhere else in the catalogue.",
            "The date and the countdown sit in the mid green that stands one step back from the ink, which keeps the two names as the only thing at full strength.",
        ],
        "how_it_opens": [
            "Direct. No cover, no envelope, no sweep: the save the date is there when the link opens, which matches a style whose argument is that nothing is in the way.",
            "The names and the date rise a few pixels as the page settles, over about half a second. Under reduced motion nothing moves and the page is already at rest.",
        ],
    },
]


def main():
    for d in DESIGNS:
        bg, surf, ink, muted, accent, accent_soft, rule, on_accent = d["pal"]
        for label, value in (
            ("bg", bg), ("surface", surf), ("ink", ink), ("muted", muted),
            ("accent", accent), ("accentSoft", accent_soft), ("rule", rule),
            ("onAccent", on_accent),
        ):
            assert HEX.match(value), f"{d['slug']}.{label}: {value}"

        ratio = contrast(ink, bg)
        assert ratio >= 4.5, f"{d['slug']}: ink on bg {ratio:.2f}:1"

        assert len(d["meta_title"]) <= 60, f"{d['slug']}: title {len(d['meta_title'])}"
        assert d["meta_title"].startswith(d["name"]), d["slug"]
        assert 110 <= len(d["meta_description"]) <= 165, (
            f"{d['slug']}: description {len(d['meta_description'])}"
        )
        assert 30 <= len(d["summary"]) <= 120, f"{d['slug']}: summary {len(d['summary'])}"

        body = TEMPLATE.format(
            slug=d["slug"], name=d["name"],
            rationale="\n".join(f" * {line}" for line in d["rationale"]),
            dark="true" if d["dark"] else "false",
            fonts=d["fonts"], ornament=d["ornament"], surface=d["surface"],
            motion=d["motion"], lettering=d["lettering"], chrome=d["chrome"],
            bg=bg, surf=surf, ink=ink, muted=muted, accent=accent,
            accent_soft=accent_soft, rule=rule, on_accent=on_accent,
            summary=d["summary"], meta_title=d["meta_title"],
            meta_description=d["meta_description"],
            opener=d["opener"], opener_name=OPENER_NAMES[d["opener"]],
            a=d["a"], b=d["b"], date=d["date"],
            spec_paper=d["spec_paper"], spec_ink=d["spec_ink"],
            spec_faces=FACES[d["fonts"]],
            what_it_is=block(d["what_it_is"], d["slug"], "whatItIs"),
            who_it_suits=block(d["who_it_suits"], d["slug"], "whoItSuits"),
            typography=block(d["typography"], d["slug"], "typography"),
            how_it_opens=block(d["how_it_opens"], d["slug"], "howItOpens"),
        )
        (ENTRIES / f"{d['slug']}.ts").write_text(body)

    print(f"wrote {len(DESIGNS)}: {', '.join(d['slug'] for d in DESIGNS)}")


if __name__ == "__main__":
    main()
