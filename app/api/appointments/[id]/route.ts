import { prisma } from "@/lib/prisma";
import { getCurrentDbUser } from "@/lib/rbac";

export async function GET(req: Request, ctx: { params: { id: string } }) {
	try {
		const id = ctx.params.id;
		if (!id) return new Response("Missing id", { status: 400 });
		const appointment = await prisma.appointment.findUnique({ where: { id }, include: { user: true, vet: true } });
		if (!appointment) return new Response("Not found", { status: 404 });
		// Access control: only the customer or the assigned vet (or admin) can fetch
		const dbUser = await getCurrentDbUser();
		if (!dbUser) return new Response("Unauthorized", { status: 401 });
		const isOwner = dbUser.id === (appointment as any).userId;
		const isVet = dbUser.role === "VET" && dbUser.id === (appointment as any)?.vet?.userId;
		const isAdmin = dbUser.role === "ADMIN";
		if (!(isOwner || isVet || isAdmin)) return new Response("Forbidden", { status: 403 });
		const canHost = !!isVet; // only the assigned vet may host (not admin, not customer)
		return Response.json({ appointment, canHost });
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e?.message || "Error" }), { status: 500 });
	}
}

export const dynamic = "force-dynamic";
