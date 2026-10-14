const STORAGE_KEY = "nuvola:night";

/** Legge la preferenza modalità notte (giorno per impostazione predefinita). */
export function isNightMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

/** Applica la classe della modalità notte al documento. */
export function applyNightMode(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("night", enabled);
}

/** Salva e applica la preferenza modalità notte. */
export function setNightMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage non disponibile */
  }
  applyNightMode(enabled);
}
