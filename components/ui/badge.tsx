"use client";
import * as React from "react";
export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "outline" | "secondary"; className?: string }){
  const cls = variant === 'outline'
    ? `inline-flex items-center rounded-xl px-2 py-1 text-xs border border-black/20 ${className||''}`
    : variant === 'secondary'
    ? `inline-flex items-center rounded-xl px-2 py-1 text-xs bg-neutral-100 ${className||''}`
    : `inline-flex items-center rounded-xl px-2 py-1 text-xs bg-emerald-100 text-emerald-900 ${className||''}`;
  return <span className={cls}>{children}</span>;
}

