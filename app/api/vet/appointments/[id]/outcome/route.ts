import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";
import { env } from "@/lib/env";
import { sendCustomerStatusUpdate, sendVetNotice } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await requireVet();
  const body = await req.json().catch(() => ({}));
  const outcome = body?.outcome as string | undefined;
  if (!outcome || !["emergency","home-care","no-treatment"].includes(outcome)) {
    return new Response("Bad Request", { status: 400 });
  }
  // Update outcome and mark as completed
  await prisma.appointment.update({ where: { id: params.id }, data: { outcome, status: 'COMPLETED' } as any });

  // Send completion notifications (best-effort)
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: { include: { user: true } } } });
    if (appt?.user?.phone || appt?.user?.email) {
      await sendCustomerStatusUpdate({
        phone: (appt as any).user.phone,
        email: (appt as any).user.email,
        firstName: (appt as any).user.firstName,
        startTimeISO: new Date((appt as any).startTime).toISOString(),
        appointmentId: (appt as any).id,
        videoLink: `${env.NEXTAUTH_URL}/meet/${(appt as any).id}`,
        timezone: (appt as any).user.timezone || null,
      }, 'COMPLETED');
    }
    if ((appt as any)?.vetId) {
      await sendVetNotice((appt as any).id, 'completed');
    }
  } catch {}

  return Response.json({ ok: true });
}

