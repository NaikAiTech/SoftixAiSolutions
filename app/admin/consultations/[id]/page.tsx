import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function AdminConsultationEdit({ params }: { params: { id: string } }) {
  await requireAdmin();
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: { include: { user: true } } } });
  const vets = await prisma.vetProfile.findMany({ include: { user: true } });
  if (!appt) return <div className="container py-8">Not found</div>;
  return (
    <div className="container py-8 space-y-6">
      <div className="text-xl">Edit Consultation</div>
      <div className="bg-white border border-neutral-200 rounded p-4 space-y-2">
        <div className="text-sm text-neutral-600">When</div>
        <div>{new Date(appt.startTime as any).toLocaleString()}</div>
        <div className="text-sm text-neutral-600">Customer</div>
        <div>{appt.user.firstName ?? appt.user.phone}</div>
        <div className="text-sm text-neutral-600">Vet</div>
        <div>{appt.vet?.displayName ?? "Unassigned"}</div>
        <a className="underline" href={`/meet/${appt.id}`}>Open meeting</a>
      </div>

      <form action={`/api/admin/consultations/${appt.id}/reschedule`} method="post" className="bg-white border border-neutral-200 rounded p-4 space-y-3">
        <div className="text-lg">Reschedule</div>
        <input name="startTime" type="datetime-local" className="border rounded px-2 py-1 bg-white" required />
        <button className="px-4 py-2 bg-black text-white rounded" type="submit">Update time</button>
      </form>

      <form action={`/api/admin/consultations/${appt.id}/cancel`} method="post" className="bg-white border border-neutral-200 rounded p-4 space-y-3">
        <div className="text-lg">Cancel</div>
        <button className="px-4 py-2 bg-red-600 text-white rounded" type="submit">Cancel appointment</button>
      </form>

      <form action={`/api/admin/consultations/${appt.id}/assign`} method="post" className="bg-white border border-neutral-200 rounded p-4 space-y-3">
        <div className="text-lg">Assign Vet</div>
        <select name="vetId" className="border rounded px-2 py-1 bg-white" defaultValue={appt.vetId ?? ""} required>
          <option value="" disabled>Select vet</option>
          {vets.map((v: any) => (
            <option key={v.id} value={v.id}>{v.displayName} ({v.user.email ?? v.user.phone})</option>
          ))}
        </select>
        <button className="px-4 py-2 bg-black text-white rounded" type="submit">Assign</button>
      </form>
    </div>
  );
}

