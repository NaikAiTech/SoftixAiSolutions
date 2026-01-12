"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Filter = string;

export default function BlogClient({ initialItems, initialPage = 1, initialPerPage = 9, initialTotal = 0 }: { initialItems: any[]; initialPage?: number; initialPerPage?: number; initialTotal?: number }){
  const [active, setActive] = useState<Filter>("All");
  const [filters, setFilters] = useState<string[]>(["All"]);
  const [items, setItems] = useState<any[]>(initialItems || []);
  const [page, setPage] = useState<number>(initialPage || 1);
  const perPage = initialPerPage || 9;
  const [total, setTotal] = useState<number>(initialTotal || (initialItems?.length || 0));

  useEffect(()=>{
    fetch('/api/blog/categories', { cache: 'no-store' }).then(r=> r.json()).then(d=> {
      const cats: string[] = Array.isArray(d.categories)? d.categories: [];
      setFilters(["All", ...cats]);
    });
  }, []);

  // Reset to first page when category changes
  useEffect(()=>{
    setPage(1);
  }, [active]);

  // Fetch items when page/category changes
  useEffect(()=>{
    const category = active === "All" ? "" : `&category=${encodeURIComponent(active)}`;
    fetch(`/api/blog/list?limit=${perPage}&page=${page}${category}`, { cache: "no-store" })
      .then(r=> r.json())
      .then(d=> {
        setItems(Array.isArray(d.items)? d.items: []);
        setTotal(typeof d.total === 'number' ? d.total : 0);
      });
  }, [active, page, perPage]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Article categories">
        {filters.map(f => (
          <button key={f} role="tab" aria-selected={active===f} onClick={()=> setActive(f)} className={[
            "inline-flex items-center rounded-full border px-3 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-600/40",
            active===f ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          ].join(" ")}>{f}</button>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((a:any)=> (
          <Card key={a.id} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {a.image && (
              <a href={`/blog/${encodeURIComponent(a.slug)}`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.altText || a.title} className="h-44 w-full object-cover" loading="lazy" />
              </a>
            )}
            <CardContent className="p-5">
              {a.category && <Badge variant="secondary" className="mb-3 rounded-full bg-slate-100 text-slate-700">{a.category}</Badge>}
              <h3 className="text-lg font-semibold leading-snug mb-1">{a.title}</h3>
              <div className="mb-4 min-h-[40px]">
                {a.summary && <p className="text-sm text-slate-500 line-clamp-2">{a.summary}</p>}
              </div>
              <Button variant="outline" className="rounded-full px-4" href={`/blog/${encodeURIComponent(a.slug)}`}>
                Read article
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={()=> setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
        <div className="text-sm text-slate-600">
          Page {page} of {Math.max(1, Math.ceil((total || 0) / perPage))}
        </div>
        <Button variant="outline" onClick={()=> setPage(p => p + 1)} disabled={page >= Math.max(1, Math.ceil((total || 0) / perPage))}>Next</Button>
      </div>
    </>
  );
}
