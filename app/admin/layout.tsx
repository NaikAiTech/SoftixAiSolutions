import { requireAdmin } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="dav-admin container py-8">{children}</div>;
}

export const metadata = {
  title: "Admin Console – Customers, Consultations & Billing | Dial A Vet",
  description: "Administer the Dial A Vet platform: customers, vets, consultations, subscriptions, partner codes, and exports.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

