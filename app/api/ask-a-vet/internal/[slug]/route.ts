import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const slug = ctx.params.slug;
  if (!slug) return new Response("Missing slug", { status: 400 });

  const supa = getSupabaseAdmin();
  // Try by slug first
  let { data: row, error } = await supa
    .from("qa_items")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== "PGRST116") {
    return new Response(error.message, { status: 500 });
  }
  if (!row) {
    const byId = await supa.from("qa_items").select("*").eq("id", slug).limit(1).maybeSingle();
    if (byId.error && (byId as any).error?.code !== "PGRST116") {
      return new Response(byId.error.message, { status: 500 });
    }
    row = byId.data as any;
  }
  if (!row || !row.published) return new Response("Not found", { status: 404 });

  return Response.json({
    item: {
      id: row.id,
      slug: row.slug,
      question: row.question,
      ownerBody: row.owner_body || row.ownerBody || null,
      answer: row.answer,
      tags: row.tags || [],
      category: null,
      metaTitle: null,
      metaDescription: null,
    },
  });
}

export const dynamic = "force-dynamic";
