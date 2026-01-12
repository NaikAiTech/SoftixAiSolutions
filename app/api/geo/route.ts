export async function GET(req: Request) {
  const url = new URL(req.url);
  const mock = url.searchParams.get("mock");
  const hdrs = (name: string) => (globalThis as any).Headers ? undefined : undefined;
  const cc =
    mock ||
    (req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-appengine-country") ||
      "").toUpperCase();
  let country: "US" | "CA" | "AU" | "UK" | "IE" | "NZ" | null = null;
  if (["US", "CA", "AU", "IE", "NZ"].includes(cc)) country = cc as any;
  else if (cc === "GB" || cc === "UK") country = "UK";
  return Response.json({ country: country || "AU" });
}

export const dynamic = "force-dynamic";
