import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const form = await req.formData();
  const status = String(form.get("status") || "");
  if (!status) return new Response("Missing status", { status: 400 });
  await prisma.vetProfile.update({ where: { id: params.id }, data: { status } });
  return Response.json({ ok: true });
}

