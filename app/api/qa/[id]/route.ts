import { prisma } from "@/lib/prisma";

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const idOrSlug = ctx.params.id;
  // Try by id then by slug
  const all = await prisma.qaItem.findMany({});
  const item = (all as any[]).find((q) => q.id === idOrSlug || q.slug === idOrSlug);
  if (!item || !item.published) return new Response("Not found", { status: 404 });
  return Response.json({ item: { id: item.id, slug: item.slug, question: item.question, answer: item.answer, tags: item.tags || [] } });
}

export const dynamic = "force-dynamic";

