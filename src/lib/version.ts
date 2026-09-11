import { useEffect, useState } from "react";

/**
 * Sistema di versioni dell'app.
 * - "2202": versione principale
 * - "0000": seconda versione, modificabile in modo indipendente
 * Per differenziare in futuro una schermata, usare useAppVersion() e
 * renderizzare il contenuto specifico della versione.
 */
export type AppVersion = "2202" | "0000";

/** Solo i PIN non protetti restano nel client: il 2202 è verificato dal server. */
export const PIN_TO_VERSION: Record<string, AppVersion> = {
  "0000": "0000",
};

const KEY = "app-version";
/** Ultima versione autenticata, ricordata sul dispositivo. */
const LAST_KEY = "nuvola:last-version";

export function getAppVersion(): AppVersion | null {
  if (typeof window === "undefined") return null;
  const v = window.sessionStorage.getItem(KEY);
  return v === "2202" || v === "0000" ? v : null;
}

/** Versione memorizzata in modo persistente sul dispositivo. */
export function getLastAppVersion(): AppVersion | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LAST_KEY);
    return v === "2202" || v === "0000" ? v : null;
  } catch {
    return null;
  }
}

export function setAppVersion(v: AppVersion) {
  window.sessionStorage.setItem(KEY, v);
  try {
    window.localStorage.setItem(LAST_KEY, v);
  } catch {
    /* storage non disponibile */
  }
}

/** Esce dalla versione corrente e torna alla schermata PIN iniziale. */
export function clearAppVersion() {
  const wasV2202 = getAppVersion() === "2202";
  window.sessionStorage.removeItem(KEY);
  try {
    window.localStorage.removeItem(LAST_KEY);
  } catch {
    /* storage non disponibile */
  }
  const go = () => {
    window.location.href = "/";
  };
  if (wasV2202) {
    void import("./access.functions")
      .then((m) => m.endSession2202())
      .finally(go);
  } else {
    go();
  }
}

/** Versione attualmente sbloccata (null durante SSR / prima del PIN). */
export function useAppVersion(): AppVersion | null {
  const [version, setVersion] = useState<AppVersion | null>(null);
  useEffect(() => {
    setVersion(getAppVersion());
  }, []);
  return version;
}
