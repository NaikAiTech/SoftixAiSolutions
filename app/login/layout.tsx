export const metadata = {
  title: "Login – Manage Your Dial A Vet Account",
  description: "Sign in with your mobile number to manage bookings, membership, and consultation history securely.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

export default function LoginLayout({ children }: { children: React.ReactNode }){
  return children as any;
}

