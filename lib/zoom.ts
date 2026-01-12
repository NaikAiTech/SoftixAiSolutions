import { env } from "./env";

async function getAccessToken(): Promise<string> {
  if (!env.ZOOM_ACCOUNT_ID || !env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET) {
    throw new Error("Zoom OAuth not configured");
  }
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(env.ZOOM_ACCOUNT_ID)}`;
  const basic = Buffer.from(`${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom token failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function createZoomMeeting(hostEmail: string, startTimeISO: string, durationMin: number, topic: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(hostEmail)}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      type: 2, // scheduled
      start_time: new Date(startTimeISO).toISOString(),
      duration: durationMin,
      settings: {
        waiting_room: true,
        join_before_host: false,
        approval_type: 2,
        mute_upon_entry: true,
        participant_video: false,
        host_video: false,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom create meeting failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return {
    id: String(data.id),
    join_url: data.join_url as string,
    start_url: data.start_url as string,
    password: data.password as string | undefined,
  };
}

export async function getHostZak(hostEmail: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(hostEmail)}/token?type=zak`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom get ZAK failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.token as string;
}

export async function updateZoomMeeting(meetingId: string, startTimeISO: string, durationMin: number) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_time: new Date(startTimeISO).toISOString(),
      duration: durationMin,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom update meeting failed: ${res.status} ${text}`);
  }
}

export async function deleteZoomMeeting(meetingId: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`Zoom delete meeting failed: ${res.status} ${text}`);
  }
}

