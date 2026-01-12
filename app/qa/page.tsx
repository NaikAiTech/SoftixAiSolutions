export const metadata = {
  title: "Q&A | Dial A Vet",
  description: "Browse common pet questions answered by our clinical team.",
  alternates: { canonical: "/vet-answer" },
};

export default async function QAListPage() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/qa/list`, { cache: 'no-store' }).catch(() => null);
  const data = res && res.ok ? await res.json() : { items: [] };
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <main className="dav-app" style={{ background: "#F5FAF8" }}>
      <div className="container" style={{ padding: "28px 0 32px" }}>
        <header className="card" style={{ padding: 20, borderRadius: 20, marginBottom: 16 }}>
          <div className="h1" style={{ marginBottom: 6, fontWeight: 600, fontSize: "clamp(24px,4vw,36px)" }}>Q&amp;A Library</div>
          <div className="lead" style={{ color: "#4B5563", fontWeight: 400 }}>Vet‑written answers to common questions</div>
        </header>
        <section className="card" style={{ padding: 16, borderRadius: 20 }}>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {items.map((q: any) => (
              <a key={q.id} href={`/qa/${encodeURIComponent(q.slug || q.id)}`} className="no-underline">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm hover:shadow transition-shadow" style={{ height: '100%' }}>
                  <div style={{ fontWeight: 600, color: '#0B1220', marginBottom: 6 }}>{q.question}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(q.tags || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="chip" style={{ padding: '4px 8px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
            {items.length === 0 && (
              <div style={{ color: '#6B7280' }}>No items yet.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

