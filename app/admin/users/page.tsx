import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdat: "desc" }, take: 100, include: { membership: true } });
  return (
    <div className="space-y-4">
      <div className="text-xl">Customers</div>
      <div className="bg-white border border-neutral-200 rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left p-2">Phone</th><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Membership</th></tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{[u.firstName, u.lastName].filter(Boolean).join(" ")}</td>
                <td className="p-2">{u.email ?? ""}</td>
                <td className="p-2">{u.membership ? u.membership.status : "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

