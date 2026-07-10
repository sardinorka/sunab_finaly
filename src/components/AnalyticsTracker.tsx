"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function getOrCreateSessionId() {
  if (typeof window === "undefined") return "";
  const key = "sunab_session_id";
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id =
      "s_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10);
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Skip admin pages
    if (pathname.startsWith("/admin")) return;
    // Skip API
    if (pathname.startsWith("/api")) return;

    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    const referrer = document.referrer || null;

    // Fire and forget
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer,
        userAgent: navigator.userAgent,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
