import { createSupabaseServerReadOnly } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerReadOnly();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) redirect("/book-a-vet-consultation");
  // Determine role
  const email = authUser.email || null;
  const phoneRaw = (authUser as any).phone || null;
  const phone = phoneRaw ? String(phoneRaw).replace(/[^0-9]/g, "") : null;
  const dbUser = phone
    ? await prisma.user.findUnique({ where: { phone } })
    : (email ? await prisma.user.findFirst({ where: { email } }) : null);
  if (!dbUser) {
    // Sign out and redirect back to login with message
    await supabase.auth.signOut();
    // Ensure cookies cleared for SSR
    const c = await cookies();
    c.set("sb-access-token", "", { path: "/", maxAge: 0 });
    c.set("sb-refresh-token", "", { path: "/", maxAge: 0 });
    redirect("/book-a-vet-consultation");
  }
  const role = (dbUser?.role || "CUSTOMER").toUpperCase();
  if (role === "ADMIN") redirect("/admin");
  if (role === "VET") redirect("/vet");
  return children as any;
}

export const metadata = {
  title: "Dashboard – Bookings, Membership & Pet Profile | Dial A Vet",
  description: "View upcoming/past consultations, manage your Unlimited membership, and update your contact and pet details.",
  openGraph: { images: [{ url: "/seo/og.jpg" }] },
  twitter: { card: "summary_large_image", images: ["/seo/og.jpg"] },
} as const;

