import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/rbac";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phoneRaw = searchParams.get("phone") || "";
  const phone = String(phoneRaw).replace(/[^0-9]/g, "");
  try {
    let free = false;
    if (phone) {
      const user = await prisma.user.findUnique({ where: { phone } }).catch(() => null);
      if (user) {
        const m = await prisma.membership.findFirst({ where: { userId: user.id } } as any).catch(() => null);
        if (m && (m as any).status === 'ACTIVE') {
          // If membership has an expiry and it's in the past, treat as not free
          const exp = (m as any).expiresAt ? new Date((m as any).expiresAt) : null;
          free = !exp || exp > new Date();
        }
      }
    } else {
      // If no phone provided, check current logged-in user
      const dbUser = await getCurrentDbUser();
      if (dbUser) {
        const m = await prisma.membership.findFirst({ where: { userId: dbUser.id } } as any).catch(() => null);
        if (m && (m as any).status === 'ACTIVE') {
          const exp = (m as any).expiresAt ? new Date((m as any).expiresAt) : null;
          free = !exp || exp > new Date();
        }
      }
    }
    return new Response(JSON.stringify({ free }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ free: false }), { status: 200, headers: { "content-type": "application/json" } });
  }
}
