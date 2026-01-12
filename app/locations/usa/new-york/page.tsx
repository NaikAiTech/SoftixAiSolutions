import React from "react";

const BRAND_PRIMARY = "#00A982";
const BRAND_PRIMARY_HOVER = "#008F70";
const BRAND_MINT = "#E6F6F2";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#F9FAFB";
const SURFACE = "#FFFFFF";

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const Pin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);
const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const Camera = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <circle cx="12" cy="14" r="4" />
  </svg>
);
const Bubble = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M21 15a4 4 0 01-4 4H9l-6 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
  </svg>
);

export const dynamic = 'force-dynamic';

export default async function NewYorkCityPage() {
  const areas = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island",
    "Long Island City",
    "Williamsburg",
    "Astoria",
  ];

  // Fetch live FX rates on the server (AUD base), then render USD
  const base = process.env.NEXTAUTH_URL || '';
  let usdMult = 1;
  try {
    const res = await fetch(`${base}/api/rates`, { cache: 'no-store' });
    const data = res.ok ? await res.json() : null;
    if (data?.rates && typeof data.rates.USD === 'number') usdMult = Number(data.rates.USD) || 1;
  } catch {}
  const usd = (aud: number) => new Intl.NumberFormat(undefined,{ style:'currency', currency:'USD' }).format(aud * usdMult);

  const faqs = [
    { q: "How quickly can I speak to a vet in New York?", a: "Most consultations connect within minutes during our service hours. We offer same-day appointments and work to get you help as quickly as possible when your pet needs advice." },
    { q: "Do you have vets available 24/7 in New York?", a: "With our global team of veterinarians and nurses from multiple countries, we offer extended hours to serve New York pet owners. Check our booking system for current availability. For true emergencies, please contact your nearest 24-hour emergency vet clinic." },
    { q: "Can you prescribe medication?", a: "No, we cannot prescribe medications through our video consultations. However, we can provide advice on your pet's condition and recommend whether a clinic visit is needed for prescription medication." },
    { q: "What types of pets do you help in New York?", a: "We specialize in cats and dogs. Our experienced team of veterinarians and registered veterinary nurses can help with behavioral questions, health concerns, nutrition advice, and preventive care for both species." },
    { q: "Is this the same as visiting a vet clinic?", a: "Dial A Vet provides professional veterinary advice through video consultations, but we cannot perform physical examinations, run diagnostic tests, or prescribe medications. We're ideal for non-emergency questions and guidance, and we'll let you know if your pet needs in-person care." },
    { q: "How much does it cost for pet owners in New York?", a: "We have extended hours to serve pet owners globally, with vets available most hours of the day. Book a consultation to see our next available appointment times." },
    { q: "Can I get a prescription from an online vet in New York?", a: "No, we cannot provide prescriptions through our online consultation service. However, our vets can advise you on whether your pet needs medication and guide you to visit a local veterinarian who can provide a prescription if needed." },
    { q: "What if my pet needs an in-person visit in New York?", a: "Our vets will help you determine if your pet needs in-person care. We provide clear guidance on when to visit a local clinic and what to expect, helping you make informed decisions about your pet's health." },
    { q: "How much does a vet consultation cost in New York?", a: "Our consultations are priced affordably compared to in-clinic visits. Check our pricing page for current rates. We believe in transparent pricing with no hidden fees." },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <section className="text-center mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm" style={{ color: TEXT_MUTED }}>
            <Pin style={{ color: TEXT_MUTED }} /> New York, USA
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Need to See a Vet in New York?</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg" style={{ color: TEXT_MUTED }}>
            Speak to our global vet team in minutes. Get expert veterinary advice for your pet anytime, day or night.
          </p>
          <div className="mt-6">
            <a href="/book-a-vet-consultation" className="rounded-full px-6 py-3 text-white text-sm font-medium shadow-sm" style={{ backgroundColor: BRAND_PRIMARY }}>
              Book Consultation Now
            </a>
            <p className="mt-3 text-xs" style={{ color: TEXT_MUTED }}>
              Available 24/7 • Quick & Easy Booking
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8 text-sm">
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <Check style={{ color: BRAND_PRIMARY }} /> Licensed Vets
            </span>
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <Check style={{ color: BRAND_PRIMARY }} /> Available 24/7
            </span>
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <Check style={{ color: BRAND_PRIMARY }} /> Same‑Day Appointments
            </span>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-2">Online Vets Available Now in New York</h2>
          <p className="text-center max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
            Connect with licensed veterinarians and vet nurses from the comfort of your home in New York.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock style={{ color: BRAND_PRIMARY }} />, title: "24/7 Availability", text:
                  "Whether it's 3 AM or 3 PM, our global vet team is here to help when your pet needs support in New York.",
              },
              {
                icon: <Camera style={{ color: BRAND_PRIMARY }} />, title: "Video Consultations", text:
                  "Book an appointment with our licensed vets. Professional video consultations from the comfort of your home.",
              },
              {
                icon: <Bubble style={{ color: BRAND_PRIMARY }} />, title: "Expert Guidance", text:
                  "Professional veterinary advice from licensed vets. Clear pricing with no hidden fees or surprise charges.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl p-6" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: BRAND_MINT, color: BRAND_PRIMARY }}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-medium mb-1">{c.title}</h3>
                <p className="text-sm" style={{ color: TEXT_MUTED }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AREAS */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-medium mb-2">Available Across New York and Surrounding Areas</h2>
          <p className="max-w-3xl mx-auto" style={{ color: TEXT_MUTED }}>
            Dial A Vet provides 24/7 veterinary consultation services to pet owners across New York and surrounding areas, including:
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {areas.map((a) => (
              <span key={a} className="rounded-full px-4 py-2 text-sm" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_DARK }}>
                {a}
              </span>
            ))}
          </div>
          <p className="mt-6 italic text-sm" style={{ color: TEXT_MUTED }}>
            No matter where you are in the New York area, Dial A Vet is here to help with your pet’s health questions.
          </p>
        </section>

        {/* PRICING: Single package */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-10">Transparent Pricing in New York</h2>
          <div className="mx-auto w-full max-w-[542px]">
            <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-8 md:p-12 text-center" style={{ borderColor: BORDER }}>
              <div className="mb-8">
                <h3 className="text-2xl font-normal mb-4" style={{ color: TEXT_DARK }}>One-off Consultation</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl md:text-6xl font-normal" style={{ color: TEXT_DARK }}>{usd(49)}</span>
                </div>
                <p className="text-sm" style={{ color: TEXT_MUTED }}>Per video consultation</p>
              </div>
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {["15-minute video consultation with global vet team","Same-day appointments available","Written consultation summary","Treatment guidance and recommendations","No subscription required"].map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span className="text-sm" style={{ color: TEXT_DARK }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/book-a-vet-consultation">
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm h-11 rounded-full w-full sm:w-auto px-12 text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                  Book Now
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-10">Getting Started with Dial A Vet in New York</h2>
          <div className="grid gap-6">
            {[
              { n: 1, title: "Book Your Consultation", text: "Choose a time that works for you. Enter your mobile number and tell us about your pet's concern in New York." },
              { n: 2, title: "Connect with a Licensed Vet", text: "Our global veterinary team will review your pet's information and connect with you via video call." },
              { n: 3, title: "Get Expert Advice", text: "Receive clear next steps, whether it's home care tips or whether you need to visit a local vet clinic in New York." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ backgroundColor: BRAND_PRIMARY }}>{s.n}</span>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="text-sm" style={{ color: TEXT_MUTED }}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-8">What New York Pet Owners Ask Us</h2>
          <div className="mx-auto max-w-3xl">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b py-4" style={{ borderColor: BORDER }}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                  {f.q}
                  <span className="text-xl leading-none select-none" style={{ color: TEXT_MUTED }}>▾</span>
                </summary>
                <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>{f.a}</p>
              </details>
            ))}
            <div className="mt-8 text-center">
            <a href="/book-a-vet-consultation" className="rounded-full px-5 py-2 text-white text-sm" style={{ backgroundColor: "#111827" }}>
                Book a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center mb-8">
          <h3 className="text-2xl font-medium">Start Your Vet Consultation in New York</h3>
          <p className="mt-2" style={{ color: TEXT_MUTED }}>
            Join thousands of pet owners in New York who trust Dial A Vet for reliable veterinary advice.
          </p>
          <div className="mt-4">
            <a href="/book-a-vet-consultation" className="rounded-full px-6 py-3 text-white text-sm font-medium" style={{ backgroundColor: BRAND_PRIMARY }}>
              Book Consultation Now
            </a>
          </div>
          <p className="mt-3 text-xs" style={{ color: TEXT_MUTED }}>
            Available 24/7 • Licensed Veterinarians • Professional Care
          </p>
        </section>

        {/* DISCLAIMER FOOTER */}
        <section className="mt-10 border-t pt-6 text-center text-xs" style={{ borderColor: BORDER, color: TEXT_MUTED }}>
          <p>Important Medical Disclaimer</p>
          <p className="mt-2 max-w-3xl mx-auto">
            Dial A Vet provides veterinary guidance and consultation services but is not a substitute for professional in‑person veterinary care. For emergencies or serious health concerns in New York, please contact your local veterinarian or emergency animal hospital immediately. Always consult with a licensed veterinarian for diagnosis and treatment.
          </p>
        </section>
      </div>
    </div>
  );
}
