import { LegalPage } from "@/components/common/LegalPage";
import { legalCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

export function generateMetadata() {
  const copy = legalCopy("en", "privacy");
  return pageMetadata({ title: copy.title, description: copy.intro, path: "/privacy" });
}

export default function PrivacyPage() {
  return <LegalPage page="privacy" />;
}
