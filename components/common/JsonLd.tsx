import { jsonLd } from "@/lib/structuredData";

// Server-rendered schema.org graph for the page it sits in.
export function JsonLd({ graph }: { graph: object[] }) {
  return <script dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} type="application/ld+json" />;
}
