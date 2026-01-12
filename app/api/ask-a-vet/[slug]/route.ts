import { getSupabaseQAAnon } from "@/lib/supabase.qa";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const slug = ctx.params.slug;
  if (!slug) return new Response("Missing slug", { status: 400 });

  // Early env presence check to aid debugging without leaking secrets
  const hasUrl = !!process.env.SUPABASE_QA_URL;
  const hasKey = !!process.env.SUPABASE_QA_ANON_KEY;
  let supa;
  try {
    supa = getSupabaseQAAnon();
  } catch (e: any) {
    return Response.json({ error: "Supabase QA not configured", debug: { hasUrl, hasKey, qaHost: hasUrl ? new URL(process.env.SUPABASE_QA_URL as string).host : null } }, { status: 500 });
  }
  const { data, error } = await supa
    .from("ask_a_vet")
    .select("id, slug, question, owner_body, vet_answer, category, meta_title, meta_description")
    .eq("slug", slug)
    .single();

  if (error?.code === "PGRST116") return new Response("Not found", { status: 404 });
  if (error) return new Response(error.message, { status: 500 });
  if (!data) return new Response("Not found", { status: 404 });

  const item = {
    id: String(data.id),
    slug: data.slug as string,
    question: (data.question as string) || "",
    answer: (data.vet_answer as string) || "",
    ownerBody: (data.owner_body as string) || "",
    category: (data.category as string) || null,
    metaTitle: (data.meta_title as string) || null,
    metaDescription: (data.meta_description as string) || null,
  };

  return Response.json({ item });
}

export const dynamic = "force-dynamic";
