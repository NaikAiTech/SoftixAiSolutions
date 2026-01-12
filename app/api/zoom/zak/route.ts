import { getHostZak } from "@/lib/zoom";
import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";

export async function GET(req: Request) {
  const session = await requireVet();
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get("appointmentId");
  if (!appointmentId) return new Response("Missing appointmentId", { status: 400 });
  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId }, include: { vet: true } });
  if (!appt || !appt.vetId || appt.vetId !== (await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } }))?.id) {
    return new Response("Forbidden", { status: 403 });
  }
  const hostEmail = (appt as any)?.vet?.zoomUserEmail;
  if (!hostEmail) return new Response("No host email", { status: 400 });
  const zak = await getHostZak(hostEmail);
  return Response.json({ zak });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
