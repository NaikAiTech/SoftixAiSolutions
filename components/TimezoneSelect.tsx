"use client";
import React from "react";
import { TZ_LIST, tzOffsetLabel } from "@/lib/timezones";

export default function TimezoneSelect({ value, onChange, name, className }: { value?: string; onChange?: (v:string)=>void; name?: string; className?: string }){
  const current = value || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const list = [current, ...TZ_LIST.filter(z => z !== current)];
  const controlled = typeof onChange === 'function';
  return (
    <select
      name={name}
      className={className}
      {...(controlled
        ? { value: current, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) }
        : { defaultValue: current })}
    >
      {list.map(tz => (
        <option key={tz} value={tz}>{tz} ({tzOffsetLabel(tz)})</option>
      ))}
    </select>
  );
}

