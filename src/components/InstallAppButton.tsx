import { useEffect, useState } from "react";
import { Check, Download, PlusSquare, Share, X } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { useT } from "@/lib/i18n";
import { vibrate } from "@/lib/vibration";
import {
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
  isAppInstalled,
  isIOSDevice,
  onInstallPromptChange,
} from "@/lib/install-prompt";

type DialogKind = "ios" | "installed" | "generic" | null;

/** Pulsante "Installa App AngyHealth" per la schermata Impostazioni. */
export function InstallAppButton() {
  const t = useT();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [, setTick] = useState(0);

  useEffect(() => onInstallPromptChange(() => setTick((n) => n + 1)), []);

  const handleClick = async () => {
    vibrate(12);
    if (isAppInstalled()) {
      setDialog("installed");
      return;
    }
    const deferred = getDeferredInstallPrompt();
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") clearDeferredInstallPrompt();
      } catch {
        /* popup chiuso o non disponibile */
      }
      return;
    }
    setDialog(isIOSDevice() ? "ios" : "generic");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="glass mt-4 flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-4 text-base font-semibold text-foreground shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97]"
      >
        <Download className="size-5" />
        {t("Installa App AngyHealth")}
      </button>

      {dialog && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/25 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setDialog(null)}
        >
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <GlassPanel className="px-6 py-6">
            {dialog === "installed" ? (
              <>
                <div className="flex items-center gap-3">
                  <Check className="size-6 shrink-0 text-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("AngyHealth è già installata")}
                  </h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("L'app è già installata su questo dispositivo e stai usando la versione installata.")}
                </p>
              </>
            ) : dialog === "ios" ? (
              <>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("Installa AngyHealth su iPhone")}
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-foreground">
                  <li className="flex items-center gap-3">
                    <Share className="size-5 shrink-0" />
                    <span>{t("1. Premi il pulsante Condividi di Safari.")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <PlusSquare className="size-5 shrink-0" />
                    <span>{t('2. Seleziona "Aggiungi alla schermata Home".')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 shrink-0" />
                    <span>{t('3. Conferma premendo "Aggiungi".')}</span>
                  </li>
                </ol>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("Installa App AngyHealth")}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('Per installare AngyHealth, apri il menu del browser e scegli "Installa app" oppure "Aggiungi a schermata Home".')}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                vibrate(12);
                setDialog(null);
              }}
              className="glass mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-transform active:scale-[0.97]"
            >
              <X className="size-4" />
              {t("Chiudi")}
            </button>
          </GlassPanel>
        </div>
      )}
    </>
  );
}
