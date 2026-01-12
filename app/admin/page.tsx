"use client";
import "./admin.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import TimezoneSelect from "@/components/TimezoneSelect";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  EllipsisVertical,
  Search,
  Download,
  Upload,
  Plus,
  Trash2,
  Users,
  Stethoscope,
  Clock,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  CreditCard,
  LogOut,
} from "lucide-react";

// Dynamic company options will be provided at runtime

// Live state
type Consult = any;
const emptyArr: any[] = [];

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Toolbar({
  companyFilter,
  setCompanyFilter,
  dateRange,
  setDateRange,
  onExport,
  companyOptions,
}: any) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 border rounded-md px-3 py-2">
          <CalendarIcon className="h-4 w-4" />
          <input
            type="date"
            value={dateRange?.from ?? ""}
            onChange={(e)=>setDateRange((prev:any)=>({ ...(prev||{}), from: e.target.value }))}
            className="outline-none text-sm"
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="date"
            value={dateRange?.to ?? ""}
            onChange={(e)=>setDateRange((prev:any)=>({ ...(prev||{}), to: e.target.value }))}
            className="outline-none text-sm"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <select
          value={companyFilter}
          onChange={(e)=>setCompanyFilter(e.target.value)}
          className="px-3 py-2 text-sm outline-none bg-white"
        >
          {(companyOptions||[]).map((c: any)=> <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <Button variant="outline" className="gap-2 hidden">
        <Filter className="h-4 w-4" />
        More filters
      </Button>
      <Button variant="outline" className="gap-2" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-3 text-sm align-top">{children}</td>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sitemap");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [dateRange, setDateRange] = useState<any>({ from: "", to: "" });
  const [query, setQuery] = useState("");
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminInitial, setAdminInitial] = useState<string>("A");
  const [selectedConsult, setSelectedConsult] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileVetId, setProfileVetId] = useState<string | null>(null);
  const [profileValues, setProfileValues] = useState<{ displayName: string; zoomUserEmail: string; timezone: string; status: 'ONLINE'|'OFFLINE' }>(
    { displayName: '', zoomUserEmail: '', timezone: '', status: 'OFFLINE' }
  );
  const [profileSaving, setProfileSaving] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [availVetId, setAvailVetId] = useState<string | null>(null);
  const [availBlocks, setAvailBlocks] = useState<any[]>([]);
  const [availForm, setAvailForm] = useState<{ weekday: number; start: string; end: string }>({ weekday: 1, start: '09:00', end: '17:00' });
  const [availSaving, setAvailSaving] = useState(false);
  // Live data
  const [consultations, setConsultations] = useState<Consult[]>(emptyArr);
  const [vets, setVets] = useState<any[]>(emptyArr);
  const [users, setUsers] = useState<any[]>(emptyArr);
  const [mtd, setMtd] = useState<{ amount: number; currency: string } | null>(null);
  const [partnerCounts, setPartnerCounts] = useState<Record<string, number>>({});
  // Subscription plans config
  const [planOneOff, setPlanOneOff] = useState<{ enabled: boolean; price: number; id: string }>({ enabled: true, price: 49, id: '' });
  const [planAnnual, setPlanAnnual] = useState<{ enabled: boolean; price: number; id: string }>({ enabled: true, price: 199, id: '' });
  const [planBiennial, setPlanBiennial] = useState<{ enabled: boolean; price: number; id: string }>({ enabled: true, price: 299, id: '' });
  const [savingOneOff, setSavingOneOff] = useState(false);
  const [savingAnnual, setSavingAnnual] = useState(false);
  const [savingBiennial, setSavingBiennial] = useState(false);
  const [subs, setSubs] = useState<{ active:number; churn30dPercent:number; mrr:number; currency:string } | null>(null);
  const [sitemapManifest, setSitemapManifest] = useState<any | null>(null);
  const [sitemapLoading, setSitemapLoading] = useState<boolean>(true);
  const [sitemapError, setSitemapError] = useState<string | null>(null);
  const [sitemapStatus, setSitemapStatus] = useState<any | null>(null);
  const [sitemapNotice, setSitemapNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pollBuildId, setPollBuildId] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const startLoading = useCallback((message: string) => {
    if (!loadingRef.current) {
      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message } }));
      loadingRef.current = true;
    }
  }, []);

  const stopLoading = useCallback(() => {
    if (loadingRef.current) {
      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
      loadingRef.current = false;
    }
  }, []);

  const formatIso = useCallback((iso: string | null | undefined) => {
    if (!iso) return '?';
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch {
      return iso;
    }
  }, []);

  const formatDurationMs = useCallback((ms?: number | null) => {
    if (ms === null || ms === undefined) return '?';
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  }, []);
  // Partner companies / codes state
  const [partnerCompanies, setPartnerCompanies] = useState<Array<{ id:string; name:string; defaultAccessDays: number|null; codePrefix: string|null; active?: boolean }>>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [codeBatches, setCodeBatches] = useState<any[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  // Dialog state for Add Company modals
  const [addCompanyDialog1, setAddCompanyDialog1] = useState(false);
  const [addCompanyDialog2, setAddCompanyDialog2] = useState(false);
  // Customers modal state
  const [custOpen, setCustOpen] = useState(false);
  const [custSaving, setCustSaving] = useState(false);
  const [custMode, setCustMode] = useState<'view'|'edit'>('view');
  const [custUser, setCustUser] = useState<any>(null);
  const [custForm, setCustForm] = useState<{ firstName:string; lastName:string; email:string; phone:string; company:string }>({ firstName:'', lastName:'', email:'', phone:'', company:'' });
  function convertUtcHmToTz(weekday: number, hmUtc: string, tz: string){
    try {
      const now = new Date();
      const days = (weekday - now.getDay() + 7) % 7;
      const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
      const offStr = formatInTimeZone(base, tz, 'xxx');
      const sign = offStr.startsWith('-') ? -1 : 1;
      const [oh, om] = offStr.slice(1).split(':').map((n)=> parseInt(n,10));
      const offsetMin = sign * (oh*60 + (om||0));
      const [hh, mm] = hmUtc.split(':').map((n)=> parseInt(n,10));
      const total = (hh*60 + (mm||0)) + offsetMin;
      const wrap = ((total % 1440)+1440)%1440;
      const h = Math.floor(wrap/60); const m = wrap%60; const pad=(n:number)=> String(n).padStart(2,'0');
      return `${pad(h)}:${pad(m)}`;
    } catch { return hmUtc; }
  }

  function AvailabilityPills({ blocks, tz }:{ blocks: any[]; tz: string }){
    if (!Array.isArray(blocks) || blocks.length === 0) return <div className="text-sm text-gray-500">No blocks</div>;
    const grouped = new Map<number, string[]>();
    for (const b of blocks) {
      const s = convertUtcHmToTz(b.weekday, b.start, tz);
      const e = convertUtcHmToTz(b.weekday, b.end, tz);
      const arr = grouped.get(b.weekday) || [];
      arr.push(`${s}-${e}`);
      grouped.set(b.weekday, arr);
    }
    const items = Array.from(grouped.entries()).sort((a,b)=> a[0]-b[0]);
    return (
      <div className="flex flex-wrap gap-2">
        {items.map(([d, ranges]) => (
          <div key={d} className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white/80 px-3 py-1.5 text-sm shadow-sm">
            <span className="rounded-full bg-[#f5f7f6] border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-800">{dayNames[d]}</span>
            <span className="text-gray-700">{ranges.join(", ")}</span>
          </div>
        ))}
      </div>
    );
  }
  const fetchManifest = useCallback(async () => {
    setSitemapLoading(true);
    setSitemapError(null);
    try {
      const res = await fetch('/api/sitemap/manifest', { cache: 'no-store' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to load sitemap manifest');
      }
      const data = await res.json().catch(() => ({} as any));
      setSitemapManifest(data?.manifest || null);
    } catch (err: any) {
      setSitemapError(err?.message || 'Failed to load sitemap manifest');
      setSitemapManifest(null);
    } finally {
      setSitemapLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(async () => {
    setSitemapNotice(null);
    setSitemapError(null);
    try {
      startLoading('Regenerating sitemap…');
      const res = await fetch('/api/sitemap/regenerate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        stopLoading();
        setSitemapNotice({ type: 'error', message: text || 'Failed to start sitemap generation.' });
        return;
      }
      const data = await res.json().catch(() => ({} as any));
      setSitemapStatus(data);
      if (data?.buildId) {
        setPollBuildId(data.buildId);
      } else {
        stopLoading();
        setSitemapNotice({ type: 'error', message: 'Failed to obtain sitemap build ID.' });
      }
    } catch (err: any) {
      stopLoading();
      setSitemapNotice({ type: 'error', message: err?.message || 'Failed to start sitemap generation.' });
    }
  }, [startLoading, stopLoading]);

  const handleCancel = useCallback(async () => {
    if (!sitemapStatus?.buildId) return;
    setSitemapNotice(null);
    try {
      startLoading('Cancelling sitemap…');
      const res = await fetch('/api/sitemap/cancel', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ buildId: sitemapStatus.buildId }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to cancel sitemap build.');
      }
      const data = await res.json().catch(() => null);
      if (data) {
        setSitemapStatus((prev: any) => ({ ...(prev || {}), ...data }));
        setPollBuildId((prev) => prev || data.buildId || null);
      }
      setSitemapNotice({ type: 'success', message: 'Cancellation requested.' });
    } catch (err: any) {
      setSitemapNotice({ type: 'error', message: err?.message || 'Failed to cancel sitemap build.' });
    } finally {
      stopLoading();
    }
  }, [sitemapStatus, startLoading, stopLoading]);

  useEffect(() => {
    fetchManifest();
  }, [fetchManifest]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/sitemap/status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (!data || cancelled) return;
        setSitemapStatus(data);
        if (data.manifest) setSitemapManifest(data.manifest);
        if (data.status === 'running' && data.buildId) {
          startLoading('Regenerating sitemap…');
          setPollBuildId(data.buildId);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [startLoading]);

  useEffect(() => {
    if (!pollBuildId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const res = await fetch(`/api/sitemap/status?buildId=${encodeURIComponent(pollBuildId)}`, { cache: 'no-store' });
        if (res.status === 404) {
          setPollBuildId(null);
          stopLoading();
          setSitemapStatus(null);
          await fetchManifest();
          return;
        }
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Failed to poll sitemap status');
        }
        const data = await res.json().catch(() => null);
        if (!data || cancelled) return;
        setSitemapStatus(data);
        if (data.manifest) setSitemapManifest(data.manifest);
        if (data.status === 'success') {
          setSitemapNotice({ type: 'success', message: 'Sitemap regenerated successfully.' });
          setPollBuildId(null);
          stopLoading();
          await fetchManifest();
        } else if (data.status === 'error') {
          setSitemapNotice({ type: 'error', message: data.error || 'Sitemap regeneration failed.' });
          setPollBuildId(null);
          stopLoading();
        } else if (data.status === 'cancelled') {
          setSitemapNotice({ type: 'error', message: 'Sitemap regeneration cancelled.' });
          setPollBuildId(null);
          stopLoading();
          await fetchManifest();
        }
      } catch (err: any) {
        if (cancelled) return;
        setSitemapError(err?.message || 'Failed to poll sitemap status');
      }
    };

    poll();
    timer = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [pollBuildId, fetchManifest, stopLoading]);

  useEffect(() => {
    if (!sitemapNotice) return;
    const timeout = setTimeout(() => setSitemapNotice(null), sitemapNotice.type === 'success' ? 6000 : 8000);
    return () => clearTimeout(timeout);
  }, [sitemapNotice]);

  useEffect(() => (
    () => {
      stopLoading();
    }
  ), [stopLoading]);
  // Admin settings state
  const [settingTz, setSettingTz] = useState<string>("");
  const [settingVideo, setSettingVideo] = useState<string>("Native (Zoom SDK)");
  const [settingAnn, setSettingAnn] = useState<string>("");
  const [settingOtp, setSettingOtp] = useState<boolean>(false);
  const [settingVetAvail, setSettingVetAvail] = useState<boolean>(true);

  // Reports: monthly series (consultations vs customers registered that month)
  const reportsData = useMemo(() => {
    const tz = settingTz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fromStr = (dateRange?.from || '').trim();
    const toStr = (dateRange?.to || '').trim();
    // Determine month range
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    if (fromStr) minDate = new Date(`${fromStr}T00:00:00Z`);
    if (toStr) maxDate = new Date(`${toStr}T23:59:59Z`);
    if (!minDate) {
      const userMin = (users||emptyArr).map((u:any)=> u.createdAt? new Date(u.createdAt) : null).filter(Boolean).sort((a:any,b:any)=> (a as Date).getTime() - (b as Date).getTime())[0] as Date|undefined;
      const consMin = (consultations||emptyArr).map((c:any)=> new Date(c.startTime || c.scheduledAt)).filter((d:any)=> d && !isNaN(d.getTime())).sort((a:any,b:any)=> a.getTime()-b.getTime())[0] as Date|undefined;
      minDate = userMin || consMin || new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth()-11, 1));
    }
    if (!maxDate) {
      const userMax = (users||emptyArr).map((u:any)=> u.createdAt? new Date(u.createdAt) : null).filter(Boolean).sort((a:any,b:any)=> (b as Date).getTime() - (a as Date).getTime())[0] as Date|undefined;
      const consMax = (consultations||emptyArr).map((c:any)=> new Date(c.startTime || c.scheduledAt)).filter((d:any)=> d && !isNaN(d.getTime())).sort((a:any,b:any)=> b.getTime()-a.getTime())[0] as Date|undefined;
      maxDate = userMax || consMax || new Date();
    }
    // Snap to month boundaries (UTC)
    const startMonth = new Date(Date.UTC(minDate!.getUTCFullYear(), minDate!.getUTCMonth(), 1));
    const endMonth = new Date(Date.UTC(maxDate!.getUTCFullYear(), maxDate!.getUTCMonth(), 1));
    // Build month buckets
    const months: { key: string; label: string }[] = [];
    let y = startMonth.getUTCFullYear();
    let m = startMonth.getUTCMonth();
    while (y < endMonth.getUTCFullYear() || (y === endMonth.getUTCFullYear() && m <= endMonth.getUTCMonth())) {
      const d = new Date(Date.UTC(y, m, 1));
      months.push({ key: formatInTimeZone(d, tz, 'yyyy-MM'), label: formatInTimeZone(d, tz, 'MMM') });
      m += 1; if (m > 11) { m = 0; y += 1; }
    }
    const consultMap = new Map(months.map(mm => [mm.key, 0] as [string, number]));
    const customersMap = new Map(months.map(mm => [mm.key, 0] as [string, number]));
    const firstKey = months[0]?.key || null;
    const lastKey = months[months.length-1]?.key || null;
    // Count consultations
    (consultations || emptyArr).forEach((c: any) => {
      const dt = c.startTime || c.scheduledAt; if (!dt) return;
      const key = formatInTimeZone(new Date(dt), tz, 'yyyy-MM');
      if (firstKey && key < firstKey) return; if (lastKey && key > lastKey) return;
      const comp = c.user?.company || '';
      const inCompany = companyFilter === 'All Companies' || comp === companyFilter;
      if (!inCompany) return;
      if (consultMap.has(key)) consultMap.set(key, (consultMap.get(key) || 0) + 1);
    });
    // Count customers (role=customer) by createdAt month
    (users || emptyArr).forEach((u: any) => {
      const created = u.createdAt ? new Date(u.createdAt) : null; if (!created) return;
      const key = formatInTimeZone(created, tz, 'yyyy-MM');
      if (firstKey && key < firstKey) return; if (lastKey && key > lastKey) return;
      const comp = u.company || '';
      const inCompany = companyFilter === 'All Companies' || comp === companyFilter;
      if (!inCompany) return;
      if (customersMap.has(key)) customersMap.set(key, (customersMap.get(key) || 0) + 1);
    });
    return months.map(mm => ({ month: mm.label, consults: consultMap.get(mm.key) || 0, customers: customersMap.get(mm.key) || 0 }));
  }, [consultations, users, settingTz, companyFilter, dateRange]);

  // Reports: partner counts by customer registrations (filtered by date range)
  const partnerUserCounts = useMemo(() => {
    const fromStr = (dateRange?.from || '').trim();
    const toStr = (dateRange?.to || '').trim();
    const fromDate = fromStr ? new Date(`${fromStr}T00:00:00Z`) : null;
    const toDate = toStr ? new Date(`${toStr}T23:59:59Z`) : null;
    const counts: Record<string, number> = {};
    (users || emptyArr).forEach((u: any) => {
      const d = u.createdAt ? new Date(u.createdAt) : null;
      if (fromDate && d && d < fromDate) return;
      if (toDate && d && d > toDate) return;
      const comp = u.company || 'Other';
      if (companyFilter !== 'All Companies' && comp !== companyFilter) return;
      counts[comp] = (counts[comp] || 0) + 1;
    });
    return counts;
  }, [users, companyFilter, dateRange]);

  // Reports: customers by country (derived from timezone/phone; hide if indeterminate)
  const usersByCountry = useMemo(() => {
    const fromStr = (dateRange?.from || '').trim();
    const toStr = (dateRange?.to || '').trim();
    const fromDate = fromStr ? new Date(`${fromStr}T00:00:00Z`) : null;
    const toDate = toStr ? new Date(`${toStr}T23:59:59Z`) : null;
    const deriveCountry = (u: any) => {
      if (u.country && typeof u.country === 'string') return (u.country as string).toUpperCase();
      const tz = u.timezone as string | null | undefined;
      if (tz) {
        if (tz.startsWith('Australia/')) return 'AU';
        if (tz === 'Pacific/Auckland') return 'NZ';
        if (tz === 'Europe/London') return 'UK';
        if (tz === 'Europe/Dublin') return 'IE';
        const caTz = ['America/Toronto','America/Winnipeg','America/Edmonton','America/Vancouver','America/Halifax','America/St_Johns'];
        if (caTz.includes(tz)) return 'CA';
        if (tz.startsWith('America/')) return 'US';
      }
      const phone = String(u.phone||'').replace(/[^+0-9]/g,'');
      if (phone.startsWith('+61')) return 'AU';
      if (phone.startsWith('+64')) return 'NZ';
      if (phone.startsWith('+44')) return 'UK';
      if (phone.startsWith('+353')) return 'IE';
      if (phone.startsWith('+1')) return 'US';
      return 'Unknown';
    };
    const counts: Record<string, number> = {};
    (users || emptyArr).forEach((u: any) => {
      const d = u.createdAt ? new Date(u.createdAt) : null;
      if (fromDate && d && d < fromDate) return;
      if (toDate && d && d > toDate) return;
      const comp = u.company || 'All Companies';
      if (companyFilter !== 'All Companies' && comp !== companyFilter) return;
      const cc = deriveCountry(u);
      counts[cc] = (counts[cc] || 0) + 1;
    });
    return counts;
  }, [users, companyFilter, dateRange]);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, rev] = await Promise.all([
          fetch('/api/admin/users?role=CUSTOMER').then(r=> r.ok ? r.json() : null).catch(()=>null),
          fetch('/api/admin/revenue').then(r=> r.ok ? r.json() : null).catch(()=>null),
        ]);
        if (Array.isArray(usersRes?.items)) setUsers(usersRes.items);
        if (rev && typeof rev.mtd === 'number') setMtd({ amount: rev.mtd, currency: rev.currency || 'AUD' });
        // derive partner counts from consultations if partner/company exists
        const counts: Record<string, number> = {};
        (consultations || []).forEach((c: any) => {
          const key = c.user?.company || 'Other';
          counts[key] = (counts[key] || 0) + 1;
        });
        setPartnerCounts(counts);
      } catch {}
    })();
  }, [consultations]);

  // Hydrate admin identity for avatar/label
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await fetch('/api/me').then(r => r.ok ? r.json() : null).catch(() => null);
        if (!alive) return;
        const email = me?.user?.email || null;
        setAdminEmail(email);
        if (email && typeof email === 'string' && email.length > 0) {
          setAdminInitial(email.trim().charAt(0).toUpperCase());
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // Partner codes: fetch companies and batch summaries
  async function refreshCodes(){
    setLoadingCodes(true);
    try {
      const [partners, s] = await Promise.all([
        fetch('/api/admin/partners?active=true').then(r=> r.ok? r.json(): null).catch(()=> null),
        fetch('/api/admin/codes?summary=1').then(x=> x.ok? x.json(): null).catch(()=> null),
      ]);
      setPartnerCompanies(Array.isArray(partners?.items) ? partners.items : []);
      setCodeBatches(Array.isArray(s?.items) ? s.items : []);
    } finally { setLoadingCodes(false); }
  }
  useEffect(()=>{ if (activeTab === 'partner-codes' || activeTab === 'partners') refreshCodes(); }, [activeTab]);

  // Fetch current admin settings
  useEffect(()=>{
    (async ()=>{
      try {
        const res = await fetch('/api/admin/settings', { credentials:'include' });
        if (!res.ok) return;
        const d = await res.json();
        if (d?.defaultTimezone) setSettingTz(d.defaultTimezone);
        if (d?.videoPlatform) setSettingVideo(d.videoPlatform);
        if (typeof d?.requireOtp === 'boolean') setSettingOtp(!!d.requireOtp);
        if (typeof d?.allowVetAvailability === 'boolean') setSettingVetAvail(!!d.allowVetAvailability);
        if (typeof d?.systemAnnouncement === 'string') setSettingAnn(d.systemAnnouncement);
        // Prefill subscription plans from saved settings
        setPlanOneOff({
          enabled: !!d?.plan_one_off_enabled,
          price: (typeof d?.plan_one_off_display_price === 'number' ? d.plan_one_off_display_price : 49),
          id: d?.plan_one_off_price_id || ''
        });
        setPlanAnnual({
          enabled: !!d?.plan_annual_enabled,
          price: (typeof d?.plan_annual_display_price === 'number' ? d.plan_annual_display_price : 199),
          id: d?.plan_annual_price_id || ''
        });
        setPlanBiennial({
          enabled: !!d?.plan_biennial_enabled,
          price: (typeof d?.plan_biennial_display_price === 'number' ? d.plan_biennial_display_price : 299),
          id: d?.plan_biennial_price_id || ''
        });
      } catch {}
    })();
  },[]);

  async function savePlatformSettings(){
    const fd = new FormData();
    fd.set('videoPlatform', settingVideo || '');
    fd.set('requireOtp', String(!!settingOtp));
    fd.set('allowVetAvailability', String(!!settingVetAvail));
    fd.set('systemAnnouncement', settingAnn || '');
    await fetch('/api/admin/settings', { method:'POST', body: fd, headers: { 'accept':'application/json' }, credentials:'include' });
    alert('Settings saved');
  }

  async function handleLogout(){
    try {
      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Signing out?' } }));
      try {
        const { createSupabaseBrowser } = await import("@/lib/supabase.client");
        const supabase = createSupabaseBrowser();
        await supabase.auth.signOut();
      } catch {}
      try {
        await fetch('/auth/session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ access_token:'', refresh_token:'' }) });
      } catch {}
    } finally {
      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
      window.location.href = '/login';
    }
  }

  const filteredConsults = useMemo(() => {
    const fromStr = (dateRange?.from || '').trim();
    const toStr = (dateRange?.to || '').trim();
    const fromDate = fromStr ? new Date(`${fromStr}T00:00:00Z`) : null;
    const toDate = toStr ? new Date(`${toStr}T23:59:59Z`) : null;
    return (consultations || emptyArr).filter((c: any) => {
      const comp = c.user?.company || "";
      const inCompany = companyFilter === "All Companies" || comp === companyFilter;
      const owner = `${c.user?.firstName||''} ${c.user?.lastName||''}`.trim();
      const inSearch = `${c.id} ${owner} ${(c as any)?.petName||''} ${(c as any)?.animal||''}`.toLowerCase().includes(query.toLowerCase());
      const dt = c.startTime || c.scheduledAt;
      const hasDate = !!dt;
      let inDate = true;
      if (hasDate) {
        const d = new Date(dt);
        if (fromDate && d < fromDate) inDate = false;
        if (toDate && d > toDate) inDate = false;
      } else {
        if (fromDate || toDate) inDate = false; // if filtering by date, hide undated rows
      }
      return inCompany && inSearch && inDate;
    });
  }, [consultations, companyFilter, query, dateRange]);

  // Customers tab: apply company and date range filters
  const filteredUsers = useMemo(() => {
    const fromStr = (dateRange?.from || '').trim();
    const toStr = (dateRange?.to || '').trim();
    const fromDate = fromStr ? new Date(`${fromStr}T00:00:00Z`) : null;
    const toDate = toStr ? new Date(`${toStr}T23:59:59Z`) : null;
    return (users || emptyArr).filter((u: any) => {
      const comp = u.company || '';
      const inCompany = companyFilter === 'All Companies' || comp === companyFilter;
      if (!inCompany) return false;
      // If no date filter, include all matching company
      if (!fromDate && !toDate) return true;
      const appts = Array.isArray(u.appointments) ? u.appointments : [];
      // Include user if they have at least one appointment inside range
      return appts.some((a: any) => {
        const dt = a?.startTime || a?.scheduledAt; if (!dt) return false;
        const d = new Date(dt);
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      });
    });
  }, [users, companyFilter, dateRange]);

  function openEdit(consult: any) {
    setSelectedConsult(consult);
    setShowEditDialog(true);
  }

  function onExport() {
    try {
      const header = ['First Name','Last Name','Email','Phone','Company','Plan','Status'];
      const rows = (filteredUsers||emptyArr).map((u:any)=> [
        u.firstName||'',
        u.lastName||'',
        u.email||'',
        u.phone||'',
        u.company||'',
        (u.membership?.planTitle || u.membership?.plan || (u.membership?.stripeSubId ? 'Unlimited' : (u.membership ? 'Free access' : '?')) || ''),
        (u.membership?.status || '')
      ]);
      const csv = [header.join(','), ...rows.map(r => r.map(v => JSON.stringify(String(v??''))).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'customers.csv'; a.click(); URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export CSV');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold tracking-tight">
              Dial A Vet ? Admin
            </motion.div>
            <Badge className="badge-secondary rounded-xl">ISO 27001</Badge>
            <Badge variant="outline" className="rounded-xl">ISO 9001</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="relative hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search consultations, vets, customers?" className="pl-9 w-44 sm:w-72" />
            </div>
            <details className="dropdown hidden" aria-hidden={true}>
              <summary className="btn btn-outline flex items-center gap-2 cursor-pointer select-none">
                Quick actions
                <ChevronDown className="h-4 w-4" />
              </summary>
              <div className="dropdown-content">
                <div className="hidden">
                  <div className="dropdown-label">Jump to</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("consultations")}>Consultations</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("vets")}>Vets</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("customers")}>Customers</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("subscriptions")}>Subscriptions</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("reports")}>Reports</div>
                  <div className="dropdown-item" onClick={() => setActiveTab("partner-codes")}>Partner Codes</div>
                  <div className="dropdown-sep"></div>
                  <div className="dropdown-item" onClick={() => setActiveTab("settings")}>Settings</div>
                </div>
              </div>
            </details>
            <details className="dropdown">
              <summary aria-label="Account menu" className="btn btn-ghost p-1.5 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                    {adminInitial}
                  </div>
                  <span className="hidden sm:inline text-sm">Admin</span>
                </div>
              </summary>
              <div className="dropdown-overlay" onClick={(e)=>{ const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.removeAttribute('open'); }} />
              <div className="dropdown-content" role="menu">
                <div className="dropdown-label">{adminEmail || 'Admin'}</div>
                <div className="dropdown-sep"></div>
                <div className="dropdown-item text-red-600" onClick={handleLogout}><span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" />Log out</span></div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 hidden">
          {[{
            label:'Customers', value: (users||emptyArr).length, icon: Users
          },{
            label:'Revenue (MTD)', value: mtd ? new Intl.NumberFormat(undefined,{ style:'currency', currency: mtd.currency}).format((mtd.amount||0)/100) : '$0', icon: CreditCard
          }].map((k:any) => (
            <Card key={k.label} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{k.label}</div>
                  <div className="text-2xl font-semibold">{(k.value as any)?.toLocaleString?.() ?? String(k.value)}</div>
                </div>
                <k.icon className="h-6 w-6" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            {/* Hidden tabs: consultations, vets, customers, reports */}
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="partners">Partner Companies</TabsTrigger>
            <TabsTrigger value="partner-codes">Partner Codes</TabsTrigger>
            <TabsTrigger value="settings" className="hidden" style={{ display: 'none' }}>Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sitemap" className="space-y-4">
            <SectionHeader title="Sitemap">
              <Button variant="outline" onClick={fetchManifest} disabled={sitemapLoading}>
                {sitemapLoading ? 'Refreshing…' : 'Refresh'}
              </Button>
              <Button onClick={handleRegenerate} disabled={pollBuildId !== null || ['running','queued'].includes(sitemapStatus?.status || '')}>
                {pollBuildId !== null || ['running','queued'].includes(sitemapStatus?.status || '') ? 'Regenerating…' : 'Regenerate Sitemap'}
              </Button>
            </SectionHeader>

            {sitemapNotice && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${sitemapNotice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}
              >
                {sitemapNotice.message}
              </div>
            )}

            {sitemapError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {sitemapError}
              </div>
            )}

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Current manifest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {sitemapLoading ? (
                  <div className="text-gray-500">Loading?</div>
                ) : !sitemapManifest ? (
                  <div className="text-gray-500">No sitemap has been generated yet.</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last run</span>
                      <span className="font-medium">{formatIso(sitemapManifest.lastRunISO || sitemapManifest.finishedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Build ID</span>
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs">{sitemapManifest.buildId}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{formatDurationMs(sitemapManifest.durationMs)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total URLs</span>
                      <span className="font-medium">{Number(sitemapManifest.pages ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Per type</div>
                      {(() => {
                        const totals = sitemapManifest.totals || {};
                        const files = sitemapManifest.filesPerType || {};
                        const latest = sitemapManifest.perTypeLatestLastmod || {};
                        const typeKeys = Array.from(new Set([...Object.keys(totals), ...Object.keys(files), ...Object.keys(latest)]));
                        if (!typeKeys.length) return <div className="text-gray-500">No entries recorded.</div>;
                        return (
                          <div className="space-y-2">
                            {typeKeys.map((key) => (
                              <div key={key} className="flex flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <div className="font-medium capitalize">{key.replace(/[-_]/g, ' ')}</div>
                                <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600 sm:mt-0 sm:justify-end">
                                  <span>{Number(totals[key] || 0).toLocaleString()} urls</span>
                                  <span>{Number(files[key] || 0).toLocaleString()} file(s)</span>
                                  <span>latest {formatIso(latest[key])}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {sitemapStatus && sitemapStatus.status !== 'success' && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Generation status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium capitalize">{sitemapStatus.status}</span>
                  </div>
                  {sitemapStatus.buildId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Build ID</span>
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs">{sitemapStatus.buildId}</code>
                    </div>
                  )}
                  {sitemapStatus.startedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Started</span>
                      <span>{formatIso(sitemapStatus.startedAt)}</span>
                    </div>
                  )}
                  {sitemapStatus.finishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Finished</span>
                      <span>{formatIso(sitemapStatus.finishedAt)}</span>
                    </div>
                  )}
                  {typeof sitemapStatus.durationMs === 'number' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{formatDurationMs(sitemapStatus.durationMs)}</span>
                    </div>
                  )}
                  {sitemapStatus.progress && (
                    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stage</span>
                        <span>{sitemapStatus.progress.stage}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Items</span>
                        <span>
                          {Number(sitemapStatus.progress.itemsProcessed || 0).toLocaleString()} /
                          {' '}
                          {sitemapStatus.progress.itemsTotal != null ? Number(sitemapStatus.progress.itemsTotal || 0).toLocaleString() : '?'}
                        </span>
                      </div>
                      {typeof sitemapStatus.progress.percent === 'number' && (
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Progress</span>
                          <span>{sitemapStatus.progress.percent}%</span>
                        </div>
                      )}
                      {sitemapStatus.progress.message && (
                        <div className="text-xs text-gray-600">{sitemapStatus.progress.message}</div>
                      )}
                    </div>
                  )}
                  {sitemapStatus.error && sitemapStatus.status === 'error' && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {sitemapStatus.error}
                    </div>
                  )}
                  {Array.isArray(sitemapStatus.logs) && sitemapStatus.logs.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-medium text-gray-600">Recent logs</div>
                      <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-2 text-[11px] leading-relaxed text-gray-700">
                        {sitemapStatus.logs.slice(-8).map((log: string, idx: number) => (
                          <div key={`${log}-${idx}`}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(sitemapStatus.status === 'running' || sitemapStatus.status === 'queued') && (
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={handleCancel} disabled={sitemapStatus.cancelRequested}>
                        {sitemapStatus.cancelRequested ? 'Cancelling…' : 'Cancel build'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Hidden: consultations */}
          <TabsContent value="consultations" className="hidden">
            <SectionHeader title="Consultations">
              <Toolbar companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} dateRange={dateRange} setDateRange={setDateRange} onExport={onExport} companyOptions={[{id:'all', name:'All Companies'}, ...partnerCompanies.map(p=>({id:p.id,name:p.name}))]} />
            </SectionHeader>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">All consultations</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="border-b">
                      <TableHeaderCell>ID</TableHeaderCell>
                      <TableHeaderCell>Scheduled</TableHeaderCell>
                      <TableHeaderCell>Company</TableHeaderCell>
                      <TableHeaderCell>Pet Owner</TableHeaderCell>
                      <TableHeaderCell>Pet</TableHeaderCell>
                      <TableHeaderCell>Assigned Vet</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsults.map((c:any, i:number) => {
                      const vet = (vets||emptyArr).find((v:any) => v.id === c.vetId);
                      return (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                          <TableCell>
                            <div className="font-medium">{i + 1}</div>
                            <div className="text-xs text-gray-500">{c.user?.plan || ''}</div>
                          </TableCell>
                          <TableCell>
                            {c.startTime || c.scheduledAt ? formatInTimeZone(new Date(c.startTime || c.scheduledAt), settingTz || Intl.DateTimeFormat().resolvedOptions().timeZone, "EEE d MMM, h:mma") : ''}
                          </TableCell>
                          <TableCell>{c.user?.company || ''}</TableCell>
                          <TableCell>
                            <div className="font-medium">{[c.user?.firstName,c.user?.lastName].filter(Boolean).join(' ')}</div>
                            <div className="text-xs text-gray-500">{c.user?.email} ? {c.user?.phone}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{(c as any)?.petName} ({(c as any)?.animal})</div>
                            <div className="text-xs text-gray-500">{(c as any)?.sex} ? Desexed: {(c as any)?.desexed} ? Age: {(c as any)?.age}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              {vet?.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("rounded-xl")}>{c.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                              <details className="dropdown">
                                <summary className="btn btn-ghost p-2"><EllipsisVertical className="h-4 w-4"/></summary>
                                <div className="dropdown-overlay" onClick={(e)=>{ const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.removeAttribute('open'); }} />
                                <div className="dropdown-content" role="menu">
                                  <div className="dropdown-item text-red-600" onClick={async (e)=>{ const detailsEl = (e.currentTarget as HTMLElement).closest('details') as HTMLDetailsElement | null; const ok = confirm('Cancel this consultation?'); if(!ok) return; document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Cancelling…' } })); try { await fetch(`/api/admin/consultations/${c.id}/cancel`, { method:'POST' }); detailsEl?.removeAttribute('open'); const cons = await fetch('/api/admin/consultations').then(r=> r.ok ? r.json() : null).catch(()=>null); if (Array.isArray(cons?.items)) setConsultations(cons.items); } finally { document.dispatchEvent(new CustomEvent('dav:loading-stop')); } }}>Cancel consult</div>
                                </div>
                              </details>
                            </div>
                          </TableCell>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit consultation</DialogTitle>
                  <DialogDescription>Update time, assign a vet, or change status.</DialogDescription>
                </DialogHeader>
                {selectedConsult && (
                  <form className="p-4 grid gap-4" onSubmit={async (e)=>{
                    e.preventDefault();
                    const formEl = e.currentTarget as HTMLFormElement;
                    const timeInput = formEl.querySelector('input[data-field="time"]') as HTMLInputElement | null;
                    const vetSelect = formEl.querySelector('select[data-field="vet"]') as HTMLSelectElement | null;
                    const statusSelect = formEl.querySelector('select[data-field="status"]') as HTMLSelectElement | null;
                    const id = selectedConsult.id;
                    try {
                      setSavingEdit(true);
                      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving consultation?' } }));
                      if (timeInput && timeInput.value) {
                        const fd = new FormData();
                        fd.set('startTime', timeInput.value);
                        await fetch(`/api/admin/consultations/${id}/reschedule`, { method: 'POST', body: fd });
                      }
                      if (vetSelect) {
                        const fd = new FormData();
                        fd.set('vetId', vetSelect.value || '');
                        if (vetSelect.value) {
                          await fetch(`/api/admin/consultations/${id}/assign`, { method: 'POST', body: fd });
                        }
                      }
                      if (statusSelect && statusSelect.value) {
                        const fd = new FormData();
                        fd.set('status', statusSelect.value);
                        await fetch(`/api/admin/consultations/${id}/status`, { method: 'POST', body: fd });
                      }
                      alert('Saved');
                      setShowEditDialog(false);
                      const cons = await fetch('/api/admin/consultations').then(r=> r.ok ? r.json() : null).catch(()=>null);
                      if (Array.isArray(cons?.items)) setConsultations(cons.items);
                    } catch {
                      alert('Failed to save');
                    } finally {
                      setSavingEdit(false);
                      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Scheduled time</Label>
                        <div className="mt-2">
                          <Input data-field="time" type="datetime-local" defaultValue={(()=>{ const raw = (selectedConsult.startTime || selectedConsult.scheduledAt); if(!raw) return ""; const d = new Date(raw); if (isNaN(d.getTime())) return ""; const tz = settingTz || Intl.DateTimeFormat().resolvedOptions().timeZone; const pad=(n:number)=> String(n).padStart(2,'0'); const zoned = new Date(formatInTimeZone(d, tz, 'yyyy-MM-dd\'T\'HH:mm')); return `${zoned.getFullYear()}-${pad(zoned.getMonth()+1)}-${pad(zoned.getDate())}T${pad(zoned.getHours())}:${pad(zoned.getMinutes())}`; })()} />
                        </div>
                      </div>
                      <div>
                        <Label>Assign vet</Label>
                        <div className="mt-2 border rounded-md">
                          <select data-field="vet" className="px-3 py-2 w-full text-sm" defaultValue={selectedConsult.vetId || ''}>
                            <option value="">Unassigned</option>
                            {vets.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <div className="mt-2 border rounded-md">
                          <select data-field="status" className="px-3 py-2 w-full text-sm" defaultValue={selectedConsult.status || 'SCHEDULED'}>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No-show</option>
                            <option value="PENDING_PAYMENT" disabled>Pending payment</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label>Internal note</Label>
                        <Textarea placeholder="Optional admin note" className="mt-2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" type="button" onClick={()=>setShowEditDialog(false)} disabled={savingEdit}>Close</Button>
                      <Button type="submit" disabled={savingEdit}>{savingEdit ? 'Saving?' : 'Save changes'}</Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Hidden: vets */}
          <TabsContent value="vets" className="hidden">
            <SectionHeader title="Vets">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 hidden"><Upload className="h-4 w-4"/>Import</Button>
                <Button className="gap-2 hidden"><Plus className="h-4 w-4"/>Add vet</Button>
              </div>
            </SectionHeader>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y">
                  {vets.map((v) => (
                    <div key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center"><Stethoscope className="h-5 w-5"/></div>
                        <div>
                          <div className="font-medium">{v.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2"><Badge className="rounded-xl">{(v.status === 'ONLINE') ? 'Active' : 'Paused'}</Badge></div>
                          <div className="mt-2">
                            <AvailabilityPills blocks={(v.availability as any[]||[])} tz={settingTz || Intl.DateTimeFormat().resolvedOptions().timeZone} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={async ()=>{
                          setProfileVetId(v.id);
                          // Load fresh vet profile
                          const res = await fetch('/api/admin/vets').then(r=> r.ok? r.json():null).catch(()=>null);
                          const full = (res?.items||[]).find((x:any)=> x.id===v.id) || {};
                          setProfileValues({ displayName: full.displayName || v.name || '', zoomUserEmail: full.zoomUserEmail || '', timezone: full.timezone || settingTz || '', status: (full.status || v.status || 'OFFLINE') });
                          setProfileOpen(true);
                        }}>Edit profile</Button>
                        <Button variant="outline" onClick={async ()=>{
                          setAvailVetId(v.id); setAvailOpen(true);
                          const res = await fetch(`/api/admin/vets/${v.id}/availability`).then(r=> r.ok? r.json():null).catch(()=>null);
                          setAvailBlocks(Array.isArray(res?.items) ? res.items : []);
                        }}>Adjust availability</Button>
                        <details className="dropdown inline-block">
                          <summary className="btn btn-ghost p-2"><EllipsisVertical className="h-4 w-4"/></summary>
                          <div className="dropdown-content">
                            <div className="dropdown-item text-red-600">Remove</div>
                          </div>
                        </details>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit vet profile</DialogTitle>
                  <DialogDescription>Update display name, Zoom email, timezone, and status.</DialogDescription>
                </DialogHeader>
                <form onSubmit={async (e)=>{ e.preventDefault(); if (!profileVetId) return; try { setProfileSaving(true); document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving profile?' } })); const fd = new FormData(); if (profileValues.displayName) fd.set('displayName', profileValues.displayName); if (profileValues.zoomUserEmail) fd.set('zoomUserEmail', profileValues.zoomUserEmail); if (profileValues.timezone) fd.set('timezone', profileValues.timezone); await fetch(`/api/admin/vets/${profileVetId}/profile`, { method:'POST', body: fd }); const sfd = new FormData(); sfd.set('status', profileValues.status); await fetch(`/api/admin/vets/${profileVetId}/status`, { method:'POST', body: sfd }); const res = await fetch('/api/admin/vets').then(r=> r.ok? r.json():null).catch(()=>null); if (Array.isArray(res?.items)) setVets(res.items.map((vv:any)=> ({ id: vv.id, name: vv.displayName || vv.user?.firstName || vv.user?.email || vv.user?.phone || 'Vet', timezone: vv.timezone || vv.user?.timezone || '?', status: vv.status, availability: vv.availability||[], userId: vv.userId }))); setProfileOpen(false); } finally { setProfileSaving(false); document.dispatchEvent(new CustomEvent('dav:loading-stop')); } }} className="grid gap-3 p-2">
                  <div>
                    <Label>Display name</Label>
                    <Input value={profileValues.displayName} onChange={(e)=> setProfileValues(v=> ({...v, displayName: e.target.value}))} className="mt-1" />
                  </div>
                  <div>
                    <Label>Zoom email</Label>
                    <Input type="email" value={profileValues.zoomUserEmail} onChange={(e)=> setProfileValues(v=> ({...v, zoomUserEmail: e.target.value}))} className="mt-1" />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <div className="mt-1 border rounded-md">
                      <TimezoneSelect value={profileValues.timezone} onChange={(tz:string)=> setProfileValues(v=> ({...v, timezone: tz}))} className="px-3 py-2 w-full text-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2"><span className="text-sm text-gray-600">{profileValues.status==='ONLINE'?'Active':'Paused'}</span><Switch defaultChecked={profileValues.status==='ONLINE'} onChange={(on:boolean)=> setProfileValues(v=> ({...v, status: on?'ONLINE':'OFFLINE'}))} /></div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <Button variant="outline" type="button" onClick={()=> setProfileOpen(false)} disabled={profileSaving}>Close</Button>
                    <Button type="submit" disabled={profileSaving}>{profileSaving? 'Saving?':'Save'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Availability dialog */}
            <Dialog open={availOpen} onOpenChange={setAvailOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit availability</DialogTitle>
                  <DialogDescription>Add or remove weekly time blocks.</DialogDescription>
                </DialogHeader>
                <div className="p-2 grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                    <div>
                      <Label>Day</Label>
                      <select className="input mt-1" value={availForm.weekday} onChange={(e)=> setAvailForm(f=> ({...f, weekday: parseInt((e.target as any).value,10)}))}>
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=> (<option key={i} value={i}>{d}</option>))}
                      </select>
                    </div>
                    <div>
                      <Label>Start</Label>
                      <input type="time" className="input mt-1" value={availForm.start} onChange={(e)=> setAvailForm(f=> ({...f, start: (e.target as any).value}))} />
                    </div>
                    <div>
                      <Label>End</Label>
                      <input type="time" className="input mt-1" value={availForm.end} onChange={(e)=> setAvailForm(f=> ({...f, end: (e.target as any).value}))} />
                    </div>
                    <div>
                      <Button onClick={async ()=>{ if(!availVetId) return; setAvailSaving(true); try { await fetch(`/api/admin/vets/${availVetId}/availability`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(availForm) }); const res = await fetch(`/api/admin/vets/${availVetId}/availability`).then(r=> r.ok? r.json():null).catch(()=>null); setAvailBlocks(Array.isArray(res?.items) ? res.items : []); } finally { setAvailSaving(false); } }}>Add</Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const dayBlocks = (availBlocks||[]).filter((b:any)=> b.weekday===i);
                      return (
                        <div key={i} className="border rounded-md p-2">
                          <div className="text-sm font-medium mb-2">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}</div>
                          <div className="flex flex-wrap gap-2">
                            {dayBlocks.length === 0 && <span className="text-sm text-gray-500">No blocks</span>}
                            {dayBlocks.map((r:any)=> (
                              <span key={r.id} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
                                {r.start}-{r.end}
                                <button aria-label="Remove" className="text-neutral-500 hover:text-black" onClick={async ()=>{ if(!availVetId) return; await fetch(`/api/admin/vets/${availVetId}/availability?blockId=${encodeURIComponent(r.id)}`, { method:'DELETE' }); const res = await fetch(`/api/admin/vets/${availVetId}/availability`).then(x=> x.ok? x.json():null).catch(()=>null); setAvailBlocks(Array.isArray(res?.items) ? res.items : []); }}>?</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-2"><Button variant="outline" onClick={()=> setAvailOpen(false)}>Close</Button></div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Hidden: customers */}
          <TabsContent value="customers" className="hidden">
            <SectionHeader title="Customers">
              <Toolbar companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} dateRange={dateRange} setDateRange={setDateRange} onExport={onExport} companyOptions={[{id:'all', name:'All Companies'}, ...partnerCompanies.map(p=>({id:p.id,name:p.name}))]} />
            </SectionHeader>
            <Card className="shadow-sm">
              <CardContent className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Contact</TableHeaderCell>
                      <TableHeaderCell>Company</TableHeaderCell>
                      <TableHeaderCell>Plan</TableHeaderCell>
                      <TableHeaderCell>Consults</TableHeaderCell>
                      {/* <TableHeaderCell>Status</TableHeaderCell> */}
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredUsers||emptyArr).map((u:any) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium">{[u.firstName,u.lastName].filter(Boolean).join(' ') || u.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">{u.email||'?'}</div>
                          <div className="text-sm text-gray-500">{u.phone||'?'}</div>
                        </TableCell>
                        <TableCell>{u.company||'?'}</TableCell>
                        <TableCell>{u.membership?.planTitle || u.membership?.plan || (u.membership?.stripeSubId ? 'Unlimited' : '?')}</TableCell>
                        <TableCell>{Array.isArray(u.appointments)? u.appointments.length : '?'}</TableCell>
                        {/* <TableCell><Badge variant="outline" className="rounded-xl">{(u.membership?.status||'None').toString()}</Badge></TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={async ()=>{ const r = await fetch(`/api/admin/users/${u.id}`).then(x=> x.ok? x.json():null).catch(()=>null); if(!r) return alert('Failed to load'); setCustUser(r); setCustForm({ firstName: r.firstName||'', lastName: r.lastName||'', email: r.email||'', phone: r.phone||'', company: r.company||'' }); setCustMode('view'); setCustOpen(true); }}>View</Button>
                            <Button size="sm" variant="outline" onClick={async ()=>{ const r = await fetch(`/api/admin/users/${u.id}`).then(x=> x.ok? x.json():null).catch(()=>null); if(!r) return alert('Failed to load'); setCustUser(r); setCustForm({ firstName: r.firstName||'', lastName: r.lastName||'', email: r.email||'', phone: r.phone||'', company: r.company||'' }); setCustMode('edit'); setCustOpen(true); }}>Edit</Button>
                            {/* <details className="dropdown inline-block">
                              <summary className="btn btn-ghost p-2"><EllipsisVertical className="h-4 w-4"/></summary>
                              <div className="dropdown-content">
                                <div className="dropdown-item text-red-600">Delete</div>
                              </div>
                            </details> */}
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions tab removed (memberships deprecated) */}

          {/* Hidden: reports/analytics */}
          <TabsContent value="reports" className="hidden">
            <SectionHeader title="Reports">
              <Toolbar companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} dateRange={dateRange} setDateRange={setDateRange} onExport={onExport} companyOptions={[{id:'all', name:'All Companies'}, ...partnerCompanies.map(p=>({id:p.id,name:p.name}))]} />
            </SectionHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="shadow-sm lg:col-span-2">
                <CardHeader className="pb-2"><CardTitle className="text-base">Consultations and customers by month</CardTitle></CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="consults" name="Consultations" stroke="#2563eb" />
                      <Line type="monotone" dataKey="customers" name="Customers" stroke="#059669" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-base">Customers by partner & country</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {/* Partner users */}
                  <div className="text-sm font-medium text-gray-600">By partner</div>
                  {(Object.keys(partnerUserCounts).length>0 ? Object.entries(partnerUserCounts) : partnerCompanies.map(c=> [c.name, 0] as any)).map(([name,count]) => (
                    <div key={`p-${name}`} className="flex items-center justify-between">
                      <div className="text-sm">{name}</div>
                      <Badge className="rounded-xl">{count} customers</Badge>
                    </div>
                  ))}
                  <Separator />
                  {/* Users by country */}
                  <div className="hidden">
                    <div className="text-sm font-medium text-gray-600">By country</div>
                    {Object.entries(usersByCountry).map(([cc,count]) => (
                      <div key={`c-${cc}`} className="flex items-center justify-between">
                        <div className="text-sm">{cc}</div>
                        <Badge className="rounded-xl">{count} customers</Badge>
                      </div>
                    ))}
                    <Separator />
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">Download company report</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <SectionHeader title="Partner Companies">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={()=> refreshCodes()}><RefreshCw className="h-4 w-4"/>Refresh</Button>
                <Dialog open={addCompanyDialog1} onOpenChange={setAddCompanyDialog1}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><Plus className="h-4 w-4"/>Add New Company</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Add Partner Company</DialogTitle>
                      <DialogDescription>Create a partner company to generate code batches for.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                      <div>
                        <Label htmlFor="pc-mgr-name">Name</Label>
                        <Input id="pc-mgr-name" className="mt-1" placeholder="e.g. Honey Insurance" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={async ()=>{
                        const name = (document.getElementById('pc-mgr-name') as HTMLInputElement)?.value?.trim();
                        if (!name) { alert('Name is required'); return; }
                        await fetch('/api/admin/partners', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name }) });
                        await refreshCodes();
                        setAddCompanyDialog1(false);
                      }}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </SectionHeader>
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base">Companies</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerCompanies.map((c)=> (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <TableCell>{c.name}</TableCell>
                        <TableCell><Badge className="rounded-xl">{c.active===false? 'Disabled':'Active'}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={async ()=>{ const nv = !(c.active!==false); await fetch('/api/admin/partners', { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify({ id: c.id, active: nv }) }); await refreshCodes(); }}>{c.active===false? 'Enable':'Disable'}</Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                    {partnerCompanies.length===0 && (
                      <tr><td colSpan={3} className="px-3 py-3 text-sm text-gray-500">No companies yet</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partner-codes" className="space-y-4">
            <SectionHeader title="Partner Codes">
              <Dialog open={addCompanyDialog2} onOpenChange={setAddCompanyDialog2}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4"/>Add New Company</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Add Partner Company</DialogTitle>
                    <DialogDescription>Create a partner company to generate code batches for.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div>
                      <Label htmlFor="pc-add-name">Name</Label>
                      <Input id="pc-add-name" className="mt-1" placeholder="e.g. Honey Insurance" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={async ()=>{
                      const name = (document.getElementById('pc-add-name') as HTMLInputElement)?.value?.trim();
                      if (!name) { alert('Name is required'); return; }
                      await fetch('/api/admin/partners', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name }) });
                      await refreshCodes();
                      setAddCompanyDialog2(false);
                    }}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SectionHeader>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Create new code batch</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Company</Label>
                  <div className="mt-2 border rounded-md">
                    <select id="pc-company" className="px-3 py-2 w-full text-sm">
                      {partnerCompanies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Number of codes</Label>
                  <Input id="pc-count" className="mt-2" placeholder="e.g. 1" defaultValue={1} />
                </div>
                <div>
                  <Label>Code format</Label>
                  <Input id="pc-format" className="mt-2" placeholder="PREFIX-XXXX-XXXX" defaultValue="DAV-XXXX-XXXX" />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Access type</Label>
                    <div className="mt-2 border rounded-md">
                      <select id="pc-access" className="px-3 py-2 w-full text-sm">
                        <option>30 days access</option>
                        <option>1-year access</option>
                        <option>Lifetime access</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Expiry date (mm/dd/yyyy)</Label>
                    <Input id="pc-expiry" className="mt-2" type="date" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" onClick={async ()=>{
                      const companySel = document.getElementById('pc-company') as HTMLSelectElement | null;
                      const countEl = document.getElementById('pc-count') as HTMLInputElement | null;
                      const formatEl = document.getElementById('pc-format') as HTMLInputElement | null;
                      const accessSel = document.getElementById('pc-access') as HTMLSelectElement | null;
                      const expiryEl = document.getElementById('pc-expiry') as HTMLInputElement | null;
                      const companyId = companySel?.value || (partnerCompanies[0]?.id || '');
                      const count = Math.max(1, Math.min(5000, parseInt(countEl?.value||'0',10)||0));
                      const format = formatEl?.value || 'DAV-XXXX-XXXX';
                      const access = accessSel?.value || '30 days access';
                      let accessDays: number | null = null;
                      if (access === '30 days access') accessDays = 30;
                      else if (access === '1-year access') accessDays = 365;
                      else if (access === 'Lifetime access') accessDays = null;
                      const prefix = (format.split('-')[0]||'DAV').toUpperCase().replace(/[^A-Z0-9]/g,'');
                      const ymd = (expiryEl?.value||'').trim();
                      if (!ymd) { alert('Please select an expiry date'); return; }
                      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) { alert('Invalid date format'); return; }
                      const [yyyy, mm, dd] = ymd.split('-');
                      const expiresAt = `${mm}/${dd}/${yyyy}`; // mm/dd/yyyy for API
                      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Generating codes?' } }));
                      try {
                        const res = await fetch('/api/admin/codes', { method:'POST', headers:{'content-type':'application/json','accept':'application/json'}, body: JSON.stringify({ companyId, description: 'Batch', accessDays, count, prefix, expiresAt }) });
                        const data = await res.json().catch(()=> ({} as any));
                        await refreshCodes();
                        const csvRes = await fetch(`/api/admin/codes/export?batchId=${encodeURIComponent(data?.batchId||'')}`);
                        const blob = await csvRes.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = 'partner-codes.csv'; a.click(); URL.revokeObjectURL(url);
                      } finally {
                        document.dispatchEvent(new CustomEvent('dav:loading-stop'));
                      }
                    }}>Generate & Export CSV</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base">Recent code batches</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <TableHeaderCell>Batch</TableHeaderCell>
                      <TableHeaderCell>Company</TableHeaderCell>
                      <TableHeaderCell>Access type</TableHeaderCell>
                      <TableHeaderCell>Created</TableHeaderCell>
                      <TableHeaderCell>Codes</TableHeaderCell>
                      <TableHeaderCell>Redeemed</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCodes && (
                      <tr><td colSpan={7} className="px-3 py-3 text-sm text-gray-500">Loading?</td></tr>
                    )}
                    {!loadingCodes && codeBatches.filter(b=> (b.codes||0)>0).map((b, i)=> (
                      <tr key={b.id||i} className="border-b hover:bg-gray-50">
                        <TableCell>{i+1}</TableCell>
                        <TableCell>{b.company}</TableCell>
                        <TableCell>{(b as any).accessDays == null ? 'Lifetime access' : ((b as any).accessDays === 30 ? '30 days access' : ((b as any).accessDays === 365 ? '1-year access' : `${(b as any).accessDays} days access`))}</TableCell>
                        <TableCell>{b.createdAt ? formatInTimeZone(new Date(b.createdAt), settingTz || Intl.DateTimeFormat().resolvedOptions().timeZone, 'd MMM yyyy') : '?'}</TableCell>
                        <TableCell>{b.codes}</TableCell>
                        <TableCell>{b.redeemed}</TableCell>
                        <TableCell><Badge className="rounded-xl">{b.active? 'Active':'Disabled'}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={async ()=>{
                              const csvRes = await fetch(`/api/admin/codes/export?batchId=${encodeURIComponent(b.id||'')}`);
                              const blob = await csvRes.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a'); a.href=url; a.download=`${String(b.company||'codes').replace(/\s+/g,'_')}-codes.csv`; a.click(); URL.revokeObjectURL(url);
                            }}>Download CSV</Button>
                            <Button size="sm" variant="outline" onClick={async ()=>{ alert(`${b.company}: ${b.codes} codes, ${b.redeemed} redeemed`); }}>View</Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                    {!loadingCodes && codeBatches.every(b=> (b.codes||0)===0) && (
                      <tr><td colSpan={7} className="px-3 py-3 text-sm text-gray-500">No partner codes yet</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="hidden">
            <SectionHeader title="Settings">
              <Button variant="outline" className="gap-2 hidden"><ShieldCheck className="h-4 w-4"/>Compliance</Button>
            </SectionHeader>
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base">Platform configuration</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form onSubmit={async (e)=>{ e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const res = await fetch('/api/admin/settings', { method:'POST', body: fd, headers: { 'accept':'application/json' }, credentials:'include' }); if(!res.ok){ const t = await res.text().catch(()=> 'Failed to save'); alert(t||'Failed to save'); return; } alert('Default timezone saved'); }}>
                  <Label>Default timezone</Label>
                  <div className="mt-2 border rounded-md">
                    <TimezoneSelect name="defaultTimezone" className="px-3 py-2 w-full text-sm" value={settingTz} onChange={setSettingTz} />
                  </div>
                  <div className="mt-2 flex justify-end"><Button type="submit">Save default</Button></div>
                </form>
                <div className="hidden">
                  <Label>Video platform</Label>
                  <div className="mt-2 border rounded-md">
                    <select className="px-3 py-2 w-full text-sm" value={settingVideo} onChange={(e)=> setSettingVideo((e.target as any).value)}>
                      <option value="Calendly + Zoom">Calendly + Zoom</option>
                      <option value="Native (Zoom SDK)">Native (Zoom SDK)</option>
                      <option value="Google Meet">Google Meet</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="hidden">
                    <Label>Require OTP login</Label>
                    <div className="mt-2 flex items-center gap-3"><Switch defaultChecked={settingOtp} onChange={(v:boolean)=> setSettingOtp(v)} /><Label>Enabled</Label></div>
                  </div>
                  <div>
                    <Label>Allow vets to set availability</Label>
                    <div className="mt-2 flex items-center gap-3"><Switch defaultChecked={settingVetAvail} onChange={(v:boolean)=> setSettingVetAvail(v)} /><Label>Enabled</Label></div>
                  </div>
                </div>
                <div className="mt-2 hidden">
                  <Label>System announcement</Label>
                  <Textarea className="mt-2" placeholder="Optional banner message for all users" value={settingAnn} onChange={(e)=> setSettingAnn(e.target.value)} />
                </div>
                <div className="mt-2 flex justify-end"><Button className="hidden" onClick={savePlatformSettings}>Save settings</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Customer modal instance */}
      <CustomerModal
        open={custOpen}
        onOpenChange={setCustOpen}
        mode={custMode}
        form={custForm}
        setForm={setCustForm}
        user={custUser}
        saving={custSaving}
        onSave={async ()=>{
          if (!custUser) return;
          try {
            setCustSaving(true);
            document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving customer?' } }));
            const fd = new FormData();
            fd.set('firstName', custForm.firstName||'');
            fd.set('lastName', custForm.lastName||'');
            fd.set('email', custForm.email||'');
            fd.set('phone', custForm.phone||'');
            fd.set('company', custForm.company||'');
            const res = await fetch(`/api/admin/users/${custUser.id}`, { method:'POST', body: fd });
            if (!res.ok) { alert('Failed to save'); return; }
            const nx = await fetch('/api/admin/users?role=CUSTOMER').then(r=> r.ok? r.json():null).catch(()=>null);
            if (Array.isArray(nx?.items)) setUsers(nx.items);
            setCustOpen(false);
          } finally {
            setCustSaving(false);
            document.dispatchEvent(new CustomEvent('dav:loading-stop'));
          }
        }}
      />
    </div>
  );
}

// Customer modal
function CustomerModal({ open, onOpenChange, mode, form, setForm, user, onSave, saving }: any){
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode==='view' ? 'Customer details' : 'Edit customer'}</DialogTitle>
          <DialogDescription>{mode==='view' ? 'Profile and membership at a glance' : 'Update basic profile fields below'}</DialogDescription>
        </DialogHeader>
        {!user ? null : (
          <div className="grid gap-3 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>First name</Label>
                <Input value={form.firstName} onChange={(e:any)=> setForm((s:any)=> ({...s, firstName: e.target.value}))} disabled={mode==='view'} className="mt-1" />
              </div>
              <div>
                <Label>Last name</Label>
                <Input value={form.lastName} onChange={(e:any)=> setForm((s:any)=> ({...s, lastName: e.target.value}))} disabled={mode==='view'} className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email} onChange={(e:any)=> setForm((s:any)=> ({...s, email: e.target.value}))} disabled={mode==='view'} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e:any)=> setForm((s:any)=> ({...s, phone: e.target.value}))} disabled={mode==='view'} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e:any)=> setForm((s:any)=> ({...s, company: e.target.value}))} disabled={mode==='view'} className="mt-1" />
              </div>
            </div>
            <div className="rounded-lg border p-3 bg-gray-50">
              <div className="text-sm text-gray-600">Plan</div>
              <div className="text-sm">{user?.membership?.planTitle || user?.membership?.plan || (user?.membership?.stripeSubId ? 'Unlimited' : '?')}</div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={()=> onOpenChange(false)} disabled={saving}>Close</Button>
          {mode==='edit' && (
            <Button onClick={onSave} disabled={saving}>{saving? 'Saving?':'Save changes'}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PartnerCodesSection(){
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [company, setCompany] = React.useState('Ancestry Pet DNA');
  const [count, setCount] = React.useState(100);
  const [prefix, setPrefix] = React.useState('DAV');
  const [accessDays, setAccessDays] = React.useState<number | ''>(30);
  const [desc, setDesc] = React.useState('Partner access');
  const companiesList = ['Ancestry Pet DNA','Honey Insurance','MadPaws','Pet Chemist'];

  async function refresh(){
    setLoading(true);
    try {
      const r = await fetch('/api/admin/codes').then(x=> x.ok? x.json(): null).catch(()=> null);
      setList(Array.isArray(r?.items) ? r.items : []);
    } finally { setLoading(false); }
  }

  React.useEffect(()=>{ refresh(); },[]);

  function makeCode(i:number){
    // PREFIX-COMP-XXXX-XXXX (simple)
    const tag = company.replace(/[^A-Z]/gi,'').slice(0,4).toUpperCase();
    const rand = () => Math.random().toString(36).slice(2,6).toUpperCase();
    return `${prefix}-${tag}-${rand()}-${rand()}`;
  }

  async function generateBatch(){
    document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Generating codes?' } }));
    try {
      for (let i=0;i<count;i++){
        const code = makeCode(i);
        const payload = { code, accessDays: accessDays === '' ? null : Number(accessDays), description: `${company}: ${desc}` };
        // best-effort; if duplicate, skip
        await fetch('/api/admin/codes', { method:'POST', headers:{'content-type':'application/json','accept':'application/json'}, body: JSON.stringify(payload) });
      }
      await refresh();
      alert('Codes generated');
    } finally {
      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
    }
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-base">Create new code batch</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Company</Label>
            <div className="mt-2 border rounded-md">
              <select className="px-3 py-2 w-full text-sm" value={company} onChange={(e)=> setCompany((e.target as any).value)}>
                {companiesList.map((c)=> (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>
          <div>
            <Label>Number of codes</Label>
            <Input className="mt-2" type="number" min={1} max={5000} value={count} onChange={(e)=> setCount(parseInt((e.target as any).value||'0',10)||0)} />
          </div>
          <div>
            <Label>Code prefix</Label>
            <Input className="mt-2" value={prefix} onChange={(e)=> setPrefix((e.target as any).value.toUpperCase().replace(/[^A-Z0-9-]/g,''))} />
          </div>
          <div>
            <Label>Access days</Label>
            <Input className="mt-2" type="number" min={0} value={accessDays as any} onChange={(e)=> setAccessDays(((e.target as any).value===''?'':parseInt((e.target as any).value,10)) as any)} placeholder="leave blank for no expiry" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input className="mt-2" value={desc} onChange={(e)=> setDesc((e.target as any).value)} />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={generateBatch}><KeyRound className="h-4 w-4 mr-2"/>Generate</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-base">Codes</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-sm text-gray-500">Loading?</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <TableHeaderCell>Code</TableHeaderCell>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableHeaderCell>Access days</TableHeaderCell>
                  <TableHeaderCell>Redeemed</TableHeaderCell>
                  <TableHeaderCell>Active</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </thead>
              <tbody>
                {list.map((c:any)=> (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <TableCell><span className="font-mono text-sm">{c.code}</span></TableCell>
                    <TableCell>{c.description||'?'}</TableCell>
                    <TableCell>{c.accessDays ?? '?'}</TableCell>
                    <TableCell>{c.redeemedCount ?? 0}</TableCell>
                    <TableCell>
                      <Badge className="rounded-xl">{c.active? 'Active':'Disabled'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={async ()=>{ const nv = !c.active; await fetch('/api/admin/codes', { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify({ id: c.id, active: nv }) }); setList(prev=> prev.map(x=> x.id===c.id? {...x, active: nv}: x)); }}>{c.active? 'Disable':'Enable'}</Button>
                        <Button size="sm" variant="outline" onClick={async ()=>{ await navigator.clipboard?.writeText(c.code); }}>Copy</Button>
                        <Button size="sm" variant="outline" onClick={async ()=>{ await fetch(`/api/admin/codes?id=${encodeURIComponent(c.id)}`, { method:'DELETE' }); setList(prev=> prev.filter(x=> x.id!==c.id)); }}>Delete</Button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
                {list.length===0 && (
                  <tr><td colSpan={6} className="px-3 py-3 text-sm text-gray-500">No partner codes yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
