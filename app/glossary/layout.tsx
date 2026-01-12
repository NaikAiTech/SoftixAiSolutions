import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary - Dial A Vet",
  description: "Learn common veterinary terms and definitions to help you understand",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Glossary - Dial A Vet",
    description: "Learn common veterinary terms and definitions to help you understand",
    url: "/glossary",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glossary - Dial A Vet",
    description: "Learn common veterinary terms and definitions to help you understand",
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children as any;
}
