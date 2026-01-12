"use client";
import React, { useState } from "react";

const BOOKING_URL = "https://www.dialavet.com/booking";
const MEMBERSHIP_URL = "https://www.dialavet.com/pricing";

const FX_DEFAULT: Record<string, number> = {
  AUD: 1,
  USD: 0.67,
  CAD: 0.90,
  GBP: 0.52,
  EUR: 0.61,
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

// Trial section palette and components
const trialBrand = {
  textDark: "#333333",
  textLight: "#555555",
  background: "#f8f9fa",
  cardBg: "#ffffff",
  border: "#e9ecef",
  iconCircleBg: "rgba(40, 167, 69, 0.1)",
  iconCheck: "#28a745",
} as const;

const CheckIcon = () => (
  <svg className="h-5 w-5" style={{ color: trialBrand.iconCheck }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FeatureCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border shadow-sm p-6 md:p-8 transition-all hover:shadow-md" style={{ backgroundColor: trialBrand.cardBg, borderColor: trialBrand.border }}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: trialBrand.iconCircleBg }}>
      <CheckIcon />
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: trialBrand.textDark }}>
      {title}
    </h3>
    <p className="text-sm leading-6" style={{ color: trialBrand.textLight }}>
      {children}
    </p>
  </div>
);

export default function AncestryLanding() {
  const [currency, setCurrency] = useState("AUD");
  const [fx, setFx] = useState<Record<string, number>>(FX_DEFAULT);

  React.useEffect(() => {
    fetch('/api/rates').then(r=> r.ok? r.json(): null).then((d)=>{
      if (d?.rates && typeof d.rates === 'object') setFx((prev)=> ({ ...prev, ...d.rates }));
    }).catch(()=>{});
  }, []);

  const partnerParams = "?partner=ancestry&trial=30d";
  const bookingLink = `${BOOKING_URL}${partnerParams}`;

  const concerns = [
    "Allergy","Anxiety","Arthritis","Behavioral","Coughing","Diarrhea","Diet & Nutrition","Digestive Issues","Ears","Eyes","Flea & Tick","Hair Loss","Itching","Preventive Care","Rash","Shaking","Skin Issues","Teeth","Urinary Health","Vomiting","Weight Management","Worms","Ancestry DNA Results","Vaccinations","General Checkups"
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F6]">
      <div className="w-full bg-emerald-600 text-white text-center text-sm py-2 px-4">
        Ancestry customers – get 30‑day unlimited access to Dial A Vet with your DNA/Health Kit.
      </div>

      {/* Top activate CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-3 text-center">
        <a href="/activate" className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-neutral-900">
          Activate Your Free Trial
        </a>
      </div>

      {/* Header removed per request */}

      <section className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center pb-8 mt-6 md:mt-8">
        <div>
          <p className="text-sm text-neutral-500 mb-2">Dial A Vet × Ancestry</p>
          <h1 className="text-4xl md:text-5xl tracking-tight text-neutral-900">
            Get Unlimited Online Vet Care for 30 Days
          </h1>
          <p className="mt-4 text-neutral-700 leading-7">
            Activate your complimentary 30‑day trial of Dial A Vet when you purchase or own an Ancestry DNA/Health Kit.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={bookingLink} className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-neutral-900">
              Book a consult – free with your kit
            </a>
            <a href={`${MEMBERSHIP_URL}${partnerParams}`} className="rounded-full bg-white ring-1 ring-black/10 text-neutral-900 px-6 py-3 text-sm font-medium hover:bg-white/90">
              View membership details
            </a>
          </div>
        </div>
      </section>

      {/* Trustpilot bar */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/5 p-4">
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span className="text-emerald-600 font-bold">★</span>
            <span>Trustpilot Excellent · 4.9 out of 5</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span>📅</span>
            <span>Same‑day appointments · Open late</span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <h2 className="text-2xl md:text-3xl tracking-tight text-neutral-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {title: "Get your Ancestry kit", body: "Purchase or use an existing DNA/Health Kit."},
            {title: "Activate your 30‑day trial", body: "Use this page to book your first consult and unlock unlimited access."},
            {title: "Chat with our vets", body: "Video consults for triage, treatment guidance, and home care advice."},
            {title: "Continue or cancel", body: "Keep your membership for best value or cancel anytime within 30 days."},
          ].map((s,i)=>(
            <div key={i} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-300 text-neutral-500 text-sm">{i+1}</div>
              <div className="text-neutral-900">{s.title}</div>
              <div className="text-sm text-neutral-600 mt-1">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Free trial features (replaces membership options) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3" style={{ color: trialBrand.textDark }}>
            What’s Included in Your 30‑Day Free Trial
          </h2>
          <p className="text-sm md:text-base max-w-3xl mx-auto" style={{ color: trialBrand.textLight }}>
            Experience unlimited veterinary care with no commitment. If you love Dial A Vet (we think you will), you can continue with our 1‑year or 2‑year membership options after your trial.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Unlimited Consultations", description: "Book as many video consultations as you need during your 30‑day trial period. No limits, no restrictions." },
            { title: "24/7 Access to Vets", description: "Get expert advice whenever you need it. Our qualified veterinarians are available around the clock." },
            { title: "Treatment Guidance", description: "Receive professional guidance on home care, medication, and when to seek in‑person treatment." },
            { title: "Same‑Day Appointments", description: "Book appointments quickly and get seen the same day. No long waits or delays for urgent concerns." },
            { title: "Multi‑Pet Coverage", description: "One membership covers all your pets. Get advice for dogs, cats, and other companion animals." },
            { title: "No Commitment", description: "Cancel anytime during your trial with no charges. Only continue if you love the service." },
          ].map((f) => (
            <FeatureCard key={f.title} title={f.title}>{f.description}</FeatureCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-center">
        <h2 className="text-2xl md:text-3xl tracking-tight text-neutral-900 mb-6">We Help Over 100 Concerns</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {concerns.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `hsl(${(i * 40) % 360}, 70%, 90%)`, color: `hsl(${(i * 40) % 360}, 40%, 30%)` }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 ring-1 ring-black/5 p-6">
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 w-full max-w-sm">
              <div className="font-medium mb-3">Cost Breakdown Example</div>
              <dl className="space-y-2 text-sm text-neutral-700">
                <div className="flex justify-between"><dt>Emergency Clinic Estimate</dt><dd>{formatMoney(1150 * (fx[currency] || 1), currency)}</dd></div>
                <div className="flex justify-between"><dt>Dial A Vet Membership (30‑Day Trial)</dt><dd>{formatMoney(0 * (fx[currency] || 1), currency)}</dd></div>
                <div className="flex justify-between"><dt>OTC Products</dt><dd>{formatMoney(38 * (fx[currency] || 1), currency)}</dd></div>
                <div className="border-t pt-2 flex justify-between font-medium"><dt>Total Out‑of‑Pocket</dt><dd>{formatMoney((0+38)*(fx[currency] || 1),currency)}</dd></div>
              </dl>
              <div className="mt-3 text-xs text-emerald-700">Approx. savings {formatMoney((1150-38)*(fx[currency] || 1),currency)} compared to clinic</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section removed per request */}

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="rounded-3xl bg-neutral-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl tracking-tight">Ready to Activate Your Free Trial?</h3>
          </div>
          <a href="/activate" className="rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-medium hover:bg-white/90">
            Activate Your Free Trial
          </a>
        </div>
      </section>
    </div>
  );
}
