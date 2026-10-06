import { notFound } from "next/navigation";
import { RoomShell } from "@/components/room/RoomShell";
import { headers } from "next/headers";
import { ROOMS } from "@/lib/constants";
import { pickLang, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return ROOMS.map((room) => ({ roomSlug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ roomSlug: string }> }) {
  const { roomSlug } = await params;
  const room = ROOMS.find((item) => item.slug === roomSlug);
  if (!room) return {};
  const lang = pickLang((await headers()).get("accept-language"));
  return pageMetadata({
    title: room.name,
    description: t(lang).metaRoom(room.name, lang === "es" ? room.descriptionEs : room.description),
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
