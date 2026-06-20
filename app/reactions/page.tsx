import { SiteNav } from "@/components/common/SiteNav";
import { ReactionInbox } from "@/components/reactions/ReactionInbox";

export default function ReactionsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <h1 className="text-4xl font-black sm:text-5xl">What came back</h1>
        <p className="mb-8 mt-4 text-lg text-neutral-600">
          Reactions to thoughts left by this browser.
        </p>
        <ReactionInbox />
      </main>
    </>
  );
}
