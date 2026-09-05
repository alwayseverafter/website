import type { Metadata } from "next";
import { Funnel } from "@/components/funnel/Funnel";

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
  return (
    <main>
      <Funnel />
    </main>
  );
}
