import { siteUrl } from "@/lib/env";

export const SITE_NAME = "Dial A Vet";
export const OG_IMAGE_PATH = "/seo/og.jpg"; // Upload at public/seo/og.jpg (1200x630)

export function absoluteUrl(path: string = "/"): string {
  const base = siteUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}

