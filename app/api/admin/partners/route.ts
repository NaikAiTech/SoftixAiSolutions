import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const active = url.searchParams.get("active");
  const where: any = {};
  if (active != null) where.active = String(active).toLowerCase() === "true";
  let items: any[] = await prisma.partnerCompany.findMany({ where, orderBy: { createdAt: "desc" } } as any);
  if (q) items = items.filter((c:any)=> String(c.name||"").toLowerCase().includes(q));
  return Response.json({ items });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(()=> ({} as any));
  const { name, description, websiteUrl, defaultAccessDays, codePrefix, active } = body || {};
  if (!name || String(name).trim().length < 2) return new Response("Name is required", { status: 400 });
  const data: any = {
    name: String(name).trim(),
    description: description || null,
    websiteUrl: websiteUrl || null,
    defaultAccessDays: defaultAccessDays == null ? null : Number(defaultAccessDays),
    codePrefix: codePrefix ? String(codePrefix).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) : null,
    active: active == null ? true : !!active,
  };
  const row = await prisma.partnerCompany.create({ data } as any);
  return Response.json({ ok: true, id: (row as any).id });
}

export async function PATCH(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(()=> ({} as any));
  const { id, name, description, websiteUrl, defaultAccessDays, codePrefix, active } = body || {};
  if (!id) return new Response("Missing id", { status: 400 });
  const data: any = {};
  if (name != null) data.name = String(name).trim();
  if (description !== undefined) data.description = description || null;
  if (websiteUrl !== undefined) data.websiteUrl = websiteUrl || null;
  if (defaultAccessDays !== undefined) data.defaultAccessDays = defaultAccessDays == null ? null : Number(defaultAccessDays);
  if (codePrefix !== undefined) data.codePrefix = codePrefix ? String(codePrefix).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) : null;
  if (active !== undefined) data.active = !!active;
  await prisma.partnerCompany.update({ where: { id }, data } as any);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });
  // soft delete: set active=false
  await prisma.partnerCompany.update({ where: { id }, data: { active: false } } as any);
  return Response.json({ ok: true });
}
