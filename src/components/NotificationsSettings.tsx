import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { GlassPanel } from "./GlassPanel";
import { Button } from "./ui/button";
import { pushConfiguration, updatePushDevice } from "@/lib/push.functions";
import { readPushPreference, writePushPreference, hasPushChoice, savePushChoice, pushSupport, pushRegistration, waitPushWorker, setWorkerPushPreference, publicPushKey } from "@/lib/push-browser";

export function NotificationsSettings() {
  const [enabled, setEnabled] = useState(true);
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const config = useServerFn(pushConfiguration);
  const update = useServerFn(updatePushDevice);
  const key = useRef("");
  const configured = useRef(false);
  const choiceThisVisit = useRef(false);
  const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const supportMessage = (support: ReturnType<typeof pushSupport>) => {
    if (support === "home-screen") return "Su iPhone serve iOS 16.4 o successivo: apri AngyHealth in Safari, scegli Condividi → Aggiungi alla schermata Home e attiva le notifiche dall’app installata.";
    if (support === "new-tab") return "Per attivare le notifiche, apri AngyHealth in una scheda separata o usa l’app pubblicata.";
    if (support === "unsupported") return "Questo dispositivo o browser non supporta le notifiche push.";
    return "";
  };

  const register = useCallback(async () => {
    const registration = await pushRegistration();
    await waitPushWorker(registration);
    let subscription = await registration.pushManager.getSubscription();
    if (subscription?.expirationTime && subscription.expirationTime <= Date.now()) {
      await subscription.unsubscribe(); subscription = null;
    }
    subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicPushKey(key.current) });
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.['p256dh'] || !json.keys['auth']) throw new Error("Registrazione push non disponibile");
    await update({ data: { enabled: true, timezone: timezone(), subscription: {
      endpoint: json.endpoint, expirationTime: subscription.expirationTime,
      keys: { p256dh: json.keys['p256dh'], auth: json.keys['auth'] },
    } } });
    await setWorkerPushPreference(registration, true);
    setMessage("Promemoria attivo alle 16:00 locali. L’orario di consegna dipende dal dispositivo e dalla connessione.");
  }, [update]);

  useEffect(() => {
    let mounted = true;
    const inspect = async () => {
      const preference = readPushPreference();
      if (!mounted) return;
      setEnabled(preference);
      try {
        const result = await config();
        configured.current = result.configured;
        key.current = result.publicKey;
        if (!mounted) return;
        const support = pushSupport();
        if (support !== "supported") { setMessage(supportMessage(support)); return; }
        if (!result.configured) { setMessage("Il servizio notifiche non è ancora configurato."); return; }
        if (!preference || Notification.permission === "denied") {
          const existing = await navigator.serviceWorker.getRegistration("/angyhealth-push-sw.js");
          if (existing) await setWorkerPushPreference(existing, false);
          await update({ data: { enabled: false, timezone: timezone() } });
          if (Notification.permission === "denied") {
            savePushChoice(); setAsk(false);
            setMessage("Il permesso notifiche è negato o revocato. Puoi riabilitarlo nelle impostazioni del dispositivo o del browser.");
          }
          return;
        }
        if (Notification.permission === "granted") {
          const existing = await navigator.serviceWorker.getRegistration("/angyhealth-push-sw.js");
          const subscription = await existing?.pushManager.getSubscription();
          if (subscription) await register();
          else { setAsk(true); setMessage("Il permesso è concesso: conferma per registrare nuovamente questo dispositivo."); }
        } else if (!hasPushChoice() && !choiceThisVisit.current) setAsk(true);
      } catch (error) { if (mounted) setMessage(error instanceof Error ? error.message : "Impossibile verificare le notifiche. Riprova quando sei online."); }
    };
    void inspect();
    const onVisible = () => { if (document.visibilityState === "visible") void inspect(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", inspect);
    return () => { mounted = false; document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("online", inspect); };
  }, [config, update, register]);

  const activate = async () => {
    const support = pushSupport();
    if (support !== "supported") { setMessage(supportMessage(support)); return; }
    if (!configured.current) { setMessage("Il servizio notifiche non è ancora configurato."); return; }
    setBusy(true);
    choiceThisVisit.current = true; savePushChoice(); setAsk(false);
    // Call before any await: Safari requires the original button's user gesture.
    const permission = Notification.permission === "default" ? Notification.requestPermission() : Promise.resolve(Notification.permission);
    try {
      if (await permission !== "granted") {
        await update({ data: { enabled: false, timezone: timezone() } });
        setMessage("Notifiche non autorizzate. AngyHealth continua a funzionare normalmente.");
        return;
      }
      await register();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Attivazione non riuscita. Riprova."); }
    finally { setBusy(false); }
  };

  const toggle = async () => {
    if (busy) return;
    if (!enabled) {
      setEnabled(true);
      if (!writePushPreference(true)) setMessage("Preferenza attiva, ma la memoria del dispositivo non è disponibile.");
      // Activation stays on this click gesture, never an automatic native prompt.
      await activate();
      return;
    }
    setEnabled(false); setAsk(false); setBusy(true);
    choiceThisVisit.current = true; savePushChoice();
    const stored = writePushPreference(false);
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration("/angyhealth-push-sw.js");
        if (registration) {
          await setWorkerPushPreference(registration, false);
          await (await registration.pushManager.getSubscription())?.unsubscribe();
        }
      }
      await update({ data: { enabled: false, timezone: timezone() } });
      setMessage(stored ? "Notifiche giornaliere disattivate." : "Notifiche disattivate; la preferenza locale non può essere salvata su questo dispositivo.");
    } catch { setMessage("Notifiche disattivate su questo dispositivo. La conferma dell’interruzione lato server richiede una connessione: riapri le Impostazioni quando sei online."); }
    finally { setBusy(false); }
  };

  return <>
    <GlassPanel className="mt-4 flex items-center justify-between px-5 py-4">
      <span className="text-base font-medium text-foreground">Notifiche</span>
      <Button type="button" variant="ghost" role="switch" aria-checked={enabled} aria-label="Notifiche" disabled={busy} onClick={() => void toggle()}
        className={`glass-center notification-switch box-border flex h-8 w-14 shrink-0 rounded-full p-[3px] transition-colors ${enabled ? "notification-switch-on justify-end" : "justify-start"}`}>
        <span className="notification-switch-thumb block size-6 shrink-0 rounded-full shadow-md transition-all" />
      </Button>
    </GlassPanel>
    {message && <p role="status" className="mt-2 px-2 text-sm leading-relaxed text-foreground">{message}</p>}
    {ask && <div className="fixed inset-0 z-[65] grid place-items-center px-5" role="dialog" aria-modal="true" aria-labelledby="push-question">
      <GlassPanel className="animate-in fade-in zoom-in-95 w-full max-w-md px-5 py-6 duration-300">
        <h2 id="push-question" className="text-base font-semibold text-foreground">Vuoi ricevere ogni giorno un piccolo promemoria da AngyHealth?</h2>
        <Button variant="ghost" disabled={busy} onClick={() => void activate()} className="glass mt-4 h-auto w-full whitespace-normal rounded-2xl px-5 py-3 text-base font-semibold text-foreground">Attiva notifiche</Button>
        <Button variant="ghost" onClick={() => { choiceThisVisit.current = true; savePushChoice(); setAsk(false); }} className="glass mt-3 h-auto w-full rounded-2xl px-5 py-3 text-base font-semibold text-foreground">Non adesso</Button>
      </GlassPanel>
    </div>}
  </>;
}