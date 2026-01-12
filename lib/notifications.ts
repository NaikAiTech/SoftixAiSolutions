import { env, siteUrl } from "./env";
import { prisma } from "@/lib/prisma";

export type BookingCoverage = "ONE_OFF" | "ANNUAL" | "BIENNIAL" | "MEMBERSHIP" | "UNKNOWN";

const LOGO_URL = "https://cdn.prod.website-files.com/65bea380e36b396fedfb84a5/65bea968f2e303fd2cd0cfdb_Dial%20A%20Vet%20-%20Green%20Logo%20.avif";

type BookingInfo = {
  phone: string;
  email?: string | null;
  firstName?: string | null;
  startTimeISO: string;
  appointmentId: string;
  videoLink?: string | null;
  vetName?: string | null;
  manageUrl?: string | null;
  timezone?: string | null;
  coverage?: BookingCoverage; // determines payment block
  priceLabel?: string | null; // optional display e.g. "$49"
};

function fmtDate(d: Date, tz?: string | null) {
  try {
    return new Intl.DateTimeFormat(undefined, { timeZone: tz || undefined, year: 'numeric', month: 'short', day: '2-digit' }).format(d);
  } catch { return d.toDateString(); }
}
function fmtTime(d: Date, tz?: string | null) {
  try {
    return new Intl.DateTimeFormat(undefined, { timeZone: tz || undefined, hour: 'numeric', minute: '2-digit' }).format(d);
  } catch { return d.toLocaleTimeString(); }
}

function baseEmailHtml({ title, subtitle, contentHtml, cta }: { title: string; subtitle?: string; contentHtml: string; cta?: { href: string; label: string } }) {
  const btn = cta ? `<div style="margin-top:16px" class="center"><a class="btn" href="${cta.href}">${cta.label}</a></div>` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;color:#1b1b1b;}
    .wrap{width:100%;padding:24px 0;}
    .container{max-width:640px;margin:0 auto;background:#ffffff;}
    .card{background:#ffffff;border-radius:20px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .center{text-align:center}
    .h1{font-size:32px;line-height:1.25;margin:16px 0 12px;letter-spacing:.2px;font-weight:normal;color:#0AA56B}
    .h2{font-size:22px;line-height:1.4;margin:0 0 18px;color:#2a2a2a;font-weight:normal}
    .p{font-size:18px;line-height:1.5;margin:0 0 18px;color:#333;font-weight:normal}
    .logo{max-width:160px;height:auto}
    .btn{display:inline-block;background:#0AA56B;color:#fff !important;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:normal;font-size:18px}
    .footer{font-size:13px;color:#666;margin-top:22px;text-align:center}
    .block{margin:20px 0;padding:16px;background:#f5f5f5;border-radius:12px;font-size:16px;color:#333;font-weight:normal}
    .row{margin:6px 0;display:flex;justify-content:space-between;gap:12px}
    .label{color:#555}
    .value{color:#1b1b1b}
    a{color:#0AA56B;text-decoration:none}
    @media (max-width:480px){ .h1{font-size:26px} .p{font-size:16px} .row{display:block} }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="container">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td class="center" style="padding:10px 20px 0">
            <img class="logo" src="${LOGO_URL}" alt="Dial A Vet">
          </td>
        </tr>
        <tr>
          <td class="center" style="padding:24px 20px 0">
            <div class="h1">${title}</div>
            ${subtitle ? `<div class="h2">${subtitle}</div>` : ''}
          </td>
        </tr>
        ${contentHtml}
        <tr>
          <td class="footer" style="padding:20px">Need more help? Email us at <a href="mailto:support@dialavet.com.au">support@dialavet.com.au</a></td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerEmailHtml(info: BookingInfo) {
  const baseUrl = siteUrl();
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  const bookingUrl = `${baseUrl}/booking`;
  let paymentRow = '';
  const cov = info.coverage || 'UNKNOWN';
  if (cov === 'MEMBERSHIP') paymentRow = `<div class="row"><span class="value">Included in your Unlimited membership (free)</span></div>`;
  else if (cov === 'ANNUAL') paymentRow = `<div class="row"><span class="value">${info.priceLabel || ''} 1-Year Membership</span></div>`;
  else if (cov === 'BIENNIAL') paymentRow = `<div class="row"><span class="value">${info.priceLabel || ''} 2-Year Membership</span></div>`;
  else if (cov === 'ONE_OFF') paymentRow = `<div class="row"><span class="value">${info.priceLabel || ''} One-off Consultation</span></div>`;
  else paymentRow = `<div class="row"><span class="value">Consultation — see your receipt for details</span></div>`;

  const contentHtml = `
  <tr>
    <td style="padding:0 20px 8px">
      <div class="block">
        <div class="row"><span class="label">Appointment details:</span></div>
        <div class="row"><span class="label">Time:</span><span class="value">${timeLabel}</span></div>
        <div class="row"><span class="label">Date:</span><span class="value">${dateLabel}</span></div>
        <div class="row"><span class="label">Manage:</span><span class="value"><a href="${bookingUrl}">${bookingUrl}</a></span></div>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 20px 8px">
      <div class="card">
        <div class="h2" style="font-size:20px;margin-bottom:12px;">How to Access</div>
        <div class="p" style="margin:0;">You’ll receive a Calendly confirmation with your meeting link. You can also return to our booking page to schedule another consult.</div>
        <div style="margin-top:16px" class="center"><a class="btn" href="${bookingUrl}">Open Booking</a></div>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 20px 8px">
      <div class="block">
        <div class="row"><span class="label">Payment</span></div>
        ${paymentRow}
      </div>
    </td>
  </tr>`;

  return baseEmailHtml({ title: 'Your Consultation is Booked with Dial A Vet! 🐾', subtitle: 'We look forward to seeing you and your pet', contentHtml, cta: { href: bookingUrl, label: 'Book Again' } });
}

function buildRescheduleEmailHtml(info: BookingInfo) {
  const baseUrl = siteUrl();
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  const joinUrl = info.videoLink || `${baseUrl}/booking`;
  const contentHtml = `
  <tr>
    <td style="padding:0 20px 8px">
      <div class="block">
        <div class="row"><span class="label">Your consultation time has been updated.</span></div>
        <div class="row"><span class="label">New time:</span><span class="value">${timeLabel}</span></div>
        <div class="row"><span class="label">New date:</span><span class="value">${dateLabel}</span></div>
        <div class="row"><span class="label">Join Link:</span><span class="value"><a href="${joinUrl}">${joinUrl}</a></span></div>
      </div>
    </td>
  </tr>`;
  return baseEmailHtml({ title: 'Your consultation was rescheduled', subtitle: 'Thanks for updating your booking', contentHtml, cta: { href: joinUrl, label: 'View details' } });
}

function buildStatusEmailHtml(info: BookingInfo, status: 'CANCELLED' | 'COMPLETED') {
  const baseUrl = siteUrl();
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  const title = status === 'CANCELLED' ? 'Your consultation was cancelled' : 'Thanks for consulting with Dial A Vet';
  const subtitle = status === 'CANCELLED' ? 'We hope to see you again soon' : 'We hope your pet is feeling better';
  const body = status === 'CANCELLED'
    ? `Your appointment for ${dateLabel} at ${timeLabel} has been cancelled. If this was a mistake, you can rebook anytime at <a href="${baseUrl}/booking">dialavet.com</a>.`
    : `Your consultation on ${dateLabel} at ${timeLabel} is completed. You can book follow-ups anytime at <a href="${baseUrl}/booking">dialavet.com</a>.`;
  const contentHtml = `
  <tr>
    <td style="padding:0 20px 8px">
      <div class="card">
        <div class="p" style="margin:0;">${body}</div>
      </div>
    </td>
  </tr>`;
  return baseEmailHtml({ title, subtitle, contentHtml });
}

function buildVetEmailHtml(kind: 'assigned'|'reschedule'|'cancel'|'completed', appt: any, tz: string) {
  const baseUrl = siteUrl();
  const start = new Date(appt.startTime);
  const timeLabel = fmtTime(start, tz);
  const dateLabel = fmtDate(start, tz);
  const vetName = appt.vet?.displayName || 'Assigned vet';
  const vetCreds = '';
  const petName = appt.user?.petName || '—';
  const ownerName = (appt.user?.firstName || '') + (appt.user?.lastName ? ` ${appt.user.lastName}` : '');
  const ownerPhone = appt.user?.phone || '';
  const ownerEmail = appt.user?.email || '';
  const dashboardUrl = `${baseUrl}/vet`;

  let headerTitle = 'Consultation Confirmed & Assigned to You';
  let intro = 'Please review the booking details below.';
  if (kind === 'reschedule') { headerTitle = 'Consultation Rescheduled'; intro = 'The booking time has changed. Review the new details below.'; }
  if (kind === 'cancel') { headerTitle = 'Consultation Cancelled'; intro = 'This consultation has been cancelled.'; }
  if (kind === 'completed') { headerTitle = 'Consultation Completed'; intro = 'This consultation is marked as completed.'; }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headerTitle}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;color:#1b1b1b;}
    .wrap{width:100%;padding:24px 0;}
    .container{max-width:640px;margin:0 auto;background:#ffffff;}
    .card{background:#ffffff;border-radius:20px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .center{text-align:center}
    .h1{font-size:28px;line-height:1.3;margin:16px 0 12px;letter-spacing:.2px;font-weight:normal;color:#0AA56B}
    .p{font-size:16px;line-height:1.5;margin:0 0 16px;color:#333;font-weight:normal}
    .logo{max-width:160px;height:auto}
    .btn{display:inline-block;background:#0AA56B;color:#fff !important;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:normal;font-size:16px}
    .footer{font-size:13px;color:#666;margin-top:22px;text-align:center}
    .block{margin:20px 0;padding:16px;background:#f5f5f5;border-radius:12px;font-size:15px;color:#333;font-weight:normal}
    .row{margin:6px 0;display:flex;justify-content:space-between;gap:12px}
    .label{color:#555;min-width:120px}
    .value{color:#1b1b1b;flex:1}
    a{color:#0AA56B;text-decoration:none}
    @media (max-width:480px){ .h1{font-size:24px} .p{font-size:15px} .row{display:block} .label{min-width:auto} }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="container">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td class="center" style="padding:10px 20px 0">
            <img class="logo" src="${LOGO_URL}" alt="Dial A Vet">
          </td>
        </tr>
        <tr>
          <td class="center" style="padding:20px 20px 0">
            <div class="h1">${headerTitle}</div>
            <div class="p">${intro}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 8px">
            <div class="block">
              <div class="row"><span class="label">Veterinary professional:</span><span class="value">${vetName}${vetCreds ? ', '+vetCreds : ''}</span></div>
              <div class="row"><span class="label">Consult type:</span><span class="value">Video Consultation</span></div>
              <div class="row"><span class="label">Date:</span><span class="value">${dateLabel}</span></div>
              <div class="row"><span class="label">Time:</span><span class="value">${timeLabel} ${tz}</span></div>
              <div class="row"><span class="label">Portal:</span><span class="value"><a href="${dashboardUrl}">${dashboardUrl}</a></span></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 8px">
            <div class="block">
              <div class="p" style="font-weight:600;margin-bottom:8px">Pet & Owner</div>
              <div class="row"><span class="label">Pet name:</span><span class="value">${petName}</span></div>
              <div class="row"><span class="label">Owner:</span><span class="value">${ownerName || '—'}</span></div>
              <div class="row"><span class="label">Contact:</span><span class="value">${ownerPhone ? `<a href="tel:${ownerPhone}">${ownerPhone}</a>` : '—'} · ${ownerEmail ? `<a href="mailto:${ownerEmail}">${ownerEmail}</a>` : '—'}</span></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 8px">
            <div class="card">
              <div class="p" style="font-weight:600;margin-bottom:8px;">How to Access Your Account</div>
              <div class="p" style="margin:0;">Open your vet portal to view your schedule and join the consultation at the scheduled time. Please join 5 minutes early to check audio/video.</div>
              <div class="center" style="margin-top:14px;">
                <a class="btn" href="${dashboardUrl}">Open Vet Portal</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="footer" style="padding:20px">Need admin help? Email <a href="mailto:support@dialavet.com.au">support@dialavet.com.au</a></td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

export async function sendCustomerBookingConfirmation(info: BookingInfo) {
  const html = buildCustomerEmailHtml(info);
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  await Promise.allSettled([
    sendSMS(info.phone, `Dial A Vet: Confirmed for ${timeLabel} on ${dateLabel}. You’ll receive a Calendly invite with details. Book again: ${siteUrl()}/booking`),
    info.email ? sendEmail(info.email, "Your Dial A Vet booking is confirmed", undefined, html) : Promise.resolve(),
  ]);
}

export async function sendCustomerRescheduleNotice(info: BookingInfo) {
  const html = buildRescheduleEmailHtml(info);
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  await Promise.allSettled([
    sendSMS(info.phone, `Dial A Vet: Rescheduled to ${timeLabel} on ${dateLabel}. Check Calendly for the new link.`),
    info.email ? sendEmail(info.email, "Your consultation was rescheduled", undefined, html) : Promise.resolve(),
  ]);
}

export async function sendCustomerStatusUpdate(info: BookingInfo, status: 'CANCELLED' | 'COMPLETED') {
  const html = buildStatusEmailHtml(info, status);
  const subj = status === 'CANCELLED' ? 'Your consultation was cancelled' : 'Consultation completed';
  const start = new Date(info.startTimeISO);
  const timeLabel = fmtTime(start, info.timezone || null);
  const dateLabel = fmtDate(start, info.timezone || null);
  const sms = status === 'CANCELLED' ? `Dial A Vet: Your consultation was cancelled for ${timeLabel} on ${dateLabel}.` : `Dial A Vet: Your consultation is completed. Thank you!`;
  await Promise.allSettled([
    sendSMS(info.phone, sms),
    info.email ? sendEmail(info.email, subj, undefined, html) : Promise.resolve(),
  ]);
}

export async function sendVetBookingNotification(vetPhone: string | null | undefined, vetEmail: string | null, info: BookingInfo) {
  // Look up vet preferences by appointment -> vetId
  let canSMS = !!vetPhone;
  let canEmail = !!vetEmail;
  let tzForVet: string | null = null;
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: info.appointmentId } });
    if (appt?.vetId) {
      const vet = await prisma.vetProfile.findUnique({ where: { id: appt.vetId } });
      if (vet) {
        const v: any = vet as any;
        const smsPref = v.smsAlerts ?? v.sms_alerts ?? false;
        const emailPref = v.emailAlerts ?? v.email_alerts ?? false;
        canSMS = !!vetPhone && !!smsPref;
        canEmail = !!vetEmail && !!emailPref;
        try {
          const adminTz = (await prisma.adminSettings.findFirst() as any)?.defaultTimezone || null;
          tzForVet = v.timezone || adminTz || 'UTC';
        } catch { tzForVet = v.timezone || 'UTC'; }
      }
    }
  } catch {}

  // Send SMS only here; HTML email is handled by sendVetNotice with templates
  await Promise.allSettled([
    (async ()=>{
      if (!canSMS) return;
      const start = new Date(info.startTimeISO);
      const timeLabel = fmtTime(start, tzForVet || null);
      const dateLabel = fmtDate(start, tzForVet || null);
      await sendSMS(vetPhone as string, `New booking at ${timeLabel} on ${dateLabel}. Open your vet portal: ${siteUrl()}/vet`);
    })(),
  ]);
}

export async function sendVetNotice(appointmentId: string, kind: 'assigned'|'reschedule'|'cancel'|'completed') {
  const appt = await prisma.appointment.findUnique({ where: { id: appointmentId }, include: { user: true, vet: { include: { user: true } } } });
  if (!appt || !appt.vet?.user) return;
  // Determine vet prefs
  const vetPhone = (appt as any).vet?.phone || (appt as any).vet?.user?.phone || null;
  let canSMS = !!vetPhone;
  let canEmail = !!appt.vet.user.email;
  try {
    const v: any = appt.vet;
    const smsPref = v.smsAlerts ?? v.sms_alerts ?? true;
    const emailPref = v.emailAlerts ?? v.email_alerts ?? true;
    canSMS = !!vetPhone && !!smsPref;
    canEmail = !!appt.vet.user.email && !!emailPref;
  } catch {}
  // Resolve timezone for vet (vet tz > admin default > UTC)
  let tz = 'UTC';
  try {
    tz = appt.vet?.timezone || (await prisma.adminSettings.findFirst() as any)?.defaultTimezone || 'UTC';
  } catch {}
  const html = buildVetEmailHtml(kind, appt, tz);
  const subjectMap: Record<typeof kind, string> = {
    assigned: 'New consultation assigned',
    reschedule: 'Consultation rescheduled',
    cancel: 'Consultation cancelled',
    completed: 'Consultation completed',
  } as const;
  const subject = subjectMap[kind];
  await Promise.allSettled([
    canEmail ? sendEmail(appt.vet.user.email as string, subject, undefined, html) : Promise.resolve(),
  ]);
}

export async function sendEmail(to: string, subject: string, text?: string, html?: string) {
  if (!env.SENDGRID_API_KEY) {
    console.log("[email mock]", { to, subject, text: text || '[html]', html: html?.slice(0, 120) + '...' });
    return;
  }
  const mod: any = await import("@sendgrid/mail");
  const mail = (mod.default && mod.default.setApiKey ? mod.default : mod) as any;
  mail.setApiKey(env.SENDGRID_API_KEY);
  await mail.send({ to, from: env.SENDGRID_FROM, subject, text: text || undefined, html: html || undefined });
}

export async function sendSMS(to: string, body: string) {
  if (!to) {
    console.log("[sms skip-empty]", { to, body });
    return;
  }
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || (!env.TWILIO_FROM_NUMBER && !env.TWILIO_MESSAGING_SERVICE_SID)) {
    console.log("[sms mock]", { to, body });
    return;
  }
  const twilio = (await import("twilio")).default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const params: any = { to, body };
  if (env.TWILIO_MESSAGING_SERVICE_SID) params.messagingServiceSid = env.TWILIO_MESSAGING_SERVICE_SID; else params.from = env.TWILIO_FROM_NUMBER;
  await twilio.messages.create(params);
}

