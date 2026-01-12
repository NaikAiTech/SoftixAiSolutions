"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ListTree } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function useHeadings(ref: React.RefObject<HTMLElement>) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: 1 | 2 }>>([]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll("h1, h2")) as HTMLHeadingElement[];
    const seen: Record<string, number> = {};
    const list = nodes.map((n) => {
      const level = (n.tagName.toLowerCase() === "h1" ? 1 : 2) as 1 | 2;
      // Some content wraps text inside <strong> or uses empty ids; derive meaningful slug
      const rawText = n.textContent || n.innerText || "";
      let id = n.id && n.id.trim() ? n.id.trim() : slugify(rawText);
      if (!id) id = `section-${Math.random().toString(36).slice(2, 8)}`;
      if (seen[id]) { seen[id] += 1; id = `${id}-${seen[id]}`; } else { seen[id] = 1; }
      n.id = id;
      return { id, text: n.textContent || "", level };
    });
    setHeadings(list);
  }, [ref]);
  return headings;
}

function useActiveHeading(
  headings: { id: string }[],
  lockRef: React.MutableRefObject<number>,
  activeId: string | null,
  setActiveId: (id: string | null) => void
) {
  useEffect(() => {
    if (!headings.length) return;
    let ticking = false;
    const TOP_OFFSET = 120; // account for site header and desired viewport anchor
    const computeActive = () => {
      if (Date.now() < lockRef.current) return; // ignore during manual lock
      const positions = headings
        .map((h) => {
          const el = document.getElementById(h.id);
          if (!el) return { id: h.id, top: Number.POSITIVE_INFINITY };
          const rect = el.getBoundingClientRect();
          return { id: h.id, top: rect.top };
        })
        .sort((a, b) => a.top - b.top);

      // Pick first heading below the offset; if none, pick the last above
      const below = positions.find((p) => p.top >= TOP_OFFSET);
      const above = positions.filter((p) => p.top < TOP_OFFSET);
      const nextActive = (below ? below.id : (above.length ? above[above.length - 1].id : positions[0]?.id)) || null;
      if (nextActive && nextActive !== activeId) setActiveId(nextActive);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    };
    computeActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headings, activeId, lockRef, setActiveId]);
}

export default function ArticleClient({ bodyHtml }: { bodyHtml: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headings = useHeadings(contentRef);
  const manualLockUntil = useRef<number>(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  useActiveHeading(headings, manualLockUntil, activeId, setActiveId);
  useEffect(() => {
    if (!activeId && headings.length) setActiveId(headings[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings, activeId]);

  // Support deep-link on initial load after IDs are injected
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!headings.length) return;
    const raw = window.location.hash || '';
    if (!raw) return;
    const hash = decodeURIComponent(raw.replace(/^#/, ''));
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      // wait a tick for layout
      setTimeout(() => {
        const SAFE_OFFSET = 160;
        const top = window.scrollY + el.getBoundingClientRect().top - SAFE_OFFSET;
        manualLockUntil.current = Date.now() + 1200;
        setActiveId(hash);
        window.scrollTo({ top, behavior: 'smooth' });
      }, 0);
    }
  }, [headings]);

  return (
    <div className="relative mt-6">
      {/* Sidebar (left, outside content width) */}
      <nav className="hidden lg:block absolute -left-72 inset-y-0 w-64" aria-label="On this page">
        <div className="w-64 sticky top-1/2 -translate-y-1/2 transform">
          <a href="/blog" className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </a>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="mb-2 text-sm font-medium text-slate-600">On this page</div>
            <ol className="space-y-1 text-sm">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 2 ? "pl-4" : "pl-0"}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(h.id);
                      if (el) {
                        const SAFE_OFFSET = 160;
                        const top = window.scrollY + el.getBoundingClientRect().top - SAFE_OFFSET;
                        manualLockUntil.current = Date.now() + 1200;
                        setActiveId(h.id);
                        window.scrollTo({ top, behavior: "smooth" });
                        history.replaceState(null, "", `#${h.id}`);
                      }
                    }}
                    className={[
                      "relative block rounded-md px-3 py-1 transition",
                      activeId === h.id
                        ? "bg-emerald-50 text-slate-900 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-black"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {h.text}
                    <span className="sr-only">Jump to section {h.text}</span>
                  </a>
                </li>
              ))}
              {!headings.length && <li className="text-slate-500">No sections</li>}
            </ol>
          </div>
        </div>
      </nav>

      {/* Mobile TOC (hidden per request) */}
      <div className="hidden">
        <Popover>
          <PopoverTrigger>
            <button className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
              <ListTree className="h-4 w-4" />
              Contents
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <ol className="space-y-1 text-sm">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 2 ? "pl-4" : "pl-0"}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(h.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        history.replaceState(null, "", `#${h.id}`);
                      }
                    }}
                    className="block rounded-md px-2 py-1 hover:bg-slate-50"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
              {!headings.length && <li className="text-slate-500">No sections</li>}
            </ol>
          </PopoverContent>
        </Popover>
      </div>

      {/* Body (full width) */}
      <article className="rounded-2xl border border-black/10 bg-white">
        <div
          ref={contentRef}
          className="prose dav-article max-w-none p-6 prose-headings:scroll-mt-24"
          dangerouslySetInnerHTML={{ __html: bodyHtml || "" }}
        />
      </article>
    </div>
  );
}
