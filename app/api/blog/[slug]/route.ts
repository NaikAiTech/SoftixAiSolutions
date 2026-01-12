import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const slug = ctx.params.slug;
  if (!slug) return new Response("Missing slug", { status: 400 });

  const supa = getSupabaseAdmin();
  // Try by slug, fall back to id equality
  let q = supa
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  let { data: row, error } = await q;
  if (error && (error as any).code !== "PGRST116") {
    return new Response(error.message, { status: 500 });
  }
  if (!row) {
    const byId = await supa.from("blog_posts").select("*").eq("id", slug).limit(1).maybeSingle();
    if (byId.error && (byId as any).error?.code !== "PGRST116") {
      return new Response(byId.error.message, { status: 500 });
    }
    row = byId.data as any;
  }
  if (!row) return new Response("Not found", { status: 404 });

  const item = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.post_description || null,
    summary: row.post_summary || null,
    bodyHtml: row.post_body || "",
    image: row.post_image || null,
    altText: row.alt_text || null,
    thumbnail: row.post_thumbnail || null,
    category: row.category || null,
    publishedAt: row.published_at || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };

  return Response.json({ item });
}

export const dynamic = "force-dynamic";
