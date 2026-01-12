import { requireAdmin } from "@/lib/rbac";
import { cancelSitemapJob } from "@/lib/sitemap";

export async function POST(req: Request) {
  await requireAdmin();

  const body = await req.json().catch(() => ({} as any));
  const buildId = typeof body?.buildId === "string" && body.buildId.length ? body.buildId : undefined;

  const job = await cancelSitemapJob(buildId);
  if (!job || (!job.cancelRequested && job.status !== "running" && job.status !== "queued")) {
    return Response.json({ ok: false, error: "No running sitemap build" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    buildId: job.buildId,
    status: job.status,
    cancelRequested: !!job.cancelRequested,
  });
}

export const dynamic = "force-dynamic";
