import NextBookingBar from "@/components/NextBookingBar";
import FreeConsultBanner from "@/components/FreeConsultBanner";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const base = process.env.NEXTAUTH_URL || '';
  let item: any = null;
  let res = await fetch(`${base}/api/ask-a-vet/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
  if (res && res.ok) {
    ({ item } = await res.json());
  } else {
    // Try internal endpoint as fallback
    res = await fetch(`${base}/api/ask-a-vet/internal/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
    if (res && res.ok) ({ item } = await res.json());
  }
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.dialavet.com').replace(/\/$/, '');
  const slug = item?.slug || params.slug;
  const url = `${siteBase}/ask-a-vet/${encodeURIComponent(slug)}`;
  const question = item?.question as string | undefined;
  const ownerBody = (item?.ownerBody || item?.owner_body || item?.metaDescription) as string | undefined;
  const title = question ? `${question} | Dial A Vet` : 'Ask a Vet | Dial A Vet';
  const description = ownerBody ? String(ownerBody).replace(/\s+/g, ' ').trim().slice(0, 300) : 'Get fast, expert guidance from our global vet team.';
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  } as any;
}

export default async function AskAVetDetailPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/ask-a-vet/internal/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
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
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.dialavet.com').replace(/\/$/, '');
  const canonicalUrl = `${siteBase}/ask-a-vet/${encodeURIComponent(item.slug)}`;
  const qaLd: any = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: item.question || undefined,
      text: item.ownerBody || undefined,
      answerCount: item.answer ? 1 : 0,
      datePublished: undefined,
      author: { '@type': 'Person', name: 'Pet Owner' },
      acceptedAnswer: item.answer ? {
        '@type': 'Answer',
        text: (item.answer as string).replace(/<[^>]+>/g, '').slice(0, 5000),
        upvoteCount: 0,
        url: canonicalUrl,
        author: { '@type': 'Person', name: 'Dial A Vet', url: `${siteBase}/about` },
      } : undefined,
    },
  };
  return (
    <main className="mx-auto w-full max-w-3xl bg-[#f7f7f8] px-4 py-8 lg:py-10">
      {/* JSON-LD Schema for QAPage */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaLd) }}
      />
      {/* Question */}
      <section className="mb-6 space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-[#0b1220] md:text-3xl">{item.question}</h1>
        {item.ownerBody && (
          <p className="text-sm text-[#6b7280] md:text-base">{item.ownerBody}</p>
        )}
      </section>

      {/* Answer */}
      <section className="mb-4 space-y-4">
        <FreeConsultBanner source={`ask-a-vet:${item.slug || ""}`} />
        <div>
          <h2 className="mb-3 text-lg font-medium text-[#0b1220]">Answer</h2>
          <div className="rounded-2xl border border-black/10 bg-white">
            <article className="prose dav-article max-w-none p-6" dangerouslySetInnerHTML={{ __html: item.answer || "" }} />
          </div>
        </div>
      </section>

      {/* Consult CTA + Appointment bar */}
      <NextBookingBar />
    </main>
  );
}
