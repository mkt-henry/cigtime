import { GuidePage } from "@/components/guides/GuidePage";
import { getGuide, guidePath } from "@/lib/guides";
import { pageMetadata } from "@/lib/site";

export const dynamic = "error";

export function generateMetadata() {
  const guide = getGuide("vent-anonymously")!;
  return pageMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug) });
}

export default function VentAnonymouslyPage() {
  return <GuidePage guide={getGuide("vent-anonymously")!} />;
}
