import React from "react";
import { TriangleAlert, CircleCheckBig, MapPin, Clock } from "lucide-react";

const LOCATIONS = [
  "Sydney NSW",
  "Newcastle & NSW Central Coast",
  "Adelaide SA",
  "Melbourne VIC",
  "Canberra ACT",
  "Brisbane QLD (inc. Gold Coast)",
  "Perth WA",
];

const REASONS = [
  "Vet comes directly to your home",
  "Reduces stress for your pet during emergencies",
  "No waiting rooms or travel required",
  "Professional emergency assessment",
  "Immediate care in familiar surroundings",
  "Licensed and experienced veterinarians",
];

const CALL_WHEN = [
  "Sudden illness or collapse",
  "Difficulty breathing",
  "Severe vomiting or diarrhea",
  "Suspected poisoning",
  "Injuries or trauma",
  "Seizures",
];

export const metadata = {
  title: "Emergency Mobile Vet | Dial A Vet",
  description: "Urgent in-home veterinary care across Australia, delivered by trusted mobile vets.",
};

export default function EmergencyVetPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-br from-destructive/10 via-background to-background py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            <TriangleAlert className="h-5 w-5" />
            Emergency Service
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">Local Emergency Mobile Vet</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Urgent in-home veterinary care when your pet needs it most, available in locations across Australia.
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Bookings available until 11:00pm
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">Why choose a mobile emergency vet?</h2>
              <ul className="mt-4 space-y-3">
                {REASONS.map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 text-[var(--brand,#00A982)]" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">When to call</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Our mobile emergency vets can help with urgent situations like:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {CALL_WHEN.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Service locations</h2>
              <div className="mt-4 grid gap-2">
                {LOCATIONS.map((loc) => (
                  <div key={loc} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {loc}
                    </span>
                    <span className="rounded-full bg-[var(--brand,#00A982)]/10 px-2 py-0.5 text-xs font-medium text-[var(--brand,#00A982)]">
                      Available
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                <span>Service provided by</span>
       <img 
  src="./images/pawssum logo.png" 
  alt="Pawssum Logo"
  style={{ width: '76px', height: '76px' }} 
/>


              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-8 rounded-2xl border border-destructive/30 bg-card text-card-foreground shadow-sm">
              <div className="rounded-t-2xl bg-destructive px-6 py-6 text-center text-white">
                <h3 className="text-2xl font-semibold">Need emergency help?</h3>
              </div>
              <div className="px-6 py-6">
                <form className="space-y-5">
                  <p className="text-base text-muted-foreground">
                    Enter your details to access our emergency vet hotline.
                  </p>
                  <label className="block text-base font-medium text-foreground">
                    First Name
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                    />
                  </label>
                  <label className="block text-base font-medium text-foreground">
                    Mobile Number
                    <input
                      type="tel"
                      placeholder="04XX XXX XXX"
                      className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                    />
                  </label>
                  <button
                    type="button"
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-destructive text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Call Now
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    For life-threatening emergencies, please also contact your nearest 24-hour emergency animal hospital.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
