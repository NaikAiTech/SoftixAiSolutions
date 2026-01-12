"use client";
import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`border border-black/20 rounded-lg px-3 py-2 ${props.className||""}`} />;
}

