import NextBookingBar from "@/components/NextBookingBar";
import BlogClient from "./pageClient";

export const metadata = {
  title: "Pet Health Articles | Dial A Vet",
  description:
    "Vet-written guides on symptoms, home care, nutrition, behaviour and when to see a clinic.",
};

const FILTERS = ["All","Symptoms","Nutrition","Puppies","Parasites","Behaviour"] as const;
type Filter = (typeof FILTERS)[number];

export default async function BlogListPage() {
  const base = process.env.NEXTAUTH_URL || "";
  const res = await fetch(`${base}/api/blog/list?limit=9&page=1`, { cache: "no-store" }).catch(() => null);
  const data = res && res.ok ? await res.json() : { items: [] };
  const items = Array.isArray(data.items) ? data.items : [];
  const initialPage = Number(data?.page) || 1;
  const initialPerPage = Number(data?.perPage) || 9;
  const initialTotal = Number(data?.total) || items.length;
  return (
    <main className="min-h-dvh bg-[#F5F7F6] text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Pet Health Articles</h1>
          <p className="mt-1 text-slate-500">Vet‑written guides on symptoms, home care, nutrition, behaviour, and when to see a clinic.</p>
        </header>
        <BlogClient initialItems={items} initialPage={initialPage} initialPerPage={initialPerPage} initialTotal={initialTotal} />
        <div className="mt-8">
          <NextBookingBar />
        </div>
      </div>
    </main>
  );
}
