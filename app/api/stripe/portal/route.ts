import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createSupabaseRouteHandler } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseRouteHandler();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return Response.json({ url: null });

  // Resolve our app user by phone or email
  let appUser: any = null;
  if ((authUser as any).phone) {
    const digits = String((authUser as any).phone).replace(/[^0-9]/g, "");
    if (digits) appUser = await prisma.user.findUnique({ where: { phone: digits } });
  }
  if (!appUser && authUser.email) appUser = await prisma.user.findFirst({ where: { email: authUser.email } });
  if (!appUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Find a Stripe customer to open Portal for
  let customerId: string | null = null;
  try {
    const membership = await prisma.membership.findFirst({ where: { userId: appUser.id } });
    if (membership?.stripeSubId) {
      const sub: any = await stripe.subscriptions.retrieve(membership.stripeSubId as any);
      if (sub?.customer) customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id || null;
    }
  } catch {}
  if (!customerId && appUser.email) {
    try {
      const list = await stripe.customers.list({ email: appUser.email, limit: 1 });
      if (list.data.length) customerId = list.data[0].id;
    } catch {}
  }
  if (!customerId) {
    const cust = await stripe.customers.create({
      email: appUser.email || undefined,
      phone: appUser.phone || undefined,
      name: [appUser.firstName, appUser.lastName].filter(Boolean).join(' ') || undefined,
    });
    customerId = cust.id;
  }

  const args: any = {
    customer: customerId,
    return_url: env.NEXTAUTH_URL + "/account",
  };
  if (env.STRIPE_PORTAL_CONFIGURATION_ID) {
    args.configuration = env.STRIPE_PORTAL_CONFIGURATION_ID;
  }
  try {
    const session = await stripe.billingPortal.sessions.create(args);
    return Response.json({ url: session.url });
  } catch (err: any) {
    // Fallback: retry without configuration if it's invalid/missing
    const message = (err?.raw?.message || err?.message || "Stripe portal error");
    const type = err?.raw?.type || err?.type || '';
    const code = err?.raw?.code || err?.code || '';
    const isConfigMissing = String(message).toLowerCase().includes('no such configuration');
    if (args.configuration && isConfigMissing) {
      try {
        const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: env.NEXTAUTH_URL + "/account" } as any);
        return Response.json({ url: session.url, warning: 'Invalid STRIPE_PORTAL_CONFIGURATION_ID; used default portal config.' });
      } catch (e2: any) {
        return Response.json({ error: e2?.raw?.message || e2?.message || 'Failed to create portal session' }, { status: 500 });
      }
    }
    return Response.json({ error: message, type, code }, { status: 500 });
  }
}

export const runtime = "nodejs";
