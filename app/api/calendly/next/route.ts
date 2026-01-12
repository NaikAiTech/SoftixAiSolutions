import { fetchNextSlotsFromCalendly } from "@/lib/calendly";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const count = parseInt(searchParams.get("count") || "3", 10);
  // Accept optional timezone param from client (e.g., browser tz)
  const tz = searchParams.get("timezone") || undefined;
  const { items, meta } = await fetchNextSlotsFromCalendly(isNaN(count) ? 3 : count, tz);
  return Response.json({ items, meta });
}
