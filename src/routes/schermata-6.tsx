import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { isVibrationEnabled, setVibrationEnabled } from "@/lib/vibration";

function VibrationToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isVibrationEnabled());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setVibrationEnabled(next);
  };

  return (
    <GlassPanel className="mt-6 flex items-center justify-between px-5 py-4">
      <span className="text-base font-medium text-foreground">Vibrazione</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Vibrazione"
        onClick={toggle}
        className={`glass-center box-border flex h-8 w-14 shrink-0 items-center rounded-full p-[3px] transition-colors ${enabled ? "justify-end bg-white/60" : "justify-start bg-white/20"}`}
      >
        <span className="block size-6 shrink-0 rounded-full bg-white shadow-md transition-all" />
      </button>
    </GlassPanel>
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
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-[clamp(1.6rem,7.5vw,2.125rem)] font-semibold tracking-tight text-foreground">Impostazioni</h1>
      </GlassPanel>

      <VibrationToggle />

      <div className="flex flex-1 items-end justify-center">
        <p className="text-center text-xs text-muted-foreground">By Giuseppe Miranda</p>
      </div>
    </ScreenLayout>
  ),
});
