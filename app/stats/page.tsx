import { SiteNav } from "@/components/common/SiteNav";
import { DauChart } from "@/components/stats/DauChart";

export default function StatsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6">
        <h1 className="text-4xl font-black sm:text-5xl">Product pulse</h1>
        <p className="mb-8 mt-4 text-lg text-neutral-600">
          Unique browsers that entered a room or acted inside it, by KST day.
        </p>
        <DauChart />
      </main>
    </>
  );
}
