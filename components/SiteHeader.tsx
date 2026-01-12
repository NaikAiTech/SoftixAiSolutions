"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function SiteHeader({ dashboardHref, isAuthed }: { dashboardHref: string | null; isAuthed: boolean }) {
  const [open, setOpen] = useState(false);
      return (
        <header className={`dl-header ${open ? "open" : ""}`} style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(0,0,0,.06)", background: "#f5f7f6" }}>
      <div className="container grid grid-cols-3 items-center" style={{ paddingTop: 14, paddingBottom: 14 }}>
        <div className="flex items-center">
          <a href="/" aria-label="Dial A Vet" className="flex items-center">
            <Image src="/brand/logo.avif" alt="Dial A Vet" width={120} height={28} />
          </a>
        </div>

        <button aria-label="Toggle menu" aria-expanded={open} aria-controls="dl-nav" onClick={() => setOpen((v) => !v)} className="justify-self-center flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white md:hidden">
          <span className="block h-[2px] w-4 bg-black"></span>
        </button>

        <nav id="dl-nav" className="hidden justify-self-center md:block">
          <ul className="flex items-center gap-8 text-[14px] text-gray-700">
            <li><a href="#" className="inline-flex items-center whitespace-nowrap hover:text-black">Pet Health<span className="ml-1">▾</span></a></li>
            <li><a href="/pricing" className="inline-flex items-center whitespace-nowrap hover:text-black">Pricing</a></li>
            <li><a href="/how-to-book-an-online-vet-consultation" className="inline-flex items-center whitespace-nowrap hover:text-black">How It Works</a></li>
            <li><a href="mailto:support@dialavet.com.au" className="inline-flex items-center whitespace-nowrap hover:text-black">Contact</a></li>
          </ul>
        </nav>
        <div className="justify-self-end">
          {isAuthed ? (
            dashboardHref ? <a href={dashboardHref} className="hidden rounded-full bg-black px-4 py-2 text-sm text-white md:inline-flex">Dashboard</a> : null
          ) : (
            <a href="/login" className="hidden rounded-full bg-black px-4 py-2 text-sm text-white md:inline-flex">Log in</a>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/10" style={{ background: "#f0efe5" }}>
          <ul className="flex flex-col gap-0 p-3 text-sm text-gray-700">
            <li><a href="#" className="block py-2">Pet Health</a></li>
            <li><a href="/pricing" className="block py-2">Pricing</a></li>
            <li><a href="/how-to-book-an-online-vet-consultation" className="block py-2">How It Works</a></li>
            <li><a href="mailto:support@dialavet.com.au" className="block py-2">Contact</a></li>
            <li className="pt-2">{isAuthed ? (dashboardHref ? <a href={dashboardHref} className="rounded-full border border-black/10 px-4 py-2">Dashboard</a> : null) : <a href="/login" className="rounded-full border border-black/10 px-4 py-2">Log in</a>}</li>
          </ul>
        </div>
      )}
    </header>
  );
}

