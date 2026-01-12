import React from "react";
import { Heart, CircleCheckBig, MapPin } from "lucide-react";

export const metadata = {
  title: "Quality of Life Assessment | Dial A Vet",
  description:
    "Compassionate mobile vets help families navigate end-of-life decisions with objective quality-of-life assessments and in-home support.",
};

const EXPECTATIONS = [
  "A caring vet will come to your home",
  "Peaceful, stress-free environment for your pet",
  "Quality of life assessment and consultation",
  "Time to say goodbye with your pet",
  "Gentle and humane procedure",
  "Aftercare options discussed",
];

const LOCATIONS = [
  "Sydney NSW",
  "Newcastle & NSW Central Coast",
  "Adelaide SA",
  "Melbourne VIC",
  "Canberra ACT",
  "Brisbane QLD (inc. Gold Coast)",
  "Perth WA",
];

export default function QualityOfLifePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-br from-muted via-background to-background py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
            <Heart className="h-5 w-5" />
            Compassionate Care
          </div>
          <h1 className="text-4xl font-semibold md:text-5xl">Quality of Life Assessment</h1>
          <p className="mt-2 text-xl font-semibold text-muted-foreground">From $399</p>
          <p className="mt-4 text-lg text-muted-foreground">
            When you&rsquo;re facing the most difficult decision, our compassionate mobile vets are here to help in the comfort of your own home.
          </p>
          <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            <span>Service provided by</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground">Pawssum</span>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-background p-6 shadow-md md:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Unsure? Speak to a Compassionate Vet Now</h3>
              <p className="text-sm text-muted-foreground">Book a fast telehealth consult for personalised guidance and next steps.</p>
            </div>
            <a href="/book-a-vet-consultation" className="inline-flex items-center justify-center rounded-md bg-[var(--brand,#00A982)] px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90">
              Book a consult <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">Compassionate End-of-Life Care</h2>
              <p className="mt-4 text-muted-foreground">
                Our team understands that saying goodbye to a beloved pet is one of the hardest things you&rsquo;ll ever do. We provide compassionate, dignified care in the comfort and privacy of your own home.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">What to Expect</h2>
              <ul className="mt-4 space-y-3">
                {EXPECTATIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Available Locations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span key={loc} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {loc}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                <span>Service provided by</span>
<img 
  src="./images/pawssum logo.png" 
  alt="Pawssum Logo"
  style={{ width: '76px', height: '76px' }} 
/>              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
              <div className="rounded-t-2xl bg-muted-foreground px-6 py-6 text-center text-white">
                <h3 className="text-2xl font-semibold">We&rsquo;re Here to Help</h3>
                <p className="mt-1 text-sm text-white/80">Enter your details and we&rsquo;ll connect you with Pawssum&rsquo;s care team.</p>
              </div>
              <div className="px-6 py-6">
                <form className="space-y-5">
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
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-muted-foreground text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Call Now
                  </button>
                  <p className="text-center text-sm text-muted-foreground">Bookings available until 11:00pm</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
