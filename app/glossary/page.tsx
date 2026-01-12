"use client";
import React, { useMemo, useState } from "react";

// Brand palette
const BRAND_PRIMARY = "#00A982";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#F9FAFB";
const SURFACE = "#FFFFFF";

// Icons (inline to avoid external deps)
const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Note: metadata cannot be exported from a client component

// Minimal glossary seeded with entries
const RAW_ENTRIES = [
  { term: "Abscess", def: "A localized collection of pus in body tissue, usually caused by bacterial infection." },
  { term: "Acute", def: "A condition that has a sudden onset and is typically severe but short‑lived." },
  { term: "Anemia", def: "A deficiency of red blood cells or hemoglobin in the blood." },
  { term: "Arthritis", def: "Inflammation of one or more joints, causing pain and stiffness." },
  { term: "Benign", def: "Not harmful or cancerous; a benign tumor is not malignant." },
  { term: "Biopsy", def: "Removal of a small piece of tissue for microscopic examination to diagnose disease." },
  { term: "Chronic", def: "A condition that persists for a long time or keeps recurring." },
  { term: "Conjunctivitis", def: "Inflammation of the conjunctiva; often called pink eye." },
  { term: "Dermatitis", def: "Inflammation of the skin, typically with itching and redness." },
  { term: "Diabetes Mellitus", def: "High blood sugar due to insulin deficiency or resistance." },
  { term: "Euthanasia", def: "The humane ending of an animal's life to prevent suffering." },
  { term: "Feline", def: "Relating to or affecting cats." },
  { term: "FIV", def: "Feline Immunodeficiency Virus, a viral infection of cats' immune system." },
  { term: "Gastritis", def: "Inflammation of the stomach lining; can cause vomiting and discomfort." },
  { term: "Heartworm", def: "A parasitic worm in the heart and pulmonary arteries; mosquito‑borne." },
  { term: "Hyperthyroidism", def: "Overproduction of thyroid hormone; common in older cats." },
  { term: "Immunity", def: "The body's ability to resist infection and disease." },
  { term: "Jaundice", def: "Yellowing of skin/eyes from excess bilirubin; often liver‑related." },
  { term: "Kennel Cough", def: "Infectious respiratory disease in dogs with a harsh, dry cough." },
  { term: "Lethargy", def: "Sluggishness and lack of energy; commonly a sign of illness." },
  { term: "Malignant", def: "Cancerous; can invade tissue and spread (metastasize)." },
  { term: "Neuter", def: "Surgical removal of the male reproductive organs (castration)." },
  { term: "Obesity", def: "Excessive body fat that poses a health risk." },
  { term: "Otitis", def: "Inflammation of the ear (outer, middle, or inner ear)." },
  { term: "Parasite", def: "Organism that lives on/in a host and benefits at the host's expense." },
  { term: "Prognosis", def: "Likely course and outcome of a disease or condition." },
  { term: "Quarantine", def: "Isolation to prevent spread of infectious disease." },
  { term: "Rabies", def: "Fatal viral disease of the nervous system; transmitted via saliva." },
  { term: "Spay", def: "Surgical removal of female reproductive organs (ovariohysterectomy)." },
  { term: "Suture", def: "Stitches used to close a wound or incision." },
  { term: "Titer", def: "Measurement of antibody levels in blood to assess immunity." },
  { term: "Toxin", def: "Poisonous substance produced by living organisms that can cause disease." },
  { term: "Urinalysis", def: "Lab analysis of urine to detect compounds for diagnosis." },
  { term: "Vaccination", def: "Administration of a vaccine to stimulate immunity." },
  { term: "Wound", def: "Injury to tissue caused by a cut, blow, or other impact." },
  { term: "X‑ray", def: "Imaging using X‑rays to view internal body structures." },
  { term: "Zoonotic", def: "Disease transmitted from animals to humans." },
] as const;

function groupEntries(entries: readonly { term: string; def: string }[]) {
  const map = new Map<string, { term: string; def: string }[]>();
  for (const e of entries) {
    const k = e.term[0].toUpperCase();
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(e);
  }
  return map;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let entries = RAW_ENTRIES.slice();
    if (active !== "All") entries = entries.filter((e) => e.term.startsWith(active));
    if (q) entries = entries.filter((e) => e.term.toLowerCase().includes(q) || e.def.toLowerCase().includes(q));
    return entries;
  }, [query, active]);

  const grouped = useMemo(() => groupEntries(filtered), [filtered]);
  const hasLetter = useMemo(() => {
    const map = new Set(RAW_ENTRIES.map((e) => e.term[0].toUpperCase()));
    return (l: string) => map.has(l);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12" style={{ color: TEXT_DARK, backgroundColor: PAGE_BG }}>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <BookOpen className="h-8 w-8" style={{ color: BRAND_PRIMARY }} />
          <h1 className="text-4xl">Veterinary Glossary</h1>
        </div>
        <p className="mb-6 text-xl" style={{ color: TEXT_MUTED }}>
          Common veterinary terms and definitions to help you understand your pet’s health
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: TEXT_MUTED }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms or definitions..."
            className="h-10 w-full rounded-md border bg-white pl-10 pr-3 text-base outline-none"
            style={{ borderColor: BORDER, color: TEXT_DARK }}
          />
        </div>

        {/* Alphabet filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActive("All")}
            className="h-9 rounded-md px-3 text-sm text-white"
            style={{ backgroundColor: BRAND_PRIMARY }}
          >
            All
          </button>
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => setActive(l)}
              disabled={!hasLetter(l)}
              className="h-9 rounded-md px-3 text-sm border"
              style={{
                borderColor: BORDER,
                backgroundColor: SURFACE,
                color: TEXT_DARK,
                opacity: hasLetter(l) ? 1 : 0.5,
                cursor: hasLetter(l) ? "pointer" : "not-allowed",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-10">
        {(active === "All" ? LETTERS : [active]).map((letter) => {
          const items = grouped.get(letter) || [];
          if (!items.length) return null;
          return (
            <section id={letter} key={letter}>
              <h2 className="mb-4 text-2xl" style={{ color: BRAND_PRIMARY }}>{letter}</h2>
              <div className="space-y-4">
                {items.map((e) => (
                  <article key={e.term} className="rounded-lg border shadow-sm" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
                    <div className="p-6">
                      <h3 className="text-lg tracking-tight">{e.term}</h3>
                      <p className="mt-2" style={{ color: TEXT_MUTED }}>{e.def}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-lg p-8 text-center" style={{ backgroundColor: "#F3F4F6" }}>
        <h2 className="mb-2 text-2xl">Still Have Questions?</h2>
        <p className="mb-6" style={{ color: TEXT_MUTED }}>
          Our veterinarians can explain any medical terms and answer your specific questions.
        </p>
        <a
          href="/book-a-vet-consultation"
          className="inline-block rounded-md px-4 py-2 text-sm text-white"
          style={{ backgroundColor: BRAND_PRIMARY }}
        >
          Book a Consultation
        </a>
      </div>
    </main>
  );
}
