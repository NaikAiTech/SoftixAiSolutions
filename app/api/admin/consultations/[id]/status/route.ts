import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { deleteZoomMeeting } from "@/lib/zoom";
import { env } from "@/lib/env";
import { sendCustomerStatusUpdate } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const form = await req.formData();
  const status = String(form.get("status") || "").toUpperCase();
  const allowed = new Set(["SCHEDULED", "CANCELLED", "COMPLETED", "NO_SHOW", "PENDING_PAYMENT"]);
  if (!allowed.has(status)) return new Response("Invalid status", { status: 400 });
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!appt) return new Response("Not found", { status: 404 });
  if (status === "CANCELLED" && (appt as any).zoomMeetingId) {
    try { await deleteZoomMeeting((appt as any).zoomMeetingId); } catch {}
  }
  await prisma.appointment.update({ where: { id: params.id }, data: { status } });
  // Notify customer on key status changes
  if ((status === 'CANCELLED' || status === 'COMPLETED') && (appt as any).user?.phone) {
    await sendCustomerStatusUpdate({
      phone: (appt as any).user.phone,
      email: (appt as any).user.email,
      firstName: (appt as any).user.firstName,
      startTimeISO: new Date((appt as any).startTime).toISOString(),
      appointmentId: (appt as any).id,
      videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      timezone: (appt as any).user.timezone || null,
    }, status as any);
  }
  return Response.json({ ok: true });
}

