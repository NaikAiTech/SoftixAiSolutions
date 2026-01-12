export const metadata = {
  title: "Join Your Online Vet Consultation – Secure Meeting",
  description: "Secure video room for your Dial A Vet consultation. Works on desktop and mobile browsers.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

export default function MeetLayout({ children }: { children: React.ReactNode }){
  return children as any;
}

