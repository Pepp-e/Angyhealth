import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

const GA_ID = "G-CL70WKEY64";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Il Google tag (gtag.js) è caricato una sola volta nell'<head> globale
 * (src/routes/__root.tsx). Qui si notifica solo il cambio schermata della PWA.
 */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    if (first.current) {
      // Il page_view iniziale è già inviato da gtag('config', ...).
      first.current = false;
      return;
    }
    window.gtag("config", GA_ID, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
