import { headers } from "next/headers";
import { SiteNav } from "@/components/common/SiteNav";
import { ReactionInbox } from "@/components/reactions/ReactionInbox";
import { pickLang, t } from "@/lib/i18n";

export default async function ReactionsPage() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <h1 className="text-4xl font-black sm:text-5xl">{copy.reactionsTitle}</h1>
        <p className="mb-8 mt-4 text-lg text-neutral-600">{copy.reactionsSubtitle}</p>
        <ReactionInbox />
      </main>
    </>
  );
}
