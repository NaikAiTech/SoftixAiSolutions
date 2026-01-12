"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SERVICE_AREAS as COUNTRY_AREAS } from "@/lib/locations";
import {
  Home,
  Calendar,
  CreditCard,
  BookOpen,
  HelpCircle,
  Wallet,
  FileText,
  MessageCircle,
  PenSquare,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Briefcase,
  Plane,
  Heart,
  TriangleAlert,
} from "lucide-react";

export type GlobalSidebarProps = {
  isAuthed: boolean;
  dashboardHref: string | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

// Brand palette
const BRAND_PRIMARY = "#00A982"; // Dial A Vet green
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#FFFFFF";
const MINT = "#E6F6F2";

type Item = { label: string; href: string; icon: React.ComponentType<any> };
const BASE_NAV: Item[] = [
  { label: "Book Consultation", href: "/book-a-vet-consultation", icon: CreditCard },
  { label: "How It Works", href: "/how-to-book-an-online-vet-consultation", icon: HelpCircle },
  { label: "Pricing", href: "/pricing", icon: Wallet },
  { label: "Health Guides", href: "/health-guides", icon: BookOpen },
  { label: "Glossary", href: "/glossary", icon: FileText },
  { label: "Vetzo Free AI Chat", href: "https://vetzo.ai/", icon: MessageCircle },
  { label: "Vet Scribe", href: "https://vetzo.ai/scribe", icon: PenSquare },
];

const MOBILE_VET_LINKS: Item[] = [
  { label: "Fit-to-Fly Certificates", href: "/fit-to-fly", icon: Plane },
  { label: "Quality of Life", href: "/quality-of-life", icon: Heart },
  { label: "Emergency Mobile Vet", href: "/emergency-vet", icon: TriangleAlert },
];

// service areas provided by COUNTRY_AREAS

export default function GlobalSidebar({ isAuthed, dashboardHref, mobileOpen, onMobileClose }: GlobalSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    try { return localStorage.getItem("globalSidebarCollapsed") === "1"; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("globalSidebarCollapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  return (
    <>
    <aside
      className={[
        "hidden sm:flex sticky top-0 h-dvh shrink-0 flex-col border-r transition-all duration-200 ease-in-out",
        collapsed ? "w-16" : "w-72",
      ].join(" ")}
      style={{ borderColor: BORDER, backgroundColor: PAGE_BG, color: TEXT_DARK }}
      aria-label="Site navigation"
    >
      {/* Header / Logo */}
      {collapsed ? (
        <div className="px-3 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image src="/favicon.png" alt="Dial A Vet" width={32} height={32} />
            </Link>
            <button
              aria-label="Expand sidebar"
              title="Expand"
              onClick={() => setCollapsed(false)}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 py-3 border-b" style={{ borderColor: BORDER }}>
          <Link href="/" className="inline-flex items-center">
            <Image src="/brand/logo.avif" alt="Dial A Vet" width={120} height={28} />
          </Link>
          <button
            aria-label="Collapse sidebar"
            title="Collapse"
            onClick={() => setCollapsed(true)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Scrollable content (nav + extras) */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2 py-2 overscroll-contain">
        {(() => {
          const ITEMS = BASE_NAV;
          return (
            <>
              <ul className="space-y-1">
                {(() => {
                  const resolved = ITEMS;
                  return resolved.map(({ label, href, icon: Icon, disabled }: any) => {
                  const active = pathname && (pathname === href || pathname.startsWith(href + "/"));
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={[
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                          active ? "ring-0" : "hover:bg-slate-50 hover:-translate-x-0.5",
                          collapsed && active ? "after:content-[''] after:absolute after:right-1 after:top-1/2 after:-translate-y-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-[#00A982]" : "",
                        ].join(' ')}
                        style={{
                          backgroundColor: active ? MINT : "transparent",
                          color: TEXT_DARK,
                          borderLeft: active ? `3px solid ${BRAND_PRIMARY}` : "3px solid transparent",
                        }}
                        aria-label={label}
                        title={collapsed ? label : undefined}
                        aria-current={active ? "page" : undefined}
                        onClick={(e)=>{ if (disabled) { e.preventDefault(); } }}
                      >
                        <Icon className="h-4 w-4 transition-colors group-hover:text-[#00A982]" style={{ color: active ? BRAND_PRIMARY : TEXT_MUTED }} />
                        {!collapsed && <span className="truncate">{label}</span>}
                      </Link>
                    </li>
                  );
                }); })()}
              </ul>
              

              {/* Extras only when expanded */}
              {!collapsed && (
                <>
                  <div className="mt-6 space-y-2 px-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Home className="h-3.5 w-3.5 text-[#4B5563]" />
                      Mobile Vet (AU)
                    </div>
                    <ul className="flex w-full flex-col gap-1">
                      {MOBILE_VET_LINKS.map(({ label, href, icon: Icon }) => {
                        const active = pathname && (pathname === href || pathname.startsWith(href + "/"));
                        return (
                          <li key={href}>
                            <Link
                              href={href}
                              className={[
                                "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors",
                                active ? "bg-[#E6F6F2] text-[#111827]" : "text-[#4B5563] hover:bg-slate-50",
                              ].join(" ")}
                              aria-current={active ? "page" : undefined}
                            >
                              <Icon className="h-4 w-4" style={{ color: active ? BRAND_PRIMARY : "#9CA3AF" }} />
                              <span className="truncate">{label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-6 space-y-2 px-2">
                    <p className="text-sm font-medium">Resources</p>
                    <Link href="/about" className="block text-sm hover:underline">About Dial A Vet</Link>
                    <Link href="/careers" className="block text-sm hover:underline">Careers</Link>
                    <a href="mailto:support@dialavet.com.au" className="block text-sm hover:underline">Contact Us</a>
                    <Link href="/privacy" className="block text-sm hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="block text-sm hover:underline">Terms of Service</Link>
                  </div>

                  <div className="mt-6 px-2">
                    <p className="mb-2 text-sm font-medium">Service Areas</p>
                    <ul className="space-y-2">
                      {COUNTRY_AREAS.map((sa) => (
                        <li key={sa.country} className="text-sm">
                          <details>
                            <summary className="cursor-pointer flex items-center justify-between">
                              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" style={{ color: TEXT_MUTED }} /> {sa.country}</span>
                              <span className="text-xs" style={{ color: TEXT_MUTED }}>▾</span>
                            </summary>
                            <ul className="mt-1 pl-5 space-y-1">
                              {sa.cities.map((c) => (
                                <li key={c.slug}>
                                  <Link href={`/locations/${sa.countrySlug}/${c.slug}`} className="block rounded px-2 py-1 text-sm hover:underline">{c.name}</Link>
                                </li>
                              ))}
                            </ul>
                          </details>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          );
        })()}
      </div>

      {/* CTAs */}
      <div className="px-3 pb-2">
        <div className="px-1 pt-2">
          {collapsed ? (
            <a
              href="/book-a-vet-consultation"
              className="inline-flex w-full items-center justify-center rounded-full p-2 text-white transition"
              style={{ backgroundColor: BRAND_PRIMARY }}
              aria-label="Book Consultation"
              title="Book Consultation"
            >
              <Calendar className="h-4 w-4" />
            </a>
          ) : (
            <a
              href="/book-a-vet-consultation"
              className="block w-full rounded-full px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              <Calendar className="h-4 w-4" />
              Book Consultation
            </a>
          )}
          {!collapsed && (
            <p className="mt-3 px-1 text-xs" style={{ color: TEXT_MUTED }}>
              Join thousands of pet owners getting fast and trusted advice
            </p>
          )}
        </div>
      </div>

      {/* Legal note when expanded */}
      {!collapsed && (
        <div className="px-4 py-3 border-t" style={{ borderColor: BORDER }}>
          <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
            Dial A Vet provides veterinary guidance, not a substitute for in-person veterinary care. Always consult with a licensed veterinarian for emergencies.
          </p>
        </div>
      )}
    </aside>
    {/* Mobile drawer */}
    {mobileOpen ? (
      <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true">
        <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={onMobileClose} />
        <div className="absolute inset-y-0 left-0 w-[88vw] max-w-[320px] bg-white border-r" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between px-3 py-3 border-b" style={{ borderColor: BORDER }}>
            <Link href="/" className="inline-flex items-center">
              <Image src="/brand/logo.avif" alt="Dial A Vet" width={120} height={28} />
            </Link>
            <button aria-label="Close" className="rounded-md p-1 text-slate-500 hover:bg-slate-50" onClick={onMobileClose}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto sidebar-scroll px-2 py-2">
            {(() => {
                const PRIMARY = BASE_NAV.slice(0, 4);
                const DISCOVER = BASE_NAV.slice(4);
                return (
                  <>
                    
                    <ul className="space-y-1">
                      {(() => {
                        const role = isAuthed ? (dashboardHref?.startsWith('/admin') ? 'ADMIN' : (dashboardHref?.startsWith('/vet') ? 'VET' : 'USER')) : null;
                        const resolved = PRIMARY.map((it) => {
                          if (it.label === 'Dashboard') return { ...it, href: isAuthed && dashboardHref ? dashboardHref : '/login' } as any;
                          if (it.label === 'My Appointments') return { ...it, href: isAuthed ? (role === 'USER' ? '/account/appointments' : (dashboardHref || '/login')) : '/login' } as any;
                          if (it.label === 'Subscription') {
                            const disabled = !!role && role !== 'USER';
                            const dest = isAuthed ? (role === 'USER' ? '/account/settings' : '#') : '/login';
                            return { ...it, href: dest, disabled } as any;
                          }
                          return it as any;
                        });
                        return resolved.map(({ label, href, icon: Icon, disabled }: any) => {
                          const active = pathname && (pathname === href || pathname.startsWith(href + "/"));
                          return (
                            <li key={href}>
                              <Link href={href} onClick={(e)=>{ if (disabled) { e.preventDefault(); } else { onMobileClose?.(); } }}
                                className={["group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                                  active ? "ring-0" : "hover:bg-slate-50"].join(" ")}
                                style={{ backgroundColor: active ? MINT : "transparent", color: TEXT_DARK, borderLeft: active ? `3px solid ${BRAND_PRIMARY}` : "3px solid transparent" }}
                                aria-current={active ? "page" : undefined}>
                                <Icon className="h-4 w-4" style={{ color: active ? BRAND_PRIMARY : TEXT_MUTED }} />
                                <span className="truncate">{label}</span>
                              </Link>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                    <div className="my-3 mx-2 h-px bg-[#E5E7EB]" />
                    
                    <ul className="space-y-1">
                      {(() => {
                        const role = isAuthed ? (dashboardHref?.startsWith('/admin') ? 'ADMIN' : (dashboardHref?.startsWith('/vet') ? 'VET' : 'USER')) : null;
                        const resolved = DISCOVER.map((it) => {
                          if (it.label === 'Subscription') {
                            const disabled = !!role && role !== 'USER';
                            const dest = isAuthed ? (role === 'USER' ? '/account/settings' : '#') : '/login';
                            return { ...it, href: dest, disabled } as any;
                          }
                          return it as any;
                        });
                        return resolved.map(({ label, href, icon: Icon, disabled }: any) => {
                          const active = pathname && (pathname === href || pathname.startsWith(href + "/"));
                          return (
                            <li key={href}>
                              <Link href={href} onClick={(e)=>{ if (disabled) { e.preventDefault(); } else { onMobileClose?.(); } }}
                                className={["group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                                  active ? "ring-0" : "hover:bg-slate-50"].join(" ")}
                                style={{ backgroundColor: active ? MINT : "transparent", color: TEXT_DARK, borderLeft: active ? `3px solid ${BRAND_PRIMARY}` : "3px solid transparent" }}
                                aria-current={active ? "page" : undefined}>
                                <Icon className="h-4 w-4" style={{ color: active ? BRAND_PRIMARY : TEXT_MUTED }} />
                                <span className="truncate">{label}</span>
                              </Link>
                            </li>
                          );
                        });
                      })()}
                    </ul>
                    <div className="mt-6 space-y-2 px-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Home className="h-3.5 w-3.5 text-[#4B5563]" />
                        Mobile Vet (AU)
                      </div>
                      <ul className="flex w-full flex-col gap-1">
                        {MOBILE_VET_LINKS.map(({ label, href, icon: Icon }) => {
                          const active = pathname && (pathname === href || pathname.startsWith(href + "/"));
                          return (
                            <li key={href}>
                              <Link
                                href={href}
                                onClick={onMobileClose}
                                className={[
                                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors",
                                  active ? "bg-[#E6F6F2] text-[#111827]" : "text-[#4B5563] hover:bg-slate-50",
                                ].join(" ")}
                                aria-current={active ? "page" : undefined}
                              >
                                <Icon className="h-4 w-4" style={{ color: active ? BRAND_PRIMARY : "#9CA3AF" }} />
                                <span className="truncate">{label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {/* Extras on mobile to match desktop */}
                    <div className="mt-6 space-y-2 px-2">
                      <p className="text-sm font-medium">Resources</p>
                      <Link href="/about" onClick={onMobileClose} className="block text-sm hover:underline">About Dial A Vet</Link>
                      <Link href="/careers" onClick={onMobileClose} className="block text-sm hover:underline">Careers</Link>
                      <a href="mailto:support@dialavet.com.au" onClick={onMobileClose} className="block text-sm hover:underline">Contact Us</a>
                      <Link href="/privacy" onClick={onMobileClose} className="block text-sm hover:underline">Privacy Policy</Link>
                      <Link href="/terms" onClick={onMobileClose} className="block text-sm hover:underline">Terms of Service</Link>
                    </div>

                    <div className="mt-6 px-2">
                      <p className="mb-2 text-sm font-medium">Service Areas</p>
                      <ul className="space-y-2">
                        {COUNTRY_AREAS.map((sa) => (
                          <li key={sa.country} className="text-sm">
                            <details>
                              <summary className="cursor-pointer flex items-center justify-between">
                                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" style={{ color: TEXT_MUTED }} /> {sa.country}</span>
                                <span className="text-xs" style={{ color: TEXT_MUTED }}>▾</span>
                              </summary>
                              <ul className="mt-1 pl-5 space-y-1">
                                {sa.cities.map((c) => (
                                  <li key={c.slug}>
                                    <Link href={`/locations/${sa.countrySlug}/${c.slug}`} onClick={onMobileClose} className="block rounded px-2 py-1 text-sm hover:underline">{c.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="px-3 pb-3 pt-1 border-t" style={{ borderColor: BORDER }}>
              <a href="/book-a-vet-consultation" onClick={onMobileClose} className="block w-full rounded-full px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition inline-flex items-center justify-center gap-2" style={{ backgroundColor: BRAND_PRIMARY }}>
                <Calendar className="h-4 w-4" /> Book Consultation
              </a>
              {isAuthed ? (dashboardHref ? (
                <a href={dashboardHref} onClick={onMobileClose} className="mt-2 block w-full rounded-full border px-4 py-2 text-center text-sm font-medium transition hover:bg-slate-50" style={{ borderColor: BORDER, color: TEXT_DARK }}>
                  Dashboard
                </a>
              ) : null) : (
                <a href="/login" onClick={onMobileClose} className="mt-2 block w-full rounded-full border px-4 py-2 text-center text-sm font-medium transition hover:bg-slate-50" style={{ borderColor: BORDER, color: TEXT_DARK }}>
                  Log In
                </a>
              )}
              <p className="mt-3 text-center text-xs" style={{ color: TEXT_MUTED }}>
                Join thousands of pet owners getting fast and trusted advice
              </p>
              <p className="mt-3 text-[11px] leading-relaxed" style={{ color: TEXT_MUTED }}>
                Dial A Vet provides veterinary guidance, not a substitute for in-person veterinary care. Always consult with a licensed veterinarian for emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
