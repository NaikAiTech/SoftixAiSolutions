"use client";
import React, { useEffect, useMemo, useState } from "react";
import PhoneInput from "@/components/PhoneInput";

const GlobalStyles = () => (
  <>
    <style>{`
      :root{ --ink:#0B1220; --muted:#4B5563; --ring:rgba(16,24,40,.06); --brand:#10b981; --brand-2:#0d9488; --bg:#ffffff; --line: rgba(0,0,0,.08); }
      *{box-sizing:border-box}
      .dav-app{background:var(--bg);color:var(--ink)}
      .dav-app, .dav-app *{font-family:'Product Sans','Google Sans',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;letter-spacing:-0.5px}
      .dav-app .container{max-width:1200px;margin:0 auto;padding:24px}
      .dav-app .layout{display:grid;grid-template-columns:260px 1fr;gap:20px;min-height:60vh}
      @media (max-width:900px){.dav-app .layout{grid-template-columns:1fr}}
      .dav-app .sidebar{border:1px solid var(--line);border-radius:18px;padding:14px;background:#fff;height:fit-content}
      .dav-app .tab{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer}
      .dav-app .tab:hover{background:rgba(0,0,0,.03)}
      .dav-app .tab.active{background:#ecfdf5; outline:1px solid #a7f3d0}
      .dav-app .h1{font-size:clamp(28px,4vw,40px);line-height:1.1;font-weight:500;letter-spacing:-1px;margin:0 0 6px}
      .dav-app .h2{font-size:clamp(16px,2.2vw,20px);color:var(--muted);margin:0}
      .dav-app .card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 8px 24px var(--ring)}
      .dav-app .section{padding:18px}
      .dav-app .grid{display:grid;gap:16px}
      .dav-app .grid-2{grid-template-columns:repeat(2,1fr)}
      .dav-app .grid-3{grid-template-columns:repeat(3,1fr)}
      .dav-app .grid-4{grid-template-columns:repeat(4,1fr)}
      @media (max-width:900px){.dav-app .grid-2,.dav-app .grid-3,.dav-app .grid-4{grid-template-columns:1fr}}
      .dav-app .btn{border:0;border-radius:999px;background:#000;color:#fff;padding:12px 18px;font-weight:500;cursor:pointer}
      .dav-app .btn-ghost{border:1px solid var(--line);background:#fff;color:#111;padding:10px 14px;border-radius:12px}
      .dav-app .chip{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:#fff;border:1px solid var(--line);box-shadow:0 2px 6px var(--ring);font-size:13px;color:#374151}
      .dav-app .pill{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:999px;border:1px solid var(--line);background:#fff;box-shadow:0 2px 6px var(--ring);font-size:14px;min-width:84px;cursor:pointer}
      .dav-app .pill.selected{outline:2px solid #111;font-weight:500}
      .dav-app .time-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;box-shadow:0 2px 6px var(--ring);font-size:14px}
      .dav-app .btn-ghost.disabled{opacity:.45;cursor:not-allowed;pointer-events:none}
      .dav-app .tooltip{position:relative;display:inline-block}
      .dav-app .tooltip:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:6px 8px;border-radius:8px;font-size:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.2)}
      .dav-app table{width:100%;border-collapse:separate;border-spacing:0}
      .dav-app th,.dav-app td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left}
      .dav-app th{font-weight:500;color:#111827;background:rgba(0,0,0,.02)}
      .dav-app .input{padding:10px 14px;border:1px solid var(--line);border-radius:12px;font:inherit;width:100%}
      .dav-app .row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
      .dav-app .headerbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    `}</style>
  </>
);

// Stable tz list for effects without triggering dependency warnings
const ACCOUNT_TZ_LIST = [
  'Australia/Sydney','Australia/Melbourne','Australia/Brisbane','Australia/Adelaide','Australia/Darwin','Australia/Perth',
  'Pacific/Auckland','Europe/London','Europe/Dublin',
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Phoenix','America/Anchorage','Pacific/Honolulu',
  'America/Toronto','America/Winnipeg','America/Edmonton','America/Vancouver','America/Halifax','America/St_Johns'
];

function Sidebar({ active, setActive }: any){
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'speak', label: 'Speak to a Vet', icon: '📞' },
    { key: 'benefits', label: 'Member Benefits', icon: '🎁' },
    { key: 'history', label: 'Consultation History', icon: '📜' },
    { key: 'account', label: 'Account', icon: '👤' },
  ];
  return (
    <aside className="sidebar">
      <div className="section" style={{paddingBottom:10}}>
        <div style={{fontWeight:600}}>Menu</div>
      </div>
      {items.map(it=> (
        <div key={it.key} className={`tab ${active===it.key? 'active':''}`} onClick={()=>setActive(it.key)}>
          <span>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </aside>
  );
}

function Header({ name }: any){
  return (
    <div className="headerbar">
      <div>
        <h1 className="h1">Welcome {name} 👋🏻</h1>
        <p className="h2">Unlimited plan — access a team of Global Vets in minutes.</p>
      </div>
      <div className="row">
        <span className="chip">⭐ 4.9/5 rating</span>
        <span className="chip">⏱️ Avg wait ~ 6 min</span>
        <span className="chip">🌍 Global Vet Team</span>
      </div>
    </div>
  );
}

function PageDashboard({ appts, isMember, tz }: any){
  const [apptsLocal, setApptsLocal] = useState<any[]>(() => Array.isArray(appts) ? appts : []);
  useEffect(()=>{ setApptsLocal(Array.isArray(appts) ? appts : []); }, [appts]);
  const upcoming = useMemo(()=> (apptsLocal||[])
    .filter((a:any)=> new Date(a.startTime) > new Date())
    .sort((a:any,b:any)=> new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0,3)
  ,[apptsLocal]);
  const fmtDay = (d: Date, z: string) => new Intl.DateTimeFormat(undefined,{ timeZone:z, weekday:'short', month:'short', day:'numeric'}).format(d);
  const fmtTime = (d: Date, z: string) => new Intl.DateTimeFormat(undefined,{ timeZone:z, hour:'numeric', minute:'2-digit'}).format(d);
  const [editAppt, setEditAppt] = useState<any | null>(null);
  const [nowTick, setNowTick] = useState<number>(() => Date.now());
  useEffect(()=>{ const id = setInterval(()=> setNowTick(Date.now()), 5000); return ()=> clearInterval(id); },[]);
  const formatStartsIn = (startISO: string) => {
    const diffMs = new Date(startISO).getTime() - nowTick;
    if (diffMs <= 0) return 'now';
    const totalMin = Math.max(0, Math.round(diffMs / 60000));
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins === 0) return '<1m';
    return `${mins}m`;
  };
  const [slots, setSlots] = useState<Array<{ iso:string; label:string; day:string }>>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const openEdit = async (appt: any) => {
    setEditAppt(appt); setSelectedIso(null); setActionMsg(null);
    try{
      setSlotsLoading(true);
      const data:any = await fetch('/api/calendly/next?count=3', { cache: 'no-store' }).then(r=> r.ok? r.json(): null).catch(()=>null);
      const now = new Date();
      const z = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const items: Array<{ iso:string; label:string; day:string }> = (data?.slots||[])
        .map((x:any)=> new Date(x.startTime))
        .filter((d:Date)=> d>now)
        .sort((a:Date,b:Date)=> a.getTime()-b.getTime())
        .slice(0,60)
        .map((d:Date)=> ({ iso: d.toISOString(), label: fmtTime(d, z as string), day: fmtDay(d, z as string) }));
      setSlots(items);
    } finally { setSlotsLoading(false); }
  };
  const doCancel = async () => {
    if (!editAppt?.manageToken) return;
    const ok = confirm('Cancel this consultation?'); if(!ok) return;
    try { setActionLoading(true); setActionMsg(null);
      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Cancelling…' } }));
      const res = await fetch('/api/manage', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ token: editAppt.manageToken, action:'cancel' }) });
      if(!res.ok){ const t = await res.text().catch(()=> 'Failed to cancel'); setActionMsg(t); return; }
      try { await fetch('/api/notify', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ appointmentId: editAppt.id, kind: 'cancel' }) }); } catch {}
      // Refresh from server to ensure we reflect canonical data
      try { const me = await fetch('/api/me').then(r=> r.ok? r.json(): null).catch(()=>null); if (Array.isArray(me?.user?.appointments)) setApptsLocal(me.user.appointments); } catch {}
      setEditAppt(null);
    } finally { setActionLoading(false); document.dispatchEvent(new CustomEvent('dav:loading-stop')); }
  };
  const doReschedule = async () => {
    if (!editAppt?.manageToken || !selectedIso) return;
    try { setActionLoading(true); setActionMsg(null);
      document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Saving changes…' } }));
      const res = await fetch('/api/manage', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ token: editAppt.manageToken, action:'reschedule', startTimeISO: selectedIso }) });
      if(!res.ok){ const t = await res.text().catch(()=> 'Failed to reschedule'); setActionMsg(t); return; }
      try { await fetch('/api/notify', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ appointmentId: editAppt.id, kind: 'reschedule' }) }); } catch {}
      // Refresh from server to ensure we reflect canonical data
      try { const me = await fetch('/api/me').then(r=> r.ok? r.json(): null).catch(()=>null); if (Array.isArray(me?.user?.appointments)) setApptsLocal(me.user.appointments); } catch {}
      setEditAppt(null);
    } finally { setActionLoading(false); document.dispatchEvent(new CustomEvent('dav:loading-stop')); }
  };
  return (
    <div className="grid grid-2">
      <div className="card section">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div style={{fontWeight:500,fontSize:18,marginBottom:6}}>Need help now?</div>
            <div style={{color:'var(--muted)',marginBottom:12}}>Book a video consultation — {isMember? 'unlimited members go to the front of the queue.' : 'join our unlimited plan for priority.'}</div>
          </div>
          <a className="btn" href="/book-a-vet-consultation">Book a call</a>
        </div>
      </div>

      <div className="card section">
        <div style={{fontWeight:500,fontSize:18,marginBottom:10}}>Your partner discounts</div>
        <div className="grid grid-2">
          {[{brand:'Mad Paws',offer:'$25 off pet sitting',href:'https://referral.madpaws.com.au/referral/'}].map((p)=> (
            <a key={p.brand} className="card section" style={{padding:12, textDecoration:'none', color:'inherit'}} href={p.href} target="_blank" rel="noreferrer">
              <div style={{fontWeight:600}}>{p.brand}</div>
              <div style={{color:'var(--muted)'}}>{p.offer}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="card section" style={{gridColumn:'1 / -1', overflowX:'auto'}}>
        <div style={{fontWeight:500,fontSize:18,marginBottom:10}}>Upcoming consultations</div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Vet</th><th>Topic</th><th style={{minWidth:120}}>Starts in</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((r:any)=> (
              <tr key={r.id}>
                <td>{tz ? `${fmtDay(new Date(r.startTime), tz)} • ${fmtTime(new Date(r.startTime), tz)}` : new Date(r.startTime).toLocaleString()}</td>
                <td>{r.vetName || '—'}</td>
                <td>{(r.concern || r.notes || '').slice(0, 90) || '—'}</td>
                <td><span className="time-badge">{formatStartsIn(r.startTime)}</span></td>
                <td>{r.status}</td>
                <td>
                  <div className="row">
                    {(() => { const ms = new Date(r.startTime).getTime() - nowTick; const joinEnabled = ms <= 5*60*1000; return joinEnabled ? (
                      <a className="btn-ghost" href={`/meet/${r.id}`}>Join</a>
                    ) : (
                      <span className="tooltip" data-tip="Join opens 5 minutes before start">
                        <span className="btn-ghost disabled">Join</span>
                      </span>
                    ); })()}
                    <button className="btn-ghost" onClick={()=> openEdit(r)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
            {upcoming.length===0 && (
              <tr><td colSpan={6} style={{color:'var(--muted)'}}>No upcoming consultations</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {editAppt && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div className="card" style={{ width:'min(720px, 96vw)', maxHeight:'90vh', overflow:'auto' }}>
            <div className="section" style={{borderBottom:'1px solid var(--line)'}}>
              <div className="row" style={{justifyContent:'space-between'}}>
                <div>
                  <div style={{fontWeight:600}}>Edit consultation</div>
                  <div style={{color:'var(--muted)', fontSize:13}}>Appointment: {new Date(editAppt.startTime).toLocaleString()} • {tz || ''}</div>
                </div>
                <button className="btn-ghost" onClick={()=> setEditAppt(null)}>Close</button>
              </div>
            </div>
            <div className="section">
              <div style={{fontWeight:500, marginBottom:8}}>Pick a new time</div>
              {slotsLoading && <div className="chip">Loading available times…</div>}
              {!slotsLoading && slots.length===0 && (
                <div style={{color:'var(--muted)', fontSize:14}}>No slots available in the next 7 days. Please try later.</div>
              )}
              {!slotsLoading && slots.length>0 && (
                <div style={{display:'grid', gridTemplateColumns:'1fr', gap:10}}>
                  {[...new Set(slots.map(s=> s.day))].map(day=> (
                    <div key={day} className="card section" style={{padding:12}}>
                      <div style={{fontSize:13, color:'var(--muted)', margin:'0 0 8px'}}>{day}</div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:10}}>
                        {slots.filter(s=> s.day===day).slice(0,12).map(s=> (
                          <button key={s.iso} className={`pill ${selectedIso===s.iso? 'selected':''}`} onClick={()=> setSelectedIso(s.iso)}>{s.label}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {actionMsg && <div style={{color:'#b91c1c', fontSize:13, marginTop:8}}>{actionMsg}</div>}
              <div className="row" style={{marginTop:12, justifyContent:'space-between'}}>
                <button className="btn-ghost" onClick={doCancel} disabled={actionLoading}>Cancel consultation</button>
                <button className="btn" onClick={doReschedule} disabled={actionLoading || !selectedIso}>Confirm reschedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageSpeakToVet({ isMember }: any){
  const [tz, setTz] = useState<string | null>(null);
  const [next, setNext] = useState<{ iso: string; label: string } | null>(null);
  const [confirm, setConfirm] = useState(false);
  useEffect(()=>{
    let cancelled=false;
    (async ()=>{
      try{
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const [meResp, adminResp] = await Promise.all([
          fetch('/api/me').then(r=> r.ok ? r.json() : null).catch(()=>null),
          fetch('/api/admin/settings?public=1').then(r=> r.ok ? r.json() : null).catch(()=>null),
        ]);
        const pick = (v?: string | null) => v && ACCOUNT_TZ_LIST.includes(v) ? v : null;
        const chosen = pick(meResp?.user?.timezone) || pick(adminResp?.defaultTimezone) || pick(localTz) || ACCOUNT_TZ_LIST[0];
        if (!cancelled) setTz(chosen);
        const data:any = await fetch('/api/calendly/next?count=3', { cache: 'no-store' }).then(r=> r.ok? r.json(): null).catch(()=>null);
        const now = new Date();
        const starts: Date[] = (data?.slots||[]).map((x:any)=> new Date(x.startTime)).filter((d: Date)=> d>now).sort((a:Date,b:Date)=> a.getTime()-b.getTime());
        const first = starts[0];
        if(first && !cancelled){
          const iso = first.toISOString();
          const label = new Intl.DateTimeFormat(undefined,{ timeZone: chosen, weekday:'short', hour:'numeric', minute:'2-digit'}).format(new Date(iso));
          setNext({ iso, label });
        }
      } catch {}
    })();
    return ()=>{cancelled=true};
  },[]);
  return (
    <div className="grid grid-2">
      <div className="card section">
        <div style={{fontWeight:500,fontSize:18,marginBottom:6}}>Book a consultation</div>
        <p style={{color:'var(--muted)'}}>{isMember? 'You have unlimited consults. Choose a time and we’ll connect you with a vet.' : 'Choose a time and complete checkout to connect with a vet.'}</p>
        <div className="row" style={{marginTop:12}}>
          <button className="btn" onClick={()=> setConfirm(true)}>Find next available</button>
          <a className="btn-ghost" href="/book-a-vet-consultation">Open scheduler</a>
        </div>
        {confirm && (
          <div className="card section" style={{marginTop:12}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:500}}>Next available: {next?.label || 'Loading…'}</div>
                <div style={{color:'var(--muted)'}}>We’ll hold this slot for a few minutes.</div>
              </div>
              <div className="row">
                {next ? (
                  <a className="btn" href={`/book-a-vet-consultation`}>Book this</a>
                ) : (
                  <button className="btn" disabled>Loading…</button>
                )}
                <button className="btn-ghost" onClick={()=> setConfirm(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card section">
        <div style={{fontWeight:500,fontSize:18,marginBottom:6}}>What you’ll need</div>
        <ul style={{marginTop:6}}>
          <li>Good lighting and your pet nearby</li>
          <li>Any recent photos or videos</li>
          <li>Medication or product names (if any)</li>
        </ul>
      </div>
    </div>
  );
}

function PageBenefits(){
  const partnerDeals = [
    { brand: 'Mad Paws', offer: '$25 off pet sitting', href: 'https://referral.madpaws.com.au/referral/' },
    { brand: 'Ancestry Pets', offer: '20% off DNA kits', href: '#' },
  ];
  return (
    <div className="grid grid-3">
      {partnerDeals.map((p)=> (
        <a key={p.brand} className="card section" href={p.href} target="_blank" rel="noreferrer">
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:600, fontSize:18}}>{p.brand}</div>
              <div style={{color:'var(--muted)', marginTop:4}}>{p.offer}</div>
            </div>
          </div>
          <div className="row" style={{marginTop:10}}>
            <button className="btn">Redeem</button>
          </div>
        </a>
      ))}
    </div>
  );
}

function PageHistory({ appts }: any){
  const [tz, setTz] = useState<string | null>(null);
  useEffect(()=>{ (async ()=>{ try{ const [me, admin] = await Promise.all([
    fetch('/api/me').then(r=> r.ok? r.json(): null).catch(()=>null),
    fetch('/api/admin/settings?public=1').then(r=> r.ok? r.json(): null).catch(()=>null),
  ]); const list = [me?.user?.timezone, admin?.defaultTimezone, Intl.DateTimeFormat().resolvedOptions().timeZone].filter(Boolean) as string[]; setTz(list[0]||null);} catch{} })(); },[]);
  const fmtDay = (d: Date, z: string) => new Intl.DateTimeFormat(undefined,{ timeZone:z, weekday:'short', month:'short', day:'numeric'}).format(d);
  const fmtTime = (d: Date, z: string) => new Intl.DateTimeFormat(undefined,{ timeZone:z, hour:'numeric', minute:'2-digit'}).format(d);
  const past = useMemo(()=> (appts||[]).filter((a:any)=> new Date(a.startTime) < new Date()),[appts]);
  return (
    <div className="card section">
      <div style={{fontWeight:500,fontSize:18,marginBottom:10}}>Consultation history</div>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Pet</th><th>Topic</th><th>Notes</th><th>Vet</th><th>Status</th><th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {past.map((r:any)=> (
            <tr key={r.id}>
              <td>{tz ? `${fmtDay(new Date(r.startTime), tz)} • ${fmtTime(new Date(r.startTime), tz)}` : new Date(r.startTime).toLocaleString()}</td>
              <td>{r.petName || '—'}</td>
              <td>{(r.concern || '').slice(0, 90) || '—'}</td>
              <td>{(r.notes || '').slice(0, 90) || '—'}</td>
              <td>{r.vetName || '—'}</td>
              <td>{r.status || '—'}</td>
              <td>{r.outcome || '—'}</td>
            </tr>
          ))}
          {past.length===0 && (
            <tr><td colSpan={6} style={{color:'var(--muted)'}}>No past consultations</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PageAccount({ profile }: any){
  const [state, setState] = useState({ email: profile?.email || '', phone: profile?.phone || '', petName: profile?.petName || '' });
  const onChange = (k:any,v:any)=> setState(p=>({...p,[k]:v}));
  const m = profile?.membership || null;
  const mi = profile?.membershipInfo || null; // live stripe info
  const status = (m?.status || '').toUpperCase();
  const isActive = status === 'ACTIVE';
  const expires = (mi?.currentPeriodEnd ? new Date(mi.currentPeriodEnd) : (m?.expiresAt ? new Date(m.expiresAt) : null));
  const fmt = (d: Date) => new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' }).format(d);
  return (
    <div className="grid grid-2">
      <div className="card section">
        <div style={{fontWeight:500,fontSize:18,marginBottom:10}}>Subscription</div>
        <div className="row" style={{marginBottom:8}}>
          <span className="chip">Plan: {m ? (mi?.productName || (m?.stripeSubId ? 'Unlimited' : 'Free access')) : 'None'}</span>
          <span className="chip">Status: {m ? (mi?.status?.toUpperCase?.() || (isActive ? 'ACTIVE' : (status || '—'))) : '—'}</span>
          {mi?.priceId && <span className="chip">Price: {new Intl.NumberFormat(undefined,{ style:'currency', currency: (mi.currency||'AUD')}).format((mi.unitAmount||0)/100)}{mi.interval ? ` / ${mi.interval}${mi.intervalCount>1?` x${mi.intervalCount}`:''}` : ''}</span>}
          {mi?.monthlyAmount != null && <span className="chip">~ {new Intl.NumberFormat(undefined,{ style:'currency', currency: (mi.currency||'AUD')}).format((mi.monthlyAmount||0)/100)}/mo</span>}
          {m && expires && (
            <span className="chip">{isActive ? 'Renews' : 'Ends'}: {fmt(expires)}</span>
          )}
        </div>
        {m && !expires && (
          <div style={{color:'var(--muted)', fontSize:14, marginBottom:8}}>Your plan will renew automatically until cancelled.</div>
        )}
        <div className="row">
          {m && (
            <>
              <button className="btn" onClick={async ()=>{ document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Opening billing…' } })); const d = await fetch('/api/stripe/portal').then(r=>r.json()); if(d.url) window.location.href=d.url; document.dispatchEvent(new CustomEvent('dav:loading-stop')); }}>Manage billing</button>
              <button className="btn-ghost" onClick={async ()=>{ document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Opening billing…' } })); const d = await fetch('/api/stripe/portal').then(r=>r.json()); if(d.url) window.location.href=d.url; document.dispatchEvent(new CustomEvent('dav:loading-stop')); }}>Cancel plan</button>
            </>
          )}
          {!m && (
            <a className="btn" href="/book-a-vet-consultation">Book a consult</a>
          )}
          <button className="btn-ghost" onClick={async ()=>{
            document.dispatchEvent(new CustomEvent('dav:loading-start', { detail: { message: 'Signing out…' } }));
            const { createSupabaseBrowser } = await import("@/lib/supabase.client");
            const supabase = createSupabaseBrowser();
            await supabase.auth.signOut();
            await fetch('/auth/session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ access_token:'', refresh_token:'' })}).catch(()=>{});
            window.location.href='/login';
            document.dispatchEvent(new CustomEvent('dav:loading-stop'));
          }}>Log out</button>
        </div>
      </div>

      <div className="card section">
        <div style={{fontWeight:500,fontSize:18,marginBottom:10}}>Profile</div>
        <div className="grid" style={{ gridTemplateColumns:'1fr', gap:16 }}>
          <div>
            <label>Email</label>
            <input className="input" value={state.email} onChange={e=>onChange('email', e.target.value)} />
          </div>
          <div>
            <label>Phone</label>
            <PhoneInput value={state.phone} onChange={(v)=> onChange('phone', v)} />
          </div>
          {false && (
            <div>
              <label>Primary pet</label>
              <input className="input" value={state.petName} onChange={e=>onChange('petName', e.target.value)} />
            </div>
          )}
        </div>
        <div className="row" style={{marginTop:12}}>
          <button className="btn" onClick={()=>alert('Profile save not yet implemented')}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default function MemberDashboard(){
  const [active, setActive] = useState('dashboard');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tz, setTz] = useState<string | null>(null);
  useEffect(()=>{
    (async ()=>{
      try{
        const [me, admin] = await Promise.all([
          fetch('/api/me').then(r=> r.ok ? r.json() : null).catch(()=>null),
          fetch('/api/admin/settings?public=1').then(r=> r.ok ? r.json() : null).catch(()=>null),
        ]);
        if(!me?.user){ window.location.href='/login'; return; }
        if (me?.user?.role) {
          const role = String(me.user.role).toUpperCase();
          if (role === 'ADMIN') { window.location.href = '/admin'; return; }
          if (role === 'VET') { window.location.href = '/vet'; return; }
        }
        setProfile(me.user); setLoading(false);
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const pick = (v?: string | null) => v && ACCOUNT_TZ_LIST.includes(v) ? v : null;
        const chosen = pick(me?.user?.timezone) || pick(admin?.defaultTimezone) || pick(localTz) || ACCOUNT_TZ_LIST[0];
        setTz(chosen);
      } catch { setLoading(false); const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone; setTz(ACCOUNT_TZ_LIST.includes(localTz)? localTz: ACCOUNT_TZ_LIST[0]); }
    })();
  },[]);
  const name = profile?.firstName || profile?.phone || profile?.email || 'Member';
  const isMember = !!profile?.membership;

  return (
    <main className="dav-app">
      <GlobalStyles />
      <div className="container">
        <Header name={name} />
        {loading && (
          <div className="card section surface" style={{ minHeight: 480 }}>
            <div style={{display:'grid',gap:12}}>
              <div style={{height:24, width:'40%', background:'rgba(0,0,0,.06)', borderRadius:8}}></div>
              <div style={{height:120, background:'rgba(0,0,0,.04)', borderRadius:12}}></div>
              <div style={{height:180, background:'rgba(0,0,0,.04)', borderRadius:12}}></div>
              <div style={{height:60, background:'rgba(0,0,0,.04)', borderRadius:12}}></div>
            </div>
          </div>
        )}
        {!loading && (
          <div className="layout">
            <Sidebar active={active} setActive={setActive} />
            <div style={{display:'grid',gap:16}}>
              {active==='dashboard' && <PageDashboard appts={profile?.appointments} isMember={isMember} tz={tz} />}
              {active==='speak' && <PageSpeakToVet isMember={isMember} />}
              {active==='benefits' && <PageBenefits />}
              {active==='history' && <PageHistory appts={profile?.appointments} />}
              {active==='account' && <PageAccount profile={profile} />}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

