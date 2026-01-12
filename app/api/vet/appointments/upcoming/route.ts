import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";

export async function GET() {
  const session = await requireVet();
  // Resolve vet by user id, tolerating snake_case columns
  const vets = await prisma.vetProfile.findMany();
  const vet = (vets as any[]).find((v: any) => (v.userId ?? v.user_id) === (session as any).userId);
  if (!vet) return Response.json({ items: [] });

  const now = new Date();
  // Fetch many and filter in JS to avoid camelCase/snake_case mismatches
  const all = await prisma.appointment.findMany({ include: { user: true } });
  const filtered = (all as any[])
    .filter((a) => (a.vetId ?? a.vet_id) === (vet as any).id)
    .filter((a) => {
      const startRaw = a.startTime ?? a.start_time;
      const d = startRaw ? new Date(startRaw) : null;
      if (!d || isNaN(d.getTime())) return false;
      const status = a.status ?? "SCHEDULED";
      return d >= now && ["SCHEDULED", "PENDING_PAYMENT"].includes(status);
    })
    .sort((a, b) => {
      const ad = new Date((a.startTime ?? a.start_time) as any).getTime();
      const bd = new Date((b.startTime ?? b.start_time) as any).getTime();
      return ad - bd;
    })
    .slice(0, 50);

  const mapped = filtered.map((a: any) => {
    const startRaw = a.startTime ?? a.start_time;
    const startDate = new Date(startRaw);
    const duration = Number(a.durationMin ?? a.duration_min ?? 15) || 15;
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return {
      id: a.id,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      petName: a.petName || "Pet",
      species: (a.animal || "Dog") as any,
      ownerName: a.user?.firstName || a.user?.phone || "Owner",
      ownerEmail: a.user?.email || "",
      reason: (a as any).concern ?? "",
      triage: ("Low") as any,
      outcome: (a as any).outcome || null,
      joinUrl: `/meet/${a.id}?role=host`,
      createdAt: new Date(a.createdAt ?? a.created_at ?? startDate).toISOString(),
      notes: a.notes || "",
    };
  });

  return Response.json({ items: mapped });
}

