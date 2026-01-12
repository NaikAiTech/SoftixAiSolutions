import React from "react";
import { SERVICE_AREAS } from "@/lib/locations";

const BRAND_PRIMARY = "#00A982";
const BRAND_PRIMARY_HOVER = "#008F70";
const BRAND_MINT = "#E6F6F2";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#F9FAFB";
const SURFACE = "#FFFFFF";

// Inline icons (no external libs)
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

function findCity(countrySlug: string, citySlug: string){
  const sa = SERVICE_AREAS.find((s)=> s.countrySlug===countrySlug);
  const city = sa?.cities.find((c)=> c.slug===citySlug);
  return { sa, city } as const;
}

export async function generateStaticParams(){
  const out: Array<{ country: string; city: string }> = [];
  for(const sa of SERVICE_AREAS){
    for(const c of sa.cities){ out.push({ country: sa.countrySlug, city: c.slug }); }
  }
  return out;
}

export async function generateMetadata({ params }: { params: { country: string; city: string } }){
  const { sa, city } = findCity(params.country, params.city);
  const cityName = city?.name || "City";
  const countryName = sa?.country || "";
  const title = `Online Vet in ${cityName}${countryName?`, ${countryName}`:''} – Dial A Vet`;
  const description = `Speak to a licensed online vet in ${cityName}. Same‑day video consultations for pets. Transparent pricing, fast advice.`;
  return { title, description };
}

export default async function CityPage({ params }: { params: { country: string; city: string } }){
  const { sa, city } = findCity(params.country, params.city);
  const cityName = city?.name || "City";
  const countryName = sa?.country || "";
  const areas = (city?.areas && city.areas.length ? city.areas : [cityName, `Greater ${cityName}`]);

  // Resolve native currency from country config
  const currency = sa?.currency || 'AUD';
  // Fetch FX (AUD base) on server
  let mult = 1;
  try {
    const base = process.env.NEXTAUTH_URL || '';
    const url = base ? `${base}/api/rates` : `/api/rates`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = res.ok ? await res.json() : null;
    if (currency === 'AUD') mult = 1; else if (data?.rates?.[currency]) mult = Number(data.rates[currency]) || 1;
  } catch {}
  const toCurr = (aud: number) => new Intl.NumberFormat(undefined,{ style:'currency', currency }).format(aud * mult);

  const faqs = [
    { q: `How quickly can I speak to a vet in ${cityName}?`, a: `Most consultations connect within minutes during our service hours in ${cityName}. We offer same-day appointments and work to get you help as quickly as possible when your pet needs advice.` },
    { q: `Do you have vets available 24/7 in ${cityName}?`, a: `We operate extended hours to serve ${cityName} pet owners, with availability across time zones. For true emergencies, please contact your nearest 24-hour emergency clinic.` },
    { q: `Can you prescribe medication in ${cityName}?`, a: "No, we cannot prescribe medications through our video consultations. However, we can advise whether your pet needs medication and when to visit a local veterinarian for a prescription." },
    { q: `What types of pets do you help in ${cityName}?`, a: "We specialize in cats and dogs. Our experienced veterinarians and registered veterinary nurses can help with behaviour, health concerns, nutrition, and preventive care for both species." },
    { q: `Is this the same as visiting a vet clinic in ${cityName}?`, a: "Dial A Vet provides professional veterinary advice through video consultations, but we cannot perform physical examinations, run diagnostic tests, or prescribe medications. We’re ideal for non‑emergency questions and guidance, and we’ll let you know if in‑person care is needed." },
    { q: `How much does it cost for pet owners in ${cityName}?`, a: `Our pricing is transparent and more affordable than in‑clinic visits. See the current rates on our Pricing page; native currency is shown automatically for ${cityName}.` },
    { q: `What if my pet needs an in‑person visit in ${cityName}?`, a: `Our vets will help you decide if your pet needs in‑person care. We explain what to expect and how urgent it is, so you can plan the right next step in ${cityName}.` },
    { q: `Do you offer follow‑up support after a consult in ${cityName}?`, a: "You’ll receive a written summary with guidance and next steps. You can book another consult any time if new questions arise." },
    { q: `How do I prepare for my online vet consult in ${cityName}?`, a: "Have your pet nearby, note symptoms and timelines, and gather any meds or records you want to discuss. A well‑lit room helps the vet assess visuals over video." },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <section className="text-center mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm" style={{ color: TEXT_MUTED }}>
            <span>{cityName}{countryName ? `, ${countryName}` : ''}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Need to See a Vet in {cityName}?</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg" style={{ color: TEXT_MUTED }}>
            Speak to our global vet team in minutes. Get expert veterinary advice for your pet anytime, day or night.
          </p>
          <div className="mt-6">
            <a href="/book-a-vet-consultation" className="rounded-full px-6 py-3 text-white text-sm font-medium shadow-sm" style={{ backgroundColor: BRAND_PRIMARY }}>
              Book Consultation Now
            </a>
            <p className="mt-3 text-xs" style={{ color: TEXT_MUTED }}>
              Available {currency === 'AUD' ? 'most hours' : 'extended hours'} • Quick & Easy Booking
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8 text-sm">
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <span style={{ color: BRAND_PRIMARY }}>✔</span> Licensed Vets
            </span>
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <span style={{ color: BRAND_PRIMARY }}>✔</span> Available Same‑Day
            </span>
            <span className="inline-flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <span style={{ color: BRAND_PRIMARY }}>✔</span> Transparent Pricing
            </span>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-2">Online Vets Available Now in {cityName}</h2>
          <p className="text-center max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
            Connect with licensed veterinarians and vet nurses from the comfort of your home in {cityName}.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Clock style={{ color: BRAND_PRIMARY }} />, title: "Extended Hours", text: `Whether it's morning or late night, our team is here for ${cityName} pets.` },
              { icon: <Camera style={{ color: BRAND_PRIMARY }} />, title: "Video Consultations", text: "Book a professional video consult from the comfort of your home." },
              { icon: <Bubble style={{ color: BRAND_PRIMARY }} />, title: "Expert Guidance", text: "Clear next steps, home care tips, and when to visit a clinic." },
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
          <h2 className="text-3xl font-medium mb-2">Available Across {cityName} and Surrounding Areas</h2>
          <p className="max-w-3xl mx-auto" style={{ color: TEXT_MUTED }}>
            Dial A Vet provides veterinary consultation services to pet owners across {cityName} and nearby areas, including:
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {areas.map((a) => (
              <span key={a} className="rounded-full px-4 py-2 text-sm" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_DARK }}>
                {a}
              </span>
            ))}
          </div>
          <p className="mt-6 italic text-sm" style={{ color: TEXT_MUTED }}>
            No matter where you are in the {cityName} area, Dial A Vet is here to help with your pet’s health questions.
          </p>
        </section>

        {/* PRICING: Single package */}
        <section className="mb-20">
          <h2 className="text-center text-3xl font-medium mb-10">Transparent Pricing in {cityName}</h2>
          <div className="mx-auto w-full max-w-[542px]">
            <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-8 md:p-12 text-center" style={{ borderColor: BORDER }}>
              <div className="mb-8">
                <h3 className="text-2xl font-normal mb-4" style={{ color: TEXT_DARK }}>One-off Consultation</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl md:text-6xl font-normal" style={{ color: TEXT_DARK }}>{toCurr(49)}</span>
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
          <h2 className="text-center text-3xl font-medium mb-10">Getting Started with Dial A Vet in {cityName}</h2>
          <div className="grid gap-6">
            {[
              { n: 1, title: "Book Your Consultation", text: `Choose a time that works for you. Enter your mobile number and tell us about your pet's concern in ${cityName}.` },
              { n: 2, title: "Connect with a Licensed Vet", text: "Our global veterinary team will review your pet's information and connect with you via video call." },
              { n: 3, title: "Get Expert Advice", text: `Receive clear next steps, whether it's home care tips or whether you need to visit a local vet clinic in ${cityName}.` },
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
          <h2 className="text-center text-3xl font-medium mb-8">What {cityName} Pet Owners Ask Us</h2>
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
          <h3 className="text-2xl font-medium">Start Your Vet Consultation in {cityName}</h3>
          <p className="mt-2" style={{ color: TEXT_MUTED }}>
            Join thousands of pet owners in {cityName} who trust Dial A Vet for reliable veterinary advice.
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
            Dial A Vet provides veterinary guidance and consultation services but is not a substitute for professional in‑person veterinary care. For emergencies or serious health concerns in {cityName}, please contact your local veterinarian or emergency animal hospital immediately. Always consult with a licensed veterinarian for diagnosis and treatment.
          </p>
        </section>
      </div>
    </div>
  );
}
