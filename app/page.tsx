"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TitleFocusSwap from "@/components/TitleFocusSwap";

const GlobalStyles = () => null;

const BRAND_PRIMARY = "#00A982"; // Dial A Vet green

const PillBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm shadow-sm">{children}</span>
);

const RotatingWords = ({ words, interval = 2400 }: { words: string[]; interval?: number }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => { const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval); return () => clearInterval(id); }, [words, interval]);
  return (
    <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent whitespace-nowrap text-5xl sm:text-6xl md:text-7xl mt-2">{words[index]}</span>
  );
};

const NextAvailable = () => {
  const tzList = [
    'Australia/Sydney','Australia/Melbourne','Australia/Brisbane','Australia/Adelaide','Australia/Darwin','Australia/Perth',
    'Pacific/Auckland','Europe/London','Europe/Dublin',
    'America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Phoenix','America/Anchorage','Pacific/Honolulu',
    'America/Toronto','America/Winnipeg','America/Edmonton','America/Vancouver','America/Halifax','America/St_Johns'
  ];
  const [tz, setTz] = useState<string | null>(null);
  const [nextIso, setNextIso] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  useEffect(()=>{
    let cancelled=false;
    (async ()=>{
      try {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const [meResp, adminResp] = await Promise.all([
          fetch('/api/me').then(r=> r.ok ? r.json() : null).catch(()=>null),
          fetch('/api/admin/settings?public=1').then(r=> r.ok ? r.json() : null).catch(()=>null),
        ]);
        const paramTz = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('tz') : null;
        const pick = (v?: string | null) => v && tzList.includes(v) ? v : null;
        const chosen = pick(paramTz) || pick(meResp?.user?.timezone) || pick(adminResp?.defaultTimezone) || pick(localTz) || tzList[0];
        if (!cancelled) setTz(chosen);
        const data:any = await fetch(`/api/calendly/next?count=1&timezone=${encodeURIComponent(chosen)}`, { cache: 'no-store' }).then(r=> r.ok? r.json(): null).catch(()=>null);
        const items: string[] = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setNextIso(items[0] || null);
      } catch {}
    })();
    return ()=>{cancelled=true};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const renderCountdown = () => {
    if (!nextIso) return 'Loading…';
    const diffMs = new Date(nextIso).getTime() - nowTick;
    if (diffMs <= 0) return 'Available now';
    const totalMin = Math.ceil(diffMs / 60000);
    const days = Math.floor(totalMin / (60 * 24));
    const hours = Math.floor((totalMin % (60 * 24)) / 60);
    const mins = totalMin % 60;
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    return `in ${parts.join(' ')}`;
  };

  return (
    <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 backdrop-blur">
      <Image src="/landing/illustrations/avatar-vet.svg" alt="vet" width={28} height={28} className="h-7 w-7 rounded-full" />
      <span className="text-sm text-gray-700">Next <em className="italic">available</em> appointment</span>
      <a className="no-underline" href={`/book-a-vet-consultation`}><PillBadge>{renderCountdown()}</PillBadge></a>
      <a href={`/book-a-vet-consultation`} className="ml-auto rounded-full px-3 py-1 text-sm text-white shadow-sm" style={{ backgroundColor: BRAND_PRIMARY }}>Schedule my appointment</a>
    </div>
  );
};

const Hero = () => (
  <section className="relative overflow-hidden text-left">
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:pb-16 md:pt-8">
      <div className="mb-2 text-sm text-gray-600">Dial A Vet</div>
      <h1 className="h1">Trusted Online Care <span className="dog-wiggle ml-2">🐶</span></h1>
      <RotatingWords words={["Global Vet Team","Rated 4.9/5 Stars","Over 40,000 Pet Owners"]} />
      <p className="mt-4 max-w-2xl lead">Access a team of Global Vets in minutes — no waiting room, clear next steps, and help deciding if you need an in-clinic visit.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/book-a-vet-consultation" className="btn">Schedule my appointment →</a>
        <PillBadge>ℹ️ $49 consults</PillBadge>
        <PillBadge>⭐ Excellent 4.9</PillBadge>
      </div>
    </div>
  </section>
);

const ServiceCard = ({ title, subtitle, icon, cta = "Book now", href = "/booking" }: { title: string; subtitle: string; icon: string; cta?: string; href?: string }) => (
  <div className="card relative h-full overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
    <div className="flex items-center gap-3 border-b border-black/5 p-4">
      <div className="text-2xl">{icon}</div>
      <div className="text-base text-gray-900">{title}</div>
    </div>
    <div className="flex h-56 flex-col justify-between p-6">
      <p className="max-w-[22rem] text-sm text-gray-600">{subtitle}</p>
      <div>
        <a href={href} className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">{cta}</a>
      </div>
    </div>
  </div>
);

const Services = () => (
  <section className="mx-auto mt-4 max-w-7xl px-4 pb-8">
    <div className="mb-6 flex items-end justify-between">
      <h2 className="text-xl tracking-tight text-gray-900">How can we help you?</h2>
      {/* Removed duplicate schedule CTA per note */}
    </div>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <ServiceCard title="Book a telehealth consult" subtitle="Video call with a Global Veterinary Professional for triage, treatment guidance, and peace of mind." icon="📞" />
      <ServiceCard title="Your Questions Answered" subtitle="Practical answers to the internet’s most-Googled pet questions." icon="✅" cta="Read articles" href="/vet-answer" />
      <ServiceCard title="Pet Health Guidance" subtitle="Vet-written guides on symptoms, home care, and when to see a clinic." icon="💊" cta="Explore guides" href="/blog" />
      <ServiceCard title="AI Vet Chat" subtitle="Free to use AI vet Chat powered by Dial A Vet." icon="💬" cta="Chat Now ->" href="https://vetzo.ai" />
    </div>
  </section>
);

const PartnersStrip = () => (
  <section className="mx-auto max-w-7xl px-4">
    <div
      className="card rounded-3xl border border-black/5 bg-white/80 px-6 py-8 backdrop-blur"
      style={{
        backgroundImage: "url('/badges/background.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="grid grid-cols-2 items-center justify-items-center gap-10 sm:grid-cols-5">
        {["/badges/Finder_Winner_Digital_019000_Finder Awards.png", "/badges/MadPaws.png"].map((src, idx) => (
          <div key={src} className="flex h-20 w-full items-center justify-center sm:justify-end overflow-visible">
            <Image
              src={src}
              alt={`Partner badge ${idx + 1}`}
              width={140}
              height={140}
              className="object-contain drop-shadow-sm"
              style={{ width: 140, height: 140 }}
            />
          </div>
        ))}
        <div className="hidden sm:block" aria-hidden="true" />
        {["/badges/RSPCA.png", "/badges/YAHOO.png"].map((src, idx) => (
          <div key={src} className="flex h-20 w-full items-center justify-center sm:justify-start">
            <Image
              src={src}
              alt={`Partner badge ${idx + 3}`}
              width={150}
              height={80}
              className="max-h-20 min-h-[5rem] w-auto object-contain drop-shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TrustBar = () => (
  <section className="mx-auto mt-4 max-w-7xl px-4">
    <div className="card rounded-3xl border border-black/5 bg-white/70 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Image src="/badges/trustpilot.svg" alt="Trustpilot" width={120} height={32} className="h-8 w-auto" />
          <span>Excellent</span>
          <span className="text-gray-500">• 4.9 out of 5 •</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🗓️</span>
          <span>Same-day appointments • Open late</span>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mx-auto w-full max-w-[542px]">
        <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-8 md:p-12 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-normal mb-4">One-off Consultation</h3>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl md:text-6xl font-normal">A$49</span>
            </div>
            <p className="text-sm text-gray-600">Per video consultation</p>
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
                <span className="text-sm text-gray-900">{f}</span>
              </div>
            ))}
          </div>
          <a href="/booking">
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm h-11 rounded-full w-full sm:w-auto px-12 text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
              Book Now
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

const StoryBanner = () => (
  <section className="mx-auto my-8 max-w-7xl px-4">
    <div className="relative rounded-3xl px-6 py-14 [background:radial-gradient(900px_900px_at_center,_#b8f3da_0%,_#eafaf2_45%,_#ffffff_90%)]">
      <div className="mx-auto flex w-full max-w-5xl items-start justify-center">
        <div className="relative w-72">
          <div className="relative w-72 rounded-[3rem] border-[12px] border-black/80 bg-black shadow-2xl">
            <Image
              src="/hero/zoe.png"
              alt="Vet on video call"
              width={600}
              height={500}
              className="h-[500px] w-full rounded-[2.4rem] object-cover"
            />
            <div className="absolute top-0 left-1/2 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
          </div>
          <div className="floaty absolute -left-56 top-8 hidden w-56 rounded-2xl bg-white/90 backdrop-blur p-3 text-sm shadow-xl ring-1 ring-black/5 md:block">⏱️ Zoe connected with a vet in 6 minutes</div>
          <div className="floaty absolute -left-56 bottom-24 hidden w-56 rounded-2xl bg-white/90 backdrop-blur p-3 text-sm shadow-xl ring-1 ring-black/5 md:block [animation-delay:1s]">🩺 Dial A Vet triaged Milo & gave a home plan</div>
          <div className="floaty absolute -right-56 top-16 hidden w-56 rounded-2xl bg-white/90 backdrop-blur p-3 text-sm shadow-xl ring-1 ring-black/5 md:block [animation-delay:0.5s]">🐾 Milo had issues with his paw pad</div>
          <div className="floaty absolute -right-56 bottom-10 hidden w-56 rounded-2xl bg-white/90 backdrop-blur p-3 text-sm shadow-xl ring-1 ring-black/5 md:block [animation-delay:1.5s]">💊 Products: antiseptic wash, booties, moisturiser</div>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-md rounded-3xl bg-white/80 backdrop-blur p-6 text-sm shadow-md">
        <h3 className="mb-3 text-xl text-gray-900">Cost breakdown</h3>
        <ul className="space-y-1 text-gray-700">
          <li className="flex justify-between"><span>Clinic quote</span><span>$897</span></li>
          <li className="flex justify-between"><span>Consult with Dial A Vet</span><span>$49</span></li>
          <li className="flex justify-between"><span>Products from chemist</span><span>$27</span></li>
          <li className="flex justify-between border-t pt-2 text-emerald-700"><span>Total</span><span>$76</span></li>
        </ul>
        <div className="mt-3 inline-block rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-sm">Saved $821 compared to clinic</div>
      </div>
      <div className="mx-auto mt-4 grid w-full max-w-2xl gap-2 md:hidden">
        {["⏱️ Zoe connected with a vet in 6 minutes","🐾 Milo had issues with his paw pad","🩺 Dial A Vet triaged Milo & gave a home plan","💊 Products: antiseptic wash, booties, moisturiser"].map((t,i)=> (
          <div key={i} className="rounded-2xl bg-white/90 backdrop-blur p-3 text-sm shadow-sm ring-1 ring-black/5">{t}</div>
        ))}
      </div>
    </div>
  </section>
);

const Topics = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <h3 className="mb-6 text-center text-2xl">Speak to our Vets About</h3>
    <div className="card rounded-3xl bg-white/90 p-6 backdrop-blur">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {["Allergy","Ancestry DNA Results","Anxiety","Arthritis/joints","Behavioral","Coughing","Diarrhea","Diet & nutrition","Digestive","Ears","Eyes","Flea & tick","Hair loss","Itching","Preventive care","Respiratory","Shaking","Skin","Teeth","Urinary health","Vomiting","Weight","Other"].map((t) => (
          <div key={t} className="rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm text-gray-800 shadow-sm">{t}</div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => (
  <section className="mx-auto max-w-5xl px-4 py-10">
    <h3 className="mb-6 text-2xl tracking-tight">Questions</h3>
    <div className="space-y-2">
      {[
        { q: "Is Dial A Vet an app or a website?", a: "We’re a web-first service - no downloads needed. Book, join your video consult, and receive your summary via email." },
        { q: "Can I use Dial A Vet if I don’t have a regular clinic?", a: "Yes. We help with triage and a plan. If hands-on care is needed, we’ll point you to a nearby clinic." },
        { q: "How do you compare to a clinic visit?", a: "We’re great for non-urgent issues, second opinions, and after-hours questions. For emergencies, go to your nearest clinic immediately." },
        { q: "Who are your vets?", a: "Licensed veterinarians and experienced vet nurses from our Global Vet Team. All with a minimum of 5 years of small-animal experience." },
        { q: "What can’t you do?", a: "We don’t prescribe or diagnose conditions that require a hands-on exam. We provide advice, triage, and guidance." },
        { q: "Do you offer after-hours appointments?", a: "Yes - we operate extended hours and often have same-day evening slots." },
        { q: "Can you prescribe medication?", a: "We provide product and OTC guidance. Prescriptions require an in-person exam under local regs." },
        { q: "What if my pet needs a clinic visit?", a: "We’ll advise when to go and help you find a nearby clinic." },
        { q: "Do you handle emergencies?", a: "For urgent or life-threatening situations, go to your nearest emergency clinic immediately." },
        { q: "Which pets do you support?", a: "Dogs and cats are our focus today; more species are coming soon." },
      ].map(({ q, a }, i) => (
        <details key={i} className="rounded-2xl bg-white p-4">
          <summary className="cursor-pointer text-base">{q}</summary>
          <div className="mt-2 text-gray-700">{a}</div>
        </details>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="mx-auto max-w-7xl px-4 pb-20">
    <div className="card rounded-3xl border border-black/5 bg-white p-6 text-sm text-gray-600">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-black/10 px-3 py-1">ISO 27001</span>
        <span className="rounded-full border border-black/10 px-3 py-1">ISO 9001</span>
      </div>
      <p className="mb-2">General advice only - we don’t prescribe, diagnose, or replace in-clinic care. If your pet needs urgent help, visit your nearest emergency vet.</p>
      <p>© {new Date().getFullYear()} Dial A Vet • Made for pet owners across the world</p>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <main className="dialavet min-h-screen bg-[#F5F7F6] text-gray-900">
      <GlobalStyles />
      <TitleFocusSwap />
      <NextAvailable />
      <Hero />
      <Services />
      <PartnersStrip />
      <TrustBar />
      <Pricing />
      <StoryBanner />
      <Topics />
      <FAQ />
      <Footer />
    </main>
  );
}
