import { prisma } from "@/lib/prisma";
import { sendCustomerBookingConfirmation, sendCustomerRescheduleNotice, sendCustomerStatusUpdate, sendVetBookingNotification, sendVetNotice } from "@/lib/notifications";
import { env } from "@/lib/env";
import { updateZoomMeeting, deleteZoomMeeting } from "@/lib/zoom";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { token, action, startTimeISO } = await req.json();
  if (!token || !action) return new Response("Missing", { status: 400 });
  const mt = await prisma.apptManageToken.findUnique({ where: { token } });
  if (!mt || mt.expiresAt < new Date()) return new Response("Invalid token", { status: 400 });
  if (action === "cancel") {
    const appt = await prisma.appointment.findUnique({ where: { id: mt.appointmentId } });
    if (appt?.zoomMeetingId) {
      try { await deleteZoomMeeting(appt.zoomMeetingId); } catch {}
    }
    await prisma.appointment.update({ where: { id: mt.appointmentId }, data: { status: "CANCELLED" } });
  } else if (action === "reschedule") {
    if (!startTimeISO) return new Response("Missing startTimeISO", { status: 400 });
    const appt = await prisma.appointment.findUnique({ where: { id: mt.appointmentId } });
    if (appt?.zoomMeetingId) {
      try { await updateZoomMeeting(appt.zoomMeetingId, startTimeISO, appt.durationMin || 15); } catch {}
    }
    await prisma.appointment.update({ where: { id: mt.appointmentId }, data: { startTime: new Date(startTimeISO) } });
  }
  const appt = await prisma.appointment.findUnique({ where: { id: mt.appointmentId }, include: { user: true, vet: { include: { user: true } } } });
  if (appt) {
    try {
      const membership = await prisma.membership.findFirst({ where: { userId: (appt as any).userId, status: 'ACTIVE' } });
      const payload = {
        phone: (appt as any)?.user?.phone,
        email: (appt as any)?.user?.email,
        firstName: (appt as any)?.user?.firstName,
        startTimeISO: (appt as any).startTime.toISOString(),
        appointmentId: (appt as any).id,
        videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
        timezone: (appt as any)?.user?.timezone || null,
        coverage: membership ? 'MEMBERSHIP' : 'ONE_OFF',
        priceLabel: membership ? null : '$49',
      } as any;
      if (action === 'reschedule') await sendCustomerRescheduleNotice(payload);
      else if ((appt as any).status === 'CANCELLED' || action === 'cancel') await sendCustomerStatusUpdate(payload, 'CANCELLED');
      else await sendCustomerBookingConfirmation(payload);
    } catch {}
    if ((appt as any).vetId) {
      try {
        const vet = await prisma.vetProfile.findUnique({ where: { id: (appt as any).vetId }, include: { user: true } });
        if (vet) {
          await sendVetBookingNotification((vet as any).user.phone, (vet as any).user.email ?? null, {
            phone: (appt as any)?.user?.phone,
            email: (appt as any)?.user?.email,
            firstName: (appt as any)?.user?.firstName,
            startTimeISO: (appt as any).startTime.toISOString(),
            appointmentId: (appt as any).id,
            videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
            vetName: (vet as any).displayName,
          });
          // Also send HTML vet notice matching new templates
          await sendVetNotice((appt as any).id, action === 'reschedule' ? 'reschedule' : 'cancel');
        }
      } catch {}
    }
  }
  return Response.json({ ok: true });
}

