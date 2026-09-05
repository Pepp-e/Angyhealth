import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { isNightMode, setNightMode } from "@/lib/theme";
import { vibrate } from "@/lib/vibration";

/** Icona luna/sole disegnata per l'app, con morph animato. */
function SunMoonIcon({ night }: { night: boolean }) {
  return (
    <span className="relative block size-9 shrink-0">
      {/* Luna */}
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className="absolute inset-0 size-9 transition-all duration-[850ms] ease-out"
        style={{
          opacity: night ? 0 : 1,
          transform: night ? "rotate(-70deg) scale(0.6)" : "rotate(0deg) scale(1)",
        }}
      >
        <path
          d="M27.5 24.6A11 11 0 0 1 15.4 8.9a12 12 0 1 0 14.4 17 11 11 0 0 1-2.3-1.3Z"
          fill="oklch(0.3 0.05 250 / 0.95)"
          stroke="oklch(0.3 0.05 250)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 5px oklch(0.3 0.05 250 / 0.35))" }}
        />
      </svg>
      {/* Sole */}
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className="absolute inset-0 size-9 transition-all duration-[850ms] ease-out"
        style={{
          opacity: night ? 1 : 0,
          transform: night ? "rotate(0deg) scale(1)" : "rotate(70deg) scale(0.6)",
        }}
      >
        <circle
          cx="20"
          cy="20"
          r="7.5"
          fill="oklch(1 0 0 / 0.95)"
          style={{ filter: "drop-shadow(0 0 6px oklch(1 0 0 / 0.6))" }}
        />
        <g stroke="oklch(1 0 0 / 0.9)" strokeWidth="2" strokeLinecap="round">
          <line x1="20" y1="3.5" x2="20" y2="8" />
          <line x1="20" y1="32" x2="20" y2="36.5" />
          <line x1="3.5" y1="20" x2="8" y2="20" />
          <line x1="32" y1="20" x2="36.5" y2="20" />
          <line x1="8.3" y1="8.3" x2="11.4" y2="11.4" />
          <line x1="28.6" y1="28.6" x2="31.7" y2="31.7" />
          <line x1="31.7" y1="8.3" x2="28.6" y2="11.4" />
          <line x1="11.4" y1="28.6" x2="8.3" y2="31.7" />
        </g>
      </svg>
    </span>
  );
}

/** Contenitore Liquid Glass cliccabile per la modalità giorno/notte. */
export function NightModeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    setNight(isNightMode());
  }, []);

  const toggle = () => {
    const next = !night;
    setNight(next);
    setNightMode(next);
    vibrate(20);
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={night} className="mt-4 block w-full">
      <GlassPanel className="flex items-center justify-between px-5 py-4 transition-all duration-200 active:scale-[0.98] active:shadow-[0_0_16px_rgba(255,255,255,0.45)]">
        <span className="text-base font-medium text-foreground">
          {night ? "Modalità giorno" : "Modalità notte"}
        </span>
        <SunMoonIcon night={night} />
      </GlassPanel>
    </button>
  );
}
