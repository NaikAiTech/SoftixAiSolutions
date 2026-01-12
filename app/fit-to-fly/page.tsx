import React from "react";
import Image from "next/image";
import { Plane, CircleCheckBig, MapPin } from "lucide-react";

const BRAND_GREEN = "#00A982";

export const metadata = {
  title: "Fit-to-Fly Veterinary Certificates | Dial A Vet",
  description:
    "Book an online consultation with an Australian vet to review your pet&rsquo;s health records and issue pre-flight fit-to-fly certificates.",
};

const INCLUDED_ITEMS = [
  "Vet home visit at your convenience",
  "Complete health check examination",
  "Vaccination review & documentation",
  "Official fit-to-fly certificate",
  "All required airline documentation",
];

const HOW_IT_WORKS = [
  "Assess your pet&rsquo;s overall health",
  "Ensure vaccinations are up to date",
  "Check for any signs of illness",
  "Review your pet&rsquo;s medical history",
  "Issue the official certificate and paperwork",
];

const LOCATIONS = [
  "Sydney NSW",
  "Newcastle & NSW Central Coast",
  "Adelaide SA",
  "Melbourne VIC",
  "Canberra ACT",
  "Brisbane QLD (incl. Gold Coast)",
  "Perth WA",
];

const ELIGIBILITY = [
  "Be a small cat or dog (pet + carrier under 8kg)",
  "Fit comfortably in an approved carrier under the seat",
  "Be older than 8 weeks",
  "Be up to date with vaccinations",
  "Have a valid veterinary certificate when required",
  "Not be a prohibited breed",
  "Not have given birth within the last 7 days",
];

const RESTRICTIONS = [
  "Travelling alone with an infant",
  "Under 18 years old and travelling alone",
  "Travelling with an assistance animal",
  "Guests with specific service requirements (unless approved)",
];

const badgeClass = "inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm";

export default function FitToFlyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-br from-emerald-100/50 via-background to-background py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium" style={{ color: BRAND_GREEN }}>
            <Plane className="h-5 w-5" />
            Mobile Vet Service
          </div>
          <h1 className="text-4xl font-semibold md:text-5xl">Fit-to-Fly Certificates</h1>
          <p className="mt-2 text-xl font-semibold" style={{ color: BRAND_GREEN }}>
            From $115 + vet visit fee
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get your pet certified for air travel on all Australian airlines with a professional vet home visit.
          </p>
          <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full bg-muted/60 px-4 py-2 text-sm text-muted-foreground">
            <span>Service provided by</span>
            <a
              href="https://www.pawssum.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-foreground/5"
            >
              <img 
  src="./images/pawssum logo.png" 
  alt="Pawssum Logo"
  style={{ width: '76px', height: '76px' }} 
/>

            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl bg-background p-8 text-center shadow-lg">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              Fit-to-Fly Veterinary Certificates for Pets Travelling on Australian Airlines
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Including Virgin Australia, Qantas, Jetstar, and all major domestic carriers
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              <a
                href="https://au.trustpilot.com/review/dialavet.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80"
              >
                <Image src="./images/trustpilot.png" alt="Trustpilot Excellent" width={100} height={50} />
              </a>
              <Image
                src="./images/finder logo.png"
                alt="Finder Awards"
                width={86}
                height={86}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold">What&rsquo;s Included</h2>
              <ul className="mt-4 space-y-3">
                {INCLUDED_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: BRAND_GREEN }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">How It Works</h2>
              <p className="mt-2 text-muted-foreground">
                When you request a fit-to-fly certificate, a licensed veterinarian will come to your location to examine your pet.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {HOW_IT_WORKS.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Available Locations</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span key={loc} className={badgeClass}>
                    <MapPin className="h-3 w-3" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              <span>Service provided by</span>
              <a
                href="https://www.pawssum.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
<img 
  src="./images/pawssum logo.png" 
  alt="Pawssum Logo"
  style={{ width: '76px', height: '76px' }} 
/>Pawssum
              </a>
            </div>
          </div>

          <div>
            <div className="sticky top-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
              <div className="rounded-t-2xl bg-[var(--brand, #00A982)] px-6 py-6 text-center text-white">
                <h3 className="text-2xl font-semibold" style={{ backgroundColor: BRAND_GREEN }}>Get Started</h3>
                <p className="mt-1 text-sm text-white/80"  style={{ backgroundColor: BRAND_GREEN }}>Bookings available until 11:00pm</p>
              </div>
              <div className="px-6 py-6">
                <form className="space-y-5">
                  <p className="text-base text-muted-foreground">
                    Enter your details and we&rsquo;ll guide you through booking your appointment.
                  </p>
                  <label className="block text-base font-medium text-foreground">
                    First Name
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                    />
                  </label>
                  <label className="block text-base font-medium text-foreground">
                    Mobile Number
                    <input
                      type="tel"
                      placeholder="04XX XXX XXX"
                      className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                    />
                  </label>
                  <button
                    type="button"
                    className="inline-flex h-12 w-full items-center justify-center rounded-md text-base font-semibold text-white"
                    style={{ backgroundColor: BRAND_GREEN }}
                  >
                    Talk to a care coordinator
                  </button>
                  <p className="text-center text-sm text-muted-foreground">Lines open 7:00am – 11:00pm local time</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold">Pets in Cabin</h2>
          <p className="mt-2 text-muted-foreground">
            As of 16 October 2025, <strong>Virgin Australia</strong> allows pets in cabin between Melbourne and the Sunshine Coast, and Melbourne and the Gold Coast.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Eligibility Requirements</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your pet must:</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {ELIGIBILITY.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CircleCheckBig className="mt-0.5 h-4 w-4" style={{ color: BRAND_GREEN }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Who can travel with a pet?</h3>
              <p className="mt-2 text-sm text-muted-foreground">You cannot travel with a pet in cabin if you are:</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {RESTRICTIONS.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <a
            href="https://www.virginaustralia.com/au/en/travel-info/specific-travel/pets/pets-in-cabin/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-medium text-emerald-700 hover:underline"
          >
            Learn more on Virgin Australia →
          </a>
        </div>
      </section>
    </main>
  );
}
