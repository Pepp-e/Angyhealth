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
        className={`glass-center relative h-8 w-14 rounded-full transition-colors ${enabled ? "bg-white/60" : "bg-white/20"}`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${enabled ? "translate-x-7" : "translate-x-1"}`}
        />
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Impostazioni</h1>
      </GlassPanel>

      <VibrationToggle />

      <div className="flex flex-1 items-end justify-center">
        <p className="text-center text-xs text-muted-foreground">By Giuseppe Miranda</p>
      </div>
    </ScreenLayout>
  ),
});
