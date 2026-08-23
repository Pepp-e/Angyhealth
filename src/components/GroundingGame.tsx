import { useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";

type Phase = { prompt: string; need: number; items: string[] };

const PHASES: Phase[] = [
  {
    prompt: "Trova 5 cose che vedi",
    need: 5,
    items: ["☁️ Nuvola", "⭐ Stella", "☀️ Sole", "🌸 Fiore", "❤️ Cuore", "🐦 Uccello", "🌙 Luna", "💧 Goccia"],
  },
  {
    prompt: "Trova 4 cose che puoi toccare",
    need: 4,
    items: ["🧸 Peluche", "📱 Telefono", "🪵 Legno", "🧣 Tessuto", "🪨 Pietra", "🍃 Foglia"],
  },
  {
    prompt: "Trova 3 cose che puoi ascoltare",
    need: 3,
    items: ["🎵 Musica", "🌊 Onde", "🌧️ Pioggia", "🗣️ Voci", "🕊️ Cinguettio"],
  },
  {
    prompt: "Trova 2 cose che ti piacciono",
    need: 2,
    items: ["📚 Libri", "🍫 Cioccolato", "🎬 Film", "🐱 Gatti"],
  },
  {
    prompt: "Scegli una cosa che ti fa stare bene",
    need: 1,
    items: ["🛏️ Riposo", "🫖 Tisana", "🚶 Passeggiata"],
  },
];

/** Minigioco Ansia: grounding 5-4-3-2-1. */
export function GroundingGame() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const phase = PHASES[step]!;

  const pick = (item: string) => {
    if (selected.includes(item)) return;
    vibrate(10);
    const next = [...selected, item];
    if (next.length >= phase.need) {
      setTimeout(() => {
        if (step < PHASES.length - 1) {
          setStep(step + 1);
          setSelected([]);
        } else {
          setDone(true);
        }
      }, 350);
    }
    setSelected(next);
  };

  const restart = () => {
    vibrate(10);
    setStep(0);
    setSelected([]);
    setDone(false);
  };

  return (
    <GlassPanel className="mt-6 w-full px-5 py-7">
      {done ? (
        <div className="animate-fade-in flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-foreground">
            Brava! Hai completato l'esercizio.
          </p>
          <p className="text-sm text-muted-foreground">
            Prenditi un momento e continua con calma.
          </p>
          <button
            type="button"
            onClick={restart}
            className="glass mt-2 rounded-full px-6 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.96]"
          >
            Ricomincia
          </button>
        </div>
      ) : (
        <div key={step} className="animate-fade-in flex flex-col items-center gap-4">
          <p className="text-center text-lg font-semibold text-foreground">
            {phase.prompt}
          </p>
          <p className="text-sm text-muted-foreground">
            {selected.length} / {phase.need}
          </p>
          <div className="grid w-full grid-cols-2 gap-3">
            {phase.items.map((item) => {
              const active = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  disabled={active}
                  onClick={() => pick(item)}
                  className={`glass min-h-14 rounded-2xl px-3 py-3 text-sm font-medium text-foreground transition-all duration-200 active:scale-[0.96] ${
                    active ? "scale-[0.97] opacity-50 ring-2 ring-white/70" : ""
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
