import type { MetadataRoute } from "next";
import { ROOMS } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<[string, number]> = [
    ["/", 1],
    ["/rooms", 0.9],
    ...ROOMS.map((room): [string, number] => [`/room/${room.slug}`, 0.8]),
    ["/guidelines", 0.4],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];

  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority,
  }));
}
