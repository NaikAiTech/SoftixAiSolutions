import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/notifications";

export async function POST(req: Request) {
  const { phone: phoneRaw } = await req.json();
  if (!phoneRaw) return new Response("Missing phone", { status: 400 });
  const phoneDigits = String(phoneRaw).replace(/[^0-9]/g, "");
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.oTP.create({ data: { phone: phoneDigits, code, expiresAt } });
  await sendSMS(phoneRaw, `Your Dial A Vet login code is ${code}`);
  return Response.json({ ok: true });
}

