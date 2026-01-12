"use client";
import * as React from "react";
export function Calendar({ mode, selected, onSelect }: any){
  const [from, setFrom] = React.useState<string>(()=> selected?.from ? toInputDate(selected.from) : "");
  const [to, setTo] = React.useState<string>(()=> selected?.to ? toInputDate(selected.to) : "");
  function toInputDate(d: Date){
    const iso = new Date(d).toISOString();
    return iso.slice(0,10);
  }
  function handleChange(nextFrom?: string, nextTo?: string){
    const f = nextFrom ?? from; const t = nextTo ?? to;
    setFrom(f); setTo(t);
    if (f && t && onSelect) {
      onSelect({ from: new Date(f), to: new Date(t) });
    }
  }
  return (
    <div className="grid gap-2 p-2">
      <div className="text-xs text-neutral-600">Select date range</div>
      <div className="grid grid-cols-2 gap-2">
        <input aria-label="From" type="date" className="border rounded px-2 py-1" value={from} onChange={(e)=> handleChange(e.target.value, undefined)} />
        <input aria-label="To" type="date" className="border rounded px-2 py-1" value={to} onChange={(e)=> handleChange(undefined, e.target.value)} />
      </div>
    </div>
  );
}

