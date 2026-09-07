import type { NextConfig } from "next";
import { SELLABLE_THEME_IDS, THEME_IDS } from "./src/invite/types";

/**
 * The styles that exist in the renderer but cannot be bought.
 *
 * Derived, not typed out. `/styles/[theme]` sets `dynamicParams = false` and
 * builds its params from the sellable list, so narrowing that list turned every
 * other style page into a hard 404 with no redirect. Any link already shared or
 * indexed was simply dead.
 *
 * Temporary, not permanent: the restriction lifts when the palettes are ported,
 * so a 308 would be a lie cached by every browser that saw it.
 */
const UNSELLABLE = THEME_IDS.filter(
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
    return UNSELLABLE.map((theme) => ({
      source: `/styles/${theme}`,
      destination: "/styles",
      /* 307. See UNSELLABLE above: a restriction with a removal date. */
      permanent: false,
    }));
  },
};

export default nextConfig;
