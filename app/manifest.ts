import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "cigtime",
    short_name: "cigtime",
    description: "Take your cigtime. A place to let it out.",
    start_url: "/rooms",
    display: "standalone",
    background_color: "#161c24",
    theme_color: "#161c24",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
