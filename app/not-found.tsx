import { headers } from "next/headers";
import { LinkButton } from "@/components/common/Button";
import { SiteNav } from "@/components/common/SiteNav";
import { pickLang, t } from "@/lib/i18n";

export default async function NotFound() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
        <h1 className="font-display text-7xl font-black uppercase leading-[0.9] text-mist">{copy.notFoundTitle}</h1>
        <p className="mt-5 text-lg text-fog">{copy.notFoundBody}</p>
        <LinkButton className="mt-10" href="/rooms">
          {copy.navRooms}
        </LinkButton>
      </main>
    </>
  );
}
