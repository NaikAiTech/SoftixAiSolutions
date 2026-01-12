import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { updateZoomMeeting } from "@/lib/zoom";
import { toDate } from "date-fns-tz";
import { env } from "@/lib/env";
import { sendCustomerRescheduleNotice, sendVetBookingNotification, sendVetNotice } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const form = await req.formData();
  const startTime = String(form.get("startTime") || "");
  if (!startTime) return new Response("Missing startTime", { status: 400 });
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: { include: { user: true } } } });
  if (!appt) return new Response("Not found", { status: 404 });
  const settings = await prisma.adminSettings.findFirst({});
  const tz = (settings as any)?.defaultTimezone || "UTC";
  const utcDate = toDate(startTime, { timeZone: tz });
  if (appt.zoomMeetingId) {
    try { await updateZoomMeeting(appt.zoomMeetingId, utcDate.toISOString(), appt.durationMin || 15); } catch {}
  }
  await prisma.appointment.update({ where: { id: params.id }, data: { startTime: utcDate } });

  // Notify customer and vet
  try {
    await sendCustomerRescheduleNotice({
      phone: (appt as any).user.phone,
      email: (appt as any).user.email,
      firstName: (appt as any).user.firstName,
      startTimeISO: utcDate.toISOString(),
      appointmentId: (appt as any).id,
      videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      timezone: (appt as any).user.timezone || null,
    });
  } catch {}
  if ((appt as any).vetId) {
    try {
      await sendVetBookingNotification((appt as any).vet.user.phone, (appt as any).vet.user.email ?? null, {
        phone: (appt as any).user.phone,
        email: (appt as any).user.email,
        firstName: (appt as any).user.firstName,
        startTimeISO: utcDate.toISOString(),
        appointmentId: (appt as any).id,
        videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      });
      await sendVetNotice((appt as any).id, 'reschedule');
    } catch {}
  }

  return new Response(null, { status: 302, headers: { Location: `/admin/consultations/${params.id}` } });
}

