"use client";
import React from "react";
import PhoneInput from "@/components/PhoneInput";

export default function DialAVetActivatePage() {
  const [code, setCode] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [step, setStep] = React.useState<"enter" | "verify">("enter");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function sendOtp() {
    try {
      setLoading(true);
      setError(null);
      if (!code || !phone) { setError("Please enter your partner code and mobile number"); return; }
      // Pre-validate phone and code before OTP
      const pre = await fetch('/api/activate/check', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ code, phone }) });
      if (!pre.ok) { const d = await pre.json().catch(()=>({})); setError(d?.error || 'Activation not allowed'); return; }
      const { createSupabaseBrowser } = await import("@/lib/supabase.client");
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({ phone, options: { channel: "sms", shouldCreateUser: true } });
      if (error) throw error;
      setStep("verify");
    } catch (e: any) {
      setError(e?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyAndActivate() {
    try {
      setLoading(true);
      setError(null);
      if (!otp) { setError("Enter the verification code sent to your phone"); return; }
      const { createSupabaseBrowser } = await import("@/lib/supabase.client");
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) throw error;
      const session = (data as any)?.session;
      if (session) {
        await fetch("/auth/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token }) });
      }
      const res = await fetch("/api/activate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setError(d?.error || "Activation failed"); return; }
      window.location.href = "/booking?free=1";
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <div className="max-w-3xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.avif" alt="Dial A Vet" className="h-10 w-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl mb-2">Activate Your Free Access</h2>
        <p className="text-gray-600 mb-8">
          Great news! If you&apos;ve received a unique code then you have free access
          to a Global Vet Team! 🌍 We&apos;re thrilled to have you here.
        </p>

        {/* Who Has Access */}
        <div className="rounded-2xl p-6 mb-8 border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white">
          <h3 className="text-xl mb-6">Who Has Access?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🏢", title: "Pet Insurance Partners", sub: "Exclusive partner benefits" },
              { icon: "🎁", title: "Company Employees", sub: "Employee wellness programs" },
              { icon: "💚", title: "Pet Service Companies", sub: "Industry partnerships" },
            ].map((x, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 ring-1 ring-gray-100 hover:shadow-md transition">
                <div className="text-emerald-600 text-3xl mb-2">{x.icon}</div>
                <h4 className="text-gray-800">{x.title}</h4>
                <p className="text-gray-500 text-sm">{x.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-5">
            You should have received an email from your company with your activation code
          </p>
        </div>

        {/* Activation Form */}
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-10 ring-1 ring-gray-100 text-left">
          <label className="block text-gray-800 mb-2">Partner Activation Code</label>
          <div className="relative mb-1">
            <input
              type="text"
              placeholder="ENTER-CODE-HERE"
              value={code}
              onChange={(e) => setCode((e.target as any).value.toUpperCase())}
              className="w-full bg-gray-100/70 border border-gray-200 rounded-xl px-5 py-3 tracking-widest text-center placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mb-5">Enter the code from your company email</p>

          <label className="block text-gray-800 mb-2">Mobile Number</label>
          <div className="mb-2">
            <PhoneInput value={phone} onChange={setPhone} />
          </div>
          <p className="text-xs text-gray-500 mt-1 mb-5">We&apos;ll send you a verification code</p>

          {error && (
            <div className="mb-3 text-sm text-red-600">{error}</div>
          )}

          {step === "enter" && (
            <button onClick={sendOtp} disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl shadow hover:opacity-95 transition disabled:opacity-60">
              {loading ? "Sending…" : "Continue"}
            </button>
          )}

          {step === "verify" && (
            <div className="mt-3 grid gap-3">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6‑digit code"
                value={otp}
                onChange={(e) => setOtp((e.target as any).value)}
                className="w-full bg-gray-100/70 border border-gray-200 rounded-xl px-5 py-3 text-center placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button onClick={verifyAndActivate} disabled={loading || !otp} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-60">
                  {loading ? "Verifying…" : "Verify & Activate"}
                </button>
                <button onClick={sendOtp} disabled={loading} className="px-4 py-3 rounded-xl border text-sm">
                  Resend
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-emerald-600 mb-2">1</div>
            <h4 className="font-semibold">Activate Access</h4>
            <p className="text-gray-500 text-sm">
              Enter your partner code and verify your mobile number
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-emerald-600 mb-2">2</div>
            <h4 className="font-semibold">Book Your Slot</h4>
            <p className="text-gray-500 text-sm">
              Choose a convenient time for your free vet consultation
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-emerald-600 mb-2">3</div>
            <h4 className="font-semibold">Connect with a Vet</h4>
              <p className="text-gray-500 text-sm">
                Get expert advice from our global team of licensed vets and veterinary nurses via video call
              </p>
          </div>
        </div>

        {/* Reviews */}
        <h3 className="text-2xl font-semibold mb-8">Trusted by pet parents worldwide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 shadow rounded-lg text-left">
            <p className="text-emerald-600 text-xl mb-3">★★★★★</p>
            <p className="text-gray-700 mb-4">
              Dr Roulstone was amazing! She even followed up to see how we were
              doing! The quick access to professional help relieved SO much stress!
              Everything was smooth and easy to use.
            </p>
            <p className="text-sm text-gray-600 font-medium">Kailey — USA</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg text-left">
            <p className="text-emerald-600 text-xl mb-3">★★★★★</p>
            <p className="text-gray-700 mb-4">
              Samantha was amazing - she was saving someone else&apos;s baby (emergency
              surgery) when we were supposed to meet but got in touch, met us
              straight away and explained everything clearly.
            </p>
            <p className="text-sm text-gray-600 font-medium">Adam — Australia</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg text-left">
            <p className="text-emerald-600 text-xl mb-3">★★★★★</p>
            <p className="text-gray-700 mb-4">
              Dr Beck spent so much time explaining my situation and giving great
              advice. It helped me not go down a route of expensive pet bills.
              Thank you!
            </p>
            <p className="text-sm text-gray-600 font-medium">Kristina — USA</p>
          </div>
        </div>

        {/* View All Reviews Button */}
        <a
          href="https://www.trustpilot.com/review/dialavet.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition"
        >
          View All Reviews
        </a>
      </div>
    </div>
  );
}

