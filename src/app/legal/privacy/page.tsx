import { PrivacyDocument, legalMetadata } from "@/components/LegalPage";
import { catalogue } from "@/lib/i18n";

export const metadata = legalMetadata(
  catalogue("en").legal.nav.privacy,
  "/legal/privacy",
);

export default function Page() {
  return <PrivacyDocument locale="en" />;
}
