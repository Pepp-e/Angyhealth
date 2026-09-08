import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Palette,
  Redo2,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { vibrate } from "@/lib/vibration";

const STORAGE_KEY = "note-fogli";

type Sheet = { text: string; font: string; color: string; drawing: string | null };

const FONTS = [
  { label: "San Francisco", value: "system-ui, -apple-system, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Corsivo", value: "'Snell Roundhand', 'Brush Script MT', cursive" },
  { label: "Handwriting", value: "'Bradley Hand', 'Segoe Script', cursive" },
  { label: "Monospace", value: "ui-monospace, 'SF Mono', monospace" },
];

const COLORS = ["#112942", "#1f6feb", "#e0245e", "#0f9d58", "#f2a33c", "#7b4bd8"];

const empty = (): Sheet => ({ text: "", font: FONTS[0].value, color: COLORS[0], drawing: null });

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        vibrate(10);
        onClick();
      }}
      className="glass-dark grid size-11 shrink-0 place-items-center rounded-full text-white shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform active:scale-[0.92]"
    >
      {children}
    </button>
  );
}

function Note() {
  const [sheets, setSheets] = useState<Sheet[]>([empty()]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<"font" | "color" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const history = useRef<string[]>([]);
  const future = useRef<string[]>([]);

  const sheet = sheets[index] ?? empty();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Sheet[];
        if (parsed.length) setSheets(parsed);
      }
    } catch {
      /* ignora */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    } catch {
      /* quota piena */
    }
  }, [sheets, loaded]);

  // Ridisegna il canvas quando cambia foglio.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current = [];
    future.current = [];
    if (sheet.drawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = sheet.drawing;
    }
  }, [index, loaded]);

  const update = (patch: Partial<Sheet>) =>
    setSheets((s) => s.map((x, i) => (i === index ? { ...x, ...patch } : x)));

  const snapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    history.current.push(canvas.toDataURL());
    future.current = [];
  };

  const restore = (data: string | null) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = data;
    }
    update({ drawing: data });
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <ScreenLayout>
      <ScreenHeader title="Le note della tua giornata" />

      <div className="glass relative mt-2 flex-1 overflow-hidden rounded-[1.6rem] bg-white/70 p-3 shadow-[0_16px_40px_rgba(30,80,140,0.28)]">
        <textarea
          value={sheet.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Scrivi cosa ti passa per la mente."
          style={{ fontFamily: sheet.font, color: sheet.color }}
          className="size-full resize-none bg-transparent text-base outline-none placeholder:opacity-40"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full touch-none"
          onPointerDown={(e) => {
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            snapshot();
            drawing.current = true;
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            ctx.strokeStyle = sheet.color;
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }}
          onPointerUp={() => {
            if (!drawing.current) return;
            drawing.current = false;
            update({ drawing: canvasRef.current?.toDataURL() ?? null });
          }}
          style={{ pointerEvents: panel ? "none" : "auto" }}
        />
      </div>

      {panel === "font" && (
        <div className="glass animate-in fade-in mt-3 flex flex-wrap gap-2 rounded-2xl p-3">
          {FONTS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                vibrate(10);
                update({ font: f.value });
                setPanel(null);
              }}
              style={{ fontFamily: f.value }}
              className="rounded-full bg-white/50 px-3 py-1 text-sm text-foreground active:scale-95"
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {panel === "color" && (
        <div className="glass animate-in fade-in mt-3 flex flex-wrap gap-3 rounded-2xl p-3">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colore ${c}`}
              onClick={() => {
                vibrate(10);
                update({ color: c });
                setPanel(null);
              }}
              style={{ backgroundColor: c }}
              className="size-8 rounded-full ring-1 ring-white/70 active:scale-90"
            />
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-5 justify-items-center gap-2">
        <ToolButton label="Font" onClick={() => setPanel((p) => (p === "font" ? null : "font"))}>
          <Type className="size-5" />
        </ToolButton>
        <ToolButton label="Colore" onClick={() => setPanel((p) => (p === "color" ? null : "color"))}>
          <Palette className="size-5" />
        </ToolButton>
        <ToolButton
          label="Annulla"
          onClick={() => {
            const prev = history.current.pop();
            if (prev === undefined) return;
            future.current.push(canvasRef.current?.toDataURL() ?? "");
            restore(prev);
          }}
        >
          <Undo2 className="size-5" />
        </ToolButton>
        <ToolButton
          label="Ripristina"
          onClick={() => {
            const next = future.current.pop();
            if (next === undefined) return;
            history.current.push(canvasRef.current?.toDataURL() ?? "");
            restore(next);
          }}
        >
          <Redo2 className="size-5" />
        </ToolButton>
        <ToolButton
          label="Elimina foglio"
          onClick={() => {
            if (!window.confirm("Vuoi cancellare questo foglio?")) return;
            snapshot();
            restore(null);
            update({ text: "" });
          }}
        >
          <Trash2 className="size-5" />
        </ToolButton>
        <ToolButton
          label="Foglio precedente"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="size-5" />
        </ToolButton>
        <ToolButton
          label="Nuovo foglio"
          onClick={() => {
            setSheets((s) => [...s, empty()]);
            setIndex(sheets.length);
          }}
        >
          <FilePlus2 className="size-5" />
        </ToolButton>
        <ToolButton
          label="Foglio successivo"
          onClick={() => setIndex((i) => Math.min(sheets.length - 1, i + 1))}
        >
          <ChevronRight className="size-5" />
        </ToolButton>
        <p className="col-span-2 self-center text-center text-sm text-foreground">
          Foglio {index + 1} / {sheets.length}
        </p>
      </div>
    </ScreenLayout>
  );
}

export const Route = createFileRoute("/note")({
  head: () => ({
    meta: [
      { title: "Le note della tua giornata — Nuvola" },
      { name: "description", content: "Scrivi e disegna le note della tua giornata." },
      { property: "og:title", content: "Le note della tua giornata — Nuvola" },
      {
        property: "og:description",
        content: "Scrivi e disegna le note della tua giornata.",
      },
    ],
  }),
  component: Note,
});
