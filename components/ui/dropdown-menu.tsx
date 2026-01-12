"use client";
import * as React from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }){ return <div className="relative inline-block">{children}</div>; }

export function DropdownMenuTrigger({ asChild, children, __ctx }: any){
  const [open, setOpen] = React.useState(false);
  return React.cloneElement(children, { onClick: ()=> setOpen((o:boolean)=>!o), 'data-open': open, __ctx: { open, setOpen } });
}

export function DropdownMenuContent({ align = 'start', children, __ctx }: any){
  if (!__ctx?.open) return null;
  return <div className="absolute mt-2 right-0 z-20 min-w-[160px] rounded-lg border border-black/10 bg-white p-1 shadow" role="menu">{children}</div>;
}

export function DropdownMenuItem({ onClick, className, children }: any){
  return <button onClick={onClick} className={`block w-full text-left px-3 py-2 rounded hover:bg-black/5 ${className||''}`}>{children}</button>;
}

export function DropdownMenuLabel({ children }: any){ return <div className="px-3 py-2 text-xs text-neutral-500">{children}</div>; }
export function DropdownMenuSeparator(){ return <div className="my-1 h-px bg-black/10" />; }

