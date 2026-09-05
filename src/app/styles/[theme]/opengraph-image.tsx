import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import {
  SITE_NAME,
  THEME_COPY,
  THEME_ORDER,
  formatSampleDate,
  isThemeId,
} from "@/lib/seo";

/**
 * The share image for one style.
 *
 * WHY this matters more than it looks: for this product the link is the
 * product. An invitation is passed around in a message, and a style page is
 * passed around the same way, so this 1200x630 is the first and often the only
 * thing a person sees. A generic card here loses the visit before the page is
 * ever rendered.
 *
 * WHY the palette is duplicated in `seo.ts` rather than read from CSS: this
 * runs in an isolated renderer with no document and no stylesheet, so a custom
 * property is not reachable. The values live next to the copy they belong to.
 *
 * WHY no Italiana: ImageResponse ships one font, and loading the display face
 * would mean a network fetch at build time whose failure mode is a silent
 * substitution, which is exactly the class of defect R3 exists to stop. So the
 * card is set entirely in the UI register instead, tracked wide, and it carries
 * the style through its palette and its proportions. That is a deliberate
 * limit, not an oversight.
 */

export const alt = "A wedding invitation style from Always Ever After";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Eight images, all produced at build time alongside the eight pages. */
export function generateStaticParams(): { theme: string }[] {
  return THEME_ORDER.map((theme) => ({ theme }));
}

/**
 * The names crowd the frame past a certain length, so the size steps down.
 * Held below the size a headline would use, because a single geometric sans set
 * very large reads as a product launch rather than as an invitation. Space
 * around the names does the work the display face would have done.
 */
function nameSize(text: string): number {
  if (text.length <= 15) return 94;
  if (text.length <= 21) return 80;
  return 66;
}

export default async function Image({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  /* R3: an unknown slug is refused here too, rather than drawn in a default palette. */
  if (!isThemeId(theme)) notFound();

  const copy = THEME_COPY[theme];
  const { paper, ink, muted, rule, accent } = copy.palette;
  const names = `${copy.sample.a} & ${copy.sample.b}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: paper,
          color: ink,
          padding: 56,
        }}
      >
        {/* The one hairline weight, inset, which is the whole frame. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            border: `1px solid ${rule}`,
            padding: "44px 56px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 7,
                textTransform: "uppercase",
                color: muted,
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 7,
                textTransform: "uppercase",
                color: muted,
              }}
            >
              {copy.name}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: nameSize(names),
                lineHeight: 1.05,
                letterSpacing: 5,
                color: ink,
                textAlign: "center",
              }}
            >
              {names}
            </div>
            {/* A short rule in the theme's one colour. It appears nowhere else on the card. */}
            <div
              style={{ display: "flex", width: 96, height: 1, backgroundColor: accent, margin: "34px 0" }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: muted,
              }}
            >
              {formatSampleDate(copy.sample.date)}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: muted,
              }}
            >
              {copy.openerName}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: muted,
              }}
            >
              Priced once, not per guest
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
