import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <div className="relative">
      <SiteNav overlay />
      <Hero />
      <SiteFooter />
    </div>
  );
}
