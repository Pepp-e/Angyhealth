const STORAGE_KEY = "nuvola:vibration";
const HAPTICS_KEY = "nuvola:haptics";

let lastVibration = 0;

/** Legge la preferenza utente sulla vibrazione (attiva per impostazione predefinita). */
export function isVibrationEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Salva la preferenza utente sulla vibrazione. */
export function setVibrationEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage non disponibile */
  }
}

/** Legge la preferenza sul feedback tattile generale (attivo per impostazione predefinita). */
export function isHapticsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(HAPTICS_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Salva la preferenza sul feedback tattile generale. */
export function setHapticsEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HAPTICS_KEY, enabled ? "on" : "off");
  } catch {
    /* storage non disponibile */
  }
}

/** Vibra il dispositivo, se supportato e se la preferenza è attiva. */
export function vibrate(pattern: number | number[]) {
  if (typeof window === "undefined") return;
  if (!isVibrationEnabled()) return;
  if (typeof navigator.vibrate !== "function") return;
  lastVibration = Date.now();
  try {
    navigator.vibrate(pattern);
  } catch {
    /* non supportato */
  }
}

/**
 * Feedback tattile generale, breve e leggero.
 * Non si somma alle vibrazioni specifiche già presenti (finestra di 200 ms).
 */
export function haptic() {
  if (typeof window === "undefined") return;
  if (!isHapticsEnabled()) return;
  if (Date.now() - lastVibration < 200) return;
  vibrate(10);
}
