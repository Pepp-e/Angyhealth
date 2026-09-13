import { useSyncExternalStore } from "react";

/** Preferenze cookie salvate localmente e collegate a Google Consent Mode v2. */
export type Consent = { analytics: boolean; ads: boolean };

export const CONSENT_KEY = "nuvola:consent";

const listeners = new Set<() => void>();
const openListeners = new Set<() => void>();

function read(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Consent>;
    if (typeof v?.analytics !== "boolean" || typeof v?.ads !== "boolean") return null;
    return { analytics: v.analytics, ads: v.ads };
  } catch {
    return null;
  }
}

let current: Consent | null = read();

export function getConsent(): Consent | null {
  return current;
}

/** Comunica la scelta ai Google tag già presenti (gtag.js / GTM). */
export function applyConsent(c: Consent) {
  if (typeof window === "undefined") return;
  const g = window.gtag;
  if (typeof g !== "function") return;
  g("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.ads ? "granted" : "denied",
    ad_user_data: c.ads ? "granted" : "denied",
    ad_personalization: c.ads ? "granted" : "denied",
  });
}

export function setConsent(c: Consent) {
  current = c;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* archiviazione non disponibile */
  }
  applyConsent(c);
  listeners.forEach((l) => l());
}

/** Riapre il pannello "Impostazioni privacy" dalle Impostazioni. */
export function openPrivacySettings() {
  openListeners.forEach((l) => l());
}

export function onOpenPrivacySettings(cb: () => void) {
  openListeners.add(cb);
  return () => {
    openListeners.delete(cb);
  };
}

export function useConsent(): Consent | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => current,
    () => null,
  );
}
