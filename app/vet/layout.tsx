import { requireVet } from "@/lib/rbac";

export default async function VetLayout({ children }: { children: React.ReactNode }) {
  await requireVet();
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Vet Dashboard Deprecated</h1>
        <p className="text-gray-600">We’ve moved scheduling and availability to Calendly. Please manage your availability and bookings directly in Calendly.</p>
        <div className="mt-4">
          <a href="https://calendly.com" target="_blank" rel="noreferrer" className="inline-block rounded-full bg-black px-4 py-2 text-sm text-white">Open Calendly</a>
        </div>
      </div>
    </div>
  ) as any;
}

export const metadata = {
  title: "Vet Dashboard – Manage Consultations & Availability | Dial A Vet",
  description: "Global vets: manage your consults, set availability blocks, and update Zoom/email/SMS preferences.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

