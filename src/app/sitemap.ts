import type { MetadataRoute } from "next";

import { THEME_ORDER, absoluteUrl, themePath } from "@/lib/seo";

/**
 * The ten URLs that exist to be found: the funnel, the gallery, and one page
 * per style.
 *
 * Routes that are not listed are not omissions. /commission, /create and
 * /preview are steps inside a purchase and a shared preview carries a couple's
 * names, so putting either in a sitemap would be inviting a crawler into
 * somebody's wedding. Legal pages are reachable from the footer and do not need
 * ranking.
 *
 * `lastModified` is the build time. That is honest for a set of static pages
 * whose content changes when this repository does, and it is better than a
 * hardcoded date that goes stale the moment the copy is edited.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/styles"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...THEME_ORDER.map((theme) => ({
      url: absoluteUrl(themePath(theme)),
      lastModified,
      changeFrequency: "monthly" as const,
      /*
       * Equal priority across all eight. Ranking one style above another here
       * would be guessing at demand we have no data for, and priority is a
       * relative hint rather than a lever.
       */
      priority: 0.8,
    })),
  ];
}
