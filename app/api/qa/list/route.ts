import { prisma } from "@/lib/prisma";

export async function GET() {
  // Random 24 published items (server role bypasses RLS, but we filter published=true for consistency)
  const all = await prisma.qaItem.findMany({});
  const published = (all as any[]).filter((q) => !!q.published);
  // Shuffle
  for (let i = published.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [published[i], published[j]] = [published[j], published[i]];
  }
  const items = published.slice(0, 24).map((q: any) => ({ id: q.id, slug: q.slug, question: q.question, tags: q.tags || [] }));
  return Response.json({ items });
}

export const dynamic = "force-dynamic";

