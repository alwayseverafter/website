import type { NextConfig } from "next";

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
};

export default nextConfig;
