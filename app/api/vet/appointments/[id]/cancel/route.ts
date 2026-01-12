import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";
import { deleteZoomMeeting } from "@/lib/zoom";
import { env } from "@/lib/env";
import { sendCustomerStatusUpdate } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireVet();
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!appt) return new Response("Not found", { status: 404 });
  const vet = appt.vetId ? await prisma.vetProfile.findUnique({ where: { id: appt.vetId } }) : null;
  if (!vet || (vet as any).userId !== (session as any).userId) return new Response("Forbidden", { status: 403 });
  if (appt.zoomMeetingId) { try { await deleteZoomMeeting(appt.zoomMeetingId); } catch {} }
  await prisma.appointment.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  try {
    await sendCustomerStatusUpdate({
      phone: (appt as any).user.phone,
      email: (appt as any).user.email,
      firstName: (appt as any).user.firstName,
      startTimeISO: new Date((appt as any).startTime).toISOString(),
      appointmentId: (appt as any).id,
      videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      timezone: (appt as any).user.timezone || null,
    }, 'CANCELLED');
  } catch {}
  return new Response(null, { status: 302, headers: { Location: "/vet" } });
}

