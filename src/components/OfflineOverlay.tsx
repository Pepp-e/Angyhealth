import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { useT } from "@/lib/i18n";

/** Overlay mostrato quando il dispositivo perde la connessione. */
export function OfflineOverlay() {
  const t = useT();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-sky px-6"
    >
      <GlassPanel className="w-full max-w-sm px-6 py-8 text-center">
        <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full glass-center">
          <WifiOff className="size-7 text-primary" strokeWidth={1.75} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("Sei offline")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Controlla la tua connessione Internet e riprova.")}
        </p>
      </GlassPanel>
    </div>
  );
}
