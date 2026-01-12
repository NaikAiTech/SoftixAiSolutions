import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { deleteZoomMeeting } from "@/lib/zoom";
import { env } from "@/lib/env";
import { sendCustomerStatusUpdate, sendVetNotice } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: { include: { user: true } } } });
  if (appt?.zoomMeetingId) { try { await deleteZoomMeeting(appt.zoomMeetingId); } catch {} }
  await prisma.appointment.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  if (appt?.user) {
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
  }
  if ((appt as any)?.vetId) {
    try { await sendVetNotice((appt as any).id, 'cancel'); } catch {}
  }
  return new Response(null, { status: 302, headers: { Location: "/admin/consultations" } });
}

