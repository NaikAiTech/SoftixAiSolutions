import { requireVet } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function VetSettingsPage() {
  const session = await requireVet();
  const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
  return (
    <div className="space-y-4">
      <div className="text-xl">Settings</div>
      <form action="/api/vet/settings" method="post" className="bg-white border border-neutral-200 rounded p-4 space-y-3">
        <div>
          <label className="block text-sm">Zoom Host Email (required for automatic meetings)</label>
          <input name="zoomUserEmail" className="border rounded px-2 py-1 bg-white" defaultValue={(vet as any)?.zoomUserEmail ?? ""} placeholder="name@yourdomain.com" />
        </div>
        <div>
          <label className="block text-sm">Zoom Meeting Number</label>
          <input name="zoomMeetingNumber" className="border rounded px-2 py-1 bg-white" defaultValue={vet?.zoomMeetingNumber ?? ""} />
        </div>
        <div>
          <label className="block text-sm">Zoom Passcode</label>
          <input name="zoomPasscode" className="border rounded px-2 py-1 bg-white" defaultValue={vet?.zoomPasscode ?? ""} />
        </div>
        <button className="px-4 py-2 bg-black text-white rounded" type="submit">Save</button>
      </form>
    </div>
  );
}

