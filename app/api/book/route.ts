import { prisma } from "@/lib/prisma";
import { createSupabaseRouteHandler } from "@/lib/supabase";
import { toDate } from "date-fns-tz";
import { getStripe, priceIdForPlan, type Plan } from "@/lib/stripe";
import { env, hasStripe } from "@/lib/env";
import { sendCustomerBookingConfirmation, sendVetBookingNotification } from "@/lib/notifications";
import { createZoomMeeting } from "@/lib/zoom";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    startTimeISO,
    form,
    plan,
    timezone,
  }: {
    startTimeISO: string;
    form: any;
    plan: Plan;
    timezone?: string;
  } = body;

  // Treat provided ISO as an absolute instant (already UTC-based)
  const tz = timezone || form?.timezone || form?.tz || null;
  const startTime = new Date(startTimeISO);
  if (isNaN(startTime.getTime()) || startTime <= new Date()) {
    return new Response("Invalid or past start time", { status: 400 });
  }

  // Determine current auth session and potential existing user by phone/email
  const supabase = createSupabaseRouteHandler();
  const { data: authData } = await supabase.auth.getUser();
  const authedUser = authData.user || null;

  // Save user's timezone, but first gate duplicates for unauthenticated flows
  const normalizedPhone = form?.phone ? String(form.phone).replace(/[^0-9]/g, "") : null;
  const existingByPhone = normalizedPhone ? await prisma.user.findUnique({ where: { phone: normalizedPhone } }) : null;
  const existingByEmail = !existingByPhone && form?.email ? await prisma.user.findFirst({ where: { email: form.email } }) : null;
  const existingUser = existingByPhone || existingByEmail;

  if (!authedUser && existingUser) {
    // Ask client to perform OTP auth to avoid creating/updating under a non-verified session
    return new Response(JSON.stringify({ requiresOtp: true }), { status: 401, headers: { 'content-type': 'application/json' } });
  }

  let user = await prisma.user.findUnique({ where: { phone: normalizedPhone || undefined } as any });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: normalizedPhone,
        email: form.email ?? null,
        timezone: tz ?? null,
        firstName: form.firstName ?? null,
        lastName: form.lastName ?? null,
      },
    });
    // Provision Supabase Auth user for OTP login if not exists
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const admin = getSupabaseAdmin();
      const e164 = form.phone as string;
      await admin.auth.admin.createUser({ phone: e164, phone_confirm: false });
    } catch {}
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: form.email ?? user.email,
        // Only set timezone on first booking (when it's currently null)
        timezone: user.timezone ?? tz ?? null,
        firstName: form.firstName ?? user.firstName,
        lastName: form.lastName ?? user.lastName,
      },
    });
    // Ensure Supabase Auth user exists for this phone
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const admin = getSupabaseAdmin();
      const e164 = form.phone as string;
      await admin.auth.admin.createUser({ phone: e164, phone_confirm: false });
    } catch {}
  }

  // Determine matching vet availability in the same reference timezone as /api/availability
  // Use UTC as the reference timezone for availability matching
  const baseTz = "UTC";
  const fmtYMD = new Intl.DateTimeFormat('en-CA', { timeZone: baseTz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: baseTz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const ymd = fmtYMD.format(startTime);
  const dayBase = toDate(`${ymd}T00:00:00`, { timeZone: baseTz });
  const weekday = dayBase.getUTCDay();
  const hmParts = fmtHM.formatToParts(startTime);
  const hh = hmParts.find(p => p.type === 'hour')?.value || '00';
  const mm = hmParts.find(p => p.type === 'minute')?.value || '00';
  const timeStr = `${hh}:${mm}`;

  // pick a vet who is available at that time and not yet booked
  const avails = await prisma.availability.findMany({ where: { weekday } });
  const candidateVetIds = (avails as any[]).filter((a: any) => a.start <= timeStr && a.end > timeStr).map((a: any) => a.vetId);
  let vetIdToAssign: string | null = null;
  for (const vid of candidateVetIds) {
    const count = (await prisma.appointment.findMany({ where: { vetId: vid, startTime } })).length;
    if (count === 0) { vetIdToAssign = vid; break; }
  }
  if (!vetIdToAssign && candidateVetIds.length) vetIdToAssign = candidateVetIds[0];
  // final capacity re-check across all candidates
  if (!vetIdToAssign) {
    const bookedAtTime = await prisma.appointment.findMany({ where: { startTime } });
    const bookedVetIds = new Set((bookedAtTime as any[]).map((b: any) => b.vetId).filter(Boolean));
    const totalAvailable = new Set(candidateVetIds).size;
    if (bookedVetIds.size >= totalAvailable) {
      return new Response("No capacity at this time", { status: 409 });
    }
  }
  // Treat expired memberships as inactive
  const m = await prisma.membership.findFirst({ where: { userId: user.id, status: "ACTIVE" } });
  const now = new Date();
  const hasActiveMembership = !!(m && (!m.expiresAt || new Date(m.expiresAt) > now));
  const appointment = await prisma.appointment.create({
    data: {
      userId: user.id,
      startTime,
      status: hasActiveMembership ? "SCHEDULED" : (hasStripe() && plan !== "oneOff" ? "PENDING_PAYMENT" : hasStripe() ? "PENDING_PAYMENT" : "SCHEDULED"),
      durationMin: 15,
      vetId: vetIdToAssign || undefined,
      concern: form.concern ?? form.concerns ?? null,
      petName: form.petName ?? null,
      animal: form.animal ?? null,
      breed: form.breed ?? null,
      age: form.age ?? null,
      conditions: form.conditions ?? null,
      sex: form.sex ?? null,
      desexed: form.desexed ?? null,
    },
  });

  // create manage token
  const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  await prisma.apptManageToken.create({ data: { appointmentId: appointment.id, token, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });

  // create Zoom meeting automatically for assigned vet
  const vet = appointment.vetId ? await prisma.vetProfile.findUnique({ where: { id: appointment.vetId } }) : null;
  if (vet?.zoomUserEmail) {
    try {
      const zm = await createZoomMeeting(vet.zoomUserEmail, new Date(appointment.startTime as any).toISOString(), 15, `Consultation with ${user.firstName ?? user.phone}`);
      await prisma.appointment.update({ where: { id: appointment.id }, data: { zoomMeetingId: zm.id, zoomJoinUrl: zm.join_url, zoomStartUrl: zm.start_url, zoomPassword: zm.password ?? null } });
    } catch (e) {
      console.error("zoom create failed", e);
    }
  }

  if (hasActiveMembership || !hasStripe()) {
    const mt = await prisma.apptManageToken.findFirst({ where: { appointmentId: appointment.id }, orderBy: { expiresAt: 'desc' } });
    await sendCustomerBookingConfirmation({
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      startTimeISO: new Date(appointment.startTime as any).toISOString(),
      appointmentId: appointment.id,
      videoLink: `${env.NEXTAUTH_URL.replace(/\/+$/g, "")}/meet/${appointment.id}`,
      manageUrl: mt ? `${env.NEXTAUTH_URL.replace(/\/+$/g, "")}/manage/${mt.token}` : undefined,
      timezone: tz || user.timezone || null,
      coverage: hasActiveMembership ? 'MEMBERSHIP' : 'ONE_OFF',
      priceLabel: hasActiveMembership ? null : '$49',
    });
    if (appointment.vetId) {
      const vet = await prisma.vetProfile.findUnique({ where: { id: appointment.vetId }, include: { user: true } });
      if (vet) {
        await sendVetBookingNotification(vet.user.phone, vet.user.email ?? null, {
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          startTimeISO: new Date(appointment.startTime as any).toISOString(),
          appointmentId: appointment.id,
          videoLink: `${env.NEXTAUTH_URL}/meet/${appointment.id}`,
          vetName: vet.displayName,
        });
        const { sendVetNotice } = await import('@/lib/notifications');
        await sendVetNotice(appointment.id, 'assigned');
      }
    }
    return Response.json({ ok: true, scheduled: true, appointmentId: appointment.id });
  }

  const stripe = getStripe();
  if (!stripe) return new Response("Stripe not configured", { status: 500 });

  // Prefer admin-configured price ID if set
  let priceId = priceIdForPlan(plan);
  try {
    const s = await prisma.adminSettings.findFirst({});
    if (plan === 'oneOff' && (s as any)?.plan_one_off_price_id) priceId = (s as any).plan_one_off_price_id;
    if (plan === 'annual' && (s as any)?.plan_annual_price_id) priceId = (s as any).plan_annual_price_id;
    if (plan === 'biennial' && (s as any)?.plan_biennial_price_id) priceId = (s as any).plan_biennial_price_id;
  } catch {}
  if (!priceId) return new Response("Missing price id", { status: 500 });

  const mode = plan === "oneOff" ? "payment" : "subscription";
  const session = await stripe.checkout.sessions.create({
    mode: mode as any,
    customer_email: user.email || undefined,
    line_items: [
      { price: priceId, quantity: 1 },
    ],
    success_url: `${env.STRIPE_SUCCESS_URL}&appointmentId=${appointment.id}&slot=${encodeURIComponent(startTime.toISOString())}&tz=${encodeURIComponent((tz || user.timezone || ''))}`,
    cancel_url: `${env.STRIPE_CANCEL_URL}&appointmentId=${appointment.id}&slot=${encodeURIComponent(startTime.toISOString())}&tz=${encodeURIComponent((tz || user.timezone || ''))}`,
    metadata: {
      appointmentId: appointment.id,
      userId: user.id,
      plan,
      timezone: tz || user.timezone || '',
    },
  });

  return Response.json({ url: session.url });
}

