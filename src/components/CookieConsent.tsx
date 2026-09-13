import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { useT } from "@/lib/i18n";
import { vibrate } from "@/lib/vibration";
import {
  getConsent,
  setConsent,
  applyConsent,
  onOpenPrivacySettings,
  type Consent,
} from "@/lib/consent";

/** Interruttore coerente con quelli delle Impostazioni. */
function Row({
  label,
  enabled,
  locked,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  const t = useT();
  return (
    <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/20 px-4 py-3">
      <span className="text-sm font-medium text-foreground">{t(label)}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t(label)}
        disabled={locked}
        onClick={onToggle}
        className={`glass-center box-border flex h-7 w-12 shrink-0 items-center rounded-full p-[3px] transition-colors ${
          enabled ? "justify-end bg-white/60" : "justify-start bg-white/20"
        } ${locked ? "opacity-70" : ""}`}
      >
        <span className="block size-5 shrink-0 rounded-full bg-white shadow-md transition-all" />
      </button>
    </div>
  );
}

function GlassButton({
  label,
  onClick,
  strong,
}: {
  label: string;
  onClick: () => void;
  strong?: boolean;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => {
        vibrate(12);
        onClick();
      }}
      className={`glass mt-3 w-full rounded-2xl px-5 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.97] ${
        strong ? "shadow-[0_0_14px_rgba(255,255,255,0.45)]" : ""
      }`}
    >
      {t(label)}
    </button>
  );
}

/** Consenso cookie/privacy collegato a Google Consent Mode v2. */
export function CookieConsent() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  // Prima apertura: il pannello compare dopo l'animazione iniziale della nuvoletta.
  useEffect(() => {
    const saved = getConsent();
    if (saved) {
      applyConsent(saved);
      return;
    }
    const id = window.setTimeout(() => setVisible(true), 2700);
    return () => window.clearTimeout(id);
  }, []);

  // Riapertura dalle Impostazioni.
  useEffect(
    () =>
      onOpenPrivacySettings(() => {
        const saved = getConsent();
        setAnalytics(saved?.analytics ?? false);
        setAds(saved?.ads ?? false);
        setCustom(true);
        setVisible(true);
      }),
    [],
  );

  if (!visible) return null;

  const save = (c: Consent) => {
    setConsent(c);
    setVisible(false);
    setCustom(false);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center px-5 py-[env(safe-area-inset-top)]">
      <GlassPanel className="animate-in fade-in zoom-in-95 w-full max-w-md px-5 py-6 shadow-[0_0_24px_rgba(255,255,255,0.3)] duration-300">
        {custom ? (
          <>
            <h2 className="text-[clamp(1.15rem,5vw,1.4rem)] font-semibold tracking-tight text-foreground">
              {t("Impostazioni privacy")}
            </h2>
            <Row label="Cookie necessari" enabled locked />
            <Row
              label="Cookie analitici"
              enabled={analytics}
              onToggle={() => setAnalytics((v) => !v)}
            />
            <Row label="Cookie pubblicitari" enabled={ads} onToggle={() => setAds((v) => !v)} />
            <GlassButton
              label="Salva preferenze"
              strong
              onClick={() => save({ analytics, ads })}
            />
          </>
        ) : (
          <>
            <h2 className="text-[clamp(1.15rem,5vw,1.4rem)] font-semibold tracking-tight text-foreground">
              {t("La tua privacy conta")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {t(
                "Utilizziamo cookie e tecnologie simili per far funzionare AngyHealth, capire come viene utilizzato e, se autorizzato, migliorare la tua esperienza. Puoi accettare tutti i cookie, rifiutare quelli non necessari oppure scegliere quali consentire.",
              )}
            </p>
            <GlassButton
              label="Accetta tutti"
              strong
              onClick={() => save({ analytics: true, ads: true })}
            />
            <GlassButton
              label="Rifiuta non necessari"
              onClick={() => save({ analytics: false, ads: false })}
            />
            <GlassButton
              label="Personalizza"
              onClick={() => {
                const saved = getConsent();
                setAnalytics(saved?.analytics ?? false);
                setAds(saved?.ads ?? false);
                setCustom(true);
              }}
            />
          </>
        )}
      </GlassPanel>
    </div>
  );
}
