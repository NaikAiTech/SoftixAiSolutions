"use client";
export function Label({ htmlFor, children, className }: { htmlFor?: string; children: any; className?: string }){
  return <label htmlFor={htmlFor} className={`text-sm text-neutral-700 ${className||''}`}>{children}</label>;
}

