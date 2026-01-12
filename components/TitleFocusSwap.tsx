"use client";
import { useEffect, useRef } from "react";

const HIDDEN_TITLE = "👋 Your Pet Needs You 🐶";

export default function TitleFocusSwap() {
  const lastVisibleTitleRef = useRef<string>("");
  useEffect(() => {
    // Initialize
    lastVisibleTitleRef.current = document.title || lastVisibleTitleRef.current;

    // Track title changes (route changes or head updates)
    const observer = new MutationObserver(() => {
      if (document.visibilityState === "visible") {
        lastVisibleTitleRef.current = document.title || lastVisibleTitleRef.current;
      }
    });
    const titleEl = document.querySelector("head > title");
    if (titleEl) observer.observe(titleEl, { childList: true });

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        document.title = HIDDEN_TITLE;
      } else {
        document.title = lastVisibleTitleRef.current || document.title;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Also handle window focus for some browsers
    const onFocus = () => {
      document.title = lastVisibleTitleRef.current || document.title;
    };
    window.addEventListener("focus", onFocus);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return null;
}

