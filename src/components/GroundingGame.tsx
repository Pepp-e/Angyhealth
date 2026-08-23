import { useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";

type Phase = { prompt: string; need: number; correct: string[]; wrong: string[] };

/** Fasi 5-4-3 con 8 emoji ciascuna: le sbagliate sono totalmente fuori contesto. */
const PHASES: Phase[] = [
  {
    prompt: "Trova 5 cose che vedi",
    need: 5,
    correct: ["👀", "🌳", "☁️", "🌞", "🏠"],
    wrong: ["🧮", "🧾", "🪫"],
  },
  {
    prompt: "Trova 4 cose che puoi toccare",
    need: 4,
    correct: ["🧸", "🪵", "🧣", "🪨"],
    wrong: ["♾️", "🔣", "🈳", "🆔"],
  },
  {
    prompt: "Trova 3 cose che puoi ascoltare",
    need: 3,
    correct: ["🎵", "🌧️", "🔔"],
    wrong: ["🧊", "🧱", "🧴", "🧹", "📏"],
  },
];

/** Minigioco Ansia: grounding 5-4-3. */
export function GroundingGame() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const phase = PHASES[step]!;
  const items = [...phase.correct, ...phase.wrong];

  const pick = (item: string) => {
    if (selected.includes(item) || wrongPick) return;

    if (!phase.correct.includes(item)) {
      setWrongPick(item);
      setTimeout(() => {
        setWrongPick(null);
        setSelected([]);
      }, 700);
      return;
    }

    const next = [...selected, item];
    setSelected(next);
    if (next.length >= phase.need) {
      vibrate(15);
      setTimeout(() => {
        if (step < PHASES.length - 1) {
          setStep(step + 1);
          setSelected([]);
        } else {
          setDone(true);
        }
      }, 350);
    }
  };

  const restart = () => {
    vibrate(10);
    setStep(0);
    setSelected([]);
    setWrongPick(null);
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
          <div className="grid w-full grid-cols-4 gap-2.5">
            {items.map((item) => {
              const active = selected.includes(item);
              const isWrong = wrongPick === item;
              return (
                <button
                  key={item}
                  type="button"
                  disabled={active}
                  onClick={() => pick(item)}
                  className={`glass flex aspect-square min-h-0 items-center justify-center rounded-2xl text-2xl transition-all duration-200 active:scale-[0.96] ${
                    isWrong ? "bg-red-500/70 ring-2 ring-red-400" : ""
                  } ${active ? "scale-[0.97] opacity-50 ring-2 ring-white/70" : ""}`}
                >
                  <span aria-hidden>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
