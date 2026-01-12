import { prisma } from "@/lib/prisma";

function digitsOnly(raw: string): string {
  return String(raw || "").replace(/[^0-9]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const code: string = (body?.code || "").trim();
    const phoneRaw: string = (body?.phone || "").trim();
    const phone = digitsOnly(phoneRaw);

    if (!code) return Response.json({ ok: false, error: "Missing activation code" }, { status: 400 });
    if (!phone) return Response.json({ ok: false, error: "Missing phone number" }, { status: 400 });
    if (phone.length < 8 || phone.length > 15) return Response.json({ ok: false, error: "Enter a valid mobile number" }, { status: 400 });

    const pc = await prisma.partnerCode.findUnique({ where: { code } }).catch(() => null) as any;
    if (!pc || pc.active === false) return Response.json({ ok: false, error: "Invalid or inactive code" }, { status: 400 });

    // Batch expiry and mapping
    if (pc.batchId) {
      const batch = await prisma.partnerCodeBatch.findUnique({ where: { id: pc.batchId } } as any).catch(() => null) as any;
      if (batch?.expiresAt && new Date(batch.expiresAt) < new Date()) {
        return Response.json({ ok: false, error: "Code expired" }, { status: 400 });
      }
    }

    // Per-code expiry
    if (pc.expiresAt && new Date(pc.expiresAt) < new Date()) {
      return Response.json({ ok: false, error: "Code expired" }, { status: 400 });
    }

    // Single-use per code
    const already = await prisma.partnerRedemption.findFirst({ where: { codeId: pc.id } } as any).catch(() => null);
    if (already) return Response.json({ ok: false, error: "Code already redeemed" }, { status: 400 });

    // If user exists, block if they already have active membership that hasn't expired yet
    const user = await prisma.user.findUnique({ where: { phone } }).catch(() => null) as any;
    if (user) {
      const m = await prisma.membership.findFirst({ where: { userId: user.id, status: "ACTIVE" } } as any).catch(() => null) as any;
      if (m) {
        const exp = m.expiresAt ? new Date(m.expiresAt) : null;
        const stillActive = !exp || exp > new Date();
        if (stillActive) {
          const expText = exp ? new Date(exp).toLocaleDateString() : null;
          return Response.json({ ok: false, error: expText ? `You already have active access until ${expText}` : "You already have active access" }, { status: 400 });
        }
      }
    }

    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "Validation failed" }, { status: 400 });
  }
}
