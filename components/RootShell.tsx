"use client";
import React from "react";
import dynamic from "next/dynamic";
import GlobalSidebar from "@/components/GlobalSidebar";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import SessionExpiryGuard from "@/components/SessionExpiryGuard";

const LoadingToast = dynamic(() => import("@/components/LoadingToast"), { ssr: false });

export default function RootShell({ children, dashboardHref, isAuthed }: { children: React.ReactNode; dashboardHref: string | null; isAuthed: boolean }){
  const [mobileOpen, setMobileOpen] = React.useState(false as boolean);
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);
  return (
    <div className="min-h-screen grid-cols-1 sm:grid sm:[grid-template-columns:auto_1fr]">
      {/* Global sidebar replaces header navbar across the site */}
      <GlobalSidebar isAuthed={isAuthed} dashboardHref={dashboardHref} mobileOpen={mobileOpen} onMobileClose={()=> setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col">
        {/* Header hidden to avoid duplicate navigation; keep for future reference if needed */}
        {/* <SiteHeader dashboardHref={dashboardHref} isAuthed={isAuthed} /> */}
        <div className="sm:hidden sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-white/80 backdrop-blur px-3 py-2">
          <button className="inline-flex items-center justify-center rounded-md border border-black/10 p-2" onClick={()=> setMobileOpen(true)} aria-label="Open menu">
            <MenuIcon className="h-5 w-5" />
          </button>
          <a href="/" className="inline-flex items-center gap-2">
            <Image src="/brand/logo.avif" alt="Dial A Vet" width={96} height={24} />
          </a>
          <a href="/book-a-vet-consultation" className="rounded-full bg-black px-3 py-1 text-sm text-white">Book</a>
        </div>
        <LoadingToast />
        <SessionExpiryGuard />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200" style={{ background: "#f5f7f6" }}>
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <a href="/" className="inline-flex items-center gap-2">
                <Image src="/brand/logo.avif" alt="Dial A Vet" width={120} height={28} />
              </a>
              <p className="mt-3 max-w-md text-sm text-neutral-600">With Dial A Vet, expert veterinary advice is just a tap away. Get fast vet consultations, trusted care, and personalized pet support – anytime, anywhere, all year round.</p>
              <p className="mt-3 text-sm text-neutral-800">Dial A Vet is ISO 27001:2022 and ISO 9001 Certified.</p>
              <div className="mt-3 flex items-center gap-2">
                <Image src="/badges/iso27001.png" alt="ISO 27001" width={64} height={64} />
                <Image src="/badges/iso9001.png" alt="ISO 9001" width={64} height={64} />
              </div>
              <a className="mt-4 inline-block text-sm text-neutral-700 hover:text-black" href="mailto:support@dialavet.com.au">support@dialavet.com.au</a>
            </div>
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-xs font-semibold tracking-wider text-neutral-900">FLUFFY STUFF</h4>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  <li><a href="/terms" className="hover:text-black">Terms &amp; Conditions</a></li>
                  <li><a href="/privacy" className="hover:text-black">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wider text-neutral-900">COMPANY</h4>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  <li><a href="/about" className="hover:text-black">About</a></li>
                  <li><a href="/careers" className="hover:text-black">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wider text-neutral-900">RESOURCES</h4>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  <li><a href="#" className="hover:text-black">Help Center</a></li>
                  <li><a href="/health-guides" className="hover:text-black">Blog</a></li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="mt-8 flex items-center justify-between text-sm text-neutral-600">
            <div>© {new Date().getFullYear()} Dial A Vet</div>
            <div>Developed by <a href="https://naikaitech.com" target="_blank" rel="noreferrer" className="underline">Naik Ai Tech</a></div>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
}

