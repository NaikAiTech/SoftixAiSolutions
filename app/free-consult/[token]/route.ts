import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CALENDLY_FREE_URL } from "@/lib/calendly";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function expiredHtml(message: string, status: number = 410) {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Free consultation link</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { background:#f5f5f5; font-family: Arial, Helvetica, sans-serif; margin:0; padding:32px; color:#111827; }
      .card { max-width:520px; margin:0 auto; background:#fff; border-radius:18px; padding:32px; box-shadow:0 12px 36px rgba(15,23,42,0.12); }
      h1 { margin:0 0 16px; font-size:24px; line-height:1.3; }
      p { margin:0 0 12px; font-size:15px; line-height:1.6; color:#1f2937; }
      a { color:#00b26b; text-decoration:none; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Heads up!</h1>
      <p>${message}</p>
      <p>If you need help booking a free consultation, email <a href="mailto:support@dialavet.com.au">support@dialavet.com.au</a>.</p>
    </div>
  </body>
</html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function GET(_req: Request, context: { params: { token: string } }) {
  const token = context.params?.token?.trim();
  if (!token) {
    return expiredHtml("This link is missing its token. Please request a new free consultation link.", 400);
  }

  let record: any = null;
  try {
    record = await prisma.freeConsultToken.findFirst({ where: { token } });
  } catch (error) {
    console.error("[free-consult redirect] lookup failed", error);
    return expiredHtml("We couldn’t verify your link right now. Please request a new one.", 500);
  }

  if (!record) {
    return expiredHtml("This link is not valid. Please request a new free consultation link.");
  }

  if (record.redeemedAt) {
    return expiredHtml("This free consultation link was already used. Check your inbox for your Calendly booking confirmation.");
  }

  if (record.expiresAt) {
    const exp = new Date(record.expiresAt);
    if (Number.isFinite(exp.getTime()) && exp.getTime() < Date.now()) {
      return expiredHtml("This free consultation link has expired. Request a new link to book your session.");
    }
  }

  try {
    await prisma.freeConsultToken.update({
      where: { token },
      data: { redeemedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("[free-consult redirect] failed to mark redeemed", error);
    return expiredHtml("We couldn’t activate your free consultation link. Please try again in a moment.", 500);
  }

  const calendlyUrl = new URL(CALENDLY_FREE_URL);
  calendlyUrl.searchParams.set("utm_source", "email");
  calendlyUrl.searchParams.set("utm_medium", "free-consult");
  calendlyUrl.searchParams.set("token_id", record.id);

  return NextResponse.redirect(calendlyUrl.toString(), { status: 302 });
}
