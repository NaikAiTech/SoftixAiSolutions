import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const items = await prisma.vetProfile.findMany({ include: { user: true, availability: true } as any });
  // Exclude admins accidentally stored in vet_profiles
  const filtered = (items || []).filter((v: any) => v?.user?.role === 'VET');
  return Response.json({ items: filtered });
}

