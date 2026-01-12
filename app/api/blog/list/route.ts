import { getSupabaseAdmin } from "@/lib/supabase";

function buildExcerpt(text: string | null | undefined, max = 180): string {
  const s = (text || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const sentenceEnd = s.search(/[.!?]\s/);
  const first = sentenceEnd > -1 ? s.slice(0, sentenceEnd + 1) : s;
  if (first.length <= max) return first;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitParam = Number(searchParams.get("limit") || 9);
  const limit = Math.min(Math.max(1, limitParam), 100);
  const pageParam = Number(searchParams.get("page") || 1);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const q = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "").trim();

  const supa = getSupabaseAdmin();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supa
    .from("blog_posts")
    .select("id, slug, title, post_summary, post_description, category, post_thumbnail, alt_text, published_at, updated_at, created_at", { count: "exact" })
    .order("published_at", { ascending: false })
    .order("updated_at", { ascending: false })
    .range(start, end);

  if (category) {
    query = query.ilike("category", category);
  }
  if (q) {
    const term = `%${q}%`;
    query = query.or(
      `title.ilike.${term},post_summary.ilike.${term},post_description.ilike.${term},category.ilike.${term}`
    );
  }

  const { data, error, count } = await query;
  if (error) return new Response(error.message, { status: 500 });

  const total = typeof count === "number" ? count : (data?.length || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const items = (data || []).map((r: any) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.post_summary || "",
    image: r.post_thumbnail || null,
    altText: r.alt_text || null,
    category: r.category || null,
    publishedAt: r.published_at || null,
  }));

  return Response.json({ items, page, perPage: limit, total, totalPages });
}

export const dynamic = "force-dynamic";
