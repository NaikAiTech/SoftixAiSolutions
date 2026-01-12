import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  // Remove vet profile (user remains)
  await prisma.vetProfile.delete({ where: { id: params.id } }).catch(()=>{});
  return Response.json({ ok: true });
}

