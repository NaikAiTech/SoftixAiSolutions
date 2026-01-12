import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatInTimeZone } from "date-fns-tz";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const settings = await prisma.adminSettings.findFirst({});
  const tz = (settings as any)?.defaultTimezone || 'UTC';
  const items = await prisma.availability.findMany({ where: { vetId: params.id }, orderBy: [{ weekday: "asc" }, { start: "asc" }] });
  const nextDateForWeekday = (weekday: number) => {
    const now = new Date();
    const days = (weekday - now.getDay() + 7) % 7;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  };
  const convert = (weekday: number, hmUtc: string) => {
    const [hh, mm] = hmUtc.split(":").map((x: string) => parseInt(x, 10));
    const base = nextDateForWeekday(weekday);
    const offStr = formatInTimeZone(base, tz, 'xxx');
    const sign = offStr.startsWith('-') ? -1 : 1;
    const [oh, om] = offStr.slice(1).split(':').map((n)=> parseInt(n,10));
    const offsetMin = sign * (oh*60 + (om||0));
    const total = (hh*60 + (mm||0)) + offsetMin;
    const wrap = ((total % 1440)+1440)%1440;
    const h = Math.floor(wrap/60); const m = wrap%60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}`;
  };
  const mapped = (items as any[]).map((r: any) => ({ ...r, start: convert(r.weekday, r.start), end: convert(r.weekday, r.end) }));
  return Response.json({ items: mapped });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const settings = await prisma.adminSettings.findFirst({});
  const tz = (settings as any)?.defaultTimezone || 'UTC';
  const { weekday, start, end } = await req.json();
  if (typeof weekday !== 'number' || !start || !end) return new Response('Bad Request', { status: 400 });
  // basic collision check
  const existing = await prisma.availability.findMany({ where: { vetId: params.id, weekday } });
  const toMin = (t: string) => { const [h,m] = t.split(':').map((x:string)=>parseInt(x,10)); return h*60+m; };
  if (existing.some((r:any)=> toMin(start) < toMin(r.end) && toMin(end) > toMin(r.start))) return new Response('Overlap', { status: 400 });
  // convert to UTC for storage
  const nextDateForWeekday = (weekday: number) => {
    const now = new Date();
    const days = (weekday - now.getDay() + 7) % 7;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  };
  const toUtcHm = (weekday: number, hmLocal: string) => {
    const base = nextDateForWeekday(weekday);
    const offStr = formatInTimeZone(base, tz, 'xxx');
    const sign = offStr.startsWith('-') ? -1 : 1;
    const [oh, om] = offStr.slice(1).split(':').map((n)=> parseInt(n,10));
    const offsetMin = sign * (oh*60 + (om||0));
    const [lh, lm] = hmLocal.split(':').map((n:string)=> parseInt(n,10));
    const total = (lh*60 + (lm||0)) - offsetMin; // UTC = local - offset
    const wrap = ((total % 1440)+1440)%1440;
    const uh = Math.floor(wrap/60); const um = wrap%60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(uh)}:${pad(um)}`;
  };
  const startUtc = toUtcHm(weekday, start);
  const endUtc = toUtcHm(weekday, end);
  await prisma.availability.create({ data: { vetId: params.id, weekday, start: startUtc, end: endUtc } });
  return Response.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const blockId = searchParams.get('blockId');
  if (blockId) await prisma.availability.delete({ where: { id: blockId } }).catch(()=>{});
  return Response.json({ ok: true });
}

