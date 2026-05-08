import { SiteNav } from "@/components/common/SiteNav";

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-black">Terms</h1>
        <div className="mt-8 space-y-5 text-base leading-7 text-neutral-700">
          <p>Use cigtime as a brief anonymous outlet, not as a place to threaten, harass, expose, or target people.</p>
          <p>Messages can be reported, hidden, or removed. Users can mute anonymous identities from their own browser.</p>
          <p>The MVP is provided as-is and should be connected to production moderation and retention rules before public launch.</p>
        </div>
      </main>
    </>
  );
}
