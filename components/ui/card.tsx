"use client";
import * as React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }){
  return <div className={`bg-white border border-black/10 rounded-2xl ${className||""}`}>{children}</div>;
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }){
  return <div className={`px-4 py-3 border-b border-black/10 ${className||""}`}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }){
  return <div className={`text-lg font-semibold ${className||""}`}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }){
  return <div className={`p-4 ${className||""}`}>{children}</div>;
}

