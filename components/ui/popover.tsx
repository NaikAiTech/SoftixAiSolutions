"use client";
import * as React from "react";
export function Popover({ children }: any){ return <div className="relative inline-block">{children}</div>; }
export function PopoverTrigger({ asChild, children }: any){ return children; }
export function PopoverContent({ children, className, align }: any){ return <div className={`absolute z-20 mt-2 rounded-lg border border-black/10 bg-white p-2 shadow ${className||''}`}>{children}</div>; }

