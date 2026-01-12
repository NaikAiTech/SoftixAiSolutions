import { requireAdmin } from "@/lib/rbac";
import {
  fetchManifestForBuild,
  fetchStoredActiveJob,
  fetchStoredJob,
  getActiveSitemapJob,
  getSitemapJob,
} from "@/lib/sitemap";

export async function GET(req: Request) {
  await requireAdmin();

  const url = new URL(req.url);
  const requestedBuildId = url.searchParams.get("buildId") || undefined;

  try {
    let job = requestedBuildId ? getSitemapJob(requestedBuildId) : getActiveSitemapJob();

    if (!job && requestedBuildId) {
      job = await fetchStoredJob(requestedBuildId);
    }

    if (!job && !requestedBuildId) {
      const pointer = await fetchStoredActiveJob().catch(() => null);
      const pointerBuildId = pointer?.currentBuildId || pointer?.lastBuildId || null;
      if (pointerBuildId) {
        job = getSitemapJob(pointerBuildId) || (await fetchStoredJob(pointerBuildId));
      }
    }

    if (job) {
      return Response.json({
        ok: true,
        buildId: job.buildId,
        status: job.status,
        startedAt: job.startedAt,
        finishedAt: job.finishedAt ?? null,
        durationMs: job.durationMs ?? null,
        progress: job.progress ?? null,
        manifest: job.manifest ?? null,
        error: job.error ?? null,
        logs: Array.isArray(job.logs) ? job.logs.slice(-100) : [],
        cancelRequested: !!job.cancelRequested,
      });
    }

    if (requestedBuildId) {
      const manifest = await fetchManifestForBuild(requestedBuildId);
      if (manifest) {
        return Response.json({
          ok: true,
          buildId: requestedBuildId,
          status: "success",
          startedAt: manifest.startedAt,
          finishedAt: manifest.finishedAt,
          durationMs: manifest.durationMs,
          progress: null,
          manifest,
          error: null,
          logs: [],
          cancelRequested: false,
        });
      }
    }
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }

  if (!requestedBuildId) {
    return Response.json({ ok: false, error: "No sitemap build is currently running" }, { status: 404 });
  }

  return Response.json({ ok: false, error: "Build not found" }, { status: 404 });
}

export const dynamic = "force-dynamic";
