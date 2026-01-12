import { prisma } from "@/lib/prisma";
import { createSupabaseRouteHandler } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const supabase = createSupabaseRouteHandler();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) return new Response("Unauthorized", { status: 401 });
  // Look up our app user by phone or email
  let appUser = null as any;
  if (authUser.phone) {
    const digits = String(authUser.phone).replace(/[^0-9]/g, "");
    if (digits) appUser = await prisma.user.findUnique({ where: { phone: digits } });
  }
  if (!appUser && authUser.email) appUser = await prisma.user.findFirst({ where: { email: authUser.email } });
  if (!appUser) return new Response("Unauthorized", { status: 401 });
  const full = await prisma.user.findUnique({
    where: { id: appUser.id },
    include: {
      membership: true,
      appointments: { orderBy: { startTime: "desc" }, take: 50 },
    },
  });
  // Attach latest manage token and vet name to each appointment for self-service manage
  try {
    const appts = Array.isArray((full as any)?.appointments) ? (full as any).appointments : [];
    const withTokens = [] as any[];
    for (const a of appts) {
      const mt = await prisma.apptManageToken.findFirst({ where: { appointmentId: a.id }, orderBy: { expiresAt: 'desc' } as any });
      let vetName: string | null = null;
      try {
        if ((a as any)?.vetId) {
          const vet = await prisma.vetProfile.findUnique({ where: { id: (a as any).vetId } });
          vetName = (vet as any)?.displayName || null;
        }
      } catch {}
      withTokens.push({ ...a, manageToken: mt?.token || null, vetName, petName: (a as any)?.petName || null, outcome: (a as any)?.outcome ?? null });
    }
    (full as any).appointments = withTokens;
  } catch {}
  // Enrich with live subscription details from Stripe if available
  let membershipInfo: any = null;
  try {
    const subId = (full as any)?.membership?.stripeSubId as string | undefined;
    if (subId) {
      const stripe = getStripe();
      if (stripe) {
        const sub: any = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price.product"],
        } as any);
        const item: any = sub?.items?.data?.[0];
        const price: any = item?.price;
        const productName = (price?.product && typeof price.product === 'object' && (price.product as any).name) || price?.nickname || null;
        const unitAmount = price?.unit_amount || 0;
        const currency = (price?.currency || 'aud').toUpperCase();
        const interval = price?.recurring?.interval || null;
        const intervalCount = price?.recurring?.interval_count || 1;
        const months = interval === 'year' ? intervalCount * 12 : interval === 'month' ? intervalCount : null;
        const monthlyAmount = months ? Math.round(unitAmount / months) : null;
        membershipInfo = {
          stripeSubscriptionId: sub?.id || subId,
          productName,
          priceId: price?.id || null,
          unitAmount,
          currency,
          interval,
          intervalCount,
          monthlyAmount,
          currentPeriodStart: sub?.current_period_start ? new Date(sub.current_period_start * 1000).toISOString() : null,
          currentPeriodEnd: sub?.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          cancelAtPeriodEnd: !!sub?.cancel_at_period_end,
          status: sub?.status || null,
        };
      }
    }
  } catch {}
  return Response.json({ user: { ...(full as any), membershipInfo } });
}

