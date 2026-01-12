import { requireAdmin } from "@/lib/rbac";
import { fetchStoredActiveJob, getActiveSitemapJob, startSitemapGeneration } from "@/lib/sitemap";

export async function POST(req: Request) {
  await requireAdmin();

  const active = getActiveSitemapJob();
  if (active && active.status === "running") {
    return Response.json(
      {
        ok: false,
        error: "Sitemap generation is already running",
        buildId: active.buildId,
      },
      { status: 409 },
    );
  }

  const pointer = await fetchStoredActiveJob().catch(() => null);
  if (pointer?.currentBuildId) {
    return Response.json(
      {
        ok: false,
        error: "Sitemap generation is already running",
        buildId: pointer.currentBuildId,
      },
      { status: 409 },
    );
  }

  let chunkSize: number | undefined;
  try {
    const body = await req.json().catch(() => null);
    if (body && typeof body.chunkSize === "number" && Number.isFinite(body.chunkSize)) {
      chunkSize = Math.max(1, Math.floor(body.chunkSize));
    }
  } catch {
    // ignore body parsing errors; fallback to default chunk size
  }

  const job = await startSitemapGeneration({ chunkSize });

  return Response.json({ ok: true, buildId: job.buildId, status: job.status, cancelRequested: !!job.cancelRequested });
}

export const dynamic = "force-dynamic";
