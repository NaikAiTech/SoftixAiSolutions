import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return res.status(500).json({
      ok: false,
      error:
        "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO env vars.",
    });
  }

  const body = req.body as Partial<ContactPayload>;
  if (!isNonEmptyString(body.name) || !isNonEmptyString(body.email) || !isNonEmptyString(body.message)) {
    return res.status(400).json({ ok: false, error: "Missing required fields." });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const subject = `New Contact Form Message - ${body.name}`;
  const text = [
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    body.company ? `Company: ${body.company}` : null,
    body.projectType ? `Project Type: ${body.projectType}` : null,
    body.budget ? `Budget: ${body.budget}` : null,
    "",
    "Message:",
    body.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await transporter.sendMail({
      from: `Softix AI Solutions <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: body.email,
      subject,
      text,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to send message." });
  }
}

