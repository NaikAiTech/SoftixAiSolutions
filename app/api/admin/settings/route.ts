import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

// Publicly readable for non-sensitive fields (used by guests to get default timezone)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const publicOnly = url.searchParams.get("public");
  const row = await prisma.adminSettings.findFirst({});
  if (publicOnly === "1" || publicOnly === "true") {
    // Only expose safe, non-sensitive fields
    return Response.json({
      defaultTimezone: (row as any)?.defaultTimezone ?? null,
      requireOtp: (row as any)?.requireOtp ?? true,
      allowVetAvailability: (row as any)?.allowVetAvailability ?? true,
      videoPlatform: (row as any)?.videoPlatform ?? null,
    });
  }
  // Full read requires admin
  await requireAdmin();
  return Response.json(row || {});
}

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const existing = await prisma.adminSettings.findFirst({});
  const data: any = {};
  if (form.has('systemAnnouncement')) data.systemAnnouncement = (form.get('systemAnnouncement') as string) ?? null;
  if (form.has('defaultTimezone')) data.defaultTimezone = (form.get('defaultTimezone') as string) ?? null;
  if (form.has('videoPlatform')) data.videoPlatform = (form.get('videoPlatform') as string) ?? null;
  if (form.has('requireOtp')) data.requireOtp = String(form.get('requireOtp') || '') === 'true';
  if (form.has('allowVetAvailability')) data.allowVetAvailability = String(form.get('allowVetAvailability') || '') === 'true';
  // Subscription controls
  if (form.has('plan_one_off_enabled')) data.plan_one_off_enabled = String(form.get('plan_one_off_enabled')||'') === 'true';
  if (form.has('plan_one_off_display_price')) data.plan_one_off_display_price = parseInt(String(form.get('plan_one_off_display_price')||'0'),10);
  if (form.has('plan_one_off_price_id')) data.plan_one_off_price_id = String(form.get('plan_one_off_price_id')||'');
  if (form.has('plan_annual_enabled')) data.plan_annual_enabled = String(form.get('plan_annual_enabled')||'') === 'true';
  if (form.has('plan_annual_display_price')) data.plan_annual_display_price = parseInt(String(form.get('plan_annual_display_price')||'0'),10);
  if (form.has('plan_annual_price_id')) data.plan_annual_price_id = String(form.get('plan_annual_price_id')||'');
  if (form.has('plan_biennial_enabled')) data.plan_biennial_enabled = String(form.get('plan_biennial_enabled')||'') === 'true';
  if (form.has('plan_biennial_display_price')) data.plan_biennial_display_price = parseInt(String(form.get('plan_biennial_display_price')||'0'),10);
  if (form.has('plan_biennial_price_id')) data.plan_biennial_price_id = String(form.get('plan_biennial_price_id')||'');
  // If nothing to update, return current row
  if (!Object.keys(data).length) return Response.json(existing || {});
  if (existing) {
    const updated = await prisma.adminSettings.update({ where: { id: (existing as any).id }, data });
    return Response.json({ ok: true, id: (updated as any).id });
  } else {
    const created = await prisma.adminSettings.create({ data });
    return Response.json({ ok: true, id: (created as any).id });
  }
}

