import { RoomsContent } from "@/components/rooms/RoomsContent";
import { t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

export function generateMetadata() {
  const copy = t("en");
  return pageMetadata({ title: copy.navRooms, description: copy.metaRooms, path: "/rooms" });
}

export default function RoomsPage() {
  return <RoomsContent />;
}
