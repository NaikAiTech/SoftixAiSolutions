import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  const summary = url.searchParams.get('summary') || url.searchParams.get('mode');
  // Summary mode: returns batch summaries
  if ((summary||'').toString().toLowerCase() === '1' || (summary||'').toString().toLowerCase() === 'true' || (summary||'').toString().toLowerCase() === 'summary') {
    const batches: any[] = await prisma.partnerCodeBatch.findMany({ orderBy: { createdAt: "desc" } } as any);
    const codes: any[] = await prisma.partnerCode.findMany({} as any);
    const reds: any[] = await prisma.partnerRedemption.findMany({} as any);
    const byBatch = new Map<string, any>();
    const codesByBatch = new Map<string, any[]>();
    batches.forEach(b => { byBatch.set(b.id, b); codesByBatch.set(b.id, []); });
    for (const c of (codes||[])) { const arr = codesByBatch.get((c as any).batchId) || []; arr.push(c); codesByBatch.set((c as any).batchId, arr); }
    const redeemedByCode = new Map<string, number>();
    for (const r of (reds||[])) { const k = (r as any).codeId; redeemedByCode.set(k, (redeemedByCode.get(k)||0)+1); }
    // fetch company names to map companyId -> name
    let companies: any[] = [];
    try { companies = await prisma.partnerCompany.findMany({} as any); } catch {}
    const nameById = new Map((companies||[]).map((c:any)=> [c.id, c.name]));
    const items = batches.map((b:any)=> ({
      id: b.id,
      companyId: b.companyId,
      company: nameById.get(b.companyId) || b.companyId || '',
      description: b.description,
      accessDays: b.accessDays,
      expiresAt: b.expiresAt,
      createdAt: b.createdAt,
      codes: (codesByBatch.get(b.id)||[]).length,
      redeemed: (codesByBatch.get(b.id)||[]).reduce((acc:number,c:any)=> acc + (redeemedByCode.get(c.id)||0), 0),
      active: (codesByBatch.get(b.id)||[]).some((c:any)=> !!c.active),
    }));
    return Response.json({ items });
  }
  // Default: flat list of codes (optionally filtered by batchId)
  const where: any = batchId ? { batchId } : {};
  const items: any[] = await prisma.partnerCode.findMany({ where, orderBy: { code: "asc" } });
  try {
    const ids = items.map((c:any)=> c.id);
    if (ids.length) {
      const reds: any[] = await prisma.partnerRedemption.findMany({ where: { codeId: ids } } as any);
      const byCode = new Map<string, number>();
      for (const r of (reds||[])) { const k = (r as any).codeId; byCode.set(k, (byCode.get(k)||0)+1); }
      items.forEach((c:any)=> c.redeemedCount = byCode.get(c.id)||0);
    }
  } catch {}
  return Response.json({ items });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(()=> ({} as any));
  const { companyId, description, accessDays, expiresAt, count, prefix, code, batchId } = body || {};
  // Single-code creation mode
  if (code) {
    const data: any = { code, accessDays: accessDays ?? null, description: description || null, active: true };
    if (batchId) data.batchId = batchId;
    try {
      const row = await prisma.partnerCode.create({ data } as any);
      return Response.json({ ok: true, id: (row as any)?.id });
    } catch (e) {
      // If duplicate or any error, try to find existing to make this idempotent
      try {
        const existing = await prisma.partnerCode.findFirst({ where: { code } } as any);
        if (existing) return Response.json({ ok: true, id: (existing as any)?.id, duplicate: true });
      } catch {}
      return new Response('Failed to create code', { status: 400 });
    }
  }
  // Batch creation mode
  if (!companyId || !count) return new Response("Missing companyId/count", { status: 400 });
  // Require mm/dd/yyyy expiry for batch
  if (!expiresAt || typeof expiresAt !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(expiresAt)) {
    return new Response("Expiry date is required (mm/dd/yyyy)", { status: 400 });
  }
  const [mmStr, ddStr, yyyyStr] = (expiresAt as string).split('/');
  const mm = parseInt(mmStr), dd = parseInt(ddStr), yyyy = parseInt(yyyyStr);
  const check = new Date(Date.UTC(yyyy, mm-1, dd));
  if (!(check.getUTCFullYear()===yyyy && check.getUTCMonth()===(mm-1) && check.getUTCDate()===dd)) {
    return new Response("Invalid expiry date", { status: 400 });
  }
  const expires = new Date(Date.UTC(yyyy, mm-1, dd, 23, 59, 59, 999));
  const batch = await prisma.partnerCodeBatch.create({ data: { companyId, description: description || null, accessDays: accessDays ?? null, expiresAt: expires } } as any);
  const gen = () => Math.random().toString(36).slice(2,6).toUpperCase();
  const tag = (prefix || 'DAV').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const pfx = tag;
  for (let i=0;i<Math.min(5000, Number(count)||0); i++){
    const codeVal = `${pfx}-${gen()}-${gen()}`;
    await prisma.partnerCode.create({ data: { code: codeVal, accessDays: accessDays ?? null, description: description || 'Batch', active: true, batchId: (batch as any).id } } as any);
  }
  return Response.json({ ok: true, batchId: (batch as any).id });
}

export async function PATCH(req: Request) {
  await requireAdmin();
  const { id, active, accessDays, description } = await req.json();
  if (!id) return new Response("Missing id", { status: 400 });
  const data: any = {};
  if (active !== undefined) data.active = !!active;
  if (accessDays !== undefined) data.accessDays = accessDays === null ? null : Number(accessDays);
  if (description !== undefined) data.description = description;
  await prisma.partnerCode.update({ where: { id }, data });
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });
  await prisma.partnerCode.delete({ where: { id } }).catch(()=>{});
  return Response.json({ ok: true });
}

