"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ZoomMeeting from "@/components/ZoomMeeting";

export default function MeetingPage({ params }: { params: { id: string } }) {
  const [zoom, setZoom] = useState<{mn: string; passcode?: string, joinUrl?: string} | null>(null);
  const [role, setRole] = useState<0|1>(0);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const qs = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const r = (qs?.get('role') || 'guest').toLowerCase();
    setRole(r === 'host' ? 1 : 0);
    (async () => {
      try {
        const res = await fetch(`/api/appointments/${params.id}`);
        if (!res.ok) {
          setErrorCode(res.status);
          setError(res.status === 401 ? 'Please log in to join your consultation.' : res.status === 403 ? 'You do not have access to this consultation.' : 'Unable to load meeting.');
          return;
        }
        const d = await res.json();
        if (r === 'host' && !d?.canHost) {
          setRole(0);
        }
        const appt = d?.appointment;
        if (appt?.zoomMeetingId && appt?.zoomJoinUrl) {
          setZoom({ mn: String(appt.zoomMeetingId), passcode: appt.zoomPassword || undefined, joinUrl: appt.zoomJoinUrl });
        } else {
          const mn = appt?.vet?.zoomMeetingNumber;
          const pc = appt?.vet?.zoomPasscode;
          if (mn) setZoom({ mn, passcode: pc || undefined });
          else setError('Meeting not configured yet.');
        }
      } catch {
        setError('Unable to load meeting.');
      }
    })();
  }, [params.id]);

  const headerGrad = useMemo(() => ({
    background: "linear-gradient(135deg, #E9F7F1 0%, #F7FBF5 100%)",
    border: "1px solid rgba(0,0,0,.06)",
  } as React.CSSProperties), []);

  return (
    <div className="min-h-[80vh] py-10" style={{ background: "#F5FAF8" }}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 rounded-2xl px-5 py-4" style={headerGrad}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold text-neutral-900">Video consultation</div>
              <div className="text-sm text-neutral-600">Appointment ID: {params.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm text-emerald-800">{role===1? 'Host (Vet)':'Participant'}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-semibold text-neutral-900">Guidelines</div>
              <ul className="list-disc pl-4 text-sm text-neutral-700 space-y-1">
                <li>Join 5 minutes early to test audio and video.</li>
                <li>Ensure good lighting and a quiet environment.</li>
                <li>Keep your pet nearby for examination.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-semibold text-neutral-900">Need help?</div>
              <div className="text-sm text-neutral-700">Email <a className="underline" href="mailto:support@dialavet.com.au">support@dialavet.com.au</a></div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <Link href="/" className="underline text-sm">Back home</Link>
            </div>
          </aside>

          <div className="rounded-2xl border border-black/10 bg-white p-3 lg:p-4 shadow-sm">
            <div className="rounded-lg bg-black" style={{ width: "100%", height: "calc(70vh + 100px)" }}>
              {error ? (
                <div className="flex h-full items-center justify-center p-6">
                  <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-5 text-center shadow-sm">
                    <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">⚠️</div>
                    <div className="mb-1 text-base font-semibold text-neutral-900">{errorCode === 401 ? 'Sign in required' : 'Access denied'}</div>
                    <div className="mb-4 text-sm text-neutral-600">{error}</div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {errorCode === 401 ? (
                        <a href={`/login?next=${encodeURIComponent(`/meet/${params.id}${role===1?"?role=host":""}`)}`} className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm text-white">Log in</a>
                      ) : (
                        <>
                          <a href="/account" className="inline-flex items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm">Go to dashboard</a>
                          <a href="/" className="inline-flex items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm">Home</a>
                          {role===1 && (
                            <a href={`/meet/${params.id}`} className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">Join as participant</a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : zoom ? (
                <ZoomMeeting meetingNumber={zoom.mn} role={role} userName={role===1? 'Host Vet':'Guest'} passcode={zoom.passcode} appointmentId={params.id} />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-300 text-sm">Preparing meeting…</div>
              )}
            </div>
            {zoom?.joinUrl && (
              <div className="mt-2 text-xs text-neutral-600">
                Having trouble? <a href={zoom.joinUrl} target="_blank" className="underline">Open in Zoom</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

