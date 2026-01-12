import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const role = url.searchParams.get("role");
  const where: any = role ? { role } : { role: "CUSTOMER" };
  const users = await prisma.user.findMany({ where, orderBy: { createdat: "desc" }, take: 500, include: { membership: true, appointments: true } });

  // Enrich plan labels from Stripe when available
  try {
    const stripe = getStripe();
    if (stripe) {
      for (const u of users as any[]) {
        const subId = u?.membership?.stripeSubId as string | undefined;
        if (!subId) continue;
        try {
          const sub: any = await stripe.subscriptions.retrieve(subId, { expand: ["items.data.price.product"] } as any);
          const item: any = sub?.items?.data?.[0];
          const price: any = item?.price;
          const productName = (price?.product && typeof price.product === 'object' && (price.product as any).name) || price?.nickname || null;
          if (!u.membership) u.membership = {} as any;
          (u.membership as any).planTitle = productName || 'Unlimited';
          // Infer internal plan key if missing
          if (!u.membership.plan && price?.recurring?.interval) {
            const interval = price.recurring.interval as string; // 'month' | 'year'
            const intervalCount = price.recurring.interval_count || 1;
            if (interval === 'year' && intervalCount >= 2) u.membership.plan = 'biennial';
            else if (interval === 'year') u.membership.plan = 'annual';
          }
        } catch {}
      }
    }
  } catch {}

  // Normalize field casing for frontend
  const normalized = (users as any[]).map((u:any)=> ({
    ...u,
    createdAt: u.createdAt || u.createdat || null,
    updatedAt: u.updatedAt || u.updatedat || null,
  }));
  return Response.json({ items: normalized });
}

