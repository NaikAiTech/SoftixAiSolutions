import { requireAdmin } from "@/lib/rbac";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  await requireAdmin();
  const stripe = getStripe();
  if (!stripe) return Response.json({ mtd: 0, currency: "AUD" });
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  // Sum paid PaymentIntents created this month
  let total: number = 0;
  let startingAfter: string | undefined = undefined;
  for (let i = 0; i < 20; i++) {
    const page: any = await stripe.paymentIntents.list({
      created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
      limit: 100,
      starting_after: startingAfter,
    } as any);
    for (const pi of page.data) {
      if (pi.status === 'succeeded') total += (pi.amount_received || 0);
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }
  return Response.json({ mtd: total, currency: (process.env.STRIPE_CURRENCY || 'AUD').toUpperCase() });
}

