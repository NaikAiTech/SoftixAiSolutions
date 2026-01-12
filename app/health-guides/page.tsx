import React from "react";

// Brand palette
const BRAND_PRIMARY = "#00A982";
const BRAND_MINT = "#E6F6F2";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#F9FAFB";
const SURFACE = "#FFFFFF";

// Simple icon set
const Chat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M21 15a4 4 0 01-4 4H9l-6 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
  </svg>
);
const Steth = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M6 3v6a4 4 0 008 0V3" />
    <path d="M12 17a5 5 0 005 5 5 5 0 005-5v-1a2 2 0 10-4 0v1" />
  </svg>
);
const Doc = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

function Card({ title, desc, href, icon, tint }: { title: string; desc: string; href: string; icon: React.ReactNode; tint?: string; }) {
  return (
    <a
      href={href}
      className="block rounded-2xl p-6 transition-shadow"
      style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: tint || BRAND_MINT, color: BRAND_PRIMARY }}>
        {icon}
      </div>
      <h3 className="text-xl" style={{ color: TEXT_DARK }}>{title}</h3>
      <p className="mt-1 text-sm" style={{ color: TEXT_MUTED }}>{desc}</p>
      <span className="mt-5 inline-block text-sm" style={{ color: BRAND_PRIMARY }}>Explore {title} →</span>
    </a>
  );
}

export const metadata = {
  title: "Health Guides – Dial A Vet",
  description: "Expert veterinary advice, answers, and resources for your pet’s health and wellbeing.",
};

export default function HealthGuidesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl">Health Guides</h1>
          <p className="mt-3 max-w-3xl mx-auto text-lg" style={{ color: TEXT_MUTED }}>
            Expert veterinary advice, answers to common questions, and helpful resources for your pet’s health and wellbeing
          </p>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card
            title="Ask A Vet"
            desc="Common pet health questions answered by our veterinary experts"
            href="/ask-a-vet"
            icon={<Chat />}
          />
          <Card
            title="Vet Answers"
            desc="In-depth veterinary advice and professional insights"
            href="/vet-answer"
            icon={<Steth />}
          />
          <Card
            title="Blog"
            desc="Latest articles, tips, and news about pet health and wellness"
            href="/blog"
            icon={<Doc />}
          />
        </section>

        {/* CTA Banner */}
        <section
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <h2 className="text-2xl">Need Personalized Advice?</h2>
          <p className="mt-2 max-w-3xl mx-auto" style={{ color: TEXT_MUTED }}>
            While our guides provide valuable information, every pet is unique. Book a consultation with our licensed veterinarians for personalized advice.
          </p>
          <div className="mt-6">
            <a
              href="/book-a-vet-consultation"
              className="inline-block rounded-full px-6 py-3 text-white text-sm"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              Book a Consultation
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
