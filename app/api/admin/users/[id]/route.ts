import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const id = params.id;
  const user: any = await prisma.user.findUnique({ where: { id }, include: { membership: true, appointments: true } });
  // Enrich plan title from Stripe
  try {
    const subId = user?.membership?.stripeSubId as string | undefined;
    const stripe = getStripe();
    if (stripe && subId) {
      const sub: any = await stripe.subscriptions.retrieve(subId, { expand: ["items.data.price.product"] } as any);
      const item: any = sub?.items?.data?.[0];
      const price: any = item?.price;
      const productName = (price?.product && typeof price.product === 'object' && (price.product as any).name) || price?.nickname || null;
      if (user?.membership) user.membership.planTitle = productName || 'Unlimited';
    }
  } catch {}
  if (!user) return new Response("Not found", { status: 404 });
  return Response.json(user);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const id = params.id;
  const form = await req.formData();
  const data: any = {};
  if (form.has('firstName')) data.firstName = String(form.get('firstName')||'');
  if (form.has('lastName')) data.lastName = String(form.get('lastName')||'');
  if (form.has('email')) data.email = String(form.get('email')||'');
  if (form.has('phone')) data.phone = String(form.get('phone')||'');
  if (form.has('company')) data.company = String(form.get('company')||'');
  const user = await prisma.user.update({ where: { id }, data });
  return Response.json({ ok: true, id: (user as any).id });
}

