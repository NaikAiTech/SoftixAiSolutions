import { createSupabaseRouteHandler } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Accept JSON or form POST
  let access_token = "";
  let refresh_token = "";
  let free = false;
  let ttlSeconds = 0;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({} as any));
    access_token = body?.access_token || "";
    refresh_token = body?.refresh_token || "";
    free = !!body?.free;
    ttlSeconds = Number(body?.ttlSeconds || 0) || 0;
  } else {
    const form = await req.formData().catch(() => null);
    access_token = (form?.get("access_token") as string) || "";
    refresh_token = (form?.get("refresh_token") as string) || "";
  }
  const supabase = createSupabaseRouteHandler();
  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    // If this is a limited free session, set a non-HttpOnly client cookie to allow auto-logout on the client
    if (free && ttlSeconds > 0) {
      const c = cookies();
      const expiresAtMs = Date.now() + ttlSeconds * 1000;
      c.set("dav_free", "1", { path: "/", maxAge: ttlSeconds, httpOnly: false, sameSite: "lax", secure: true });
      c.set("dav_free_expires_at", String(expiresAtMs), { path: "/", maxAge: ttlSeconds, httpOnly: false, sameSite: "lax", secure: true });
    }
    return NextResponse.json({ ok: true });
  } else {
    // Logout
    await supabase.auth.signOut();
    try {
      const c = cookies();
      c.set("dav_free", "", { path: "/", maxAge: 0 });
      c.set("dav_free_expires_at", "", { path: "/", maxAge: 0 });
    } catch {}
    return NextResponse.json({ ok: true });
  }
}

export const dynamic = "force-dynamic";
