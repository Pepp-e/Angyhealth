import { useEffect, useState } from "react";

/**
 * Sistema di versioni dell'app.
 * - "2202": versione principale
 * - "0000": seconda versione, modificabile in modo indipendente
 * Per differenziare in futuro una schermata, usare useAppVersion() e
 * renderizzare il contenuto specifico della versione.
 */
export type AppVersion = "2202" | "0000";

export const PIN_TO_VERSION: Record<string, AppVersion> = {
  "2202": "2202",
  "0000": "0000",
};

const KEY = "app-version";

export function getAppVersion(): AppVersion | null {
  if (typeof window === "undefined") return null;
  const v = window.sessionStorage.getItem(KEY);
  return v === "2202" || v === "0000" ? v : null;
}

export function setAppVersion(v: AppVersion) {
  window.sessionStorage.setItem(KEY, v);
}

/** Esce dalla versione corrente e torna alla schermata PIN iniziale. */
export function clearAppVersion() {
  window.sessionStorage.removeItem(KEY);
  window.location.href = "/";
}

/** Versione attualmente sbloccata (null durante SSR / prima del PIN). */
export function useAppVersion(): AppVersion | null {
  const [version, setVersion] = useState<AppVersion | null>(null);
  useEffect(() => {
    setVersion(getAppVersion());
  }, []);
  return version;
}
