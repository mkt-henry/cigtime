import { SiteNav } from "@/components/common/SiteNav";

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-black">Privacy</h1>
        <div className="mt-8 space-y-5 text-base leading-7 text-neutral-700">
          <p>cigtime is designed for anonymous short sessions. The MVP stores your generated ID, nickname, muted users, and local message cache in browser localStorage.</p>
          <p>Do not post names, phone numbers, email addresses, links, or details that identify you or another person.</p>
          <p>When Supabase is connected, messages, reactions, and reports should be retained only as long as needed for the service and moderation.</p>
        </div>
      </main>
    </>
  );
}
