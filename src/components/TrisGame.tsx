import { useEffect, useState } from "react";
import { RotateCcw, Users, UserRound, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { vibrate } from "@/lib/vibration";
import { botMove, emptyBoard, nextSoloStarter, play, result, type Board, type Mark, type Difficulty } from "@/lib/tris";

type Mode = "solo" | "pair";
const control = "glass h-auto min-h-12 rounded-3xl px-4 py-3 text-base font-semibold text-foreground transition-transform active:scale-[0.96] hover:bg-transparent whitespace-normal";
const selectionControl = `${control} min-h-24 w-full px-6 py-6 text-2xl [&_svg]:size-7`;
const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difficile" },
];

export function TrisGame() {
  const t = useT();
  const [mode, setMode] = useState<Mode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Mark>("X");
  const [starter, setStarter] = useState<Mark>("X");
  const outcome = result(board);

  useEffect(() => {
    if (mode !== "solo" || !difficulty || turn !== "O" || outcome.winner || outcome.draw) return;
    const timer = window.setTimeout(() => {
      const move = botMove(board, difficulty);
      if (move === null) return;
      setBoard(play(board, move, "O"));
      setTurn("X");
      vibrate(10);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [mode, difficulty, turn, board, outcome.winner, outcome.draw]);

  function choose(next: Mode) {
    vibrate(10); setMode(next); setDifficulty(null); setBoard(emptyBoard()); setStarter("X"); setTurn("X");
  }
  function restart() {
    const next = mode === "solo" ? nextSoloStarter(starter) : "X";
    vibrate(10); setBoard(emptyBoard()); setStarter(next); setTurn(next);
  }
  function pick(index: number) {
    if (!mode || (mode === "solo" && (!difficulty || turn === "O"))) return;
    const next = play(board, index, turn);
    if (next === board) return;
    vibrate(10); setBoard(next); setTurn(turn === "X" ? "O" : "X");
  }

  if (!mode) return (
    <div className="mx-auto flex min-h-[55svh] w-full max-w-96 flex-1 flex-col justify-center gap-7 py-6" role="group" aria-label={t("Scegli la modalità")}>
      <Button variant="ghost" className={selectionControl} onClick={() => choose("solo")}><UserRound aria-hidden />{t("Da solo")}</Button>
      <Button variant="ghost" className={selectionControl} onClick={() => choose("pair")}><Users aria-hidden />{t("In coppia")}</Button>
    </div>
  );

  if (mode === "solo" && !difficulty) return (
    <div className="mx-auto flex min-h-[55svh] w-full max-w-96 flex-1 flex-col justify-center gap-5 py-6">
      <p className="text-center text-xl font-semibold text-foreground">{t("Scegli la difficoltà")}</p>
      {difficulties.map(level => <Button key={level.value} variant="ghost" className={selectionControl} onClick={() => { vibrate(10); setDifficulty(level.value); }}>{t(level.label)}</Button>)}
    </div>
  );

  const status = outcome.draw ? "Pareggio!" : outcome.winner
    ? mode === "solo" ? outcome.winner === "X" ? "Hai vinto!" : "Ha vinto il bot!" : outcome.winner === "X" ? "Ha vinto Utente 1!" : "Ha vinto Utente 2!"
    : mode === "solo" ? turn === "X" ? "Il tuo turno" : "Turno del bot" : turn === "X" ? "Turno Utente 1" : "Turno Utente 2";
  const statusMark = outcome.draw ? null : outcome.winner ?? turn;
  const locked = Boolean(outcome.winner || outcome.draw || (mode === "solo" && turn === "O"));

  return (
    <div className="tris-game mt-6 flex flex-col items-center gap-6">
      <p role="status" aria-live="polite" className={`glass flex min-h-14 w-full items-center justify-center rounded-3xl px-3 py-3 text-center text-lg font-semibold ${statusMark ? `tris-turn-${statusMark.toLowerCase()}` : "text-foreground"}`}>{t(status)}</p>
      <div role="group" aria-label={t("Griglia Tris")} className="tris-board grid w-full max-w-80 grid-cols-3 gap-3">
        {board.map((mark, i) => (
          <Button key={i} variant="ghost" aria-label={`${t("Casella")} ${i + 1}: ${mark ?? t("vuota")}`} disabled={locked || Boolean(mark)} onClick={() => pick(i)}
            className={`glass tris-cell aspect-square h-auto min-w-0 rounded-2xl p-0 hover:bg-transparent ${outcome.line.includes(i) ? "tris-winning" : ""}`}>
            {mark && <svg viewBox="0 0 100 100" className={`tris-mark tris-mark-${mark.toLowerCase()}`} fill="none" aria-hidden="true">
              {mark === "X" ? <path d="M25 25L75 75M75 25L25 75" /> : <circle cx="50" cy="50" r="29" />}
            </svg>}
          </Button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        <Button variant="ghost" className={control} onClick={restart}><RotateCcw aria-hidden />{t("Ricomincia")}</Button>
        <Button variant="ghost" className={control} onClick={() => { vibrate(10); setMode(null); setBoard(emptyBoard()); }}><ArrowLeftRight aria-hidden />{t("Cambia modalità")}</Button>
      </div>
    </div>
  );
}