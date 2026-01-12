import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
export const dynamic = "force-dynamic";

export default async function AdminConsultationsPage() {
  const items = await prisma.appointment.findMany({ orderBy: { startTime: "desc" }, take: 200, include: { user: true, vet: { include: { user: true } } } });
  return (
    <div className="space-y-4">
      <div className="text-xl">Consultations</div>
      <div className="bg-white border border-neutral-200 rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">When</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Vet</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{format(new Date(a.startTime as any), "EEE d MMM h:mm a")}</td>
                <td className="p-2">{a.user.firstName ?? a.user.phone}</td>
                <td className="p-2">{a.vet?.user.firstName ?? "Unassigned"}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">
                  <form className="inline" action={`/api/admin/consultations/${a.id}/cancel`} method="post">
                    <button className="underline mr-2" type="submit">Cancel</button>
                  </form>
                  <a className="underline mr-2" href={`/vet/appointments/${a.id}`}>Open</a>
                  <a className="underline" href={`/admin/consultations/${a.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

