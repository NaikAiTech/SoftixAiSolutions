export const dynamic = 'force-dynamic';

export default async function QADetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/qa/${encodeURIComponent(params.id)}`, { cache: 'no-store' }).catch(() => null);
  if (!res || !res.ok) {
    return (
      <main className="dav-app" style={{ background: "#F5FAF8" }}>
        <div className="container" style={{ padding: "28px 0 32px" }}>
          <div className="card" style={{ padding: 20, borderRadius: 20 }}>
            <div style={{ color: '#6B7280' }}>Not found.</div>
          </div>
        </div>
      </main>
    );
  }
  const { item } = await res.json();
  return (
    <main className="dav-app" style={{ background: "#F5FAF8" }}>
      <div className="container" style={{ padding: "28px 0 32px" }}>
        <header className="card" style={{ padding: 20, borderRadius: 20, marginBottom: 16 }}>
          <div className="h1" style={{ marginBottom: 6, fontWeight: 600, fontSize: "clamp(22px,3.6vw,32px)" }}>{item.question}</div>
          <div className="lead" style={{ color: "#4B5563", fontWeight: 400 }}>Vet‑written answer</div>
        </header>
        <section className="card" style={{ padding: 20, borderRadius: 20 }}>
          <article style={{ color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{item.answer}</article>
          {(item.tags || []).length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(item.tags || []).map((t: string) => (
                <span key={t} className="chip" style={{ padding: '4px 8px' }}>{t}</span>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

