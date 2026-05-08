import { SiteNav } from "@/components/common/SiteNav";

export default function GuidelinesPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-black">Community Guidelines</h1>
        <div className="mt-8 space-y-5 text-base leading-7 text-neutral-700">
          <p>Keep it short. Keep it anonymous. Let the thought pass without dragging someone else into it.</p>
          <p>Blocked in the MVP: links, personal contact info, images, direct messages, mentions, harassment, hate, sexual content, spam, and self-harm instructions.</p>
          <p>Use reactions for lightweight empathy: same, real, oof, lol, and hug.</p>
        </div>
      </main>
    </>
  );
}
