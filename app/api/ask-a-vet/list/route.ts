import { getSupabaseQAAnon } from "@/lib/supabase.qa";

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
  const debug = (searchParams.get("debug") || "").toLowerCase() === "1" || (searchParams.get("debug") || "").toLowerCase() === "true";

  // Early env presence check to aid debugging without leaking secrets
  const hasUrl = !!process.env.SUPABASE_QA_URL;
  const hasKey = !!process.env.SUPABASE_QA_ANON_KEY;
  let supa;
  try {
    supa = getSupabaseQAAnon();
  } catch (e: any) {
    if (debug) {
      return Response.json({ items: [], debug: { hasUrl, hasKey, qaHost: hasUrl ? new URL(process.env.SUPABASE_QA_URL as string).host : null } }, { status: 500 });
    }
    return new Response("Supabase QA not configured", { status: 500 });
  }
  let query = supa
    .from("ask_a_vet")
    .select("*", { count: "exact" })
    .not("slug", "is", null)
    .order("id", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (q) {
    const term = `%${q}%`;
    // OR filter across question and owner_body
    query = query.or(
      `question.ilike.${term},owner_body.ilike.${term}`
    );
  }

  const { data, error, count } = await query;
  if (error) return new Response(error.message, { status: 500 });

  const items = (data || []).map((row: any) => ({
    id: String(row.id),
    slug: row.slug as string,
    question: row.question as string,
    excerpt: buildExcerpt(row.owner_body),
    category: row.category as string | null,
  }));

  const total = typeof count === 'number' ? count : (data?.length || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return Response.json({ items, page, perPage: limit, total, totalPages });
}

export const dynamic = "force-dynamic";
