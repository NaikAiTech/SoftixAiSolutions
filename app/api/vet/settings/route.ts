import { requireVet } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await requireVet();
  const form = await req.formData();
  const isZoomOnly = form.get("_zoom");
  const isPrefsOnly = form.get("_prefs");
  const isTzOnly = form.get("_tz");
  const zoomUserEmail = String(form.get("zoomUserEmail") ?? "");
  const displayName = String(form.get("displayName") ?? "");
  const phone = String(form.get("phone") ?? "");
  const zoomMeetingNumber = String(form.get("zoomMeetingNumber") ?? "");
  const zoomPasscode = String(form.get("zoomPasscode") ?? "");
  const emailAlerts = form.get("emailAlerts");
  const smsAlerts = form.get("smsAlerts");
  const emailAlertsOff = form.get("emailAlertsOff");
  const smsAlertsOff = form.get("smsAlertsOff");
  const status = String(form.get("status") ?? "");
  const timezone = String(form.get("timezone") ?? "");
  const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
  if (!vet) return new Response("No vet", { status: 400 });
  // Build partial update to avoid clobbering unrelated settings
  const updateCamel: any = {};
  const updateSnake: any = {};
  if (isZoomOnly) {
    updateCamel.zoomUserEmail = zoomUserEmail || null;
    if (displayName) updateCamel.displayName = displayName;
    // Phone belongs to linked users row for the vet
    if (phone) updateCamel.phone = phone;
  }
  if (isTzOnly) {
    if (timezone) updateCamel.timezone = timezone;
  }
  if (isPrefsOnly) {
    const existingEmail = ((vet as any).emailAlerts ?? (vet as any).email_alerts ?? false) as boolean;
    const existingSms = ((vet as any).smsAlerts ?? (vet as any).sms_alerts ?? false) as boolean;
    const nextEmail = emailAlerts ? true : (emailAlertsOff ? false : existingEmail);
    const nextSms = smsAlerts ? true : (smsAlertsOff ? false : existingSms);
    updateSnake.email_alerts = nextEmail;
    updateSnake.sms_alerts = nextSms;
    updateCamel.emailAlerts = nextEmail;
    updateCamel.smsAlerts = nextSms;
  }
  if (!isZoomOnly && !isPrefsOnly && !isTzOnly) {
    // Full update fallback
    updateCamel.zoomUserEmail = zoomUserEmail || null;
    if (displayName) updateCamel.displayName = displayName;
    if (phone) updateCamel.phone = phone;
    const existingEmail = ((vet as any).emailAlerts ?? (vet as any).email_alerts ?? false) as boolean;
    const existingSms = ((vet as any).smsAlerts ?? (vet as any).sms_alerts ?? false) as boolean;
    const nextEmail = emailAlerts ? true : (emailAlertsOff ? false : existingEmail);
    const nextSms = smsAlerts ? true : (smsAlertsOff ? false : existingSms);
    updateSnake.email_alerts = nextEmail;
    updateSnake.sms_alerts = nextSms;
    updateCamel.emailAlerts = nextEmail;
    updateCamel.smsAlerts = nextSms;
  }
  if (timezone && !isPrefsOnly && !isZoomOnly) {
    updateCamel.timezone = timezone;
  }
  // Always preserve status and zoom meeting number/passcode when provided
  if (zoomMeetingNumber) updateSnake.zoom_meeting_number = zoomMeetingNumber;
  if (zoomPasscode) updateSnake.zoom_passcode = zoomPasscode;
  if (status === 'ONLINE' || status === 'OFFLINE') updateCamel.status = status;

  try {
    if (Object.keys(updateSnake).length) {
      await prisma.vetProfile.update({ where: { id: vet.id }, data: updateSnake });
    }
    if (Object.keys(updateCamel).length) {
      await prisma.vetProfile.update({ where: { id: vet.id }, data: updateCamel });
    }
  } catch (e) {
    // As a fallback, try camel-only
    if (Object.keys(updateCamel).length) {
      await prisma.vetProfile.update({ where: { id: vet.id }, data: updateCamel });
    }
  }
  const accept = req.headers.get('accept') || '';
  if (accept.includes('application/json')) {
    return Response.json({ ok: true });
  }
  return new Response(null, { status: 302, headers: { Location: "/vet/settings" } });
}

export async function GET() {
  const session = await requireVet();
  const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId }, include: { user: true } as any });
  if (!vet) return Response.json({ emailAlerts: false, smsAlerts: false, status: 'OFFLINE' });
  return Response.json({
    emailAlerts: !!(((vet as any).emailAlerts) ?? ((vet as any).email_alerts) ?? false),
    smsAlerts: !!(((vet as any).smsAlerts) ?? ((vet as any).sms_alerts) ?? false),
    status: (vet as any).status ?? 'OFFLINE',
    zoomUserEmail: (vet as any).zoomUserEmail ?? null,
    displayName: (vet as any).displayName ?? "",
    timezone: (vet as any).timezone ?? null,
    zoomMeetingNumber: ((vet as any).zoomMeetingNumber ?? (vet as any).zoom_meeting_number) ?? null,
    zoomPasscode: ((vet as any).zoomPasscode ?? (vet as any).zoom_passcode) ?? null,
    phone: (vet as any).phone ?? null,
  });
}

export const dynamic = "force-dynamic";

