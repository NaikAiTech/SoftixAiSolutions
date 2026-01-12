import NextBookingBar from "@/components/NextBookingBar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/ask-a-vet/internal/${encodeURIComponent(params.slug)}`, { cache: 'no-store' }).catch(() => null);
  if (!res || !res.ok) return { title: 'Vet Answer | Dial A Vet' };
  const { item } = await res.json();
  return {
    title: item.metaTitle || `${item.question} – Vet Answer | Dial A Vet`,
    description: item.metaDescription || undefined,
  };
}

export default async function AskAVetInternalDetailPage({ params }: { params: { slug: string } }) {
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
  return (
    <main className="mx-auto w-full max-w-3xl bg-[#f7f7f8] px-4 py-8 lg:py-10">
      {/* Question */}
      <section className="mb-6 space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-[#0b1220] md:text-3xl">{item.question}</h1>
        {item.ownerBody && (
          <p className="text-sm text-[#6b7280] md:text-base">{item.ownerBody}</p>
        )}
      </section>

      {/* Answer */}
      <section className="mb-4">
        <h2 className="mb-3 text-lg font-medium text-[#0b1220]">Answer</h2>
        <div className="rounded-2xl border border-black/10 bg-white">
          <article className="prose dav-article max-w-none p-6" dangerouslySetInnerHTML={{ __html: item.answer || "" }} />
        </div>
      </section>

      {/* Consult CTA */}
      <section className="mb-4">
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-medium text-[#0b1220]">Still worried? Chat to a real vet.</h3>
            <p className="text-sm text-[#6b7280]">Book a fast telehealth consult for personalised guidance and next steps.</p>
          </div>
          <Button href="/book-a-vet-consultation" className="rounded-xl px-5 py-2.5 text-white bg-emerald-500 hover:bg-emerald-600">
            Book a consult <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Consult CTA + Appointment bar */}
      <NextBookingBar />
    </main>
  );
}
