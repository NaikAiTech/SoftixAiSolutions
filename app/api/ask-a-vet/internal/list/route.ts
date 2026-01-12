import { getSupabaseAdmin } from "@/lib/supabase";

function buildExcerpt(text: string | null | undefined, max = 160): string {
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

  const supa = getSupabaseAdmin();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Use safe ordering by id to avoid unknown column issues
  let query = supa
    .from("qa_items")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("id", { ascending: false })
    .range(start, end);

  if (q) {
    const term = `%${q}%`;
    query = query.or(`question.ilike.${term},owner_body.ilike.${term},answer.ilike.${term}`);
  }

  const { data, error, count } = await query;
  if (error) return new Response(error.message, { status: 500 });

  const total = typeof count === "number" ? count : (data?.length || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const items = (data || []).map((r: any) => ({
    id: r.id,
    slug: r.slug,
    question: r.question,
    excerpt: buildExcerpt(r.owner_body || r.answer || ""),
    tags: r.tags || [],
  }));

  return Response.json({ items, page, perPage: limit, total, totalPages });
}

export const dynamic = "force-dynamic";
