"use client";
import React, { useEffect, useState } from "react";

export default function LoadingToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("Processing…");
  const [count, setCount] = useState(0);
  useEffect(() => {
    function onStart(e: Event) {
      const detail = (e as CustomEvent).detail || {};
      setMessage(detail.message || "Processing…");
      setCount((c) => c + 1);
      setVisible(true);
    }
    function onStop() {
      setCount((c) => {
        const next = Math.max(0, c - 1);
        if (next === 0) setVisible(false);
        return next;
      });
    }
    document.addEventListener("dav:loading-start", onStart as any);
    document.addEventListener("dav:loading-stop", onStop as any);
    return () => {
      document.removeEventListener("dav:loading-start", onStart as any);
      document.removeEventListener("dav:loading-stop", onStop as any);
    };
  }, []);
  if (!visible) return null;
  return (
    <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", top: 16, right: 16, zIndex: 9999 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: "linear-gradient(135deg, #F1FBF6 0%, #F9FEFB 100%)", border: "1px solid rgba(0,0,0,.08)", boxShadow: "0 6px 18px rgba(16,24,40,.08)" }}>
        <Spinner />
        <div style={{ fontSize: 14, color: "#0F172A" }}>{message}</div>
      </div>
    </div>
  );
}

function Spinner(){
  return (
    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(23,143,122,.25)", borderTopColor: "#178F7A", animation: "dav-spin 0.8s linear infinite" }}>
      <style>{`@keyframes dav-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

