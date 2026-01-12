import { Buffer } from "node:buffer";
import { getSupabaseAnon } from "@/lib/supabase";

const STORAGE_BUCKET = "blog-images";
const STORAGE_ROOT = "sitemaps/current";

async function fetchFile(key: string) {
  const supa = getSupabaseAnon();
  const { data, error } = await supa.storage.from(STORAGE_BUCKET).download(key);
  if (error) {
    const statusCode = (error as any)?.statusCode ?? (error as any)?.status;
    if (statusCode === 404) return null;
    throw error;
  }
  if (!data) return null;
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

export async function GET() {
  try {
    const buffer = await fetchFile(`${STORAGE_ROOT}/sitemap.xml`);
    if (!buffer) {
      return new Response("Sitemap not found", { status: 404 });
    }
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    return new Response("Failed to load sitemap", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
