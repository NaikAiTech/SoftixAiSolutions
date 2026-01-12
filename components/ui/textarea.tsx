"use client";
import * as React from "react";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea {...props} className={`border border-black/20 rounded-lg px-3 py-2 ${props.className||""}`} />;
}

