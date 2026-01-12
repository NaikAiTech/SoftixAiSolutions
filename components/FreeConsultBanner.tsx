"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type FreeConsultBannerProps = {
  source?: string;
  className?: string;
  headline?: string;
  description?: string;
  buttonLabel?: string;
  successMessage?: string;
};

export default function FreeConsultBanner({
  source,
  className,
  headline = "Get a Free 10-Minute Vet Consultation With Dial A Vet",
  description = "",
  buttonLabel = "Receive Now",
  successMessage = "Success! We emailed your free booking link.",
}: FreeConsultBannerProps) {
  const inputId = React.useId();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Enter your email to continue.");
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/free-consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const err = data?.error || "We couldn't send the email. Please try again.";
        setStatus("error");
        setMessage(err);
        return;
      }
      setStatus("success");
      setMessage(successMessage);
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again in a moment.");
    }
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-emerald-600/20 bg-card text-card-foreground shadow-sm min-h-[124px]",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/badges/Free-Background.png)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
      <form onSubmit={onSubmit} className="relative z-10 flex w-full flex-col items-center gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-medium text-foreground md:text-xl">{headline}</h3>
          {description && <p className="text-sm text-muted-foreground md:text-base">{description}</p>}
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label htmlFor={inputId} className="sr-only">
              Email
            </label>
            <div className="flex w-full flex-col gap-1">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                id={inputId}
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm sm:w-64"
                disabled={status === "loading"}
                required
              />
              <p className="text-xs text-muted-foreground sm:text-left">* we will email a free booking link.</p>
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : buttonLabel}
            </button>
          </div>
          {message && (
            <p
              className={cn(
                "text-center text-sm md:text-left",
                status === "success" ? "text-emerald-900" : "text-rose-700"
              )}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
