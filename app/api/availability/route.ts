import { prisma } from "@/lib/prisma";
import { addMinutes, isAfter } from "date-fns";
import { toDate } from "date-fns-tz";

function toWeekday(date: Date) {
  return date.getDay();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") || 14);
  const slotMinutes = Number(searchParams.get("slot") || 15);
  // Use UTC as the reference timezone for weekly availability window
  const baseTz = "UTC";
  const now = new Date();
  const slots: { startTime: string }[] = [];

  const availability = await prisma.availability.findMany();
  const booked = await prisma.appointment.findMany({
    where: { startTime: { gte: now } },
    select: { startTime: true },
  });
  const bookedCountMap = new Map<string, number>();
  for (const b of booked as any[]) {
    const iso = new Date(b.startTime).toISOString();
    bookedCountMap.set(iso, (bookedCountMap.get(iso) || 0) + 1);
  }
  const seen = new Set<string>();

  const fmtYMD = new Intl.DateTimeFormat('en-CA', { timeZone: baseTz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: baseTz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  for (let d = 0; d < days; d++) {
    const dayLocalYmd = fmtYMD.format(new Date(now.getTime() + d * 24 * 60 * 60 * 1000));
    const day = toDate(`${dayLocalYmd}T00:00:00`, { timeZone: baseTz });
    const weekday = day.getUTCDay();
    const dayAvail = (availability as any[]).filter((a: any) => a.weekday === weekday);
    for (const a of dayAvail as any[]) {
      const [startH, startM] = (a.start as string).split(":").map((n: string) => parseInt(n));
      const [endH, endM] = (a.end as string).split(":").map((n: string) => parseInt(n));
      // Build a time in baseTz and convert to UTC for comparison/storage
      let cursor = toDate(`${dayLocalYmd}T${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}:00`, { timeZone: baseTz });
      const end = toDate(`${dayLocalYmd}T${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}:00`, { timeZone: baseTz });
      while (cursor < end) {
        if (isAfter(cursor, now)) {
          // Count how many vets are available at this cursor time
          const parts = fmtHM.formatToParts(cursor);
          const hh = parts.find(p => p.type === 'hour')?.value || '00';
          const mm = parts.find(p => p.type === 'minute')?.value || '00';
          const hhmm = `${hh}:${mm}`;
          const availableVets = (availability as any[])
            .filter((av: any) => av.weekday === weekday && av.start <= hhmm && av.end > hhmm)
            .map((av: any) => av.vetId);
          const iso = cursor.toISOString();
          if (!seen.has(iso)) {
            const bookedCount = bookedCountMap.get(iso) || 0;
            if (availableVets.length > bookedCount) {
              slots.push({ startTime: iso });
            }
            seen.add(iso);
          }
        }
        cursor = addMinutes(cursor, slotMinutes);
      }
    }
  }

  // Ensure ascending chronological order
  slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return Response.json({ slots });
}

