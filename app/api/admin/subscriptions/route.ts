import { requireAdmin } from "@/lib/rbac";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const stripe = getStripe();
  // Compute active members from our own DB (includes code-based access without Stripe)
  let activeFromDb = 0;
  try {
    const now = new Date();
    const rows = await prisma.membership.findMany({ where: { status: "ACTIVE" } } as any);
    activeFromDb = (rows || []).filter((m: any) => !m.expiresAt || new Date(m.expiresAt) > now).length;
  } catch {}
  if (!stripe) return Response.json({ active: activeFromDb, churn30dPercent: 0, churn30dCount: 0, mrr: 0, currency: (process.env.STRIPE_CURRENCY || 'AUD').toUpperCase() });

  let active = 0;
  let mrr = 0; // in minor units (cents)
  let churn30dCount = 0;
  const currency = (process.env.STRIPE_CURRENCY || 'AUD').toUpperCase();
  const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

  let startingAfter: string | undefined = undefined;
  for (let pageNum = 0; pageNum < 50; pageNum++) {
    const page: any = await stripe.subscriptions.list({
      status: 'all',
      limit: 100,
      starting_after: startingAfter,
      // price is sufficient for MRR; avoid deep product expansion (causes 400)
      expand: ['data.items.data.price'],
    } as any);

    for (const sub of page.data) {
      const status = sub.status;
      const items = sub.items?.data || [];
      if (status === 'active' || status === 'trialing' || status === 'past_due') {
        active += 1;
        // Sum MRR contribution across items
        for (const it of items) {
          const price: any = it.price;
          if (!price || !price.recurring) continue;
          const unitAmount = (price.unit_amount ?? 0) * (it.quantity ?? 1);
          const interval: string = price.recurring.interval; // 'month'|'year'
          const intervalCount: number = price.recurring.interval_count || 1;
          const months = interval === 'month' ? intervalCount : interval === 'year' ? intervalCount * 12 : 1;
          if (months > 0) mrr += Math.round(unitAmount / months);
        }
      }
      if (status === 'canceled' && typeof (sub as any).canceled_at === 'number' && (sub as any).canceled_at >= thirtyDaysAgo) {
        churn30dCount += 1;
      }
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  const churn30dPercent = Math.round((churn30dCount / Math.max(1, active + churn30dCount)) * 1000) / 10; // one decimal place

  // Prefer internal active count when available to avoid double-counting and include code-based access
  const finalActive = activeFromDb > 0 ? activeFromDb : active;
  return Response.json({ active: finalActive, churn30dPercent, churn30dCount, mrr, currency });
}

