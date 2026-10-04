import type { NextConfig } from "next";
import { BASE_THEME_IDS, SELLABLE_THEME_IDS } from "./src/invite/types";

/**
 * The original styles that have no page of their own.
 *
 * `/styles/[theme]` sets `dynamicParams = false` and builds its params from
 * `THEME_ORDER`, so a style outside that list is a hard 404 with no redirect
 * and any link already shared or indexed is simply dead. These seven are in
 * that position: written, but deliberately neither sold nor listed.
 *
 * Scoped to `BASE_THEME_IDS`, and that scoping is load-bearing. This list was
 * once every unsellable theme, which was the same set back when the gallery
 * was sellable-only. The catalogue broke that equivalence: its forty-six
 * styles are listed and routed but not yet buyable, so the old derivation
 * matched all of them and 307'd every catalogue page to the index. They were
 * prerendered and unreachable, and no test caught it because the redirect
 * lives in the build config rather than in the app. `seo.test.ts` now asserts
 * that nothing here shadows a page that exists.
 *
 * Temporary, not permanent: the restriction lifts when the palettes are
 * ported, so a 308 would be a lie cached by every browser that saw it.
 */
const UNROUTED = BASE_THEME_IDS.filter(
  (theme) => !(SELLABLE_THEME_IDS as readonly string[]).includes(theme),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  /**
   * Turbopack refuses to trace a node_modules symlink that resolves outside the
   * project root, which is exactly how the parallel worktrees share one install.
   * Naming the root explicitly makes the shared copy legal.
   *
   * Falls back to the working directory, which is correct on Vercel and for a
   * plain clone. AEA_ROOT is only ever set in a local worktree.
   */
  turbopack: { root: process.env.AEA_ROOT ?? process.cwd() },
  async redirects() {
    return UNROUTED.map((theme) => ({
      source: `/styles/${theme}`,
      destination: "/styles",
      /* 307. See UNROUTED above: a restriction with a removal date. */
      permanent: false,
    }));
  },
};

export default nextConfig;
