import { Buffer } from "node:buffer";
import type { NextRequest } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";

const STORAGE_BUCKET = "blog-images";
const STORAGE_ROOT = "sitemaps/current";
const ARCHIVE_ROOT = STORAGE_ROOT.replace(/\/current$/, "") + "/archive";
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

export async function GET(_req: NextRequest, context: { params: { path?: string[] } }) {
  const segments = Array.isArray(context.params?.path) ? context.params.path : [];
  if (!segments.length) return new Response("Not found", { status: 404 });

  if (!segments.every((segment) => SAFE_SEGMENT.test(segment))) {
    return new Response("Invalid path", { status: 400 });
  }

  const relativePath = segments.join("/");
  const supa = getSupabaseAnon();

  const tryDownload = async (path: string) => {
    const { data, error } = await supa.storage.from(STORAGE_BUCKET).download(path);
    if (error) {
      const statusCode = (error as any)?.statusCode ?? (error as any)?.status;
      if (statusCode === 404) return null;
      throw error;
    }
    return data;
  };

  if (relativePath === "manifest.json" || relativePath === "sitemap.xml") {
    const direct = await tryDownload(`${STORAGE_ROOT}/${relativePath}`);
    if (!direct) return new Response("Not found", { status: 404 });
    const buffer = Buffer.from(await direct.arrayBuffer());
    const contentType = relativePath.endsWith(".json")
      ? "application/json; charset=utf-8"
      : "application/xml; charset=utf-8";
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Content-Length": String(buffer.length),
      },
    });
  }

  let manifest: any = null;
  try {
    const manifestBlob = await tryDownload(`${STORAGE_ROOT}/manifest.json`);
    if (manifestBlob) {
      manifest = JSON.parse(await manifestBlob.text());
    }
  } catch (err) {
    console.error("Failed to load sitemap manifest", err);
    return new Response("Failed to load file", { status: 500 });
  }

  const archivePrefix = manifest?.storage?.archivePrefix || (manifest?.buildId ? `${ARCHIVE_ROOT}/${manifest.buildId}` : null);

  let file: Blob | null = null;
  if (archivePrefix) {
    const archivePath = `${archivePrefix}/${relativePath}`.replace(/^\/+/, "");
    file = await tryDownload(archivePath);
  }

  if (!file) {
    file = await tryDownload(`${STORAGE_ROOT}/${relativePath}`);
  }

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = relativePath.endsWith(".json")
    ? "application/json; charset=utf-8"
    : "application/xml; charset=utf-8";

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300, s-maxage=600",
      "Content-Length": String(buffer.length),
    },
  });
}

export const dynamic = "force-dynamic";
