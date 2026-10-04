import type { Metadata } from "next";
import { Funnel } from "@/components/funnel/Funnel";
import { STYLE_COUNT } from "@/lib/seo";

/**
 * The home page is the funnel. It stays a server component so it can carry its
 * own metadata, and hands the whole sequence to one client boundary, because
 * locale and the couple's names are shared across sections.
 */
export const metadata: Metadata = {
  title: "Always Ever After",
  description:
    "A wedding invitation that opens. One link, sent to everyone you love, "
    + "on any phone, with no app and no account. Priced once, not per guest.",
  alternates: { canonical: "/" },
};

export default function Home() {
  /*
   * The count is read here, on the server, and handed across the boundary as a
   * string. `@/lib/seo` reaches the whole catalogue, so importing it inside the
   * client component would put forty-six entry modules in the browser bundle.
   */
  return (
    <main>
      <Funnel styleCount={STYLE_COUNT} />
    </main>
  );
}
