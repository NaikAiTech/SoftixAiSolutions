"use client";
import * as React from "react";

export function Select({ value, onValueChange, children }: any){
  const [open, setOpen] = React.useState(false);
  const ctx = { value, onValueChange, open, setOpen } as any;
  return <SelectContext.Provider value={ctx}><div data-select>{children}</div></SelectContext.Provider>;
}
export function SelectTrigger({ className, children, onClick }: any){
  const ctx = React.useContext(SelectContext);
  return <button type="button" onClick={()=> ctx?.setOpen?.(!ctx?.open)} className={`border border-black/20 rounded-lg px-3 py-2 ${className||''}`}>{children}</button>;
}
export function SelectValue({ placeholder }: any){ return <span className="text-neutral-600">{placeholder}</span>; }
export function SelectContent({ children }: any){ const ctx = React.useContext(SelectContext); if (!ctx?.open) return null; return <div className="mt-2 rounded-lg border border-black/10 bg-white shadow p-1">{children}</div>; }
export function SelectItem({ value, children }: any){ const ctx = React.useContext(SelectContext); return <div onClick={()=> { ctx?.onValueChange?.(value); ctx?.setOpen?.(false); }} data-value={value} className="px-3 py-2 rounded hover:bg-black/5 cursor-pointer">{children}</div>; }
const SelectContext = React.createContext<any>(null);

