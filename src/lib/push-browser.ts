const KEY = "angyhealth:notifications";
const ASKED = "angyhealth:notifications-choice";

export function readPushPreference() {
  try { return localStorage.getItem(KEY) !== "off"; } catch { return true; }
}
export function writePushPreference(enabled: boolean) {
  try { localStorage.setItem(KEY, enabled ? "on" : "off"); return true; } catch { return false; }
}
export function hasPushChoice() {
  try { return localStorage.getItem(ASKED) === "yes"; } catch { return false; }
}
export function savePushChoice() {
  try { localStorage.setItem(ASKED, "yes"); } catch { /* App remains usable without storage. */ }
}
export function pushSupport(): "supported" | "home-screen" | "new-tab" | "unsupported" {
  if (window.top !== window.self) return "new-tab";
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
  if (ios && !standalone) return "home-screen";
  if (!window.isSecureContext || !("Notification" in window) || !("PushManager" in window) || !("serviceWorker" in navigator)) return "unsupported";
  return "supported";
}
export async function pushRegistration() {
  return navigator.serviceWorker.register("/angyhealth-push-sw.js", { scope: "/" });
}
export async function waitPushWorker(registration: ServiceWorkerRegistration) {
  if (registration.active) return;
  const worker = registration.installing ?? registration.waiting;
  if (!worker) throw new Error("Registrazione push non disponibile");
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error("Registrazione push non disponibile")); }, 10000);
    const cleanup = () => { window.clearTimeout(timeout); worker.removeEventListener("statechange", change); };
    const change = () => {
      if (worker.state === "activated") { cleanup(); resolve(); }
      if (worker.state === "redundant") { cleanup(); reject(new Error("Registrazione push non disponibile")); }
    };
    worker.addEventListener("statechange", change);
    change();
  });
}
export async function setWorkerPushPreference(registration: ServiceWorkerRegistration, enabled: boolean) {
  await waitPushWorker(registration);
  const worker = registration.active;
  if (!worker) throw new Error("Registrazione push non disponibile");
  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => { channel.port1.close(); reject(new Error("Preferenza push non confermata")); }, 4000);
    channel.port1.onmessage = () => { window.clearTimeout(timeout); channel.port1.close(); resolve(); };
    worker.postMessage({ type: "angyhealth-push-preference", enabled }, [channel.port2]);
  });
}
export function publicPushKey(key: string) {
  const binary = atob(key.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}