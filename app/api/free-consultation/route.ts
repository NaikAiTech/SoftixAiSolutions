import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notifications";
import { createOneTimeSchedulingLink } from "@/lib/calendly";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function sanitizeSource(input: unknown) {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (!value) return null;
  return value.slice(0, 120);
}

function formatExpiryLabel(iso?: string | null) {
  if (!iso) return "in 7 days";
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "soon";
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_REGEX.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const source = sanitizeSource(payload?.source);
  const userAgent = req.headers.get("user-agent") || undefined;
  const referer = req.headers.get("referer") || undefined;

  let tokenRecord: any = null;
  const nowDate = new Date();
  const nowMs = nowDate.getTime();

  try {
    const existing = await prisma.freeConsultToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (existing) {
      return Response.json(
        { error: "This email already used its free consultation access. Check your inbox for the link." },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("[free-consultation] failed to query existing token", error);
    return Response.json({ error: "We couldn't create your link right now. Try again in a moment." }, { status: 500 });
  }

  const metadata: Record<string, any> = {};
  if (userAgent) metadata.userAgent = userAgent;
  if (referer) metadata.referer = referer;
  if (source) metadata.sourceTag = source;

  const schedulingLink = await createOneTimeSchedulingLink();
  if (!schedulingLink?.booking_url) {
    return Response.json({ error: "We couldn’t generate your Calendly booking link. Please try again shortly." }, { status: 502 });
  }

  const calendlyBookingUrl = schedulingLink.booking_url as string;
  const calendlyExpiresAt = schedulingLink.expires_at ? new Date(schedulingLink.expires_at).toISOString() : null;
  metadata.calendlyBookingUrl = calendlyBookingUrl;
  if (schedulingLink.scheduling_url) metadata.calendlySchedulingUrl = schedulingLink.scheduling_url;
  if (schedulingLink.owner) metadata.calendlyOwner = schedulingLink.owner;

  const expiresAt = calendlyExpiresAt || new Date(nowMs + 7 * 24 * 60 * 60 * 1000).toISOString();
  let createdToken: any = null;
  for (let i = 0; i < 4 && !createdToken; i += 1) {
    const token = randomBytes(24).toString("hex");
    try {
      createdToken = await prisma.freeConsultToken.create({
        data: {
          email,
          token,
          source,
          metadata: Object.keys(metadata).length ? metadata : null,
          expiresAt,
        },
      });
    } catch (error: any) {
      const message = String(error?.message || "").toLowerCase();
      if (message.includes("duplicate") || message.includes("unique")) {
        continue;
      }
      console.error("[free-consultation] failed to create token", error);
      return Response.json({ error: "We couldn't create your link right now. Try again later." }, { status: 500 });
    }
  }

  if (!createdToken) {
    return Response.json({ error: "We couldn't create your link right now. Try again later." }, { status: 500 });
  }

  const expiresAtIso = createdToken.expiresAt as string | null;
  const expiresLabel = formatExpiryLabel(expiresAtIso);
  const bookingUrl = calendlyBookingUrl;

  const text = [
    "Hi there,",
    "",
    "You’ve unlocked a free 10-minute video consultation with Dial A Vet.",
    "",
    "In your session, you can:",
    "- Ask about new or ongoing symptoms",
    "- Get guidance on whether an in-clinic visit is needed",
    "- Discuss behaviour, nutrition, or general care",
    "",
    "Your link is unique to you and can only be used once:",
    bookingUrl,
    "",
    `Book soon—your link expires ${expiresLabel}.`,
    "",
    "Dial A Vet provides general advice and triage support only. For emergencies, contact your local emergency vet clinic immediately.",
    "",
    "Talk soon,",
    "The Dial A Vet team",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Your free 10-minute video consultation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5;">
    <center style="width:100%; background-color:#f5f5f5;">
      <!--[if mso]>
      <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px; margin:0 auto; background-color:#ffffff; font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="height:24px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center">
            <img src="https://cdn.prod.website-files.com/65bea380e36b396fedfb84a5/65bea968f2e303fd2cd0cfdb_Dial%20A%20Vet%20-%20Green%20Logo%20.avif" alt="Dial A Vet" width="150" style="display:block; border:0; outline:none; text-decoration:none;">
          </td>
        </tr>
        <tr>
          <td style="height:24px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" style="padding:0 32px; color:#111827; font-size:22px; line-height:1.4; font-weight:bold;">
            Your free 10-minute video consultation is here 🐶🐱
          </td>
        </tr>
        <tr>
          <td style="height:16px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" style="padding:0 32px; color:#111827; font-size:15px; line-height:1.6;">
            Hi there,
            <br><br>
            You’ve unlocked a <strong>free 10-minute video consultation</strong> with Dial A Vet.
          </td>
        </tr>
        <tr>
          <td style="height:16px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" style="padding:0 32px; color:#111827; font-size:15px; line-height:1.6;">
            In your session, you can:
            <ul style="padding-left:20px; margin:8px 0 0 0;">
              <li>Ask about new or ongoing symptoms</li>
              <li>Get guidance on whether an in-clinic visit is needed</li>
              <li>Discuss behaviour, nutrition, or general care</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="height:16px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" style="padding:0 32px; color:#111827; font-size:14px; line-height:1.6;">
            Your link below is <strong>unique to you and can only be used once.</strong>
          </td>
        </tr>
        <tr>
          <td style="height:24px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="center">
            <a href="${bookingUrl}" style="background-color:#00b26b; color:#ffffff; font-size:16px; font-weight:bold; text-decoration:none; padding:14px 32px; border-radius:999px; display:inline-block;">
              Book your free 10-minute consult
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:12px 32px 0 32px; color:#6b7280; font-size:11px; line-height:1.5;">
            One-time use link. Please do not forward this email. Book before ${expiresLabel}.
          </td>
        </tr>
        <tr>
          <td style="height:24px; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td align="left" style="padding:0 32px 24px 32px; color:#6b7280; font-size:11px; line-height:1.5;">
            Dial A Vet provides general advice and triage support only. We cannot diagnose, prescribe medication, or provide emergency treatment via telehealth.
            <br><br>
            If your pet has difficulty breathing, severe pain, collapse, seizures, uncontrolled bleeding, or any other emergency, please contact your local emergency vet clinic immediately.
          </td>
        </tr>
      </table>
      <!--[if mso]>
          </td>
        </tr>
      </table>
      <![endif]-->
    </center>
  </body>
</html>`;

  try {
    await sendEmail(email, "Your free Dial A Vet consultation", text, html);
  } catch (error: any) {
    console.error("[free-consultation] failed to send email", error);
    const statusCode = Number(error?.code || error?.response?.status || error?.response?.statusCode);
    if (statusCode === 401) {
      console.error("[free-consultation] sendgrid unauthorized — confirm SENDGRID_API_KEY and verified sender.");
    }
    return Response.json({ error: "We couldn't send the email right now. Please try again soon." }, { status: 500 });
  }

  return Response.json({ ok: true, expiresAt: expiresAtIso });
}
