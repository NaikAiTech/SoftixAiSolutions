"use client";
import * as React from "react";
export function Switch({ id, defaultChecked, onChange }: any){
  const [checked, setChecked] = React.useState(!!defaultChecked);
  return (
    <button id={id} onClick={()=>{ const v = !checked; setChecked(v); onChange?.(v); }} className={`inline-flex h-5 w-9 items-center rounded-full ${checked? 'bg-black':'bg-neutral-300'}`}>
      <span className={`h-4 w-4 bg-white rounded-full transition-transform ${checked? 'translate-x-4':'translate-x-1'}`} />
    </button>
  );
}

