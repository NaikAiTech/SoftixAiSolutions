import NextBookingBar from "@/components/NextBookingBar";
import AskAVetSearch from "@/components/AskAVetSearch";

export const metadata = {
  title: "Vet Answers – Internal DB | Dial A Vet",
  description:
    "Practical answers to the internet’s most‑Googled pet questions. Written and reviewed by our veterinary team.",
};

export default async function AskAVetInternalListPage() {
  const base = process.env.NEXTAUTH_URL || "";
  const res = await fetch(`${base}/api/ask-a-vet/internal/list?limit=3`, { cache: "no-store" }).catch(() => null);
  const data = res && res.ok ? await res.json() : { items: [] };
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 28 }}>
      <header className="card surface" style={{ padding: 20, borderRadius: 20, marginBottom: 16 }}>
        <div className="h1" style={{ marginBottom: 6 }}>Vet Answers (Internal)</div>
        <div className="lead">Practical answers to the internet’s most‑Googled pet questions. Written and reviewed by our veterinary team.</div>
      </header>

      <AskAVetSearch defaultItems={items} linkPrefix="/ask-a-vet-internal" />

      <NextBookingBar />
    </main>
  );
}
