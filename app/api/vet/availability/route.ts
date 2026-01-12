import { requireVet } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatInTimeZone, toDate } from "date-fns-tz";

export async function GET() {
  try {
    const session = await requireVet();
    const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
    if (!vet) return Response.json({ items: [] });
    const items = await prisma.availability.findMany({ where: { vetId: vet.id }, orderBy: [{ weekday: "asc" }, { start: "asc" }] });
    // Convert stored UTC HH:MM to vet timezone for display, and shift weekday to local
    const tz = (vet as any).timezone || (await prisma.adminSettings.findFirst({}))?.defaultTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const nextDateForWeekday = (weekday: number) => {
      const now = new Date();
      const days = (weekday - now.getDay() + 7) % 7;
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
    };
    const pad = (n: number) => String(n).padStart(2, '0');
    const convertAndShift = (weekday: number, hmUtc: string) => {
      let [hh, mm] = hmUtc.split(":").map((x: string) => parseInt(x, 10));
      if (hh === 24 && mm === 0) { hh = 24; mm = 0; }
      const base = nextDateForWeekday(weekday);
      const offStr = formatInTimeZone(base, tz, 'xxx'); // e.g., +10:00
      const sign = offStr.startsWith('-') ? -1 : 1;
      const [oh, om] = offStr.slice(1).split(':').map((n)=> parseInt(n,10));
      const offsetMin = sign * (oh*60 + (om||0));
      const total = (hh*60 + (mm||0)) + offsetMin; // minutes relative to UTC day start
      const shiftDays = Math.floor(total / 1440);
      const wrap = ((total % 1440)+1440)%1440;
      const h = Math.floor(wrap/60); const m = wrap%60;
      const localWeekday = (weekday + shiftDays + 7) % 7;
      return { hm: `${pad(h)}:${pad(m)}`, localWeekday };
    };
    const mapped = (items as any[]).map((r: any) => {
      const s = convertAndShift(r.weekday, r.start);
      const e = convertAndShift(r.weekday, r.end);
      return { ...r, weekday: s.localWeekday, start: s.hm, end: e.hm };
    });
    return Response.json({ items: mapped });
  } catch (e: any) {
    console.error("vet availability GET error", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireVet();
    const vet = await prisma.vetProfile.findFirst({ where: { userId: (session as any).userId } });
    if (!vet) return new Response("No vet", { status: 400 });
    const { weekday, start, end } = await req.json();

    // Validate input
    const timePattern = /^(?:[01]\d|2[0-3]):(?:00|15|30|45|59)$/;
    if (typeof weekday !== "number" || weekday < 0 || weekday > 6) {
      return Response.json({ error: "Invalid weekday" }, { status: 400 });
    }
    if (!timePattern.test(start) || !timePattern.test(end)) {
      return Response.json({ error: "Times must be in 15-minute increments (HH:MM)" }, { status: 400 });
    }
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map((x: string) => parseInt(x, 10));
      return h * 60 + m;
    };
    const sMin = toMinutes(start);
    const eMin = toMinutes(end);
    if (!(sMin < eMin)) {
      return Response.json({ error: "Start must be before end" }, { status: 400 });
    }

    // Convert local vet times to UTC Date objects to detect day crossing
    const tz = (vet as any).timezone || (await prisma.adminSettings.findFirst({}))?.defaultTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const pad = (n: number) => String(n).padStart(2, '0');
    const ymdForWeekday = (wd: number) => {
      const now = new Date();
      const days = (wd - now.getDay() + 7) % 7;
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
      const y = d.getFullYear();
      const m = pad(d.getMonth()+1);
      const da = pad(d.getDate());
      return `${y}-${m}-${da}`;
    };
    const localYmd = ymdForWeekday(weekday);
    const startUTC = toDate(`${localYmd}T${start}:00`, { timeZone: tz });
    const endUTC = toDate(`${localYmd}T${end}:00`, { timeZone: tz });
    const startWdUTC = startUTC.getUTCDay();
    const endWdUTC = endUTC.getUTCDay();
    const startHmUTC = `${pad(startUTC.getUTCHours())}:${pad(startUTC.getUTCMinutes())}`;
    const endHmUTC = `${pad(endUTC.getUTCHours())}:${pad(endUTC.getUTCMinutes())}`;

    // Helper to check overlaps for a particular UTC weekday block
    const checkOverlapsUtc = async (utcWeekday: number, hmStart: string, hmEnd: string) => {
      const toMin = (t: string, isEnd: boolean) => { const [h, m] = t.split(":").map((x)=> parseInt(x,10)); const v = h*60 + m; return isEnd && h===0 && m===0 ? 1440 : v; };
      const ns = toMin(hmStart, false);
      const ne = toMin(hmEnd, true);
      const exist = await prisma.availability.findMany({ where: { vetId: vet.id, weekday: utcWeekday } });
      return (exist as any[]).some((r: any)=> {
        const rs = toMin(r.start, false);
        const re = toMin(r.end, true);
        return ns < re && ne > rs;
      });
    };

    if (startWdUTC === endWdUTC && endHmUTC > startHmUTC) {
      // Single UTC day block
      const hasOverlap = await checkOverlapsUtc(startWdUTC, startHmUTC, endHmUTC);
      if (hasOverlap) return Response.json({ error: "Overlap with existing time block. Use adjacent or non-overlapping times." }, { status: 400 });
      await prisma.availability.create({ data: { vetId: vet.id, weekday: startWdUTC, start: startHmUTC, end: endHmUTC } });
    } else {
      // Crosses midnight in UTC → split into two blocks
      // Part A: from startHmUTC to 23:59 on startWdUTC
      const endA = "23:59";
      const hasOverlapA = await checkOverlapsUtc(startWdUTC, startHmUTC, endA);
      if (hasOverlapA) return Response.json({ error: "Overlap (first part). Adjust times to avoid crossing existing blocks." }, { status: 400 });
      await prisma.availability.create({ data: { vetId: vet.id, weekday: startWdUTC, start: startHmUTC, end: endA } });
      // Part B: from 00:00 to endHmUTC on endWdUTC
      const startB = "00:00";
      const hasOverlapB = await checkOverlapsUtc(endWdUTC, startB, endHmUTC);
      if (hasOverlapB) return Response.json({ error: "Overlap (second part). Adjust times to avoid crossing existing blocks." }, { status: 400 });
      await prisma.availability.create({ data: { vetId: vet.id, weekday: endWdUTC, start: startB, end: endHmUTC } });
    }
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("vet availability POST error", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireVet();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) await prisma.availability.delete({ where: { id } }).catch(() => {});
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("vet availability DELETE error", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}

