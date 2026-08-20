const STORAGE_KEY = "nuvola:vibration";

/** Legge la preferenza utente sulla vibrazione (attiva per impostazione predefinita). */
export function isVibrationEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) !== "off";
}

/** Salva la preferenza utente sulla vibrazione. */
export function setVibrationEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
}

/** Vibra il dispositivo, se supportato e se la preferenza è attiva. */
export function vibrate(pattern: number | number[]) {
  if (typeof window === "undefined") return;
  if (!isVibrationEnabled()) return;
  if (typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}
