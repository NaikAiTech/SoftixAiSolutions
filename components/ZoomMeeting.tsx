"use client";
import { useEffect, useRef } from "react";


type ZoomClientFactory = {
  createClient: () => any;
};

type Props = {
  meetingNumber: string;
  role: 0 | 1;
  userName: string;
  userEmail?: string;
  passcode?: string;
  appointmentId?: string;
};

export default function ZoomMeeting({
  meetingNumber,
  role,
  userName,
  userEmail,
  passcode,
  appointmentId,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    let client: any;

    (async () => {
      try {
        const mod = await import("@zoom/meetingsdk/embedded").catch(() =>
          import("@zoom/meetingsdk")
        );

        const ZoomEmbedded = mod?.default as ZoomClientFactory;
        if (!ZoomEmbedded?.createClient) {
          console.error("Zoom SDK did not expose createClient");
          return;
        }

        client = ZoomEmbedded.createClient();
        clientRef.current = client;

        await client.init({
          debug: false,
          zoomAppRoot: containerRef.current!,
          language: "en-US",
          customize: {
            video: {
              isResizable: true,
              hideGalleryView: false,
              viewSizes: {
                default: { width: 1000, height: 600 },
                speaker: { width: 1000, height: 600 },
                gallery: { width: 1000, height: 600 },
              },
              defaultViewType: "gallery" as any,
              popper: { disableDraggable: true },
            },
          } as any,
        });

        const sigRes = await fetch(
          `/api/zoom/signature?mn=${encodeURIComponent(meetingNumber)}&role=${role}`
        );
        const { signature, key } = await sigRes.json();
        if (!signature || !key) return;

        let zak: string | undefined;
        if (role === 1 && appointmentId) {
          try {
            const z = await fetch(
              `/api/zoom/zak?appointmentId=${encodeURIComponent(appointmentId)}`
            ).then((r) => r.json());
            zak = z?.zak;
          } catch {}
        }

        await client.join({
          sdkKey: key,
          signature,
          meetingNumber,
          password: passcode || "",
          userName,
          userEmail,
          zak,
        });

        // Initial fit after connect
        client.on("connection-change", (payload: any) => {
          if (payload?.state === "Connected") {
            setTimeout(() => {
              const el = containerRef.current!;
              const { width, height } = el.getBoundingClientRect();
              client.updateVideoOptions({
                viewSizes: { default: { width: Math.floor(width), height: Math.floor(height) } },
              });
            }, 600);
          }
        });
      } catch (e) {
        console.error("Zoom SDK error:", e);
      }
    })();

    return () => {
      try {
        clientRef.current?.leaveMeeting?.();
      } catch {}
      clientRef.current = null;
    };
  }, [meetingNumber, role, userName, userEmail, passcode, appointmentId]);

  // Keep Zoom sized to parent using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (!clientRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        try {
          clientRef.current.updateVideoOptions({
            viewSizes: { default: { width: Math.floor(rect.width), height: Math.floor(rect.height) } },
          });
        } catch {}
      });
    });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: 12 }}
    />
  );
}
