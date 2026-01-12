import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = typeof payload?.token === "string" ? payload.token.trim() : "";
  if (!token) {
    return Response.json({ error: "Missing token." }, { status: 400 });
  }

  let record: any;
  try {
    record = await prisma.freeConsultToken.findFirst({
      where: { token },
    });
  } catch (error) {
    console.error("[free-consultation] failed to lookup token", error);
    return Response.json({ error: "We couldn't verify this link right now. Try again soon." }, { status: 500 });
  }

  if (!record) {
    return Response.json({ error: "This link is invalid or has expired." }, { status: 404 });
  }
  if (record.redeemedAt) {
    return Response.json({ error: "This link was already used." }, { status: 410 });
  }
  if (record.expiresAt) {
    try {
      const exp = new Date(record.expiresAt);
      if (Number.isFinite(exp.getTime()) && exp.getTime() < Date.now()) {
        return Response.json({ error: "This link has expired." }, { status: 410 });
      }
    } catch {
      // ignore parse errors
    }
  }

  try {
    await prisma.freeConsultToken.update({
      where: { id: record.id },
      data: { redeemedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("[free-consultation] failed to mark token as redeemed", error);
    return Response.json({ error: "We couldn't unlock your link right now. Try again later." }, { status: 500 });
  }

  return Response.json({ ok: true, email: record.email, source: record.source || null });
}
