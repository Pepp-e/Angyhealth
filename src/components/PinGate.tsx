import { useEffect, useState, type ReactNode } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { getAppVersion, setAppVersion, PIN_TO_VERSION } from "@/lib/version";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "ok"] as const;

/** Schermata iniziale di accesso con PIN a 4 cifre. */
export function PinGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [intro, setIntro] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (getAppVersion()) setUnlocked(true);
    setReady(true);
    const t = setTimeout(() => setIntro(false), 2600);
    return () => clearTimeout(t);
  }, []);

  const press = (k: (typeof KEYS)[number]) => {
    vibrate(12);
    if (k === "back") {
      setError(false);
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (k === "ok") {
      const version = PIN_TO_VERSION[pin];
      if (version) {
        vibrate([90, 40, 140]);
        setAppVersion(version);
        setUnlocked(true);
      } else {
        setError(true);
        vibrate([90, 40, 140]);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 700);
      }
      return;
    }
    setError(false);
    setPin((p) => (p.length < 4 ? p + k : p));
  };

  if (!ready) return null;

  if (unlocked) {
    return <div className="animate-in fade-in zoom-in-95 duration-500 ease-out">{children}</div>;
  }

  if (intro) {
    return (
      <main className="grid min-h-svh w-full place-items-center overflow-hidden">
        <span className="animate-cloud-cross inline-block">
          <svg viewBox="0 0 200 130" className="cloud-glow-lg h-auto w-56" role="img" aria-hidden>
            <defs>
              <radialGradient id="cloudFillIntro" cx="38%" cy="28%" r="90%">
                <stop offset="0%" stopColor="oklch(1 0 0 / 0.96)" />
                <stop offset="55%" stopColor="oklch(0.98 0.01 240 / 0.88)" />
                <stop offset="100%" stopColor="oklch(0.9 0.03 240 / 0.82)" />
              </radialGradient>
            </defs>
            <path
              d="M40 104
                 C22 104 14 90 22 78
                 C27 70 36 68 43 70
                 C42 54 55 42 71 44
                 C79 30 100 26 113 36
                 C122 24 143 25 151 39
                 C154 45 155 51 154 56
                 C172 55 183 68 179 83
                 C176 96 165 104 150 104
                 Z"
              fill="url(#cloudFillIntro)"
              stroke="oklch(1 0 0 / 0.85)"
              strokeWidth="2"
            />
            <ellipse cx="92" cy="52" rx="28" ry="11" fill="oklch(1 0 0 / 0.7)" />
          </svg>
        </span>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md animate-in flex-col items-center justify-center px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] fade-in slide-in-from-bottom-2 zoom-in-[0.97] duration-700 ease-out">
      <GlassPanel className={`w-full px-5 py-7 ${error ? "animate-quick-bounce" : ""}`}>
        <h1 className="text-center text-[clamp(1.25rem,5.6vw,1.6rem)] font-bold tracking-tight text-foreground">
          Inserisci il codice "0000".
        </h1>

        <div className="mt-5 flex items-center justify-center gap-4" aria-label="Cifre inserite">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`size-4 rounded-full border transition-all duration-200 ${
                error
                  ? "border-red-300/80 bg-red-400/70 shadow-[0_0_12px_rgba(248,113,113,0.85)]"
                  : i < pin.length
                    ? "border-white/80 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                    : "border-white/70 bg-white/25"
              }`}
            />
          ))}
        </div>

        <p
          className="mt-3 h-5 text-center text-sm font-medium text-foreground/80"
          aria-live="polite"
        >
          {error ? "Codice errato" : ""}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => press(k)}
              aria-label={k === "back" ? "Cancella" : k === "ok" ? "Conferma" : k}
              className="glass grid min-h-14 place-items-center rounded-2xl text-xl font-semibold text-foreground shadow-[0_0_10px_rgba(255,255,255,0.25)] transition-transform active:scale-[0.94]"
            >
              {k === "back" ? "⌫" : k === "ok" ? "✓" : k}
            </button>
          ))}
        </div>
      </GlassPanel>
    </main>
  );
}
