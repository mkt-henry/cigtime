import { ReactionsContent } from "@/components/reactions/ReactionsContent";
import { t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

export function generateMetadata() {
  const copy = t("en");
  return pageMetadata({ title: copy.reactionsTitle, description: copy.reactionsSubtitle, path: "/reactions", noIndex: true });
}

export default function ReactionsPage() {
  return <ReactionsContent />;
}
