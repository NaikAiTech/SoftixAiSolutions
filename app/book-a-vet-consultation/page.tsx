"use client";
import React from "react";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { CALENDLY_FREE_URL, CALENDLY_PAID_URL } from "@/lib/calendly";
import PhoneInput from "@/components/PhoneInput";

export default function BookingEmbedPage() {
  const [isFree, setIsFree] = React.useState<boolean>(false);
  const [checkOpen, setCheckOpen] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [phone, setPhone] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [otpMode, setOtpMode] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [tokenStatus, setTokenStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [tokenMessage, setTokenMessage] = React.useState<string | null>(null);
  const [bookedCount] = React.useState<number>(() => 10 + Math.floor(Math.random() * 41));

  // On mount: if user just activated and is logged in, auto-enable free embed
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/partner/free', { cache: 'no-store' });
        const d = res.ok ? await res.json() : {};
        if (!alive) return;
        if (d?.free) setIsFree(true);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const token = url.searchParams.get("freeToken");
    if (!token) return;
    let active = true;
    setTokenStatus("loading");
    setTokenMessage("Unlocking your free consultation…");
    (async () => {
      try {
        const res = await fetch("/api/free-consultation/redeem", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => null);
        if (!active) return;
        if (res.ok) {
          setIsFree(true);
          setCheckOpen(false);
          setOtpMode(false);
          setOtpSent(false);
          setOtpError(null);
          setError(null);
          setTokenStatus("success");
          setTokenMessage("Redirecting you to your free booking…");
          url.searchParams.delete("freeToken");
          window.history.replaceState(null, document.title, url.toString());
          window.location.replace(CALENDLY_FREE_URL);
          return;
        } else {
          setTokenStatus("error");
          setTokenMessage(data?.error || "This free link is no longer valid. Request a new one below.");
        }
      } catch {
        if (!active) return;
        setTokenStatus("error");
        setTokenMessage("We couldn't verify your free link. Please try again or request a new one below.");
      } finally {
        if (!active) return;
        url.searchParams.delete("freeToken");
        window.history.replaceState(null, document.title, url.toString());
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function verifyFreeAccess() {
    try {
      setChecking(true);
      setError(null); setOtpError(null); setOtpMode(false); setOtpCode(""); setOtpSent(false);
      if (!phone) { setError("Enter your mobile number"); return; }
      // First: check if this phone has active free access (membership)
      const res = await fetch(`/api/partner/free?phone=${encodeURIComponent(phone)}`, { cache: "no-store" });
      const d = res.ok ? await res.json() : {};
      if (!d?.free) { setError("No free access for this number. Try another or activate your code."); return; }
      // Then: send OTP and show OTP entry UI
      const { createSupabaseBrowser } = await import("@/lib/supabase.client");
      const supabase = createSupabaseBrowser();
      const { error: sendErr } = await supabase.auth.signInWithOtp({ phone, options: { channel: 'sms', shouldCreateUser: true } });
      if (sendErr) { setError(sendErr.message || 'Failed to send code'); return; }
      setOtpSent(true);
      setOtpMode(true);
    } catch {
      setError("Could not verify access. Please try again later.");
    } finally { setChecking(false); }
  }

  async function verifyOtpAndEnable() {
    try {
      setOtpLoading(true);
      setOtpError(null);
      if (!otpCode) { setOtpError('Enter the 6‑digit code'); return; }
      const { createSupabaseBrowser } = await import("@/lib/supabase.client");
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: otpCode, type: 'sms' });
      if (error) { setOtpError(error.message || 'Invalid code'); return; }
      const session = (data as any)?.session;
      if (session) {
        await fetch('/auth/session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token, free: true, ttlSeconds: 3600 }) });
      }
      setIsFree(true);
      setOtpMode(false);
    } catch {
      setOtpError('Verification failed');
    } finally { setOtpLoading(false); }
  }

  async function resendOtp() {
    try {
      setOtpLoading(true);
      setOtpError(null);
      const { createSupabaseBrowser } = await import("@/lib/supabase.client");
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({ phone, options: { channel: 'sms', shouldCreateUser: true } });
      if (error) setOtpError(error.message || 'Could not resend'); else setOtpSent(true);
    } finally { setOtpLoading(false); }
  }

  return (
    <main className="min-h-screen" style={{ background: "#F5F7F6" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {/* Activity banner */}
        <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 text-sm text-center">
          Over {bookedCount} appointments booked in the last hour!
        </div>
        <header className="mb-4">
          <h1 className="text-3xl">Book a Consultation</h1>
          <p className="text-sm text-gray-600">Embedded scheduling via Calendly.</p>
        </header>

        {tokenStatus !== "idle" && tokenMessage && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-sm text-center ${
              tokenStatus === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : tokenStatus === "loading"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {tokenMessage}
          </div>
        )}

        {!isFree && (
          <div className="mb-4 bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent">
                <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                <path d="M12 8v13"></path>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
              </svg>
              <span className="text-sm">Have access to free consultations?</span>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm border bg-background h-9 rounded-md px-3 border-accent/40 hover:bg-accent/10"
              onClick={() => setCheckOpen((v) => !v)}
            >
              Click here
            </button>
          </div>
        )}
        {isFree && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-emerald-50 border-emerald-200 text-emerald-700">
              Free partner access active
            </span>
          </div>
        )}

        {checkOpen && !isFree && (
          <div className="mb-4 grid gap-2 max-w-md">
            <label className="text-sm text-gray-600">Enter your mobile number to check free access</label>
            <PhoneInput value={phone} onChange={setPhone} />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex gap-2">
              <button
                className="rounded-full bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
                onClick={verifyFreeAccess}
                disabled={checking || !phone}
              >
                {checking ? "Checking…" : "Check access"}
              </button>
              <a className="rounded-full border px-4 py-2 text-sm" href="/activate">Activate a code</a>
            </div>
            {otpMode && (
              <div className="mt-2 grid gap-2">
                <label className="text-sm text-gray-600">Enter the verification code we sent</label>
                <input
                  className="rounded-full border px-4 py-2 text-sm"
                  placeholder="6‑digit code"
                  value={otpCode}
                  onChange={(e)=> setOtpCode((e.target as any).value)}
                />
                {otpError && <div className="text-sm text-red-600">{otpError}</div>}
                <div className="flex gap-2">
                  <button className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-60" onClick={verifyOtpAndEnable} disabled={otpLoading || !otpCode}>
                    {otpLoading ? 'Verifying…' : 'Verify & continue'}
                  </button>
                  <button className="rounded-full border px-4 py-2 text-sm disabled:opacity-60" onClick={resendOtp} disabled={otpLoading}>
                    Resend
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border">
          <CalendlyEmbed url={isFree ? CALENDLY_FREE_URL : CALENDLY_PAID_URL} height={1200} />
        </div>
      </div>
    </main>
  );
}
