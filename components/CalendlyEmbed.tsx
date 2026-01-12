"use client";
import React from "react";
import Script from "next/script";

export default function CalendlyEmbed({ url, height = 1200, className }: { url: string; height?: number | string; className?: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = React.useState<boolean>(false);

  // Script loading is handled by Next <Script> below

  // If the Calendly script was already loaded elsewhere in the app,
  // Next.js won't fire onLoad again for subsequent mounts. Detect it.
  React.useEffect(() => {
    const win: any = typeof window !== 'undefined' ? (window as any) : null;
    if (win?.Calendly && typeof win.Calendly.initInlineWidget === 'function') {
      setScriptReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!scriptReady || !containerRef.current) return;
    try {
      const Calendly = (window as any).Calendly;
      // If Calendly previously injected an iframe, clear it first
      const container = containerRef.current;
      if (container) {
        const iframes = Array.from(container.querySelectorAll('iframe'));
        iframes.forEach((f) => f.remove());
        container.innerHTML = "";
      }
      if (Calendly && typeof Calendly.initInlineWidget === "function") {
        // Defer a tick to ensure container is in DOM
        setTimeout(() => {
          try { Calendly.initInlineWidget({ url, parentElement: containerRef.current! }); } catch {}
        }, 0);
      }
    } catch {}
  }, [scriptReady, url]);

  const computedHeight = typeof height === "number" ? `${height}px` : String(height);

  return (
    <div className={className} style={{ width: "100%" }}>
      <div
        key={String(scriptReady) + ':' + url}
        ref={containerRef}
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: 320, width: "100%", height: computedHeight }}
      />
      {!scriptReady && (
        <div style={{ padding: 12, fontSize: 14 }}>Loading scheduler…</div>
      )}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
        async
      />
    </div>
  );
}
