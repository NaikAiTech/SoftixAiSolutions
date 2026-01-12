export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_PRICE_ONE_OFF: process.env.STRIPE_PRICE_ONE_OFF || "",
  STRIPE_PRICE_ANNUAL: process.env.STRIPE_PRICE_ANNUAL || "",
  STRIPE_PRICE_BIENNIAL: process.env.STRIPE_PRICE_BIENNIAL || "",
  STRIPE_PORTAL_CONFIGURATION_ID: process.env.STRIPE_PORTAL_CONFIGURATION_ID || "",
  STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/booking?success=1",
  STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/booking?canceled=1",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
  SENDGRID_FROM: process.env.SENDGRID_FROM || "Dial A Vet <no-reply@dialavet.com>",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || "",
  TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID || "",
  // Calendly (optional for availability banner)
  CALENDLY_API_TOKEN: process.env.CALENDLY_API_TOKEN || "",
  CALENDLY_OWNER: process.env.CALENDLY_OWNER || "",
  CALENDLY_EVENT: process.env.CALENDLY_EVENT || "",
  // Zoom
  ZOOM_ACCOUNT_ID: process.env.ZOOM_ACCOUNT_ID || "",
  ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID || "",
  ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET || "",
  ZOOM_MEETING_SDK_KEY: process.env.ZOOM_MEETING_SDK_KEY || "",
  ZOOM_MEETING_SDK_SECRET: process.env.ZOOM_MEETING_SDK_SECRET || "",
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || "",
  WORKSPACE_DOMAINS: process.env.WORKSPACE_DOMAINS || "",
};

export function hasStripe() {
  return !!env.STRIPE_SECRET_KEY && !!env.STRIPE_PRICE_ONE_OFF;
}

export function normalizeBaseUrl(u: string) {
  return u.replace(/\/+$/g, "");
}

export function siteUrl() {
  return normalizeBaseUrl(env.NEXTAUTH_URL);
}

