import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/rbac";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return new Response("Missing code", { status: 400 });
  // Require authenticated Supabase user; map to our DB user
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return new Response("Unauthorized", { status: 401 });
  const pc = await prisma.partnerCode.findUnique({ where: { code } });
  if (!pc || !pc.active) return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });
  // If this code belongs to a batch with an expiry and it's past, block redemption
  try {
    if ((pc as any).batchId) {
      const batch = await prisma.partnerCodeBatch.findUnique({ where: { id: (pc as any).batchId } } as any);
      if (batch?.expiresAt && new Date(batch.expiresAt) < new Date()) {
        return new Response(JSON.stringify({ error: "Code expired" }), { status: 400 });
      }
      // Set user's company from batch if available
      try {
        if (batch?.companyId) {
          const company = await prisma.partnerCompany.findUnique({ where: { id: batch.companyId } } as any);
          if (company?.name && (dbUser.company !== company.name)) {
            await prisma.user.update({ where: { id: dbUser.id }, data: { company: company.name } });
          }
        }
      } catch {}
    }
  } catch {}
  // Also respect per-code expiry if present
  try {
    if ((pc as any).expiresAt && new Date((pc as any).expiresAt) < new Date()) {
      return new Response(JSON.stringify({ error: "Code expired" }), { status: 400 });
    }
  } catch {}
  // Enforce single-use per code
  const alreadyRedeemed = await prisma.partnerRedemption.findFirst({ where: { codeId: (pc as any).id } } as any);
  if (alreadyRedeemed) return new Response(JSON.stringify({ error: "Code already redeemed" }), { status: 400 });
  // Guard: if user already has active membership that hasn't expired, block
  try {
    const m = await prisma.membership.findFirst({ where: { userId: dbUser.id, status: "ACTIVE" } } as any);
    if (m) {
      const exp = (m as any).expiresAt ? new Date((m as any).expiresAt) : null;
      const stillActive = !exp || exp > new Date();
      if (stillActive) {
        return new Response(JSON.stringify({ error: exp ? `You already have active access until ${exp.toISOString().slice(0,10)}` : "You already have active access" }), { status: 400 });
      }
    }
  } catch {}
  // Block if user has an active Stripe membership
  try {
    const m = await prisma.membership.findFirst({ where: { userId: dbUser.id, status: "ACTIVE" } } as any);
    const subId = (m as any)?.stripeSubId as string | undefined;
    if (subId) {
      const stripe = getStripe();
      if (stripe) {
        const sub: any = await stripe.subscriptions.retrieve(subId);
        const status = sub?.status;
        if (status === 'active' || status === 'trialing' || status === 'past_due') {
          return new Response(JSON.stringify({ error: "You already have an active Stripe membership" }), { status: 400 });
        }
      }
    }
  } catch {}
  await prisma.partnerRedemption.create({ data: { codeId: pc.id, phone: dbUser.phone || '', userId: dbUser.id } });
  // Deactivate the code so it can't be used again
  try { await prisma.partnerCode.update({ where: { id: (pc as any).id }, data: { active: false } }); } catch {}
  // accessDays: 30 -> 30d access, 365 -> 1y access, null -> lifetime (no expiry)
  const expiresAt = (pc as any).accessDays == null ? null : new Date(Date.now() + Number((pc as any).accessDays) * 24 * 60 * 60 * 1000);
  await prisma.membership.upsert({ where: { userId: dbUser.id }, update: { status: "ACTIVE", expiresAt }, create: { userId: dbUser.id, status: "ACTIVE", expiresAt } });
  return Response.json({ ok: true });
}

