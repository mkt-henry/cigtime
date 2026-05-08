import { notFound } from "next/navigation";
import { RoomShell } from "@/components/room/RoomShell";
import { ROOMS } from "@/lib/constants";

export function generateStaticParams() {
  return ROOMS.map((room) => ({ roomSlug: room.slug }));
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
