import { headers } from "next/headers";
import { LinkButton } from "@/components/common/Button";
import { SiteNav } from "@/components/common/SiteNav";
import { pickLang, t } from "@/lib/i18n";

export default async function NotFound() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl font-black">{copy.notFoundTitle}</h1>
        <p className="mt-3 text-base text-neutral-600">{copy.notFoundBody}</p>
        <LinkButton className="mt-8" href="/rooms">
          {copy.navRooms}
        </LinkButton>
      </main>
    </>
  );
}
