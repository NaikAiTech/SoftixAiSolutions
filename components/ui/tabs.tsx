"use client";
import * as React from "react";

export function Tabs({ value, onValueChange, className, children }:{ value: string; onValueChange: (v:string)=>void; className?: string; children: React.ReactNode }){
  return <div className={className}>{React.Children.map(children, (child: any)=>{
    if (!child) return null;
    if (child.type?.displayName === 'TabsList') return React.cloneElement(child, { value, onValueChange });
    if (child.type?.displayName === 'TabsContent') return React.cloneElement(child, { active: child.props.value === value });
    return child;
  })}</div>;
}

export function TabsList({ children, value, onValueChange, className }: any){
  return <div className={`flex flex-wrap gap-2 ${className||''}`}>{React.Children.map(children, (child: any)=> React.cloneElement(child, { current: child.props.value === value, onSelect: onValueChange }))}</div>;
}
TabsList.displayName = 'TabsList';

export function TabsTrigger({ value, children, current, onSelect }: any){
  return <button onClick={()=> onSelect?.(value)} className={`px-3 py-2 rounded-lg border ${current? 'bg-black text-white border-black':'bg-white border-black/20'}`}>{children}</button>;
}

export function TabsContent({ active, children, className }: any){
  if (!active) return null;
  return <div className={className}>{children}</div>;
}
TabsContent.displayName = 'TabsContent';

