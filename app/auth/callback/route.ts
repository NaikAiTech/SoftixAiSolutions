import { createSupabaseRouteHandler } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/rbac";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const supabase = createSupabaseRouteHandler();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  // Route by role after session is set
  let dest = "/account";
  try {
    const dbUser = await getCurrentDbUser();
    const role = (dbUser as any)?.role || "CUSTOMER";
    if (role === "ADMIN") dest = "/admin";
    else if (role === "VET") dest = "/vet";
    else {
      // Non-workspace users should not proceed via OAuth; sign out and bounce to login
      await supabase.auth.signOut();
      const urlObj = new URL(req.url);
      return NextResponse.redirect(new URL("/login?not_registered=1", urlObj));
    }
  } catch {}
  return NextResponse.redirect(new URL(dest, url));
}

export const dynamic = "force-dynamic";
