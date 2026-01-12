import { requireAdmin } from "@/lib/rbac";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  await requireAdmin();
  const stripe = getStripe();
  if (!stripe) return new Response("", { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=revenue.csv" } });
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const header = ["id","created","status","amount","currency","customer_email"].join(",");
  const lines: string[] = [];
  let startingAfter: string | undefined = undefined;
  for (let i = 0; i < 20; i++) {
    const page: any = await stripe.paymentIntents.list({ created: { gte: Math.floor(startOfMonth.getTime()/1000) }, limit: 100, starting_after: startingAfter } as any);
    for (const pi of page.data) {
      const row = [pi.id, new Date((pi.created||0)*1000).toISOString(), pi.status, String(pi.amount_received||0), (pi.currency||'aud').toUpperCase(), (pi.receipt_email||'')].map((v)=>`"${String(v).replaceAll('"','""')}"`).join(",");
      lines.push(row);
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }
  const csv = [header, ...lines].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=revenue.csv" } });
}

