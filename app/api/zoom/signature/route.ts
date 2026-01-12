import { env } from "@/lib/env";

function base64url(source: Buffer) {
  let encoded = source.toString("base64");
  encoded = encoded.replace(/=+$/, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");
  return encoded;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const meetingNumber = searchParams.get("mn");
  const role = parseInt(searchParams.get("role") || "0", 10);
  if (!env.ZOOM_MEETING_SDK_KEY || !env.ZOOM_MEETING_SDK_SECRET) return Response.json({ signature: null, key: null });
  if (!meetingNumber) return new Response("Missing meeting number", { status: 400 });

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    appKey: env.ZOOM_MEETING_SDK_KEY,
    sdkKey: env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
  };
  const encHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const data = `${encHeader}.${encPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.ZOOM_MEETING_SDK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const signature = `${data}.${base64url(Buffer.from(sigBuf))}`;
  return Response.json({ signature, key: env.ZOOM_MEETING_SDK_KEY });
}

export const runtime = "nodejs";
