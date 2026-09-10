import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import {
  isVibrationEnabled,
  setVibrationEnabled,
  isHapticsEnabled,
  setHapticsEnabled,
  vibrate,
} from "@/lib/vibration";
import { clearAppVersion } from "@/lib/version";
import { NightModeToggle } from "@/components/NightModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useT } from "@/lib/i18n";

function ToggleRow({
  label,
  enabled,
  onToggle,
  className,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const t = useT();
  return (
    <GlassPanel className={`flex items-center justify-between px-5 py-4 ${className ?? ""}`}>
      <span className="text-base font-medium text-foreground">{t(label)}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t(label)}
        onClick={onToggle}
        className={`glass-center box-border flex h-8 w-14 shrink-0 items-center rounded-full p-[3px] transition-colors ${enabled ? "justify-end bg-white/60" : "justify-start bg-white/20"}`}
      >
        <span className="block size-6 shrink-0 rounded-full bg-white shadow-md transition-all" />
      </button>
    </GlassPanel>
  );
}

function VibrationToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isVibrationEnabled());
  }, []);

  return (
    <ToggleRow
      label="Vibrazione"
      enabled={enabled}
      className="mt-6"
      onToggle={() => {
        const next = !enabled;
        setEnabled(next);
        setVibrationEnabled(next);
      }}
    />
  );
}

function HapticsToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isHapticsEnabled());
  }, []);

  return (
    <ToggleRow
      label="Feedback tattile"
      enabled={enabled}
      className="mt-4"
      onToggle={() => {
        const next = !enabled;
        setEnabled(next);
        setHapticsEnabled(next);
      }}
    />
  );
}


export const Route = createFileRoute("/schermata-6")({
  head: () => ({
    meta: [
      { title: "Impostazioni — Nuvola" },
      { name: "description", content: "Impostazioni dell'app Nuvola, incluso il controllo della vibrazione." },
      { property: "og:title", content: "Impostazioni — Nuvola" },
      { property: "og:description", content: "Impostazioni dell'app Nuvola, incluso il controllo della vibrazione." },
    ],
  }),
  component: Impostazioni,
});

function Impostazioni() {
  const t = useT();
  return (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-[clamp(1.4rem,6.2vw,1.8rem)] font-semibold tracking-tight text-foreground">{t("Impostazioni")}</h1>
      </GlassPanel>

      <VibrationToggle />

      <HapticsToggle />

      <NightModeToggle />

      <LanguageToggle />

      <div className="mt-6 flex justify-center">
        <div className="h-px w-2/3 rounded-full bg-white/70" />
      </div>

      <button
        type="button"
        onClick={() => {
          vibrate(20);
          clearAppVersion();
        }}
        className="glass mt-4 flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-4 text-base font-semibold text-foreground shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97]"
      >
        <ArrowLeft className="size-5" />
        {t("Torna al pin")}
      </button>

      <div className="flex flex-1 flex-col items-center justify-end">
        <p className="text-center text-xs text-muted-foreground">By Giuseppe Miranda</p>
        <p className="mt-1.5 text-center text-[0.65rem] text-muted-foreground/80">
          © 2026 — AngyHealth. Tutti i diritti riservati.
        </p>
      </div>
    </ScreenLayout>
  );
}
