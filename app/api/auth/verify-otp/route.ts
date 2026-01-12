import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { phone: phoneRaw, code } = await req.json();
  if (!phoneRaw || !code) return new Response("Missing", { status: 400 });
  const phone = String(phoneRaw).replace(/[^0-9]/g, "");
  const otp = await prisma.oTP.findFirst({ where: { phone, code, consumed: false } });
  if (!otp || otp.expiresAt < new Date()) return new Response("Invalid code", { status: 400 });
  await prisma.oTP.update({ where: { id: otp.id }, data: { consumed: true } });
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) user = await prisma.user.create({ data: { phone } });
  await createSession(user.id);
  return Response.json({ ok: true });
}

