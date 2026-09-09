import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

type Phase = { prompt: string; need: number; correct: string[]; wrong: string[] };

/** 5 fasi con 8 emoji ciascuna: le sbagliate sono totalmente fuori contesto. */
const PHASES: Phase[] = [
  {
    prompt: "Trova 5 cose che vedi",
    need: 5,
    correct: ["👀", "🌳", "☁️", "🌞", "🏠"],
    wrong: ["🔣", "♾️", "🆔"],
  },
  {
    prompt: "Trova 4 cose che puoi toccare",
    need: 4,
    correct: ["🧸", "🪵", "🧣", "🪨"],
    wrong: ["🌈", "🌬️", "💭", "🕐"],
  },
  {
    prompt: "Trova 3 cose che puoi ascoltare",
    need: 3,
    correct: ["🎵", "🌧️", "🔔"],
    wrong: ["🧊", "🧱", "🧴", "📏", "🪣"],
  },
  {
    prompt: "Trova 2 cose che ti piacciono",
    need: 2,
    correct: ["🍫", "🐶", "🍕", "🎧", "📚", "🌻", "🍦", "🏖️"],
    wrong: [],
  },
  {
    prompt: "Scegli una cosa che ti fa stare bene",
    need: 1,
    correct: ["🤗", "😴", "🛁", "🍵", "🎶", "🌅", "🐱", "💐"],
    wrong: [],
  },
];

/** Mescola una copia dell'array (Fisher-Yates). */
function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = a;
  }
  return arr;
}

/** Minigioco Ansia: grounding 5-4-3-2-1. */
export function GroundingGame() {
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const t = useT();


  const phase = PHASES[step]!;
  const items = useMemo(
    () => shuffle([...phase.correct, ...phase.wrong]),
    // rimescola a ogni fase e a ogni ripartenza
    [step, round, phase.correct, phase.wrong],
  );

  const pick = (item: string) => {
    if (selected.includes(item) || wrongPick) return;

    if (!phase.correct.includes(item)) {
      setWrongPick(item);
      setTimeout(() => {
        setWrongPick(null);
        setSelected([]);
        setRound((r) => r + 1);
      }, 1000);
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
    setRound((r) => r + 1);
    setSelected([]);
    setWrongPick(null);
    setDone(false);
  };

  return (
    <GlassPanel className="mt-4 w-full px-4 py-5">
      {done ? (
        <div className="animate-fade-in flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-foreground">
            {t("Brava! Hai completato l'esercizio.")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("Prenditi un momento e continua con calma.")}
          </p>
          <button
            type="button"
            onClick={restart}
            className="glass mt-1 rounded-full px-6 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.96]"
          >
            {t("Ricomincia")}
          </button>
        </div>
      ) : (
        <div key={`${step}-${round}`} className="animate-fade-in flex flex-col items-center gap-3">
          <p className="text-center text-lg font-semibold text-foreground">
            {t(phase.prompt)}
          </p>
          <p className="text-sm text-muted-foreground">
            {selected.length} / {phase.need}
          </p>
          <div className="grid w-full grid-cols-4 gap-2">
            {items.map((item) => {
              const active = selected.includes(item);
              const isWrong = wrongPick === item;
              return (
                <button
                  key={item}
                  type="button"
                  disabled={active || wrongPick !== null}
                  onClick={() => pick(item)}
                  className={`glass flex aspect-square min-h-0 items-center justify-center rounded-2xl text-2xl transition-all duration-200 active:scale-[0.96] ${
                    isWrong
                      ? "bg-red-500/70 ring-2 ring-red-400 shadow-[0_0_18px_rgba(248,113,113,0.85)]"
                      : ""
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
