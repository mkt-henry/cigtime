import { JsonLd } from "@/components/common/JsonLd";
import { LegalPage } from "@/components/common/LegalPage";
import { legalMetadata, legalStructuredData } from "@/lib/legalSeo";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

export function generateMetadata() {
  return legalMetadata("terms");
}

export default function TermsPage() {
  return (
    <>
      <JsonLd graph={legalStructuredData("terms")} />
      <LegalPage page="terms" />
    </>
  );
}
