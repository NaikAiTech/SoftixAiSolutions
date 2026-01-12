export {
  startSitemapGeneration,
  getSitemapJob,
  getActiveSitemapJob,
  fetchManifestFromCurrent,
  fetchManifestForBuild,
  fetchStoredJob,
  fetchStoredActiveJob,
  cancelSitemapJob,
}
  from "@/lib/sitemap/generator";

export type { SitemapManifest, SitemapJobState } from "@/lib/sitemap/generator";
