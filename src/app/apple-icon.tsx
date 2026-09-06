import { ImageResponse } from "next/og";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/Mark";

/**
 * The home screen icon. Same arch as `icon.svg`, drawn larger because iOS
 * rounds the corners and crops toward the centre, so the mark is inset further
 * than it is in the favicon.
 *
 * No text: at 180 px on a home screen a tracked wordmark is illegible, and an
 * illegible wordmark is worse than none.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f5",
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox={MARK_VIEWBOX}
          fill="none"
          stroke="#131a26"
          strokeWidth={2.4}
        >
          <path d={MARK_PATHS.arch} />
          <path d={MARK_PATHS.bar} />
        </svg>
      </div>
    ),
    size,
  );
}
