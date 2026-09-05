import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Everything public is crawlable.
 *
 * /preview is disallowed because a shared preview URL carries a couple's names
 * in the query string. It is unlisted rather than secret, and an unlisted page
 * that a crawler indexes stops being unlisted. Blocking it costs no search
 * surface, because the eight style pages are the search surface.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/preview", "/create"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
