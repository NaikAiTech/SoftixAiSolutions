"use client";
import React, { useEffect, useMemo, useState } from "react";
import AvailabilityBlocks from "./_components/AvailabilityBlocks";
import PhoneInput from "@/components/PhoneInput";

// Self‑contained canvas‑preview version (no external UI libs)
// Theme update inspired by the screenshot: soft mint/teal gradient accents,
// rounded pills, subtle shadows — content unchanged.

// ---------- Theme ----------
const THEME = {
  bg: "#ffffff",
  sidebarBg: "#F6FAF8",
  primary: "#178F7A",         // deep teal
  primary2: "#77D9A3",        // mint
  outline: "#E6F0EC",
  text: "#0F172A",
  muted: "#6B7280",
  chip: "#E9F7F1",
  headerGrad: "linear-gradient(135deg, #E9F7F1 0%, #F7FBF5 100%)",
  cardGrad: "linear-gradient(135deg, #F1FBF6 0%, #F9FEFB 100%)",
};

// ---------- Types ----------

type Outcome = "emergency" | "home-care" | "no-treatment" | null;

type Soap = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

type Booking = {
  id: string;
  start: string; // ISO
  end: string;   // ISO
  petName: string;
  species: "Dog" | "Cat" | "Other";
  ownerName: string;
  ownerEmail: string;
  reason: string;
  triage: "Low" | "Medium" | "High";
  notes?: string;
  outcome: Outcome;
  soap?: Soap;
  createdAt: string;
  joinUrl?: string;
};

type DayAvail = { active: boolean; start: string; end: string };

type Availability = {
  timezone: string;
  days: Record<string, DayAvail>; // Mon..Sun
};

// ---------- Utils ----------

const fmtDateTZ = (iso: string, tz: string) => new Intl.DateTimeFormat(undefined, {
  timeZone: tz, weekday: "short", day: "2-digit", month: "short", year: "numeric"
}).format(new Date(iso));
const fmtTimeTZ = (iso: string, tz: string) => new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const withinRange = (now: Date, startISO: string, endISO: string) => now >= new Date(startISO) && now <= new Date(endISO);
const canJoinWindow = (now: Date, startISO: string, endISO: string) => now >= new Date(new Date(startISO).getTime() - 10*60*1000) && now <= new Date(new Date(endISO).getTime() + 60*1000);

const badge = (text: string, color: string) => (
  <span style={{
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: `1px solid ${color}33`,
    color,
    background: `${color}14`,
    backdropFilter: "blur(2px)",
  }}>{text}</span>
);

const missingBadge = (label: string) => badge(`Missing ${label}`, "#b91c1c");

async function fetchJson(url: string): Promise<{ items: Booking[] }> {
  try {
    const res = await fetch(url, { credentials: "include" });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("application/json")) return { items: [] };
    return await res.json();
  } catch {
    return { items: [] };
  }
}

// ---------- Mock Data ----------

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk_001",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 20*60*1000).toISOString(),
    petName: "Milo",
    species: "Dog",
    ownerName: "Sophie Li",
    ownerEmail: "sophie@example.com",
    reason: "Intermittent vomiting, lethargy",
    triage: "High",
    outcome: null,
    createdAt: new Date().toISOString(),
    joinUrl: "https://zoom.us/j/123456789",
  },
  {
    id: "bk_002",
    start: new Date(Date.now() + 90*60*1000).toISOString(),
    end: new Date(Date.now() + 110*60*1000).toISOString(),
    petName: "Luna",
    species: "Cat",
    ownerName: "James Park",
    ownerEmail: "james@example.com",
    reason: "Sneezing and watery eyes",
    triage: "Low",
    outcome: "home-care",
    createdAt: new Date(Date.now() - 60*60*1000).toISOString(),
  },
  {
    id: "bk_003",
    start: new Date(Date.now() - 240*60*1000).toISOString(),
    end: new Date(Date.now() - 210*60*1000).toISOString(),
    petName: "Charlie",
    species: "Dog",
    ownerName: "Priya Desai",
    ownerEmail: "priya@example.com",
    reason: "Itchy skin and ear shaking",
    triage: "Medium",
    outcome: "no-treatment",
    createdAt: new Date(Date.now() - 300*60*1000).toISOString(),
  },
];

// ---------- UI Primitives (tiny) ----------

const Card: React.FC<{title?: string; description?: string; children: any; style?: React.CSSProperties}> = ({title, description, children, style}) => (
  <div style={{
    border: `1px solid ${THEME.outline}`,
    borderRadius: 20,
    background: THEME.bg,
    boxShadow: "0 1px 3px rgba(16,24,40,0.04)",
    overflow: "hidden",
    ...style,
  }}>
    {(title || description) && (
      <div style={{
        padding: 16,
        borderBottom: `1px solid ${THEME.outline}`,
        background: THEME.headerGrad,
      }}>
        {title && <div style={{fontWeight: 700, color: THEME.text}}>{title}</div>}
        {description && <div style={{color: THEME.muted, fontSize: 14}}>{description}</div>}
      </div>
    )}
    <div style={{padding: 16}}>{children}</div>
  </div>
);

const Button: React.FC<{children: any; onClick?: ()=>void; href?: string; target?: string; disabled?: boolean; variant?: "default"|"secondary"|"outline"; submit?: boolean;}> = ({children, onClick, href, target, disabled, variant="default", submit}) => {
  const style: React.CSSProperties = (() => {
    if (variant === "default") return {
      background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primary2} 100%)`,
      color: "#fff",
      border: "1px solid transparent",
    };
    if (variant === "secondary") return {
      background: THEME.cardGrad,
      color: THEME.text,
      border: `1px solid ${THEME.outline}`,
    };
    return {
      background: THEME.bg,
      color: THEME.text,
      border: `1px solid ${THEME.outline}`,
    };
  })();

  const content = (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "10px 14px", borderRadius: 12,
      cursor: disabled?"not-allowed":"pointer",
      opacity: disabled?0.6:1,
      boxShadow: variant === "default" ? "0 4px 14px rgba(23,143,122,0.25)" : "0 1px 2px rgba(16,24,40,0.06)",
      ...style,
    }} onClick={disabled? undefined : onClick}>
      {children}
    </div>
  );
  if (href) return <a href={disabled? undefined : href} target={target} rel="noreferrer" style={{textDecoration: "none"}}>{content}</a>;
  return (
    <button type={submit? 'submit' : 'button'} disabled={disabled} style={{ all: 'unset' }} onClick={disabled? undefined : onClick}>
      {content}
    </button>
  );
};

const FieldRow: React.FC<{label: string; children: any}> = ({label, children}) => (
  <label style={{display:"grid", gridTemplateColumns:"160px 1fr", gap:12, alignItems:"center"}}>
    <span style={{color:THEME.muted, fontSize:14}}>{label}</span>
    <div>{children}</div>
  </label>
);

// ---------- Subcomponents ----------

function TriageBadge({level}:{level: Booking["triage"]}){
  const map: Record<Booking["triage"], string> = { Low: "#047857", Medium: "#b45309", High: "#b91c1c" };
  return badge(level, map[level]);
}

function OutcomeBadge({outcome}:{outcome: Outcome}){
  if (!outcome) return badge("Pending", THEME.muted);
  const map: Record<Exclude<Outcome,null>,[string,string]> = {
    "emergency": ["Emergency visit", "#b91c1c"],
    "home-care": ["At-home care", THEME.primary],
    "no-treatment": ["No treatment", "#047857"],
  };
  const [label, color] = map[outcome];
  return badge(label, color);
}

function BookingRow({ b, onOpen, tz, hideJoin, showStatus, hideTriage, showStartsIn, nowTick, hideOutcome }: { b: Booking; onOpen: (b: Booking) => void; tz: string; hideJoin?: boolean; showStatus?: boolean; hideTriage?: boolean; showStartsIn?: boolean; nowTick?: number; hideOutcome?: boolean }) {
  const now = new Date(nowTick || Date.now());
  const live = withinRange(now, b.start, b.end);
  const diffMs = new Date(b.start).getTime() - (nowTick || Date.now());
  const totalMin = Math.max(0, Math.round(diffMs / 60000));
  const startsInLabel = diffMs <= 0 ? 'now' : (totalMin >= 60 ? `${Math.floor(totalMin/60)}h ${totalMin%60}m` : (totalMin === 0 ? '<1m' : `${totalMin}m`));
  const joinEnabled = diffMs <= 5 * 60 * 1000; // Join opens 5 minutes before start
  const statusText = (b as any).status || (live ? 'IN PROGRESS' : 'SCHEDULED');
  const petNode = b.petName && b.petName !== "Pet" ? (
    <>{b.petName}</>
  ) : (
    missingBadge('pet')
  );
  const ownerNode = b.ownerName && b.ownerName !== "Owner" ? (
    <>{b.ownerName}</>
  ) : (
    missingBadge('owner')
  );
  return (
    <div style={{
      display:"grid", gridTemplateColumns: (()=>{ const withOutcome = showStartsIn ? "1.2fr 1.2fr 1.2fr .8fr .8fr 1.2fr 1.2fr" : "1.2fr 1.2fr 1.2fr .8fr .8fr 1.2fr"; const noOutcome = showStartsIn ? "1.2fr 1.2fr 1.2fr .8fr .8fr 1.2fr" : "1.2fr 1.2fr 1.2fr .8fr 1.2fr"; return hideOutcome ? noOutcome : withOutcome; })(), gap:12, alignItems:"center",
      border:`1px solid ${THEME.outline}`, borderRadius:16, padding:12, background:THEME.bg,
      boxShadow:"0 1px 2px rgba(16,24,40,0.04)"
    }}>
      <div>
        <div style={{fontWeight:700, color:THEME.text}}>{fmtDateTZ(b.start, tz)}</div>
        <div style={{color:THEME.muted, fontSize:14}}>{fmtTimeTZ(b.start, tz)} - {fmtTimeTZ(b.end, tz)}</div>
      </div>
      <div>
        <div style={{fontWeight:700, color:THEME.text}}>{petNode} <span style={{color:THEME.muted}}>({b.species})</span></div>
        <div style={{color:THEME.muted, fontSize:14}}>{ownerNode}</div>
      </div>
      <div style={{color:THEME.text}}>{b.reason ? (b.reason.length > 90 ? b.reason.slice(0,90)+"…" : b.reason) : '—'}</div>
      {!hideOutcome && (<div><OutcomeBadge outcome={b.outcome}/></div>)}
      {showStartsIn ? (
        <div>
          <span style={{display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:999, border:`1px solid ${diffMs <= 5*60*1000 && diffMs >= 0 ? '#a7f3d0' : THEME.outline}`, background: diffMs <= 5*60*1000 && diffMs >= 0 ? '#ecfdf5' : THEME.bg, fontSize:14, fontWeight:700}}>{startsInLabel}</span>
        </div>
      ) : (<></>)}
      {showStatus ? (
        <div>
          <span style={{display:'inline-flex', alignItems:'center', gap:6, padding:'4px 8px', borderRadius:999, border:`1px solid ${THEME.outline}`, background:THEME.cardGrad, fontSize:12, color:THEME.text}}>{statusText}</span>
        </div>
      ) : (<div />)}
      <div style={{display:"flex", justifyContent:"flex-end", gap:8, whiteSpace:'nowrap', minWidth:160}}>
        {!hideJoin && (
          b.joinUrl ? (
            <span title={joinEnabled ? '' : 'Join opens 5 minutes before start.'}>
              <Button href={b.joinUrl} target="_blank" disabled={!joinEnabled} variant={live?"default":joinEnabled?"secondary":"outline"}>
                <span role="img" aria-label="video">🎥</span> Join
              </Button>
            </span>
          ) : (
            <Button disabled variant="outline"><span role="img" aria-label="video">🎥</span> No link</Button>
          )
        )}
        <Button variant={live?"outline":"secondary"} onClick={()=>onOpen(b)}>ℹ️ View</Button>
      </div>
    </div>
  );
}

function Modal({open, onClose, children}:{open:boolean; onClose:()=>void; children:any}){
  if(!open) return null;
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.25)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, zIndex:1000}}>
      <div style={{maxWidth:900, width:"100%", background:THEME.bg, borderRadius:20, boxShadow:"0 10px 30px rgba(16,24,40,0.18)", border:`1px solid ${THEME.outline}`}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:16, borderBottom:`1px solid ${THEME.outline}`, background:THEME.headerGrad}}>
          <div style={{fontWeight:700, color:THEME.text}}>Consultation details</div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div style={{padding:16}}>{children}</div>
      </div>
    </div>
  );
}

// ---------- Availability Editor ----------

const DEFAULT_AVAIL: Availability = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  days: {
    Mon: { active: true,  start: "09:00", end: "17:00" },
    Tue: { active: true,  start: "09:00", end: "17:00" },
    Wed: { active: true,  start: "09:00", end: "17:00" },
    Thu: { active: true,  start: "09:00", end: "17:00" },
    Fri: { active: true,  start: "09:00", end: "17:00" },
    Sat: { active: false, start: "09:00", end: "13:00" },
    Sun: { active: false, start: "09:00", end: "13:00" },
  }
};

import { TZ_LIST as COMMON_TZS, tzOffsetLabel } from "@/lib/timezones";

function AvailabilityPanel({value, onChange}:{value: Availability; onChange: (v:Availability)=>void}){
  const daysOrder: (keyof Availability["days"])[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div style={{display:"grid", gap:16}}>
      <Card title="Time zone" description="Applies to all weekly slots">
        <FieldRow label="Time zone">
          <select value={value.timezone} onChange={(e)=> onChange({ ...value, timezone: e.target.value })} style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, width:"100%", background:THEME.bg}}>
            {[value.timezone, ...COMMON_TZS.filter(t=>t!==value.timezone)].map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </FieldRow>
      </Card>

      <Card title="Weekly availability" description="Set your recurring hours (Mon-Sun)">
        <div style={{display:"grid", gap:8}}>
          {daysOrder.map((d) => (
            <div key={d} style={{display:"grid", gridTemplateColumns:"90px 1fr 1fr auto", alignItems:"center", gap:12}}>
              <strong style={{width:80, color:THEME.text}}>{d}</strong>
              <label style={{display:"flex", alignItems:"center", gap:8}}>
                <input type="checkbox" checked={value.days[d].active} onChange={(e)=> onChange({ ...value, days: { ...value.days, [d]: { ...value.days[d], active: e.target.checked } } })} />
                <span style={{color:THEME.muted, fontSize:14}}>Active</span>
              </label>
              <input type="time" value={value.days[d].start} onChange={(e)=> onChange({ ...value, days: { ...value.days, [d]: { ...value.days[d], start: e.target.value } } })} style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, background:THEME.bg}} />
              <input type="time" value={value.days[d].end} onChange={(e)=> onChange({ ...value, days: { ...value.days, [d]: { ...value.days[d], end: e.target.value } } })} style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, background:THEME.bg}} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- Main ----------

export default function VetPortalDashboard(){
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loadedUpcoming, setLoadedUpcoming] = useState(false);
  const [loadedPast, setLoadedPast] = useState(false);
  const [vetTz, setVetTz] = useState<string | null>(null);
  const [active, setActive] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<"availability"|"upcoming"|"past"|"settings">("upcoming");
  const [availability, setAvailability] = useState<Availability>(DEFAULT_AVAIL);
  const [nowTick, setNowTick] = useState<number>(() => Date.now());
  const [settingsValues, setSettingsValues] = useState<{ emailAlerts: boolean; smsAlerts: boolean; zoomUserEmail: string; displayName: string; phone: string }>(
    { emailAlerts: false, smsAlerts: false, zoomUserEmail: "", displayName: "", phone: "" }
  );
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  // Auth guard: only vets can access
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      try{
        const me = await fetch('/api/me').then(r=> r.ok? r.json(): null).catch(()=>null);
        if(!alive) return;
        if (!me?.user) { window.location.href='/login'; return; }
        const role = String(me.user.role || '').toUpperCase();
        if (role === 'ADMIN') { window.location.href = '/admin'; return; }
        if (role !== 'VET') { window.location.href='/account'; return; }
      } catch {}
    })();
    return ()=>{ alive = false };
  },[]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (section === "upcoming" && !loadedUpcoming) {
        const upData = await fetchJson('/api/vet/appointments/upcoming');
        if (!alive) return;
        setUpcomingBookings(upData.items || []);
        setLoadedUpcoming(true);
      }
      if (section === "past" && !loadedPast) {
        const pastData = await fetchJson('/api/vet/appointments/past');
        if (!alive) return;
        setPastBookings(pastData.items || []);
        setLoadedPast(true);
      }
    })();
    return () => { alive = false; };
  }, [section, loadedUpcoming, loadedPast]);

  // ticker for upcoming countdowns
  useEffect(()=>{ const id = setInterval(()=> setNowTick(Date.now()), 5000); return ()=> clearInterval(id); },[]);

  // Mobile detection to stack layout
  useEffect(()=>{
    const mql = typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)') : null;
    const update = () => setIsNarrow(!!mql?.matches);
    update();
    mql?.addEventListener?.('change', update);
    return ()=> mql?.removeEventListener?.('change', update);
  },[]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/vet/settings');
        const d = res.ok ? await res.json() : null;
        if (!alive) return;
        if (d?.timezone) setVetTz(d.timezone); else {
          try {
            const s = await fetch('/api/admin/settings?public=1');
            if (s.ok) { const g = await s.json(); if (g?.defaultTimezone) setVetTz(g.defaultTimezone); }
          } catch {}
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (section !== "settings") return;
      try {
        const res = await fetch('/api/vet/settings');
        if (!res.ok) return;
        const d = await res.json();
        if (!alive) return;
        setSettingsValues({ emailAlerts: !!d.emailAlerts, smsAlerts: !!d.smsAlerts, zoomUserEmail: (d.zoomUserEmail || ""), displayName: d.displayName || "", phone: d.phone || "" });
      } catch {}
    })();
    return () => { alive = false; };
  }, [section]);

  const upcoming = useMemo(() =>
    upcomingBookings.slice().sort((a,b)=> a.start.localeCompare(b.start)),
  [upcomingBookings]);
  const past = useMemo(() =>
    pastBookings.slice().sort((a,b)=> b.start.localeCompare(a.start)),
  [pastBookings]);

  function openBooking(b: Booking){ setActive(b); setOpen(true); }
  async function saveOutcome(outcome: Outcome, soap?: Soap){
    if(!active) return;
    try {
      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving…' } }));
      // Persist SOAP/notes first
      if (soap) {
        const payload: any = { soap: { subjective: soap.subjective || '', objective: soap.objective || '', assessment: soap.assessment || '', plan: soap.plan || '' } };
        if ((soap as any).consultationSummary !== undefined) payload.soap.consultationSummary = (soap as any).consultationSummary || '';
        await fetch(`/api/vet/appointments/${active.id}/notes`, { method:'PATCH', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) });
      }
      // Persist outcome if changed
      if (outcome && outcome !== (active as any).outcome) {
        await fetch(`/api/vet/appointments/${active.id}/outcome`, { method:'PATCH', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ outcome }) });
      }
      // Refresh lists
      const [upData, pastData] = await Promise.all([
        fetchJson('/api/vet/appointments/upcoming'),
        fetchJson('/api/vet/appointments/past'),
      ]);
      setUpcomingBookings(upData.items || []);
      setPastBookings(pastData.items || []);
      setOpen(false);
    } finally {
      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
    }
  }

  // Hydrate SOAP when a booking is opened
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      if (!active) return;
      try {
        const res = await fetch(`/api/appointments/${active.id}`);
        if (!alive || !res.ok) return;
        const d = await res.json();
        const s = (d?.appointment?.soap || {}) as any;
        setSoap({ subjective: s.subjective || '', objective: s.objective || '', assessment: s.assessment || '', plan: s.plan || '' });
        const summary = (d?.appointment?.notes ?? s.consultationSummary ?? s.clientSummary ?? '') as any;
        setClientSummary(summary ? String(summary) : '');
      } catch {}
    })();
    return ()=> { alive = false };
  }, [active]);

  // Basic SOAP editor state
  const [soap, setSoap] = useState<Soap>({ subjective:"", objective:"", assessment:"", plan:"" });
  const [clientSummary, setClientSummary] = useState<string>("");

  // Layout styles
  const layout: React.CSSProperties = { display:"grid", gridTemplateColumns: isNarrow ? "1fr" : "250px 1fr", minHeight:"100vh", background:THEME.bg };
  const sidebar: React.CSSProperties = isNarrow
    ? { borderRight:`1px solid ${THEME.outline}`, padding:16, position:"static", height:"auto", background:THEME.sidebarBg }
    : { borderRight:`1px solid ${THEME.outline}`, padding:16, position:"sticky", top:0, height:"100vh", background:THEME.sidebarBg };
  const main: React.CSSProperties = { padding: isNarrow ? 16 : 24, maxWidth:1100, width:"100%", margin:"0 auto" };
  const navBtn = (active:boolean): React.CSSProperties => ({
    display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, cursor:"pointer",
    fontWeight: active?700:600, color: active?THEME.text:"#374151", background: active?THEME.cardGrad:"transparent",
    border: `1px solid ${active?THEME.outline:"transparent"}`,
  });

  return (
    <div style={layout}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <div style={{fontSize:20, fontWeight:800, marginBottom:12, color:THEME.text}}>Dial A Vet</div>
        <div style={{color:THEME.muted, fontSize:13, marginBottom:16}}>Vet Portal</div>

        <div style={{display:"grid", gap:8}}>
          <div style={navBtn(section==="availability")} onClick={()=>setSection("availability")}>🗓️ Availability</div>
          <div style={navBtn(section==="upcoming")} onClick={()=>setSection("upcoming")}>✅ Upcoming consultations</div>
          <div style={navBtn(section==="past")} onClick={()=>setSection("past")}>📁 Past consultations</div>
          <div style={navBtn(section==="settings")} onClick={()=>setSection("settings")}>⚙️ Settings</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{...main, minHeight: 'calc(100vh - 220px)'}}>
        <div style={{
          display:"flex", flexDirection: isNarrow ? 'column' : 'row', gap: isNarrow ? 8 : 0,
          justifyContent: isNarrow ? 'flex-start' : 'space-between', alignItems: isNarrow ? 'flex-start' : 'center', marginBottom:16,
          padding:16, borderRadius:16, background:THEME.headerGrad, border:`1px solid ${THEME.outline}`,
        }}>
          <div>
            <div style={{fontSize:22, fontWeight:800, color:THEME.text}}>
              {section === "availability" && "Availability"}
              {section === "upcoming" && "Upcoming Consultations"}
              {section === "past" && "Past Consultations"}
              {section === "settings" && "Settings"}
            </div>
            <div style={{color:THEME.muted}}>
              {section === "availability" && "Choose your weekly schedule and time zone."}
              {section === "upcoming" && "Your next telehealth consults."}
              {section === "past" && "A record of completed consults."}
              {section === "settings" && "Personal preferences and account controls."}
            </div>
          </div>
          <div>
            <Button variant="secondary" onClick={async ()=>{
              document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Signing out…' } }));
              const { createSupabaseBrowser } = await import("@/lib/supabase.client");
              const supabase = createSupabaseBrowser();
              await supabase.auth.signOut();
              await fetch('/auth/session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ access_token:'', refresh_token:'' })}).catch(()=>{});
              document.dispatchEvent(new CustomEvent('dav:loading-stop'));
              window.location.href = '/login';
            }}>Log out</Button>
          </div>
        </div>

        {section === "availability" && (
          <div style={{display:"grid", gap:16}}>
            <Card title="Time zone" description="Used to compute your weekly slots">
              <form onSubmit={async (e)=>{ e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); fd.set('_tz','1'); document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving time zone…' } })); await fetch('/api/vet/settings', { method:'POST', body: fd, headers: { 'accept':'application/json' } }); document.dispatchEvent(new CustomEvent('dav:loading-stop')); alert('Time zone saved'); }} style={{display:'grid', gap:12}}>
                <FieldRow label="Time zone">
                  <select name="timezone" value={vetTz || Intl.DateTimeFormat().resolvedOptions().timeZone} onChange={(e)=> setVetTz(e.target.value)} style={{padding:'10px 12px', borderRadius:12, border:`1px solid ${THEME.outline}`}}>
                    {COMMON_TZS.map(tz => (<option key={tz} value={tz}>{tz} ({tzOffsetLabel(tz)})</option>))}
                  </select>
                </FieldRow>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  <Button submit>Save</Button>
                </div>
              </form>
            </Card>
            <AvailabilityBlocks />
          </div>
        )}

        {section === "upcoming" && (
          <Card title="Upcoming" description="Your next consultations">
            {upcoming.length === 0 ? (
              <div style={{color:THEME.muted, fontSize:14}}>No upcoming consultations</div>
            ) : (
              <div style={{display:"grid", gap:8, overflowX:'auto'}}>
                <div style={{
                  display:"grid", gridTemplateColumns:"1.2fr 1.2fr 1.2fr .8fr .8fr 1.2fr", gap:12,
                  color:THEME.text, fontSize:13, fontWeight:800,
                  background: THEME.headerGrad, border:`1px solid ${THEME.outline}`, padding:'10px 12px', borderRadius:14,
                  boxShadow:"0 1px 2px rgba(16,24,40,0.06)"
                }}>
                  <div>Date</div>
                  <div>Customer & Pet</div>
                  <div>Topic</div>
                  <div>Starts in</div>
                  <div>Status</div>
                  <div style={{textAlign:'right'}}>Actions</div>
                </div>
                {upcoming.map(b => <BookingRow key={b.id} b={b} onOpen={openBooking} tz={vetTz || 'UTC'} showStatus hideTriage showStartsIn nowTick={nowTick} hideOutcome />)}
              </div>
            )}
          </Card>
        )}

        {section === "past" && (
          <Card title="Past consultations" description="Your most recent completed consults — newest first">
            {past.length === 0 ? (
              <div style={{color:THEME.muted, fontSize:14}}>No past consultations</div>
            ) : (
              <div style={{display:"grid", gap:8, overflowX:'auto'}}>
                <div style={{
                  display:"grid", gridTemplateColumns:"1.2fr 1.2fr 1.2fr .8fr .8fr 1.2fr", gap:12,
                  color:THEME.text, fontSize:13, fontWeight:800,
                  background: THEME.headerGrad, border:`1px solid ${THEME.outline}`, padding:'10px 12px', borderRadius:14,
                  boxShadow:"0 1px 2px rgba(16,24,40,0.06)"
                }}>
                  <div>Date</div>
                  <div>Customer & Pet</div>
                  <div>Topic</div>
                  <div>Outcome</div>
                  <div>Status</div>
                  <div style={{textAlign:'right'}}>Actions</div>
                </div>
                {past.map(b => <BookingRow key={b.id} b={b} onOpen={openBooking} tz={vetTz || 'UTC'} hideJoin showStatus hideTriage />)}
              </div>
            )}
          </Card>
        )}

        {section === "settings" && (
          <div style={{display:"grid", gap:16}}>
            <Card title="Profile" description="Basics about you">
              <form method="post" action="/api/vet/settings" onSubmit={async (e)=>{
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving profile…' } }));
                await fetch('/api/vet/settings', { method: 'POST', body: data, headers: { 'accept': 'application/json' } });
                try {
                  const res = await fetch('/api/vet/settings');
                  if (res.ok) {
                const d = await res.json();
                setSettingsValues({ emailAlerts: !!d.emailAlerts, smsAlerts: !!d.smsAlerts, zoomUserEmail: (d.zoomUserEmail || ""), displayName: d.displayName || "", phone: d.phone || "" });
                  }
                } catch {}
                document.dispatchEvent(new CustomEvent('dav:loading-stop'));
                alert('Saved');
              }} style={{display:"grid", gap:12}}>
                <input type="hidden" name="_zoom" value="1" />
                <FieldRow label="Display name"><input name="displayName" type="text" placeholder="Dr Taylor" value={settingsValues.displayName} onChange={(e)=> setSettingsValues(v=> ({...v, displayName: e.target.value}))} style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, width:"100%"}}/></FieldRow>
                <FieldRow label="Mobile number">
                  <div>
                    <input type="hidden" name="phone" value={settingsValues.phone} />
                    <PhoneInput value={settingsValues.phone || ""} onChange={(e164)=> setSettingsValues(v=> ({...v, phone: e164}))} />
                  </div>
                </FieldRow>
                <FieldRow label="Zoom email"><input name="zoomUserEmail" type="email" placeholder="vet.zoom@domain.com" value={settingsValues.zoomUserEmail} onChange={(e)=> setSettingsValues(v=> ({...v, zoomUserEmail: e.target.value}))} style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, width:"100%"}}/></FieldRow>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                  <Button submit>Save</Button>
                </div>
              </form>
            </Card>
            <Card title="Notifications" description="When to notify you">
              <form method="post" action="/api/vet/settings" style={{display:"grid", gap:12}} onSubmit={async (e)=>{
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving preferences…' } }));
                await fetch('/api/vet/settings', { method: 'POST', body: data, headers: { 'accept': 'application/json' } });
                try {
                  const res = await fetch('/api/vet/settings');
                  if (res.ok) {
                    const d = await res.json();
                    setSettingsValues({ emailAlerts: !!d.emailAlerts, smsAlerts: !!d.smsAlerts, zoomUserEmail: (d.zoomUserEmail || ""), displayName: d.displayName || "", phone: d.phone || "" });
                  }
                } catch {}
                document.dispatchEvent(new CustomEvent('dav:loading-stop'));
                alert('Preferences saved');
              }}>
                <input type="hidden" name="_prefs" value="1" />
                <FieldRow label="Email alerts"><input name="emailAlerts" type="checkbox" checked={settingsValues.emailAlerts} onChange={(e)=> setSettingsValues(v => ({...v, emailAlerts: e.target.checked}))}/>
                  <input type="hidden" name="emailAlertsOff" value={settingsValues.emailAlerts ? '0' : '1'} /></FieldRow>
                <FieldRow label="SMS alerts"><input name="smsAlerts" type="checkbox" checked={settingsValues.smsAlerts} onChange={(e)=> setSettingsValues(v => ({...v, smsAlerts: e.target.checked}))}/>
                  <input type="hidden" name="smsAlertsOff" value={settingsValues.smsAlerts ? '0' : '1'} /></FieldRow>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                  <Button submit>Save preferences</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>

      {/* Modal lives at root so it overlays both panes */}
      <Modal open={open} onClose={()=>setOpen(false)}>
        {!active ? null : (
          <div style={{display:"grid", gridTemplateColumns:"1.2fr .8fr", gap:16}}>
            <Card title="SOAP notes" description="Private medical notes - team only">
              <div style={{display:"grid", gap:8}}>
                {(["subjective","objective","assessment","plan"] as const).map((k) => (
                  <div key={k}>
                    <div style={{fontSize:12, color:THEME.muted, marginBottom:4}}>{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                    <textarea
                      value={(soap as any)[k]}
                      onChange={(e)=> setSoap(s => ({...s, [k]: e.target.value}))}
                      rows={3}
                      style={{width:"100%", border:`1px solid ${THEME.outline}`, borderRadius:12, padding:10, fontFamily:"inherit"}}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <div style={{display:"grid", gap:16}}>
              <Card title="Owner & case" description="Quick reference">
                <div style={{display:"grid", gap:8, fontSize:14}}>
                  <div style={{display:"flex", justifyContent:"space-between"}}><span style={{color:THEME.muted}}>Owner</span><span style={{fontWeight:700, color:THEME.text}}>{active.ownerName && active.ownerName !== "Owner" ? active.ownerName : missingBadge('owner')}</span></div>
                  <div style={{display:"flex", justifyContent:"space-between"}}><span style={{color:THEME.muted}}>Email</span><span style={{fontWeight:700, color:THEME.text}}>{active.ownerEmail ? active.ownerEmail : missingBadge('email')}</span></div>
                  <div style={{display:"flex", justifyContent:"space-between"}}><span style={{color:THEME.muted}}>Reason</span><span style={{fontWeight:700, color:THEME.text, textAlign:"right"}}>{active.reason ? active.reason : missingBadge('reason')}</span></div>
                </div>
              </Card>

              <Card title="Outcome" description="Choose the final outcome">
                <div style={{display:"grid", gap:8}}>
                  <select id="outcome-select" style={{padding:"10px 12px", borderRadius:12, border:`1px solid ${THEME.outline}`, background:THEME.bg}} defaultValue={active.outcome ?? ""}>
                    <option value="" disabled>Select an outcome</option>
                    <option value="emergency">Emergency visit needed</option>
                    <option value="home-care">At-home care</option>
                    <option value="no-treatment">No treatment required</option>
                  </select>
                  {/* Hide triage display in dialog for past consults */}
                  <div>
                    <div style={{fontSize:12, color:THEME.muted, marginBottom:4}}>Summary for the Client</div>
                    <textarea value={clientSummary} onChange={(e)=> setClientSummary(e.target.value)} rows={3} style={{width:"100%", border:`1px solid ${THEME.outline}`, borderRadius:12, padding:10, fontFamily:"inherit"}} />
                  </div>
                  {/* Join call button hidden in consultation details */}
                  <div style={{color:THEME.muted, fontSize:12}}>Tip: outcomes feed QA, insurer reporting, and referral workflows.</div>
                </div>
              </Card>

              <div style={{display:"flex", gap:8, justifyContent:"flex-end"}}>
                <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button onClick={()=>{
                  const select = document.getElementById("outcome-select") as HTMLSelectElement | null;
                  const outcome = (select?.value || null) as Outcome;
                  // Save client summary in notes and four SOAP fields in SOAP
                  (async ()=>{
                    document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving…' } }));
                    try {
                      await fetch(`/api/vet/appointments/${active.id}/notes`, { method:'PATCH', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ notes: clientSummary || '', soap: { subjective: soap.subjective||'', objective: soap.objective||'', assessment: soap.assessment||'', plan: soap.plan||'' } }) });
                      if (outcome && outcome !== (active as any).outcome) {
                        await fetch(`/api/vet/appointments/${active.id}/outcome`, { method:'PATCH', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ outcome }) });
                      }
                      const [upData, pastData] = await Promise.all([
                        fetchJson('/api/vet/appointments/upcoming'),
                        fetchJson('/api/vet/appointments/past'),
                      ]);
                      setUpcomingBookings(upData.items || []);
                      setPastBookings(pastData.items || []);
                      setOpen(false);
                    } finally {
                      document.dispatchEvent(new CustomEvent('dav:loading-stop'));
                    }
                  })();
                }}>Save notes & outcome</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

