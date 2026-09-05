import { TermsDocument, legalMetadata } from "@/components/LegalPage";
import { catalogue } from "@/lib/i18n";

export const metadata = legalMetadata(
  catalogue("de").legal.nav.terms,
  "/legal/terms",
);

export default function Page() {
  return <TermsDocument locale="de" />;
}
