import { GuidePage } from "@/components/guides/GuidePage";
import { getGuide, guidePath } from "@/lib/guides";
import { pageMetadata } from "@/lib/site";

export const dynamic = "error";

export function generateMetadata() {
  const guide = getGuide("let-it-go")!;
  return pageMetadata({ title: guide.title, description: guide.description, path: guidePath(guide.slug) });
}

export default function LetItGoPage() {
  return <GuidePage guide={getGuide("let-it-go")!} />;
}
