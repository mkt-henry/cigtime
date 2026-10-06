import { headers } from "next/headers";
import { LegalPage } from "@/components/common/LegalPage";
import { pickLang } from "@/lib/i18n";
import { legalCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata() {
  const copy = legalCopy(pickLang((await headers()).get("accept-language")), "privacy");
  return pageMetadata({ title: copy.title, description: copy.intro, path: "/privacy" });
}

export default function PrivacyPage() {
  return <LegalPage page="privacy" />;
}
