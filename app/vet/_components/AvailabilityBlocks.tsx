"use client";
import { useEffect, useMemo, useState } from "react";

export default function AvailabilityBlocks() {
  const [rows, setRows] = useState<any[]>([]);
  const [weekday, setWeekday] = useState(0);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  async function refresh() {
    const d = await fetch("/api/vet/availability").then((r) => r.json());
    setRows(d.items || []);
  }

  useEffect(() => { refresh(); }, []);

  const grouped = useMemo(() => {
    const g: Record<number, any[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    for (const r of rows) { (g[r.weekday] ||= []).push(r); }
    for (const k of Object.keys(g)) { g[Number(k)].sort((a,b)=> (a.start as string).localeCompare(b.start as string)); }
    return g;
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <div className="text-sm text-neutral-700 mb-2">Select a day and add one or more time blocks</div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {days.map((d, i) => (
            <button key={d} onClick={() => setWeekday(i)} className={`chip ${weekday===i? 'outline outline-1 outline-black/80' : ''}`}>{d}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-sm text-neutral-600">Start</label>
            <input type="time" className="input mt-1" value={start} onChange={(e)=> setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-neutral-600">End</label>
            <input type="time" className="input mt-1" value={end} onChange={(e)=> setEnd(e.target.value)} />
          </div>
          <div>
            <button className="btn w-full" onClick={async () => {
              await fetch("/api/vet/availability", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ weekday, start, end }) });
              await refresh();
            }}>Add block</button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="section-title mb-2">Your weekly availability</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((d, i) => (
            <div key={d} className="border border-black/10 rounded-xl p-3">
              <div className="text-sm font-medium mb-2">{d}</div>
              <div className="flex flex-wrap gap-2">
                {(grouped[i]||[]).length === 0 && (
                  <span className="text-sm text-neutral-500">No blocks</span>
                )}
                {(grouped[i]||[]).map((r:any) => (
                  <span key={r.id} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
                    {r.start} – {r.end}
                    <button aria-label="Remove" className="text-neutral-500 hover:text-black" onClick={async ()=>{
                      await fetch(`/api/vet/availability?id=${r.id}`, { method: 'DELETE' });
                      await refresh();
                    }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}