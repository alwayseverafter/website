import { ImprintDocument, legalMetadata } from "@/components/LegalPage";
import { catalogue } from "@/lib/i18n";

export const metadata = legalMetadata(
  catalogue("de").legal.nav.imprint,
  "/impressum",
);

export default function Page() {
  return <ImprintDocument locale="de" />;
}
