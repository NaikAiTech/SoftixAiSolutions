import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerReadOnly } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const ADMIN_EMAILS = new Set((env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean));
const WORKSPACE_DOMAINS = new Set((env.WORKSPACE_DOMAINS || "").split(",").map((d) => d.trim().toLowerCase()).filter(Boolean));

async function ensureUserRole(email?: string | null, phone?: string | null) {
  if (!email && !phone) return null;
  let user = null as any;
  const phoneDigits = phone ? String(phone).replace(/[^0-9]/g, "") : null;
  if (phoneDigits) user = await prisma.user.findUnique({ where: { phone: phoneDigits } });
  if (!user && email) user = await prisma.user.findFirst({ where: { email } });
  // Determine desired role:
  // - If email domain is workspace: ADMIN if in ADMIN_EMAILS, else VET
  // - Else: preserve existing or default CUSTOMER (no elevation for non-workspace)
  const emailDomain = email ? String(email).split("@").pop()?.toLowerCase() || null : null;
  const isWorkspace = !!(emailDomain && WORKSPACE_DOMAINS.has(emailDomain));
  const desiredRole = isWorkspace ? (email && ADMIN_EMAILS.has(email) ? "ADMIN" : "VET") : (user?.role || "CUSTOMER");
  if (!user) {
    user = await prisma.user.create({ data: { phone: phoneDigits || (email ? `supabase:${email}` : null), email: email || null, role: desiredRole } });
    // Do NOT auto-create vet profile for ADMIN or CUSTOMER. Vet profile is created only when promoted to VET.
  } else {
    // Promote role if coming from customer or becoming admin, and persist email if provided
    if (email && ADMIN_EMAILS.has(email) && user.role !== "ADMIN") {
      user = await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN", email: email ?? user.email } });
    }
    // Ensure vet profile exists only when role is VET
    if (user.role === "VET") {
      await prisma.vetProfile.upsert({ where: { userId: user.id }, create: { userId: user.id, displayName: email || phone || "Vet" }, update: {} });
    }
  }
  return user;
}

export async function requireVet() {
  const supabase = createSupabaseServerReadOnly();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) redirect("/login");
  const user = await ensureUserRole(authUser.email, authUser.phone);
  if (!user) redirect("/login");
  if (user.role !== "VET") {
    if (user.role === "ADMIN") redirect("/admin");
    redirect("/account");
  }
  return { userId: user.id, role: user.role } as any;
}

export async function requireAdmin() {
  const supabase = createSupabaseServerReadOnly();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) redirect("/login");
  const user = await ensureUserRole(authUser.email, authUser.phone);
  if (!user || user.role !== "ADMIN") redirect("/");
  return { userId: user.id, role: user.role } as any;
}

// Returns the DB user for the current authenticated session or null
export async function getCurrentDbUser(): Promise<any | null> {
  const supabase = createSupabaseServerReadOnly();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) return null;
  const user = await ensureUserRole(authUser.email, authUser.phone);
  return user;
}

