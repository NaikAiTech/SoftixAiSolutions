import { prisma } from "@/lib/prisma";

export async function GET() {
  const all = (await prisma.blogPost?.findMany?.({} as any)) as any[] | undefined;
  if (!Array.isArray(all)) return Response.json({ categories: [] });
  const set = new Set<string>();
  for (const r of all) {
    const c = (r.category || "").trim();
    if (c) set.add(c);
  }
  const categories = Array.from(set).sort((a, b) => a.localeCompare(b));
  return Response.json({ categories });
}

export const dynamic = "force-dynamic";
