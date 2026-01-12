import { Buffer } from "node:buffer";
import { siteUrl } from "@/lib/env";
import { SERVICE_AREAS } from "@/lib/locations";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase";
import { getSupabaseQAAnon } from "@/lib/supabase.qa";

const STORAGE_BUCKET = "blog-images";
const STORAGE_ROOT = "sitemaps";
const DEFAULT_CHUNK_SIZE = Number.parseInt(process.env.SITEMAP_CHUNK_SIZE || "10000", 10) || 10000;
const JOB_STATE_PREFIX = `${STORAGE_ROOT}/jobs`;
const LOG_LIMIT = 200;
const QA_MAX_PAGE_SIZE = 10000;
const CANCEL_ERROR = "SITEMAP_CANCELLED";

type SitemapTypeKey = "static" | "blogs" | "questions" | "answers";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type SitemapUrl = {
  loc: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: string;
};

type GeneratedFile = {
  type: SitemapTypeKey;
  chunk: number;
  relativePath: string;
  storagePath: string;
  latestLastmod: string | null;
  itemCount: number;
};

type TypeSummary = {
  type: SitemapTypeKey;
  totalItems: number;
  files: number;
  latestLastmod: string | null;
};

export type SitemapManifest = {
  buildId: string;
  chunkSize: number;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  totals: Record<string, number>;
  filesPerType: Record<string, number>;
  perTypeLatestLastmod: Record<string, string | null>;
  pages: number;
  lastRunISO: string;
  baseUrl: string;
  storage: {
    bucket: string;
    currentPrefix: string;
    archivePrefix: string;
  };
};

type JobProgress = {
  stage: string;
  type?: SitemapTypeKey;
  chunk?: number;
  totalChunks?: number | null;
  itemsProcessed?: number;
  itemsTotal?: number | null;
  percent?: number;
  message?: string;
};

export type SitemapJobState = {
  buildId: string;
  status: "queued" | "running" | "success" | "error" | "cancelled";
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  progress?: JobProgress;
  manifest?: SitemapManifest | null;
  error?: string;
  logs: string[];
  cancelRequested?: boolean;
};

const jobs = new Map<string, SitemapJobState>();
let activeJobId: string | null = null;

function createBuildId(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  const timestamp = `${y}${m}${d}T${hh}${mm}${ss}Z`;
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}`;
}

function baseUrl(): string {
  return siteUrl().replace(/\/$/, "");
}

function normalizeIso(input: string | Date | null | undefined, fallback: string): string {
  if (!input) return fallback;
  try {
    if (typeof input === "string") {
      const date = new Date(input);
      if (!Number.isNaN(date.getTime())) return date.toISOString();
      return new Date(Date.parse(input)).toISOString();
    }
    return input.toISOString();
  } catch {
    return fallback;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function addLog(job: SitemapJobState, message: string) {
  const timestamp = new Date().toISOString();
  job.logs.push(`[${timestamp}] ${message}`);
  if (job.logs.length > LOG_LIMIT) {
    job.logs = job.logs.slice(-LOG_LIMIT);
  }
}

function setProgress(job: SitemapJobState, progress: JobProgress) {
  job.progress = progress;
}

function getStorageErrorStatus(error: unknown): number | undefined {
  return (error as any)?.statusCode ?? (error as any)?.status;
}

async function ensureNotCancelled(job: SitemapJobState) {
  if (job.cancelRequested) throw new Error(CANCEL_ERROR);
  const now = Date.now();
  const key = '__cancelCheckAt';
  const lastCheck = (job as any)[key] || 0;
  if (now - lastCheck > 2000) {
    (job as any)[key] = now;
    try {
      const stored = await downloadJson(`${JOB_STATE_PREFIX}/${job.buildId}.json`).catch(() => null);
      if (stored?.cancelRequested) {
        job.cancelRequested = true;
      }
    } catch {
      // ignore fetch errors
    }
  }
  if (job.cancelRequested) throw new Error(CANCEL_ERROR);
}

async function ensureBucketPublic() {
  const supa = getSupabaseAdmin();
  try {
    await supa.storage.createBucket(STORAGE_BUCKET, { public: true });
  } catch (err: any) {
    const code = err?.error || err?.message || "";
    if (!String(code).toLowerCase().includes("already exists")) {
      throw err;
    }
  }
  const { error } = await supa.storage.updateBucket(STORAGE_BUCKET, { public: true });
  if (error) throw error;
}

async function uploadText(path: string, content: string, contentType = "application/xml") {
  const supa = getSupabaseAdmin();
  const buffer = Buffer.from(content, "utf8");
  const { error } = await supa.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      cacheControl: "3600",
      contentType,
      upsert: true,
    });
  if (error) throw error;
}

async function uploadJson(path: string, data: unknown) {
  const body = JSON.stringify(data, null, 2);
  await uploadText(path, body, "application/json");
}

async function downloadJson(path: string): Promise<any | null> {
  const supa = getSupabaseAnon();
  const { data, error } = await supa.storage.from(STORAGE_BUCKET).download(path);
  if (error) {
    const statusCode = getStorageErrorStatus(error);
    if (statusCode === 404) return null;
    throw error;
  }
  if (!data) return null;
  const text = await data.text();
  return JSON.parse(text);
}

async function persistJobState(job: SitemapJobState) {
  try {
    const snapshot: SitemapJobState = {
      ...job,
      logs: job.logs.slice(-LOG_LIMIT),
      progress: job.progress ? { ...job.progress } : job.progress,
      manifest: job.manifest ?? null,
      cancelRequested: !!job.cancelRequested,
    };
    await uploadJson(`${JOB_STATE_PREFIX}/${job.buildId}.json`, snapshot);
    const pointer = {
      currentBuildId: job.status === "running" || job.status === "queued" ? job.buildId : null,
      lastBuildId: job.buildId,
      status: job.status,
      progress: snapshot.progress ?? null,
      cancelRequested: !!job.cancelRequested,
      updatedAt: new Date().toISOString(),
    };
    await uploadJson(`${JOB_STATE_PREFIX}/active.json`, pointer);
  } catch (err) {
    console.error("Failed to persist sitemap job state", err);
  }
}

async function updateProgress(job: SitemapJobState, progress: JobProgress) {
  setProgress(job, progress);
  await persistJobState(job);
}

function buildUrlsetXml(urls: SitemapUrl[]): string {
  const lines = urls.map((url) => {
    const parts = [
      `<loc>${escapeXml(url.loc)}</loc>`,
      `<lastmod>${escapeXml(url.lastmod)}</lastmod>`,
      `<changefreq>${url.changefreq}</changefreq>`,
      `<priority>${url.priority}</priority>`,
    ];
    return `  <url>\n    ${parts.join("\n    ")}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>\n`;
}

function buildSitemapIndex(base: string, files: GeneratedFile[]): string {
  const lines = files.map((file) => {
    const loc = `${base}/sitemaps/${file.relativePath}`.replace(/([^:])\/\//g, "$1/");
    const lastmod = escapeXml(file.latestLastmod || new Date().toISOString());
    return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</sitemapindex>\n`;
}

function buildStaticRoutes(startIso: string): SitemapUrl[] {
  const base = baseUrl();
  const fallback = startIso;
  const staticPaths = new Set<string>([
    "/",
    "/about",
    "/ask-a-vet",
    "/blog",
    "/book-a-vet-consultation",
    "/careers",
    "/glossary",
    "/health-guides",
    "/how-to-book-an-online-vet-consultation",
    "/pricing",
    "/privacy",
    "/terms",
    "/vet-answer",
    "/vet-answers",
    "/qa",
  ]);
  for (const area of SERVICE_AREAS) {
    for (const city of area.cities) {
      staticPaths.add(`/locations/${area.countrySlug}/${city.slug}`);
    }
  }
  return Array.from(staticPaths).map((path) => ({
    loc: `${base}${path}`,
    lastmod: fallback,
    changefreq: "monthly" as ChangeFreq,
    priority: "0.5",
  }));
}

async function fetchBlogChunk(offset: number, limit: number) {
  const supa = getSupabaseAdmin();
  let query = supa
    .from("blog_posts")
    .select("slug, updated_at, updatedAt, published_at, publishedAt, created_at, createdAt", { count: "exact" })
    .not("slug", "is", null)
    .range(offset, offset + limit - 1);
  try {
    query = query.not("published_at", "is", null);
  } catch {}
  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: data || [], count: typeof count === "number" ? count : null };
}

async function fetchQaItemsChunk(offset: number, limit: number) {
  const supa = getSupabaseAdmin();
  const { data, error, count } = await supa
    .from("qa_items")
    .select("slug, updatedAt, updated_at, createdAt, created_at, published", { count: "exact" })
    .eq("published", true)
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { rows: data || [], count: typeof count === "number" ? count : null };
}

async function fetchAskAVetChunk(client: ReturnType<typeof getSupabaseQAAnon> | null, offset: number, limit: number) {
  if (!client) return { rows: [], count: 0 };
  const pageSize = Math.min(limit, QA_MAX_PAGE_SIZE);
  const { data, error, count } = await client
    .from("ask_a_vet")
    .select(
      "id, slug, updated_at, updatedAt, published_at, publishedAt, created_at, createdAt, published, is_published, indexable, is_indexable",
      { count: "exact" },
    )
    .not("slug", "is", null)
      .order("id", { ascending: true })
    .range(offset, offset + pageSize - 1);
  if (error) throw error;
  return { rows: data || [], count: typeof count === "number" ? count : null };
}

function determineAskAVetPublish(row: any): boolean {
  const flags = [
    row?.published,
    row?.is_published,
    row?.isPublished,
    row?.indexable,
    row?.is_indexable,
    row?.isIndexable,
  ];
  if (flags.some((v) => v === true || v === "true" || v === 1 || v === "1")) return true;
  if (row?.published_at || row?.publishedAt) return true;
  return false;
}

function toAbsolutePath(slug: string | null | undefined, prefix: string): string | null {
  if (!slug) return null;
  const sanitized = String(slug).trim();
  if (!sanitized) return null;
  const encoded = encodeURIComponent(sanitized);
  return `${baseUrl()}${prefix}${encoded}`;
}

async function runTypeGeneration(options: {
  job: SitemapJobState;
  type: SitemapTypeKey;
  chunkSize: number;
  startedAt: string;
  archivePrefix: string;
  qaClient: ReturnType<typeof getSupabaseQAAnon> | null;
}): Promise<{ summary: TypeSummary; files: GeneratedFile[] }> {
  const { job, type, chunkSize, startedAt, archivePrefix, qaClient } = options;
  const files: GeneratedFile[] = [];
  const summary: TypeSummary = { type, totalItems: 0, files: 0, latestLastmod: null };
  let offset = 0;
  let chunkIndex = 1;
  let totalCount: number | null = null;
  const pageSize = type === "answers" ? Math.min(chunkSize, QA_MAX_PAGE_SIZE) : chunkSize;

  await ensureNotCancelled(job);

  const finalizeChunk = async (urls: SitemapUrl[]) => {
    if (!urls.length) return;
    const latest = urls.reduce<string | null>((acc, item) => {
      const lm = item.lastmod;
      if (!lm) return acc;
      if (!acc) return lm;
      return new Date(lm) > new Date(acc) ? lm : acc;
    }, null);
    const relativePath = `${type === "static" ? "static" : type}/${`sitemap-${type}-${chunkIndex}`}.xml`;
    const storagePath = `${archivePrefix}/${relativePath}`;
    const xml = buildUrlsetXml(urls);
    await uploadText(storagePath, xml);
    files.push({
      type,
      chunk: chunkIndex,
      relativePath,
      storagePath,
      latestLastmod: latest,
      itemCount: urls.length,
    });
    summary.files += 1;
    if (latest && (!summary.latestLastmod || new Date(latest) > new Date(summary.latestLastmod))) {
      summary.latestLastmod = latest;
    }
  };

  if (type === "static") {
    const urls = buildStaticRoutes(startedAt);
    summary.totalItems = urls.length;
    await finalizeChunk(urls);
    await updateProgress(job, {
      stage: "Static routes",
      type,
      chunk: 1,
      totalChunks: 1,
      itemsProcessed: urls.length,
      itemsTotal: urls.length,
      percent: 100,
      message: "Static pages indexed",
    });
    return { summary, files };
  }

  while (true) {
    await ensureNotCancelled(job);
    let rows: any[] = [];
    try {
      if (type === "blogs") {
        const res = await fetchBlogChunk(offset, chunkSize);
        rows = res.rows;
        if (totalCount === null) totalCount = res.count;
      } else if (type === "questions") {
        const res = await fetchQaItemsChunk(offset, chunkSize);
        rows = res.rows;
        if (totalCount === null) totalCount = res.count;
      } else if (type === "answers") {
        const res = await fetchAskAVetChunk(qaClient, offset, pageSize);
        rows = res.rows;
        if (totalCount === null) totalCount = res.count;
      }
    } catch (err) {
      throw err;
    }

    if (!rows.length) break;

    await ensureNotCancelled(job);

    const urls: SitemapUrl[] = [];
    if (type === "blogs") {
      for (const row of rows) {
        const slug = row?.slug;
        const loc = toAbsolutePath(slug, "/blog/");
        if (!loc) continue;
        const lastmod = normalizeIso(
          row?.updated_at || row?.updatedAt || row?.published_at || row?.publishedAt || row?.created_at || row?.createdAt,
          startedAt,
        );
        urls.push({
          loc,
          lastmod,
          changefreq: "weekly",
          priority: "0.8",
        });
      }
    } else if (type === "questions") {
      for (const row of rows) {
        const slug = row?.slug;
        const loc = toAbsolutePath(slug, "/ask-a-vet/");
        if (!loc) continue;
        const lastmod = normalizeIso(row?.updatedAt || row?.updated_at || row?.createdAt || row?.created_at, startedAt);
        urls.push({
          loc,
          lastmod,
          changefreq: "daily",
          priority: "0.7",
        });
      }
    } else if (type === "answers") {
      for (const row of rows) {
        const slug = row?.slug;
        if (!determineAskAVetPublish(row)) continue;
        const loc = toAbsolutePath(slug, "/vet-answers/");
        if (!loc) continue;
        const lastmod = normalizeIso(
          row?.updated_at || row?.updatedAt || row?.published_at || row?.publishedAt || row?.created_at || row?.createdAt,
          startedAt,
        );
        urls.push({
          loc,
          lastmod,
          changefreq: "daily",
          priority: "0.6",
        });
      }
    }

    summary.totalItems += urls.length;

    await finalizeChunk(urls);

    const processed = summary.totalItems;
    const total = totalCount ?? null;
    const percent = total ? Math.min(100, Math.round((processed / total) * 100)) : undefined;
    await updateProgress(job, {
      stage: `Generating ${type} sitemap`,
      type,
      chunk: chunkIndex,
      totalChunks: total ? Math.ceil(total / pageSize) : null,
      itemsProcessed: processed,
      itemsTotal: total,
      percent,
    });

    chunkIndex += 1;
    offset += rows.length;
  }

  if (summary.totalItems === 0 && summary.files === 0) {
    addLog(job, `No ${type} entries found; skipping sitemap generation for this type.`);
  }

  return { summary, files };
}

export async function startSitemapGeneration(options?: { chunkSize?: number }): Promise<SitemapJobState> {
  if (activeJobId) {
    const job = jobs.get(activeJobId);
    if (job) return job;
  }

  const buildId = createBuildId();
  const job: SitemapJobState = {
    buildId,
    status: "queued",
    startedAt: new Date().toISOString(),
    progress: { stage: "Queued" },
    manifest: null,
    logs: [],
    cancelRequested: false,
  };
  jobs.set(buildId, job);
  activeJobId = buildId;

  const chunkSize = Math.max(1, options?.chunkSize || DEFAULT_CHUNK_SIZE);

  await persistJobState(job);

  (async () => {
    const startedAt = new Date().toISOString();
    job.startedAt = startedAt;
    job.status = "running";
    addLog(job, `Starting sitemap build ${buildId} with chunk size ${chunkSize}`);
    await updateProgress(job, { stage: "Preparing storage" });

    const startHr = Date.now();
    try {
      await ensureBucketPublic();

      let qaClient: ReturnType<typeof getSupabaseQAAnon> | null = null;
      try {
        qaClient = getSupabaseQAAnon();
      } catch (err) {
        addLog(job, `QA Supabase client not configured; skipping answers sitemap (${String(err)})`);
      }

      const archivePrefix = `${STORAGE_ROOT}/archive/${buildId}`;

      const allFiles: GeneratedFile[] = [];
      const summaries: TypeSummary[] = [];

      const types: SitemapTypeKey[] = ["static", "blogs", "questions", "answers"];
      for (const type of types) {
        await ensureNotCancelled(job);
        if (type === "answers" && !qaClient) {
          summaries.push({ type, totalItems: 0, files: 0, latestLastmod: null });
          continue;
        }
        addLog(job, `Generating ${type} sitemap`);
        const result = await runTypeGeneration({
          job,
          type,
          chunkSize,
          startedAt,
          archivePrefix,
          qaClient,
        });
        summaries.push(result.summary);
        allFiles.push(...result.files);
      }

      const activeFiles = allFiles.filter((file) => file.itemCount > 0);

      await ensureNotCancelled(job);

      const manifest: SitemapManifest = {
        buildId,
        chunkSize,
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: 0,
        totals: Object.fromEntries(summaries.map((s) => [s.type, s.totalItems])),
        filesPerType: Object.fromEntries(summaries.map((s) => [s.type, s.files])),
        perTypeLatestLastmod: Object.fromEntries(summaries.map((s) => [s.type, s.latestLastmod])),
        pages: summaries.reduce((sum, s) => sum + s.totalItems, 0),
        lastRunISO: "",
        baseUrl: baseUrl(),
        storage: {
          bucket: STORAGE_BUCKET,
          currentPrefix: `${STORAGE_ROOT}/current`,
          archivePrefix: `${STORAGE_ROOT}/archive/${buildId}`,
        },
      };
      manifest.durationMs = Date.now() - startHr;
      manifest.lastRunISO = manifest.finishedAt;

      if (!activeFiles.length) {
        addLog(job, "No sitemap files were generated; aborting activation step.");
      }

      addLog(job, "Writing manifest and index files");
      const indexXml = buildSitemapIndex(manifest.baseUrl, activeFiles);
      await uploadText(`${archivePrefix}/sitemap.xml`, indexXml);
      await uploadJson(`${archivePrefix}/manifest.json`, manifest);

        if (activeFiles.length > 0) {
          await updateProgress(job, { stage: "Activating build", message: "Updating current pointers" });
          await uploadJson(`${STORAGE_ROOT}/current/manifest.json`, manifest);
          await uploadText(`${STORAGE_ROOT}/current/sitemap.xml`, indexXml);
        }

        job.status = "success";
        job.finishedAt = manifest.finishedAt;
        job.durationMs = manifest.durationMs;
        job.manifest = manifest;
        await updateProgress(job, { stage: "Completed", percent: 100 });
        addLog(job, "Sitemap build completed successfully");
      } catch (err: any) {
        if (err?.message === CANCEL_ERROR) {
          job.status = "cancelled";
          job.error = "Sitemap generation cancelled";
          job.finishedAt = new Date().toISOString();
          job.durationMs = Date.now() - startHr;
          await updateProgress(job, { stage: "Cancelled", message: "Cancelled by admin" });
          addLog(job, "Sitemap build cancelled by admin");
        } else {
          job.status = "error";
          job.error = err?.message || String(err);
          job.finishedAt = new Date().toISOString();
          job.durationMs = Date.now() - startHr;
          await updateProgress(job, { stage: "Failed", message: job.error });
          addLog(job, `Sitemap build failed: ${job.error}`);
        }
      } finally {
        activeJobId = null;
        await persistJobState(job);
      }
  })();

  return job;
}

export function getSitemapJob(buildId: string): SitemapJobState | null {
  return jobs.get(buildId) || null;
}

export function getActiveSitemapJob(): SitemapJobState | null {
  if (!activeJobId) return null;
  return jobs.get(activeJobId) || null;
}

export async function cancelSitemapJob(buildId?: string): Promise<SitemapJobState | null> {
  const pointer = await fetchStoredActiveJob().catch(() => null);
  const targetId = buildId || activeJobId || pointer?.currentBuildId || pointer?.lastBuildId || null;
  if (!targetId) return null;

  let job = jobs.get(targetId) || null;
  if (job) {
    if (job.status !== "running" && job.status !== "queued") return job;
    if (job.cancelRequested) return job;
    job.cancelRequested = true;
    addLog(job, "Cancellation requested by admin");
    await updateProgress(job, { stage: "Cancelling", message: "Cancelling…" });
    return job;
  }

  let stored: SitemapJobState | null = null;
  try {
    stored = await fetchStoredJob(targetId);
  } catch {
    stored = null;
  }
  if (!stored) return null;
  if (stored.status !== "running" && stored.status !== "queued") return stored;

  stored.cancelRequested = true;
  const cancelLog = `[${new Date().toISOString()}] Cancellation requested by admin`;
  stored.logs = Array.isArray(stored.logs) ? [...stored.logs, cancelLog].slice(-LOG_LIMIT) : [cancelLog];
  stored.status = "cancelled";
  stored.error = "Sitemap generation cancelled";
  stored.finishedAt = new Date().toISOString();
  if (stored.startedAt && !stored.durationMs) {
    try {
      stored.durationMs = Date.now() - Date.parse(stored.startedAt);
    } catch {
      stored.durationMs = undefined;
    }
  }
  stored.progress = { stage: "Cancelled", message: "Cancelled by admin" };
  await uploadJson(`${JOB_STATE_PREFIX}/${targetId}.json`, stored);

  const pointerUpdate = {
    currentBuildId: pointer?.currentBuildId === targetId ? null : pointer?.currentBuildId || null,
    lastBuildId: stored.buildId,
    status: stored.status,
    progress: stored.progress ?? null,
    cancelRequested: true,
    updatedAt: new Date().toISOString(),
  };
  await uploadJson(`${JOB_STATE_PREFIX}/active.json`, pointerUpdate);

  return stored;
}

export async function fetchManifestFromCurrent(): Promise<SitemapManifest | null> {
  const supa = getSupabaseAnon();
  const path = `${STORAGE_ROOT}/current/manifest.json`;
  const { data, error } = await supa.storage.from(STORAGE_BUCKET).download(path);
  if (error) {
    const statusCode = getStorageErrorStatus(error);
    if (statusCode === 404) return null;
    throw error;
  }
  if (!data) return null;
  const text = await data.text();
  return JSON.parse(text) as SitemapManifest;
}

export async function fetchManifestForBuild(buildId: string): Promise<SitemapManifest | null> {
  const supa = getSupabaseAnon();
  const path = `${STORAGE_ROOT}/archive/${buildId}/manifest.json`;
  const { data, error } = await supa.storage.from(STORAGE_BUCKET).download(path);
  if (error) {
    const statusCode = getStorageErrorStatus(error);
    if (statusCode === 404) return null;
    throw error;
  }
  if (!data) return null;
  const text = await data.text();
  return JSON.parse(text) as SitemapManifest;
}

export async function fetchStoredJob(buildId: string): Promise<SitemapJobState | null> {
  if (!buildId) return null;
  const raw = await downloadJson(`${JOB_STATE_PREFIX}/${buildId}.json`).catch((err) => {
    console.error("Failed to download stored sitemap job", err);
    throw err;
  });
  if (!raw) return null;
  return raw as SitemapJobState;
}

export async function fetchStoredActiveJob(): Promise<any | null> {
  try {
    return await downloadJson(`${JOB_STATE_PREFIX}/active.json`);
  } catch (err) {
    console.error("Failed to download active sitemap job pointer", err);
    throw err;
  }
}

