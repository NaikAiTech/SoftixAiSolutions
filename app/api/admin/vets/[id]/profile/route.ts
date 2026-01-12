import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const form = await req.formData();
  const displayName = String(form.get("displayName") || "").trim();
  const zoomUserEmail = String(form.get("zoomUserEmail") || "").trim();
  const timezone = String(form.get("timezone") || "").trim();

  const data: any = {};
  if (displayName) data.displayName = displayName;
  if (zoomUserEmail) data.zoomUserEmail = zoomUserEmail;
  if (timezone) data.timezone = timezone;

  await prisma.vetProfile.update({ where: { id: params.id }, data });
  return Response.json({ ok: true });
}

