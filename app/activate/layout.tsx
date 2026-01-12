export const metadata = {
  title: "Activate Partner Code – Unlock Free Online Vet Access",
  description: "Redeem your 8‑digit partner code to unlock Dial A Vet access. Verify by phone and complete your profile to begin.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

export default function ActivateLayout({ children }: { children: React.ReactNode }){
  return children as any;
}

