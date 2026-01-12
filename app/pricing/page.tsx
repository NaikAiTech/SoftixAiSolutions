import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Brand palette (static so Tailwind does not purge classes)
const BRAND_PRIMARY = "#00A982"; // Dial A Vet green
const BRAND_PRIMARY_HOVER = "#008F70";
const BRAND_MINT = "#E6F6F2"; // soft mint highlight
const TEXT_DARK = "#111827"; // near-black text
const TEXT_MUTED = "#4B5563"; // body/labels
const SURFACE = "#FFFFFF";
const PAGE_BG = "#F9FAFB"; // light gray page background

export const metadata = {
  title: "Pricing – Dial A Vet",
  description: "Simple, transparent pricing for per-consult bookings. No memberships.",
};

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  // Single package only (AUD)

  const faqs = [
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit and debit cards through our secure payment processor, Stripe.",
    },
    {
      q: "Is there a refund policy?",
      a: "Refunds are available if you cancel before your scheduled appointment.",
    },
    {
      q: "Can I book for multiple pets?",
      a: "Yes! Each consultation can cover multiple pets. Just let the vet know at the start of your call.",
    },
    {
      q: "Do you offer business or partner pricing?",
      a: "Yes, we offer special pricing for businesses and partners. Contact us to discuss custom pricing options.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header from provided HTML */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-normal mb-6 text-foreground">Simple, Transparent Pricing</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">One flat rate for professional veterinary consultations. No subscriptions, no hidden fees.</p>
            </div>
          </div>
        </section>
        {/* Single Package */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto w-full max-w-[542px]">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 md:p-12 text-center">
              <div className="mb-8">
                <h2 className="text-2xl font-normal mb-4 text-foreground">One-off Consultation</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl md:text-6xl font-normal text-foreground">A$49</span>
                </div>
                <p className="text-muted-foreground">Per video consultation</p>
              </div>
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {[
                  "15-minute video consultation with global vet team",
                  "Same-day appointments available",
                  "Written consultation summary",
                  "Treatment guidance and recommendations",
                  "No subscription required",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
                <a href="/book-a-vet-consultation">
                  <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm h-11 rounded-full w-full sm:w-auto px-12 text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                    Book Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Compare Plans removed (memberships deprecated) */}

        {/* FAQs */}
        <section className="mb-20">
          <h2 className="text-2xl text-center mb-6">Pricing FAQs</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border p-4" style={{ borderColor: "#E5E7EB", backgroundColor: SURFACE }}>
                <summary className="cursor-pointer list-none">{f.q}</summary>
                <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA (use our links) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-normal mb-4 text-foreground">Ready to Speak with a Vet?</h2>
              <p className="text-muted-foreground mb-8">Book your consultation now or learn more about how Dial A Vet works</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/book-a-vet-consultation">
                  <Button className="h-11 px-8 rounded-full text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                    Book Consultation
                  </Button>
                </a>
                <a href="/how-to-book-an-online-vet-consultation">
                  <Button variant="outline" className="h-11 px-8 rounded-full border-[#D1D5DB] text-[#111827]">
                    How It Works
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
