import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import Stripe from "stripe";
import { sendCustomerBookingConfirmation, sendVetBookingNotification } from "@/lib/notifications";
import { createZoomMeeting } from "@/lib/zoom";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return new Response("Stripe not configured", { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointmentId = session.metadata?.appointmentId;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as "oneOff" | "annual" | "biennial" | undefined;
    const timezone = session.metadata?.timezone || undefined;
    if (appointmentId && userId) {
      await prisma.appointment.update({ where: { id: appointmentId }, data: { status: "SCHEDULED" } });
      if (plan && plan !== "oneOff" && session.subscription) {
        await prisma.membership.upsert({
          where: { userId },
          update: { status: "ACTIVE", stripeSubId: session.subscription as string, plan },
          create: { userId, status: "ACTIVE", stripeSubId: session.subscription as string, plan },
        });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      let appt = await prisma.appointment.findUnique({ where: { id: appointmentId } });
      // Create Zoom meeting after payment (avoid abandoned)
      if (appt?.vetId && !appt.zoomMeetingId) {
        const vet = await prisma.vetProfile.findUnique({ where: { id: appt.vetId } });
        if (vet?.zoomUserEmail) {
          try {
            const zm = await createZoomMeeting(vet.zoomUserEmail, new Date(appt.startTime as any).toISOString(), appt.durationMin || 15, `Consultation`);
            appt = await prisma.appointment.update({ where: { id: appointmentId }, data: { zoomMeetingId: zm.id, zoomJoinUrl: zm.join_url, zoomStartUrl: zm.start_url, zoomPassword: zm.password ?? null } });
          } catch {}
        }
      }
      if (user && appt) {
        const mt = await prisma.apptManageToken.findFirst({ where: { appointmentId: appt.id }, orderBy: { expiresAt: 'desc' } });
        await sendCustomerBookingConfirmation({
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          startTimeISO: new Date(appt.startTime as any).toISOString(),
          appointmentId: appt.id,
          videoLink: `${env.NEXTAUTH_URL}/meet/${appt.id}`,
          manageUrl: mt ? `${env.NEXTAUTH_URL}/manage/${mt.token}` : undefined,
          timezone: timezone || user.timezone || null,
          coverage: !plan || plan === 'oneOff' ? 'ONE_OFF' : (plan === 'annual' ? 'ANNUAL' : 'BIENNIAL'),
          priceLabel: !plan || plan === 'oneOff' ? '$49' : (plan === 'annual' ? '' : '$299'),
        });
        if (appt.vetId) {
          const vet = await prisma.vetProfile.findUnique({ where: { id: appt.vetId }, include: { user: true } });
          if (vet) {
            await sendVetBookingNotification(vet.user.phone, vet.user.email ?? null, {
              phone: user.phone,
              email: user.email,
              firstName: user.firstName,
              startTimeISO: new Date(appt.startTime as any).toISOString(),
              appointmentId: appt.id,
              videoLink: `${env.NEXTAUTH_URL}/meet/${appt.id}`,
              vetName: vet.displayName,
            });
            // Also send vet email notification if enabled (parity with non-Stripe path)
            const { sendVetNotice } = await import('@/lib/notifications');
            await sendVetNotice(appt.id, 'assigned');
          }
        }
      }
    }
  }

  return new Response("ok");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

