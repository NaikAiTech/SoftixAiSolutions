# Dial A Vet

Next.js app with Tailwind, Supabase (Postgres), Stripe, Twilio, SendGrid, Calendly embed.

Getting started:

1. Copy `.env.example` to `.env` and fill values
2. Install deps: `npm install`
3. Setup DB (Supabase): run SQL to create tables (see `supabase/schema.sql`)
4. Run dev: `npm run dev`

Primary routes:
- `/` Landing page
- `/book-a-vet-consultation` Calendly scheduling embed (paid or partner free)
- `/api/health` Health check
- `/login` (legacy) – consider redirecting to `/book-a-vet-consultation` or `/activate`

Calendly:
- Paid booking embed: set URL in `lib/calendly.ts` (`CALENDLY_PAID_URL`)
- Partner free embed: set URL in `lib/calendly.ts` (`CALENDLY_FREE_URL`)
- Optional API: provide `CALENDLY_API_TOKEN`, `CALENDLY_OWNER`, `CALENDLY_EVENT` to enable `/api/calendly/next` for the next available banner

Notes:
- Fonts: Product Sans/Google Sans (no bold). Tailwind default font stack included.
- Colors: background `#f5f7f6`, text `#000000`.
- Uses Supabase JS client via a Prisma-compat shim under `lib/prisma.ts`.
- Zoom video via Calendly; all previous custom booking logic deprecated.

Notifications:
- Booking confirmation, reschedule, and status updates (cancelled/completed) are sent via SendGrid (email) and Twilio (SMS).
- Ensure env vars are set: `SENDGRID_API_KEY`, `SENDGRID_FROM`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`.
- Fallback notifier endpoint: `POST /api/notify` with `{ appointmentId, kind: 'reschedule'|'cancel'|'completed' }`.

Update: Minor docs tweak to trigger deployment (availability now uses UTC).
Update: Terminology refreshed to “Global Vet Team”; homepage adds AI Vet Chat (https://vetzo.ai).
Update: Switch booking to Calendly embeds; remove memberships/user panels; vet dashboard deprecated.
Update: Minor README touch to reflect latest marketing page refreshes.
---

Developed by Naik AI Tech

- Developer: Talib Saleem Naik
- Email: admin@naikaitech.com
- Website: https://naikaitech.com
