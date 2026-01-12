import NextBookingBar from "@/components/NextBookingBar";
import { Badge } from "@/components/ui/badge";
import FreeConsultBanner from "@/components/FreeConsultBanner";
import ArticleClient from "../ArticleClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/blog/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
  if (!res || !res.ok) return { title: 'Article | Dial A Vet' };
  const { item } = await res.json();
  return {
    title: item.title ? `${item.title} | Dial A Vet` : 'Article | Dial A Vet',
    description: item.description || undefined,
  };
}

function fmtDate(iso?: string | null) {
  if (!iso) return null;
  try { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso)); } catch { return null; }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const base = process.env.NEXTAUTH_URL || '';
  const res = await fetch(`${base}/api/blog/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
  if (!res || !res.ok) {
    return (
      <main className="mx-auto w-full max-w-3xl bg-[#f7f7f8] px-4 py-8 lg:py-10">
        <article className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-[#6b7280]">Not found.</div>
        </article>
      </main>
    );
  }
  const { item } = await res.json();
  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/&amp;|&/g, ' and ')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  function injectHeadingIds(html: string): string {
    const used: Record<string, number> = {};
    return html.replace(/<h(1|2)([^>]*)>([\s\S]*?)<\/h\1>/gi, (m, lvl, attrs, inner) => {
      const plain = (inner || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      let id = slugify(plain) || `section-${Math.random().toString(36).slice(2, 8)}`;
      if (used[id]) { used[id] += 1; id = `${id}-${used[id]}`; } else { used[id] = 1; }
      if (/\sid\s*=\s*"[^"]*"/i.test(attrs)) {
        attrs = attrs.replace(/\sid\s*=\s*"[^"]*"/i, ` id="${id}"`);
      } else {
        attrs = `${attrs} id="${id}"`;
      }
      return `<h${lvl}${attrs}>${inner}</h${lvl}>`;
    });
  }
  const processedHtml = injectHeadingIds(item.bodyHtml || "");
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.dialavet.com').replace(/\/$/, '');
  const canonicalUrl = `${siteBase}/blog/${encodeURIComponent(item.slug)}`;
  const imageAbs = item.image ? (item.image.startsWith('http') ? item.image : `${siteBase}${item.image}`) : undefined;
  const articlePlain = (item.bodyHtml || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const blogLd: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: item.title || undefined,
    image: imageAbs || undefined,
    author: { '@type': 'Organization', name: 'Dial A Vet', url: siteBase },
    publisher: {
      '@type': 'Organization',
      name: 'Dial A Vet',
      logo: { '@type': 'ImageObject', url: `${siteBase}/brand/logo.avif` },
    },
    datePublished: item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined,
    dateModified: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
    description: item.summary || item.description || undefined,
    articleBody: articlePlain || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url: canonicalUrl,
  };
  const related = item.category
    ? await fetch(`${base}/api/blog/list?limit=3&category=${encodeURIComponent(item.category)}`, { cache: 'no-store' })
        .then(r => r.ok ? r.json() : { items: [] }).then(d => (d.items||[]).filter((x: any)=> x.slug !== item.slug))
        .catch(()=> [])
    : [];
  return (
    <main className="mx-auto w-full max-w-3xl bg-[#F5F7F6] px-4 py-8 lg:py-10">
      {/* JSON-LD Schema for BlogPosting */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      {/* Hero image */}
      {item.image && (
        <div className="mb-5 overflow-hidden rounded-2xl border border-black/10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.altText || item.title || ''} className="h-64 w-full object-cover" />
        </div>
      )}

      {/* Title + meta */}
      <header className="mb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#0b1220] md:text-3xl">{item.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {item.category && <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">{item.category}</Badge>}
          {fmtDate(item.publishedAt) && <span className="text-slate-500">Published {fmtDate(item.publishedAt)}</span>}
          {fmtDate(item.updatedAt) && <span className="text-slate-500">Updated {fmtDate(item.updatedAt)}</span>}
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="Dial A Vet" className="h-8 w-8 rounded-full border border-black/10" />
          <span>By Dial A Vet</span>
        </div>
        {item.summary && <p className="mt-2 text-sm text-[#6b7280] md:text-base">{item.summary}</p>}
      </header>

        {/* Body + free consult + related */}
        <section className="space-y-8">
          <FreeConsultBanner source={`blog:${item.slug || ""}`} />
          <ArticleClient bodyHtml={processedHtml} />
          {Array.isArray(related) && related.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-medium text-[#0b1220]">Related articles</h2>
              <ul className="space-y-2">
                {related.map((r: any) => (
                  <li key={r.id} className="rounded-xl border border-black/10 bg-white p-3 hover:shadow-sm transition-shadow">
                    <a className="no-underline" href={`/blog/${encodeURIComponent(r.slug)}`}>
                      <div className="text-[15px] font-medium text-[#0b1220]">{r.title}</div>
                      {r.summary && <div className="text-sm text-slate-600 line-clamp-2">{r.summary}</div>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>

        <div className="mt-8">
          <NextBookingBar />
        </div>
    </main>
  );
}
