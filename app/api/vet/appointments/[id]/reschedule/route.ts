import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";
import { updateZoomMeeting } from "@/lib/zoom";
import { env } from "@/lib/env";
import { sendCustomerRescheduleNotice, sendVetNotice } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireVet();
  const form = await req.formData();
  const startTime = String(form.get("startTime") || "");
  if (!startTime) return new Response("Missing startTime", { status: 400 });
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: { include: { user: true } } } });
  if (!appt) return new Response("Not found", { status: 404 });
  const vet = appt.vetId ? await prisma.vetProfile.findUnique({ where: { id: appt.vetId } }) : null;
  if (!vet || (vet as any).userId !== (session as any).userId) return new Response("Forbidden", { status: 403 });
  if (appt.zoomMeetingId) {
    try { await updateZoomMeeting(appt.zoomMeetingId, new Date(startTime).toISOString(), appt.durationMin || 15); } catch {}
  }
  await prisma.appointment.update({ where: { id: params.id }, data: { startTime: new Date(startTime) } });

  // Notify customer and vet
  try {
    await sendCustomerRescheduleNotice({
      phone: (appt as any).user.phone,
      email: (appt as any).user.email,
      firstName: (appt as any).user.firstName,
      startTimeISO: new Date(startTime).toISOString(),
      appointmentId: (appt as any).id,
      videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      timezone: (appt as any).user.timezone || null,
    });
  } catch {}
  try {
    await sendVetNotice((appt as any).id, 'reschedule');
  } catch {}

  return new Response(null, { status: 302, headers: { Location: `/vet/appointments/${params.id}` } });
}

