import type { MetadataRoute } from "next";
import { ROOMS } from "@/lib/constants";
import { GUIDES, guidePath } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { CONTENT_DATES } from "@/lib/structuredData";

export default function sitemap(): MetadataRoute.Sitemap {
  const { guides, legal, rooms, site } = CONTENT_DATES;
  const pages: Array<[string, number, string]> = [
    ["/", 1, site.modified],
    ["/rooms", 0.9, rooms.modified],
    ...ROOMS.map((room): [string, number, string] => [`/room/${room.slug}`, 0.8, rooms.modified]),
    ...GUIDES.map((guide): [string, number, string] => [guidePath(guide.slug), 0.7, guides.modified]),
    ["/guidelines", 0.4, legal.modified],
    ["/privacy", 0.2, legal.modified],
    ["/terms", 0.2, legal.modified],
  ];

  return pages.map(([path, priority, lastModified]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
