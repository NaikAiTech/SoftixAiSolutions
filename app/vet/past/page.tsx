import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";
import { format } from "date-fns";

export default async function VetPastPage() {
  const session = await requireVet();
  const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
  const items = await prisma.appointment.findMany({
    where: { vetId: vet?.id ?? undefined, startTime: { lt: new Date() } },
    orderBy: { startTime: "desc" },
    include: { user: true },
    take: 50,
  });
  return (
    <div className="space-y-4">
      <div className="text-xl">Past Appointments</div>
      <div className="bg-white border border-neutral-200 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left p-2">When</th><th className="text-left p-2">Customer</th><th className="text-left p-2">Notes</th></tr>
          </thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{format(a.startTime, "EEE d MMM h:mm a")}</td>
                <td className="p-2">{a.user.firstName ?? a.user.phone}</td>
                <td className="p-2">{a.notes ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

