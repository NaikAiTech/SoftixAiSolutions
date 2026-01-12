import type { Metadata } from "next";
import "./globals.css";
import { createSupabaseServerReadOnly } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import RootShell from "@/components/RootShell";
import Script from "next/script";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Dial A Vet: 24/7 Online Vet Advice – Talk to a Vet for $49",
  description: "Speak to a licensed online vet 24/7 for just $49. Trusted by thousands of Australians for fast, expert pet advice - anytime, anywhere.",
  openGraph: {
    title: "Dial A Vet: 24/7 Online Vet Advice – Talk to a Vet for $49",
    description: "Speak to a licensed online vet 24/7 for just $49. Trusted by thousands of Australians for fast, expert pet advice - anytime, anywhere.",
    images: [{ url: "/seo/og.jpg" }],
    siteName: "Dial A Vet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dial A Vet: 24/7 Online Vet Advice – Talk to a Vet for $49",
    description: "Speak to a licensed online vet 24/7 for just $49. Trusted by thousands of Australians for fast, expert pet advice - anytime, anywhere.",
    images: ["/seo/og.jpg"],
  },
};



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve current user and role to render proper nav links (server-only)
  const supabase = createSupabaseServerReadOnly();
  const { data } = await supabase.auth.getUser();
  let dashboardHref: string | null = null;
  const isAuthed = !!data.user;
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (data.user) {
    const email = data.user.email || null;
    const phone = (data.user as any).phone || null;
    const dbUser = email
      ? await prisma.user.findFirst({ where: { email } })
      : phone
      ? await prisma.user.findUnique({ where: { phone } })
      : null;
    const role = dbUser?.role || null;
    dashboardHref = role === "ADMIN" ? "/admin" : role === "VET" ? "/vet" : "/book-a-vet-consultation";
  }
  return (
    <html lang="en">
      {/* eslint-disable @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Product+Sans:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
          </>
        ) : null}
      </head>
      {/* eslint-enable @next/next/no-page-custom-font */}
      <body className="bg-background text-text">
        <RootShell dashboardHref={dashboardHref} isAuthed={isAuthed}>{children}</RootShell>
        <Analytics />
      </body>
    </html>
  );
}
