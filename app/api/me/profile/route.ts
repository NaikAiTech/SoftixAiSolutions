import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/rbac";

export async function POST(req: Request) {
  const user = await getCurrentDbUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const ct = req.headers.get("content-type") || "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({} as any));
    firstName = body?.firstName || "";
    lastName = body?.lastName || "";
    email = body?.email || "";
    phone = body?.phone || "";
  } else {
    const form = await req.formData().catch(() => null);
    firstName = String(form?.get("firstName") || "");
    lastName = String(form?.get("lastName") || "");
    email = String(form?.get("email") || "");
    phone = String(form?.get("phone") || "");
  }

  const data: any = {};
  if (firstName !== "") data.firstName = firstName;
  if (lastName !== "") data.lastName = lastName;
  if (email !== "") data.email = email;
  if (phone !== "") data.phone = phone;
  if (Object.keys(data).length === 0) return new Response(JSON.stringify({ ok: true }), { status: 200 });

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return Response.json({ ok: true, id: (updated as any).id });
}

