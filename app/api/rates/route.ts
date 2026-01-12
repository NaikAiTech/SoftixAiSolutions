export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let CACHE: { fetchedAt: number; rates: Record<string, number> } | null = null;

const SUPPORTED = ["AUD","USD","EUR","GBP","CAD","NZD"] as const;

function normalizeRates(base: string, rates: Record<string, number> | undefined) {
  const out: Record<string, number> = {};
  for (const c of SUPPORTED) {
    if (c === base) out[c] = 1;
    else out[c] = typeof rates?.[c] === 'number' ? Number(rates[c]) : 1; // fallback multiplier
  }
  return out;
}

export async function GET() {
  const now = Date.now();
  if (CACHE && now - CACHE.fetchedAt < 60 * 60 * 1000) {
    return Response.json({ base: 'AUD', rates: CACHE.rates, cached: true, fetchedAt: CACHE.fetchedAt });
  }
  try {
    const url = `https://api.frankfurter.app/latest?from=AUD&to=USD,EUR,GBP,CAD,NZD`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Rates fetch failed: ${res.status}`);
    const data = await res.json().catch(()=> ({}));
    const base = (data?.base || data?.from || 'AUD').toString();
    const rates = normalizeRates(base, data?.rates);
    CACHE = { fetchedAt: now, rates };
    return Response.json({ base: 'AUD', rates, cached: false, fetchedAt: now });
  } catch {
    if (CACHE) return Response.json({ base: 'AUD', rates: CACHE.rates, cached: true, fetchedAt: CACHE.fetchedAt });
    return Response.json({ base: 'AUD', rates: { AUD: 1, USD: 0.67, EUR: 0.62, GBP: 0.53, CAD: 0.90, NZD: 1.08 } }, { status: 200 });
  }
}