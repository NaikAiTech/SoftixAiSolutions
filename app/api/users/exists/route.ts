import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const phone = (url.searchParams.get('phone') || '').trim();
    let exists = false;
    if (phone) {
      const digits = phone.replace(/[^0-9]/g, "");
      const u = await prisma.user.findUnique({ where: { phone: digits } });
      exists = !!u;
    }
    return new Response(JSON.stringify({ exists }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store, no-cache, must-revalidate', 'pragma': 'no-cache', 'expires': '0' } });
  } catch {
    return new Response(JSON.stringify({ exists: false }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store, no-cache, must-revalidate', 'pragma': 'no-cache', 'expires': '0' } });
  }
}

export const dynamic = "force-dynamic";

