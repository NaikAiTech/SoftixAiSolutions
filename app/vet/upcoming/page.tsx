import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";
import { format } from "date-fns";
import Link from "next/link";

export default async function VetUpcomingPage() {
  const session = await requireVet();
  const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
  const items = await prisma.appointment.findMany({
    where: { vetId: vet?.id ?? undefined, startTime: { gte: new Date() }, status: { in: ["SCHEDULED", "PENDING_PAYMENT"] } },
    orderBy: { startTime: "asc" },
    include: { user: true },
  });
  return (
    <div className="space-y-4">
      <div className="text-xl">Upcoming Appointments</div>
      <div className="bg-white border border-neutral-200 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left p-2">When</th><th className="text-left p-2">Customer</th><th className="text-left p-2">Status</th><th className="text-left p-2">Action</th></tr>
          </thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{format(new Date(a.startTime as any), "EEE d MMM h:mm a")}</td>
                <td className="p-2">{a.user.firstName ?? a.user.phone}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">
                  <Link href={`/meet/${a.id}?role=host`} className="underline">Join as host</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

