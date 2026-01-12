import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";

export default async function VetApptPage({ params }: { params: { id: string } }) {
  await requireVet();
  const appt = await prisma.appointment.findUnique({ where: { id: params.id }, include: { user: true, vet: true } });
  if (!appt) return <div className="container py-8">Not found</div>;
  return (
    <div className="container py-8">
      <h1 className="text-2xl mb-4">Appointment</h1>
      <div className="bg-white border border-neutral-200 rounded p-4 mb-6">
        <div className="text-sm text-neutral-600">When</div>
        <div>{new Date(appt.startTime).toLocaleString()}</div>
        <div className="text-sm text-neutral-600 mt-3">Customer</div>
        <div>{appt.user.firstName ?? appt.user.phone}</div>
        <a className="underline mt-3 inline-block" href={`/meet/${appt.id}?role=host`}>Join consultation</a>
      </div>
      <form className="bg-white border border-neutral-200 rounded p-4 mb-6" action={`/api/vet/appointments/${appt.id}/reschedule`} method="post">
        <div className="text-lg mb-2">Reschedule</div>
        <input name="startTime" type="datetime-local" className="border rounded px-2 py-1 bg-white" required />
        <div className="mt-3"><button className="px-4 py-2 bg-black text-white rounded" type="submit">Update time</button></div>
      </form>
      <form className="bg-white border border-neutral-200 rounded p-4 mb-6" action={`/api/vet/appointments/${appt.id}/cancel`} method="post">
        <div className="text-lg mb-2">Cancel</div>
        <button className="px-4 py-2 bg-red-600 text-white rounded" type="submit">Cancel appointment</button>
      </form>
      <form className="bg-white border border-neutral-200 rounded p-4" action={`/api/vet/appointments/${appt.id}/notes`} method="post">
        <div className="text-lg mb-2">Consultation notes</div>
        <textarea name="notes" className="w-full border rounded px-3 py-2 bg-white h-40" defaultValue={appt.notes ?? ""} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Subjective</div>
            <textarea name="subjective" className="w-full border rounded px-3 py-2 bg-white h-24" defaultValue={(appt as any).soap?.subjective || ""} />
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1">Objective</div>
            <textarea name="objective" className="w-full border rounded px-3 py-2 bg-white h-24" defaultValue={(appt as any).soap?.objective || ""} />
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1">Assessment</div>
            <textarea name="assessment" className="w-full border rounded px-3 py-2 bg-white h-24" defaultValue={(appt as any).soap?.assessment || ""} />
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1">Plan</div>
            <textarea name="plan" className="w-full border rounded px-3 py-2 bg-white h-24" defaultValue={(appt as any).soap?.plan || ""} />
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-neutral-600 mb-1">Client summary</div>
            <textarea name="clientSummary" className="w-full border rounded px-3 py-2 bg-white h-24" defaultValue={(appt as any).soap?.clientSummary || ""} />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="px-4 py-2 bg-black text-white rounded" type="submit">Save notes</button>
        </div>
      </form>
    </div>
  );
}

