import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendCustomerRescheduleNotice, sendCustomerStatusUpdate, sendVetBookingNotification } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { appointmentId, kind } = await req.json();
    if (!appointmentId || !kind) return new Response("Missing", { status: 400 });
    const appt = await prisma.appointment.findUnique({ where: { id: appointmentId }, include: { user: true, vet: { include: { user: true } } } });
    if (!appt || !appt.user) return new Response("Not found", { status: 404 });

    const payload = {
      phone: (appt as any).user.phone,
      email: (appt as any).user.email,
      firstName: (appt as any).user.firstName,
      startTimeISO: new Date((appt as any).startTime).toISOString(),
      appointmentId: (appt as any).id,
      videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
      timezone: (appt as any).user.timezone || null,
    } as any;

    if (kind === 'reschedule') {
      await sendCustomerRescheduleNotice(payload);
      if ((appt as any).vet?.user) {
        await sendVetBookingNotification((appt as any).vet.user.phone, (appt as any).vet.user.email ?? null, payload);
      }
    } else if (kind === 'cancel') {
      await sendCustomerStatusUpdate(payload, 'CANCELLED');
    } else if (kind === 'completed') {
      await sendCustomerStatusUpdate(payload, 'COMPLETED');
    } else {
      return new Response("Invalid kind", { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (e: any) {
    return new Response(e?.message || 'Error', { status: 500 });
  }
}