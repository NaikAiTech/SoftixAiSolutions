import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const form = await req.formData();
  const vetId = String(form.get("vetId") || "");
  if (!vetId) return new Response("Missing vetId", { status: 400 });
  await prisma.appointment.update({ where: { id: params.id }, data: { vetId } });
  return new Response(null, { status: 302, headers: { Location: `/admin/consultations/${params.id}` } });
}

