import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  const s = await prisma.adminSettings.findFirst({});
  const items = [
    { key:'oneOff', enabled: !!(s as any)?.plan_one_off_enabled, priceId: (s as any)?.plan_one_off_price_id || null, displayPrice: (s as any)?.plan_one_off_display_price ?? 49, title: 'One-off Consultation', note: 'Single video consult' },
    { key:'annual', enabled: !!(s as any)?.plan_annual_enabled, priceId: (s as any)?.plan_annual_price_id || null, displayPrice: (s as any)?.plan_annual_display_price ?? 199, title: 'Unlimited – 1 year', note: 'Unlimited tele-vet for 12 months' },
    { key:'biennial', enabled: !!(s as any)?.plan_biennial_enabled, priceId: (s as any)?.plan_biennial_price_id || null, displayPrice: (s as any)?.plan_biennial_display_price ?? 299, title: 'Unlimited – 2 years', note: 'Unlimited tele-vet for 24 months' },
  ].filter(p => p.enabled);
  return Response.json({ items });
}

