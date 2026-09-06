import { ImageResponse } from "next/og";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/Mark";
import { SITE_NAME } from "@/lib/seo";

/**
 * The share image for the funnel itself.
 *
 * The site had none. Every link to alwayseverafter.com posted anywhere rendered
 * as a bare URL, which for a product whose whole argument is that it looks
 * expensive is the worst possible first impression, and the one place a
 * competitor's card would beat it without trying.
 *
 * Same two limits as the style cards in `/styles/[theme]/opengraph-image.tsx`:
 * no Italiana, because `ImageResponse` ships one font and fetching the display
 * face at build time fails by silently substituting another, which is R3; and
 * the palette is written out here, because this runs in an isolated renderer
 * with no stylesheet and no custom properties.
 *
 * The mark carries the weight the display face would have carried. It is the
 * one place on the site where the arch appears at size.
 */

export const alt = `${SITE_NAME}. A wedding invitation that opens.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#FAF8F5";
const INK = "#131A26";
const INK_2 = "#4A5568";
const RULE = "#DCD8D2";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PAPER,
          color: INK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "72px 96px",
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox={MARK_VIEWBOX}
          fill="none"
          stroke={INK}
          strokeWidth={2}
        >
          <path d={MARK_PATHS.arch} />
          <path d={MARK_PATHS.bar} />
        </svg>

        {/* The wordmark, tracked the way the page tracks it. */}
        <div
          style={{
            marginTop: 44,
            fontSize: 40,
            letterSpacing: 18,
            /* Tracking pushes the optical centre right; the indent pulls it
               back, exactly as globals.css does for the live wordmark. */
            textIndent: 18,
            textTransform: "uppercase",
            color: INK,
          }}
        >
          {SITE_NAME}
        </div>

        {/* The one rule weight this design system has. */}
        <div style={{ width: 220, height: 1, background: RULE, margin: "44px 0" }} />

        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            letterSpacing: 0.4,
            color: INK_2,
            textAlign: "center",
            maxWidth: 760,
            display: "flex",
          }}
        >
          One invitation, one link, sent to everyone you love. Priced once, not
          per guest.
        </div>
      </div>
    ),
    size,
  );
}
