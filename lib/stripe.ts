import Stripe from "stripe";
import { env } from "./env";
import { prisma } from "./prisma";

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

export type Plan = "oneOff" | "annual" | "biennial";

export function priceIdForPlan(plan: Plan) {
  switch (plan) {
    case "oneOff":
      return env.STRIPE_PRICE_ONE_OFF;
    case "annual":
      return env.STRIPE_PRICE_ANNUAL;
    case "biennial":
      return env.STRIPE_PRICE_BIENNIAL;
  }
}

export async function activePlans() {
  const s = await prisma.adminSettings.findFirst({});
  const plans: Array<{ key: Plan; enabled: boolean; priceId?: string | null; displayPrice?: number | null }>= [
    { key: 'oneOff', enabled: !!(s as any)?.plan_one_off_enabled, priceId: (s as any)?.plan_one_off_price_id || env.STRIPE_PRICE_ONE_OFF, displayPrice: (s as any)?.plan_one_off_display_price ?? 49 },
    { key: 'annual', enabled: !!(s as any)?.plan_annual_enabled, priceId: (s as any)?.plan_annual_price_id || env.STRIPE_PRICE_ANNUAL, displayPrice: (s as any)?.plan_annual_display_price ?? 199 },
    { key: 'biennial', enabled: !!(s as any)?.plan_biennial_enabled, priceId: (s as any)?.plan_biennial_price_id || env.STRIPE_PRICE_BIENNIAL, displayPrice: (s as any)?.plan_biennial_display_price ?? 299 },
  ];
  return plans.filter(p => p.enabled);
}

