import { ImprintDocument, legalMetadata } from "@/components/LegalPage";
import { catalogue } from "@/lib/i18n";

/**
 * The Impressum sits at /impressum in both languages, because that is the URL
 * a German visitor looks for and the one an Abmahnung would name. The English
 * page carries the same disclosures rather than hiding them behind the German
 * one: the duty under § 5 DDG attaches to the site, not to a locale.
 */
export const metadata = legalMetadata(
  catalogue("en").legal.nav.imprint,
  "/impressum",
);

export default function Page() {
  return <ImprintDocument locale="en" />;
}
