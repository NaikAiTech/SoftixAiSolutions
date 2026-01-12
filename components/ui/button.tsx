"use client";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "icon";
};

export function Button({ href, className, variant = "default", size="md", children, ...rest }: Props){
  const base = "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors";
  const variants: Record<string,string> = {
    default: "bg-black text-white",
    outline: "border border-black/20 bg-white",
    ghost: "text-black/70 hover:bg-black/5",
    secondary: "bg-neutral-100",
  };
  const sizes: Record<string,string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    icon: "p-2",
  };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className||""}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}

