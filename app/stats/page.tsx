import { StatsContent } from "@/components/stats/StatsContent";
import { t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

export function generateMetadata() {
  const copy = t("en");
  return pageMetadata({ title: copy.statsTitle, description: copy.statsSubtitle, path: "/stats", noIndex: true });
}

export default function StatsPage() {
  return <StatsContent />;
}
