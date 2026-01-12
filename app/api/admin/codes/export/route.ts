import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  const where: any = batchId ? { batchId } : {};
  const items = await prisma.partnerCode.findMany({ where, orderBy: { code: "asc" } });
  const rows = ["code,description,accessDays,expiresAt,active"].concat(items.map((c:any)=> [c.code, JSON.stringify(c.description||""), c.accessDays ?? "", (c as any).expiresAt ? new Date((c as any).expiresAt).toISOString() : "", c.active ? 1 : 0].join(',')));
  const body = rows.join("\n");
  return new Response(body, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=partner-codes.csv" } });
}

