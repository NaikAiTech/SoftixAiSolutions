export const metadata = {
  title: "Book an Online Vet Consultation – Global Vet Team ($49)",
  description: "Pick a time for a 15‑minute video consult with licensed vets. Fast triage, clear next steps, after‑hours available.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

export default function BookingLayout({ children }: { children: React.ReactNode }){
  return children as any;
}

