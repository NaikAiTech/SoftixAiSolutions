import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const items = await prisma.appointment.findMany({ orderBy: { startTime: "desc" }, take: 200, include: { user: true, vet: true } });
  return Response.json({ items });
}

