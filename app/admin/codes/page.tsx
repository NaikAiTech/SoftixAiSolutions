"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [days, setDays] = useState<number | "">(30);
  const [desc, setDesc] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  useEffect(() => {
    fetch("/api/admin/codes").then((r) => r.json()).then((d) => setCodes(d.items));
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h1">Partner Codes</div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">Add New Company</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add Partner Company</DialogTitle>
              <DialogDescription>Create a partner company to generate code batches for.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div>
                <Label htmlFor="pc-add-name">Name</Label>
                <Input id="pc-add-name" className="mt-1" placeholder="e.g. Honey Insurance" value={companyName} onChange={(e)=> setCompanyName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={async ()=>{
                const name = (companyName||"").trim();
                if (!name) return;
                await fetch('/api/admin/partners', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name }) });
                setCompanyName("");
                setAddOpen(false);
              }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="card p-4">
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-sm muted">Code</label>
            <input className="input mt-1" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <label className="text-sm muted">Description (optional)</label>
            <input className="input mt-1" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-sm muted">Access days (blank = unlimited)</label>
            <input className="input mt-1" value={days} onChange={(e) => setDays(e.target.value === "" ? "" : parseInt(e.target.value))} />
          </div>
          <div className="flex md:justify-end">
            <button className="btn" onClick={async () => {
              await fetch("/api/admin/codes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, accessDays: days === "" ? null : days, description: desc || null }) });
              const d = await fetch("/api/admin/codes").then((r) => r.json());
              setCodes(d.items);
            }}>Create</button>
          </div>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm table">
          <thead>
            <tr><th>Code</th><th>Description</th><th>Access type</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.description || ""}</td>
                <td>{c.accessDays == null ? 'Lifetime access' : (c.accessDays === 30 ? '30 days access' : (c.accessDays === 365 ? '1-year access' : `${c.accessDays} days access`))}</td>
                <td>{c.active ? "Yes" : "No"}</td>
                <td>
                  <button className="underline mr-2" onClick={async ()=>{ await fetch("/api/admin/codes", { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify({ id: c.id, active: !c.active }) }); const d = await fetch("/api/admin/codes").then(r=>r.json()); setCodes(d.items); }}>{c.active? 'Deactivate':'Activate'}</button>
                  <button className="underline text-red-600" onClick={async ()=>{ await fetch(`/api/admin/codes?id=${c.id}`, { method:'DELETE' }); const d = await fetch("/api/admin/codes").then(r=>r.json()); setCodes(d.items); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

