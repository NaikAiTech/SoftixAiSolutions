"use client";
import { useEffect, useState } from "react";

export default function ManagePage({ params }: { params: { token: string } }) {
  const [when, setWhen] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    // Minimal: not fetching appointment details; only actions
  }, [params.token]);
  return (
    <div className="container py-10">
      <h1 className="text-2xl mb-4">Manage your booking</h1>
      {when && <div className="mb-4">Current time: {when}</div>}
      <div className="space-y-3 max-w-md">
        <div className="text-lg">Reschedule</div>
        <input className="w-full border rounded px-3 py-2 bg-white" placeholder="YYYY-MM-DDTHH:mm" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={async () => {
          const res = await fetch("/api/manage", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: params.token, action: "reschedule", startTimeISO: newTime }) });
          setMsg(res.ok ? "Rescheduled" : "Failed");
        }}>Confirm reschedule</button>
        <div className="text-lg mt-6">Cancel booking</div>
        <button className="px-4 py-2 bg-white border border-neutral-300 rounded" onClick={async () => {
          const res = await fetch("/api/manage", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: params.token, action: "cancel" }) });
          setMsg(res.ok ? "Cancelled" : "Failed");
        }}>Cancel</button>
        {msg && <div className="text-sm text-neutral-700">{msg}</div>}
      </div>
    </div>
  );
}

