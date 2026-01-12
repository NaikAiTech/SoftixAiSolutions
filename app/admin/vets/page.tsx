import React from "react";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function AdminVetsPage() {
  const vets = await prisma.vetProfile.findMany({ include: { user: true } });
  const users = await prisma.user.findMany({ take: 50, orderBy: { createdat: "desc" } });
  return (
    <div className="space-y-4">
      <div className="text-xl">Vets</div>
      <div className="bg-white border border-neutral-200 rounded p-2">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Availability</th></tr></thead>
          <tbody>
            {vets.map((v: any) => (
              <tr key={v.id} className="border-b align-top">
                <td className="p-2">{v.displayName}</td>
                <td className="p-2">{v.user.email ?? ""}</td>
                <td className="p-2">
                  <VetAvailabilityAdmin vetId={v.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xl">Users</div>
      <div className="bg-white border border-neutral-200 rounded">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-2">Phone</th><th className="text-left p-2">Role</th><th className="text-left p-2">Actions</th></tr></thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <form className="inline" action={`/api/admin/vets/${u.id}/promote`} method="post"><button className="underline mr-2" type="submit">Promote to Vet</button></form>
                  <form className="inline" action={`/api/admin/vets/${u.id}/demote`} method="post"><button className="underline" type="submit">Demote to Customer</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VetAvailabilityAdmin({ vetId }: { vetId: string }){
  const [rows, setRows] = React.useState<any[]>([]);
  const [weekday, setWeekday] = React.useState<number>(1);
  const [start, setStart] = React.useState<string>("09:00");
  const [end, setEnd] = React.useState<string>("17:00");
  React.useEffect(()=>{ (async()=>{ const d = await fetch(`/api/admin/vets/${vetId}/availability`).then(r=>r.json()); setRows(d.items||[]); })(); },[vetId]);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={weekday} onChange={(e)=> setWeekday(parseInt(e.target.value))}>{days.map((d,i)=>(<option key={d} value={i}>{d}</option>))}</select>
        <input className="border rounded px-2 py-1" type="time" value={start} onChange={(e)=> setStart(e.target.value)} />
        <input className="border rounded px-2 py-1" type="time" value={end} onChange={(e)=> setEnd(e.target.value)} />
        <button className="border rounded px-3 py-1" onClick={async ()=>{ await fetch(`/api/admin/vets/${vetId}/availability`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ weekday, start, end }) }); const d = await fetch(`/api/admin/vets/${vetId}/availability`).then(r=>r.json()); setRows(d.items||[]); }}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {rows.length===0 && (<span className="text-xs text-neutral-500">No blocks</span>)}
        {rows.map((r:any)=> (
          <span key={r.id} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
            {days[r.weekday]} {r.start}–{r.end}
            <button className="text-neutral-500 hover:text-black" onClick={async ()=>{ await fetch(`/api/admin/vets/${vetId}/availability?blockId=${r.id}`, { method:'DELETE' }); setRows(rows.filter(x=>x.id!==r.id)); }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

