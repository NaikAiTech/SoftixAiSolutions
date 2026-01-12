"use client";
import * as React from "react";
export function Checkbox({ defaultChecked, onChange }: any){
  const [checked, setChecked] = React.useState(!!defaultChecked);
  return <input type="checkbox" checked={checked} onChange={(e)=>{ setChecked(e.target.checked); onChange?.(e.target.checked); }} className="h-4 w-4 rounded border-black/20" />;
}

