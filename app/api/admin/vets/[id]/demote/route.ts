import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  await prisma.user.update({ where: { id: params.id }, data: { role: "CUSTOMER" } });
  return new Response(null, { status: 302, headers: { Location: "/admin/vets" } });
}

