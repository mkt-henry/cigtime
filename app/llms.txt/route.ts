import { ROOMS } from "@/lib/constants";
import { GUIDES, guidePath } from "@/lib/guides";
import { t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text map of the site for AI assistants (llmstxt.org).
export function GET() {
  const copy = t("en");
  const lines = [
    "# cigtime",
    "",
    `> ${copy.metaDescription}`,
    "",
    "cigtime is a free web app, in English and Spanish. No sign-up: everyone gets a random nickname, and Google sign-in is optional. A session lasts 1, 3, 5 or 10 minutes, a line is at most 140 characters, others can react with same, real, oof, lol or hug, and messages are deleted after 24 hours. It is a short break, not therapy or crisis help.",
    "",
    "## Rooms",
    "",
    ...ROOMS.map((room) => `- [${room.name}](${SITE_URL}/room/${room.slug}): ${room.description}`),
    "",
    "## Guides",
    "",
    ...GUIDES.map((guide) => `- [${guide.title}](${SITE_URL}${guidePath(guide.slug)}): ${guide.description}`),
    "",
    "## FAQ",
    "",
    ...copy.faq.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
    "## Policies",
    "",
    `- [Guidelines](${SITE_URL}/guidelines)`,
    `- [Privacy](${SITE_URL}/privacy)`,
    `- [Terms](${SITE_URL}/terms)`,
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
