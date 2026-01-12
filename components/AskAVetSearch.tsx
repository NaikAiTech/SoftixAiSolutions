"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export type AskItem = {
  id: string;
  slug: string;
  question: string;
  excerpt?: string | null;
  category?: string | null;
};

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function AskAVetSearch({ defaultItems, linkPrefix = "/ask-a-vet", searchPath = "/api/ask-a-vet/list", initialPage = 1, initialPerPage = 9, initialTotal = 0 }: { defaultItems: AskItem[]; linkPrefix?: string; searchPath?: string; initialPage?: number; initialPerPage?: number; initialTotal?: number }) {
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<AskItem[]>(defaultItems);
  const [page, setPage] = React.useState<number>(initialPage || 1);
  const perPage = initialPerPage || 9;
  const [total, setTotal] = React.useState<number>(initialTotal || defaultItems.length);
  const [loading, setLoading] = React.useState(false);
  const debounced = useDebounced(query, 400);

  // Reset to first page when query changes
  React.useEffect(() => {
    setPage(1);
  }, [debounced]);

  React.useEffect(() => {
    let isCancelled = false;
    async function run() {
      try {
        setLoading(true);
        const qParam = debounced ? `&q=${encodeURIComponent(debounced)}` : "";
        const res = await fetch(`${searchPath}?limit=${perPage}&page=${page}${qParam}`, { cache: "no-store" });
        if (!isCancelled && res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data.items) ? data.items : []);
          setTotal(typeof data.total === 'number' ? data.total : 0);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    run();
    return () => { isCancelled = true; };
  }, [debounced, searchPath, page, perPage]);

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Input
            placeholder="Search questions…"
            aria-label="Search questions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input rounded-full bg-white"
          />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <article key={a.id} className="card rounded-2xl h-full">
            <div className="p-4 flex h-full flex-col">
              <div className="text-xs text-[#6b7280] mb-1">Question</div>
              <h2 className="text-[17px] md:text-[18px] font-medium text-[#0b1220] leading-snug tracking-tight">{a.question}</h2>
              {a.excerpt && (
                <>
                  <div className="text-xs text-[#6b7280] mt-3 mb-1">Details</div>
                  <p className="text-sm leading-6 text-[#374151]">{a.excerpt}</p>
                </>
              )}
              <div className="mt-3 mt-auto">
                <a href={`${linkPrefix}/${encodeURIComponent(a.slug)}`} className="btn-outline w-full inline-flex items-center justify-center rounded-full">Read more</a>
              </div>
            </div>
          </article>
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-black/10 bg-white p-10 text-center text-[#6b7280]">
            No results. Try different keywords.
          </div>
        )}
        {loading && (
          <div className="col-span-full rounded-2xl border border-black/10 bg-white p-10 text-center text-[#6b7280]">
            Searching…
          </div>
        )}
      </section>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-outline rounded-full px-4 py-2">Previous</button>
        <div className="text-sm text-[#6b7280]">Page {page} of {Math.max(1, Math.ceil((total || 0) / perPage))}</div>
        <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.max(1, Math.ceil((total || 0) / perPage))} className="btn-outline rounded-full px-4 py-2">Next</button>
      </div>
    </div>
  );
}
