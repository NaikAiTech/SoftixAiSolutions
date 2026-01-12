export const TZ_LIST: string[] = [
  "Australia/Sydney","Australia/Melbourne","Australia/Brisbane","Australia/Adelaide","Australia/Darwin","Australia/Perth",
  "Pacific/Auckland","Europe/London","Europe/Dublin",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Phoenix","America/Anchorage","Pacific/Honolulu",
  "America/Toronto","America/Winnipeg","America/Edmonton","America/Vancouver","America/Halifax","America/St_Johns"
];

export function tzOffsetLabel(tz: string): string {
  try {
    const date = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset', hour: '2-digit' });
    const parts = fmt.formatToParts(date);
    const off = parts.find(p => p.type === 'timeZoneName')?.value || '';
    const m = off.match(/(GMT|UTC)([+\-]\d{1,2})(?::(\d{2}))?/);
    if (m) {
      const sign = m[2][0];
      const hh = m[2].slice(1).padStart(2, '0');
      const mm = (m[3] || '00').padStart(2, '0');
      return `UTC${sign}${hh}${mm !== '00' ? `:${mm}` : ''}`;
    }
  } catch {}
  return 'UTC±00';
}

