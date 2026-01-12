"use client";
import React from "react";

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const v = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  return v ? decodeURIComponent(v.split('=')[1]) : null;
}

async function signOutNow() {
  try {
    await fetch('/auth/session', { method: 'POST' });
  } catch {}
  try {
    // Best-effort client cleanup of helper cookies
    document.cookie = 'dav_free=; Max-Age=0; Path=/';
    document.cookie = 'dav_free_expires_at=; Max-Age=0; Path=/';
  } catch {}
}

export default function SessionExpiryGuard() {
  React.useEffect(() => {
    function schedule() {
      const expRaw = readCookie('dav_free_expires_at');
      const now = Date.now();
      const exp = expRaw ? parseInt(expRaw, 10) : 0;
      if (!exp || Number.isNaN(exp)) return;
      const msLeft = exp - now;
      if (msLeft <= 0) {
        void signOutNow();
        return;
      }
      const id = window.setTimeout(() => { void signOutNow(); }, msLeft + 250);
      return () => window.clearTimeout(id);
    }
    const cleanup = schedule();
    const onVis = () => { const expRaw = readCookie('dav_free_expires_at'); if (expRaw && parseInt(expRaw, 10) <= Date.now()) void signOutNow(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return null;
}
