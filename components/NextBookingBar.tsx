"use client";
import React from "react";
import { CalendarCheck, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TZ_LIST } from "@/lib/timezones";

type Slot = { iso: string; label: string };

export default function NextBookingBar() {
  const [tz, setTz] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [nextIso, setNextIso] = React.useState<string | null>(null);
  const [nowTick, setNowTick] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const chosen = (TZ_LIST.includes(localTz) ? localTz : TZ_LIST[0]);
        if (!cancelled) setTz(chosen);

        const data:any = await fetch(`/api/calendly/next?count=1&timezone=${encodeURIComponent('Australia/Sydney')}`, { cache: 'no-store' }).then(r=> r.ok? r.json(): null).catch(()=>null);
        const items: string[] = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled && data?.meta) {
          console.log('[calendly-next-meta]', data.meta);
        }
        if (!cancelled) setNextIso(items[0] || null);
      } catch {}
    })();
    return ()=>{ cancelled = true };
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function renderCountdown() {
    if (!nextIso) return <span className="text-sm text-gray-600">Loading…</span>;
    const diffMs = new Date(nextIso).getTime() - nowTick;
    if (diffMs <= 0) return <span className="text-sm text-gray-700">Available now</span>;
    const totalMin = Math.ceil(diffMs / 60000);
    const days = Math.floor(totalMin / (60 * 24));
    const hours = Math.floor((totalMin % (60 * 24)) / 60);
    const mins = totalMin % 60;
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    return <span className="text-sm text-gray-700">in {parts.join(" ")}</span>;
  }

  return (
    <section className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-black/10 bg-white/80 p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600">
          <Clock className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Next available appointment</p>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-black shadow-sm">
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
            {renderCountdown()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button href={`/book-a-vet-consultation`} className="rounded-xl px-5 py-2.5 text-white bg-emerald-500 hover:bg-emerald-600">
          Schedule my appointment
          <ChevronRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
