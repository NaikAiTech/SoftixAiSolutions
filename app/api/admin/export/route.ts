import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const items = await prisma.appointment.findMany({ orderBy: { startTime: "desc" }, include: { user: true, vet: { include: { user: true } } } });
  const header = ["id","startTime","status","userPhone","userEmail","vetName"].join(",");
  const lines = items.map((a: any) => [
    a.id,
    a.startTime.toISOString(),
    a.status,
    a.user.phone,
    a.user.email ?? "",
    a.vet?.displayName ?? "",
  ].map((v) => `"${String(v).replaceAll('"','""')}"`).join(","));
  const csv = [header, ...lines].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=consultations.csv" } });
}

