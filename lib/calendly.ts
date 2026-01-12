import { env } from "@/lib/env";

export const CALENDLY_PAID_URL =
  "https://calendly.com/d/cmbh-z8z-c42?hide_gdpr_banner=1&text_color=1c251a&primary_color=3c8977";

export const CALENDLY_FREE_URL =
  "https://calendly.com/dialavet/uavdua3863268v?hide_gdpr_banner=1&primary_color=34986b";

export function getCalendlyAuthHeaders() {
  const token = process.env.CALENDLY_API_TOKEN || env.CALENDLY_API_TOKEN || "";
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Calendly-API-Version": "2.0.0",
  } as Record<string, string>;
}

type SchedulingLinkResource = {
  booking_url?: string;
  scheduling_url?: string;
  owner?: string;
  expires_at?: string | null;
};

export async function createOneTimeSchedulingLink(eventTypeUri?: string): Promise<SchedulingLinkResource | null> {
  const headers = getCalendlyAuthHeaders();
  if (!headers) {
    console.warn("[calendly] Missing CALENDLY_API_TOKEN; cannot create scheduling link");
    return null;
  }
  const ownerUri =
    eventTypeUri ||
    (process.env.CALENDLY_EVENT || env.CALENDLY_EVENT || "").trim();
  if (!ownerUri) {
    console.warn("[calendly] Missing CALENDLY_EVENT env var; cannot create scheduling link");
    return null;
  }
  try {
    const res = await fetch("https://api.calendly.com/scheduling_links", {
      method: "POST",
      headers,
      body: JSON.stringify({
        owner: ownerUri,
        owner_type: "EventType",
        max_event_count: 1,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "(empty body)");
      console.warn("[calendly] scheduling_links failed %s — %s", res.status, body.slice(0, 240));
      return null;
    }
    const json: any = await res.json().catch(() => ({}));
    return (json?.resource as SchedulingLinkResource) || null;
  } catch (error) {
    console.warn("[calendly] scheduling_links error: %s", (error as any)?.message || error);
    return null;
  }
}

type SlotsMeta = { source: 'timeslots' | 'available_times' | 'none'; start_time: string; end_time: string; timezone?: string; owner: string; event: string };

export async function fetchNextSlotsFromCalendly(count: number = 3, timezone?: string): Promise<{ items: string[]; meta: SlotsMeta }> {
  try {
    const headers = getCalendlyAuthHeaders();
    if (!headers) {
      console.warn("[calendly] Missing CALENDLY_API_TOKEN; cannot fetch next slots");
      return { items: [], meta: { source: 'none', start_time: '', end_time: '', timezone, owner: '', event: '' } };
    }
    // Calendly requires full URIs for owner and event_type
    const ownerUri = (process.env.CALENDLY_OWNER || "").trim();
    const eventUri = (process.env.CALENDLY_EVENT || "").trim();
    if (!ownerUri || !eventUri) {
      console.warn("[calendly] Missing CALENDLY_OWNER or CALENDLY_EVENT; ownerUri=%s eventUri=%s", ownerUri || "(empty)", eventUri || "(empty)");
      return { items: [], meta: { source: 'none', start_time: '', end_time: '', timezone, owner: ownerUri, event: eventUri } };
    }

    const now = new Date();
    // Calendly requires start_time strictly in the future; use +1 minute
    const startTime = new Date(now.getTime() + 1 * 60 * 1000).toISOString();
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Try timeslots API first
    const tsUrl = new URL("https://api.calendly.com/availability/timeslots");
    tsUrl.searchParams.set("start_time", startTime);
    tsUrl.searchParams.set("end_time", endTime);
    tsUrl.searchParams.set("event_type", eventUri);
    tsUrl.searchParams.set("owner", ownerUri);
    if (timezone) tsUrl.searchParams.set("timezone", timezone);
    const tsRes = await fetch(tsUrl.toString(), { headers, cache: "no-store" });
    if (tsRes.ok) {
      const data: any = await tsRes.json().catch(() => ({}));
      const slots: string[] = Array.isArray(data?.collection)
        ? data.collection
            .map((s: any) => s?.start_time)
            .filter((x: any) => typeof x === "string")
            .slice(0, count)
        : [];
      console.log("[calendly] timeslots ok — owner=%s event=%s count=%d", ownerUri, eventUri, slots.length);
      return { items: slots, meta: { source: 'timeslots', start_time: startTime, end_time: endTime, timezone, owner: ownerUri, event: eventUri } };
    }
    const txt1 = await tsRes.text().catch(() => "(no body)");
    console.warn("[calendly] timeslots failed %s — %s", tsRes.status, txt1.slice(0, 300));

    // Fallback: legacy endpoint using organization + event_type
    if (ownerUri.includes("/organizations/")) {
      const alt = new URL("https://api.calendly.com/event_type_available_times");
      alt.searchParams.set("start_time", startTime);
      alt.searchParams.set("end_time", endTime);
      alt.searchParams.set("event_type", eventUri);
      alt.searchParams.set("organization", ownerUri);
      if (timezone) alt.searchParams.set("timezone", timezone);
      const altRes = await fetch(alt.toString(), { headers, cache: "no-store" });
      if (!altRes.ok) {
        const txt2 = await altRes.text().catch(() => "(no body)");
        console.warn("[calendly] event_type_available_times failed %s — %s", altRes.status, txt2.slice(0, 300));
        return { items: [], meta: { source: 'none', start_time: startTime, end_time: endTime, timezone, owner: ownerUri, event: eventUri } };
      }
      const data: any = await altRes.json().catch(() => ({}));
      const slots: string[] = Array.isArray(data?.collection)
        ? data.collection
            .map((s: any) => s?.start_time)
            .filter((x: any) => typeof x === "string")
            .slice(0, count)
        : [];
      console.log("[calendly] available_times ok — org=%s event=%s count=%d", ownerUri, eventUri, slots.length);
      return { items: slots, meta: { source: 'available_times', start_time: startTime, end_time: endTime, timezone, owner: ownerUri, event: eventUri } };
    }
    return { items: [], meta: { source: 'none', start_time: startTime, end_time: endTime, timezone, owner: ownerUri, event: eventUri } };
  } catch (e) {
    console.warn("[calendly] timeslots error: %s", (e as any)?.message || e);
    return { items: [], meta: { source: 'none', start_time: '', end_time: '', timezone, owner: '', event: '' } };
  }
}
