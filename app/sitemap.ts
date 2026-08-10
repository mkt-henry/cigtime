import type { MetadataRoute } from "next";
import { ROOMS } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/rooms",
    "/reactions",
    "/guidelines",
    "/privacy",
    "/terms",
    ...ROOMS.map((room) => `/room/${room.slug}`),
  ];

  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
