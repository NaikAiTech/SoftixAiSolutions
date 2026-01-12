"use client";
import { useState } from "react";
import PhoneInput from "@/components/PhoneInput";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"enterPhone" | "enterCode">("enterPhone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  // Surface message if redirected due to missing DB user
  if (typeof window !== 'undefined' && !info && !error) {
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get('not_registered')) {
        setInfo('No account found for this number. Please book or redeem a partner code to create your account.');
      }
    } catch {}
  }
  // Restrict page to admin-only via query param user=admin
  if (typeof window !== 'undefined') {
    try {
      const u = new URL(window.location.href);
      const userParam = (u.searchParams.get('user') || '').toLowerCase();
      if (userParam !== 'admin') {
        window.location.replace('/');
        return null as any;
      }
    } catch {}
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg, #F1FBF6 0%, #F9FEFB 100%)"}}>
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <div className="card p-6 hidden">
          {/* Phone login hidden intentionally */}
        </div>
        <div className="card p-6">
          <div className="h3">Admin access</div>
          <p className="lead mb-2">Sign in with your Google Workspace account.</p>
          <a className="btn inline-block w-full sm:w-auto text-center" href="#" onClick={async (e) => { e.preventDefault();
            const { createSupabaseBrowser } = await import("@/lib/supabase.client");
            const supabase = createSupabaseBrowser();
            const callback = `${window.location.origin}/auth/callback`;
            await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback, queryParams: { prompt: 'select_account' } } });
          }}>Sign in with Google</a>
        </div>
      </div>
    </div>
  );
}

