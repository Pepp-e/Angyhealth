import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";

const CLOUD_PATH =
  "M40 104 C22 104 14 90 22 78 C27 70 36 68 43 70 C42 54 55 42 71 44 C79 30 100 26 113 36 C122 24 143 25 151 39 C154 45 155 51 154 56 C172 55 183 68 179 83 C176 96 165 104 150 104 Z";

const PHASES = [
  { key: "in", label: "Inspira", secs: 4, scale: 1.25 },
  { key: "hold", label: "Trattieni", secs: 2, scale: 1.25 },
  { key: "out", label: "Espira", secs: 6, scale: 0.85 },
] as const;

const TOTAL_CYCLES = 5;

/** Minigioco Panico: respirazione guidata 4-2-6 per 5 cicli. */
export function BreathingGame() {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [remaining, setRemaining] = useState<number>(PHASES[0]!.secs);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  // Scala congelata nel punto esatto in cui l'animazione è stata messa in pausa.
  const [frozenScale, setFrozenScale] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePause = () => {
    vibrate(10);
    if (!paused) {
      const el = svgRef.current;
      if (el) {
        const t = getComputedStyle(el).transform;
        const m = t && t !== "none" ? new DOMMatrixReadOnly(t) : null;
        setFrozenScale(m ? m.a : null);
      }
      setPaused(true);
    } else {
      setFrozenScale(null);
      setPaused(false);
    }
  };

  useEffect(() => {
    if (done || paused) return;
    timer.current = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // fine fase
        vibrate(10);
        if (phase < PHASES.length - 1) {
          setPhase(phase + 1);
          return PHASES[phase + 1]!.secs;
        }
        if (cycle < TOTAL_CYCLES) {
          setCycle(cycle + 1);
          setPhase(0);
          return PHASES[0]!.secs;
        }
        setDone(true);
        return 0;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [phase, cycle, done, paused]);

  const restart = () => {
    vibrate(15);
    setPhase(0);
    setCycle(1);
    setRemaining(PHASES[0]!.secs);
    setPaused(false);
    setDone(false);
  };

  const current = PHASES[phase]!;
  const elapsed = current.secs - remaining;

  return (
    <GlassPanel className="mt-6 w-full px-5 py-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-52 w-full items-center justify-center">
          <svg
            viewBox="0 0 200 130"
            className="cloud-glow-lg h-auto w-56 max-w-full"
            aria-hidden
            style={{
              transform: `scale(${done ? 1 : current.scale})`,
              transition: done
                ? "transform 800ms ease-in-out"
                : paused
                  ? "none"
                  : `transform ${remaining * 1000}ms linear`,
            }}
          >
            <path
              d={CLOUD_PATH}
              fill="oklch(1 0 0 / 0.9)"
              stroke="oklch(1 0 0 / 0.85)"
              strokeWidth="2"
            />
            <ellipse cx="92" cy="52" rx="28" ry="11" fill="oklch(1 0 0 / 0.7)" />
          </svg>
        </div>

        {done ? (
          <>
            <p className="text-center text-lg font-semibold text-foreground">
              Hai completato l'esercizio!
            </p>
            <button
              type="button"
              onClick={restart}
              className="glass rounded-full px-6 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.96]"
            >
              Ricomincia
            </button>
          </>
        ) : (
          <>
            <p className="text-center text-xl font-semibold text-foreground">
              {current.label}
            </p>
            <p
              key={`${phase}-${remaining}-${elapsed}`}
              className="text-center text-4xl font-bold tabular-nums text-foreground"
              aria-live="polite"
            >
              {remaining}
            </p>
            <p className="text-sm text-muted-foreground">
              {cycle} / {TOTAL_CYCLES}
            </p>
            <button
              type="button"
              onClick={() => {
                vibrate(10);
                setPaused((p) => !p);
              }}
              aria-label={paused ? "Riprendi" : "Pausa"}
              className="glass min-h-12 rounded-full px-7 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.96]"
            >
              {paused ? "▶ Play" : "⏸ Pausa"}
            </button>
          </>
        )}
      </div>
    </GlassPanel>
  );
}
