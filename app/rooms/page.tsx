import { JsonLd } from "@/components/common/JsonLd";
import { RoomsContent } from "@/components/rooms/RoomsContent";
import { ROOMS } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { absoluteUrl, breadcrumb, webPage } from "@/lib/structuredData";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

const TITLE = "Rooms: Pick a Spot for a One-Minute Break";

export function generateMetadata() {
  return pageMetadata({ title: TITLE, description: t("en").metaRooms, path: "/rooms" });
}

export default function RoomsPage() {
  return (
    <>
      <JsonLd
        graph={[
          { ...webPage({ path: "/rooms", name: TITLE, description: t("en").metaRooms }), "@type": "CollectionPage" },
          {
            "@type": "ItemList",
            itemListElement: ROOMS.map((room, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: room.name,
              url: absoluteUrl(`/room/${room.slug}`),
            })),
          },
          breadcrumb([[t("en").navRooms, "/rooms"]]),
        ]}
      />
      <RoomsContent />
    </>
  );
}
