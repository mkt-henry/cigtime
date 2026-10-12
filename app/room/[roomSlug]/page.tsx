import { notFound } from "next/navigation";
import { RoomShell } from "@/components/room/RoomShell";
import { ROOMS } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

// Fail the build if request-only rendering is introduced into this static page.
export const dynamic = "error";

// The room catalog is fixed; unknown slugs should never render on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROOMS.map((room) => ({ roomSlug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ roomSlug: string }> }) {
  const { roomSlug } = await params;
  const room = ROOMS.find((item) => item.slug === roomSlug);
  if (!room) return {};
  return pageMetadata({
    title: room.name,
    description: t("en").metaRoom(room.name, room.description),
    path: `/room/${room.slug}`,
  });
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomSlug: string }>;
}) {
  const { roomSlug } = await params;
  const room = ROOMS.find((item) => item.slug === roomSlug);

  if (!room) {
    notFound();
  }

  return <RoomShell room={room} />;
}
