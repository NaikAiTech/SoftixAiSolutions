"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    // Ensure gtag exists and id is configured
    if (!id || typeof window === "undefined" || !(window as any).gtag) return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname || "/";

    (window as any).gtag("config", id, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}
