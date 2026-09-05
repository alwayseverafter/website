import next from "eslint-config-next";
import nextTs from "eslint-config-next/typescript";

/**
 * R1 is enforced here rather than trusted. Viewport units inside the renderer
 * are what caused B2: the invitation is embedded in the page at three sizes,
 * and `vh` resolves against the window rather than the frame, so motion
 * travelled 1.58x its container. See docs/LESSONS.md.
 */
const noViewportUnitsInRenderer = {
  files: ["src/invite/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/\\d(vh|vw|svh|svw|lvh|dvh)\\b/]",
        message:
          "Viewport units break inside embedded previews (LESSONS.md R1). Use cqh/cqw or a custom property the host sets.",
      },
    ],
  },
};

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", ".claude/**"] },
  ...next,
  ...nextTs,
  noViewportUnitsInRenderer,
];

export default config;
