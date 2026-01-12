import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const user = await prisma.user.update({ where: { id: params.id }, data: { role: "VET" } });
  const exists = await prisma.vetProfile.findFirst({ where: { userId: user.id } });
  if (!exists) {
    await prisma.vetProfile.create({ data: { userId: user.id, displayName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.phone } });
  }
  return new Response(null, { status: 302, headers: { Location: "/admin/vets" } });
}

