import { requireAdmin } from "@/lib/rbac";
import { fetchManifestFromCurrent } from "@/lib/sitemap";

export async function GET() {
  await requireAdmin();

  try {
    const manifest = await fetchManifestFromCurrent();
    return Response.json({ ok: true, manifest });
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
