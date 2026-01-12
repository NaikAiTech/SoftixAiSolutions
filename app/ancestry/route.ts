import { NextResponse } from "next/server";

// TEMPORARILY DISABLED: Remove this file and restore page.enabled.tsx -> page.tsx to re-enable.
export async function GET(req: Request) {
  const url = new URL(req.url);
  url.pathname = "/";
  return NextResponse.redirect(url, 308);
}
