import type { MetadataRoute } from "next";
import { ROOMS } from "@/lib/constants";
import { GUIDES, guidePath } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<[string, number]> = [
    ["/", 1],
    ["/rooms", 0.9],
    ...ROOMS.map((room): [string, number] => [`/room/${room.slug}`, 0.8]),
    ...GUIDES.map((guide): [string, number] => [guidePath(guide.slug), 0.7]),
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
