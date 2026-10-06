import { headers } from "next/headers";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SiteNav } from "@/components/common/SiteNav";
import { ReactionInbox } from "@/components/reactions/ReactionInbox";
import { pickLang, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata() {
  const copy = t(pickLang((await headers()).get("accept-language")));
  return pageMetadata({ title: copy.reactionsTitle, description: copy.reactionsSubtitle, path: "/reactions", noIndex: true });
}

export default async function ReactionsPage() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] text-mist sm:text-7xl">
          {copy.reactionsTitle}
        </h1>
        <p className="mb-10 mt-5 text-lg leading-relaxed text-fog">{copy.reactionsSubtitle}</p>
        <ReactionInbox />
      </main>
      <SiteFooter />
    </>
  );
}
