import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Baseline,
  Check,
  Droplets,
  Files,
  Layers,
  Minus,
  Palette,
  PenLine,
  Plus,
  Redo2,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { vibrate } from "@/lib/vibration";

const STORAGE_KEY = "note-fogli";

type Sheet = {
  text: string;
  font: string;
  color: string;
  size: number;
  alpha: number;
  drawing: string | null;
};

const FONTS = [
  { label: "San Francisco", value: "system-ui, -apple-system, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Sans", value: "'Helvetica Neue', Arial, sans-serif" },
  { label: "Corsivo", value: "'Snell Roundhand', 'Brush Script MT', cursive" },
  { label: "Handwriting", value: "'Bradley Hand', 'Segoe Script', cursive" },
  { label: "Elegante", value: "'Didot', 'Playfair Display', serif" },
  { label: "Macchina da scrivere", value: "'American Typewriter', 'Courier New', serif" },
  { label: "Monospace", value: "ui-monospace, 'SF Mono', monospace" },
];

const HUES = [0, 25, 45, 90, 140, 190, 215, 250, 285, 320];
const COLORS: string[] = [
  ...HUES.flatMap((h) => [
    `hsl(${h} 85% 75%)`,
    `hsl(${h} 80% 60%)`,
    `hsl(${h} 75% 45%)`,
    `hsl(${h} 70% 30%)`,
  ]),
  "#ffffff",
  "#e5e7eb",
  "#c3c9d2",
  "#9aa3af",
  "#6b7280",
  "#4b5563",
  "#2c3440",
  "#112942",
  "#000000",
  "#8b5e34",
  "#a97142",
  "#5b3a21",
];

const empty = (): Sheet => ({
  text: "",
  font: FONTS[0]!.value,
  color: "#112942",
  size: 100,
  alpha: 100,
  drawing: null,
});

type Popup = "mode" | "size" | "color" | "fourth" | "actions" | "sheets" | null;

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
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
      className={`glass-dark grid size-11 shrink-0 place-items-center rounded-full text-white transition-transform active:scale-[0.9] ${
        active ? "ring-2 ring-white/80" : ""
      }`}
    >
      {children}
    </button>
  );
}

function PopupRow({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        vibrate(10);
        onClick();
      }}
      className="glass-center flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-base text-foreground transition-transform active:scale-[0.97] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Popup({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 pb-24" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass animate-pin-zoom-in w-full max-w-sm rounded-[1.6rem] p-4 shadow-[0_16px_40px_rgba(30,80,140,0.35)]"
      >
        {children}
      </div>
    </div>
  );
}

function Note() {
  const [sheets, setSheets] = useState<Sheet[]>([empty()]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [popup, setPopup] = useState<Popup>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mode, setMode] = useState<"write" | "draw">("write");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const history = useRef<Sheet[]>([]);
  const future = useRef<Sheet[]>([]);

  const sheet = sheets[index] ?? empty();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Sheet[];
        if (parsed.length) setSheets(parsed.map((s) => ({ ...empty(), ...s })));
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
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    history.current = [];
    future.current = [];
    const data = sheets[index]?.drawing;
    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = data;
    }
  }, [index, loaded]);

  const update = (patch: Partial<Sheet>) =>
    setSheets((s) => s.map((x, i) => (i === index ? { ...x, ...patch } : x)));

  const snapshot = () => {
    history.current.push({ ...sheet });
    if (history.current.length > 30) history.current.shift();
    future.current = [];
  };

  const paint = (data: string | null) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = data;
    }
  };

  const applySheet = (s: Sheet) => {
    setSheets((all) => all.map((x, i) => (i === index ? s : x)));
    paint(s.drawing);
  };

  const undo = () => {
    const prev = history.current.pop();
    if (!prev) return;
    future.current.push({ ...sheet });
    applySheet(prev);
  };

  const redo = () => {
    const next = future.current.pop();
    if (!next) return;
    history.current.push({ ...sheet });
    applySheet(next);
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const openPopup = (p: Popup) => setPopup((cur) => (cur === p ? null : p));
  const close = () => {
    setPopup(null);
    setConfirmDelete(false);
  };

  return (
    <ScreenLayout>
      <ScreenHeader title="Le note della tua giornata" />

      {/* Foglio di carta realistico */}
      <div className="relative mt-2 flex-1 overflow-hidden rounded-[0.9rem] rounded-tr-[2.2rem] bg-[linear-gradient(150deg,#ffffff_0%,#fbfaf6_45%,#f3f1ea_100%)] p-4 shadow-[0_18px_45px_rgba(30,80,140,0.32),0_2px_0_rgba(255,255,255,0.9)_inset,-6px_0_14px_-10px_rgba(0,0,0,0.25)_inset] ring-1 ring-black/5">
        <div className="pointer-events-none absolute inset-y-0 left-7 w-px bg-red-300/40" />
        <textarea
          value={sheet.text}
          onChange={(e) => {
            if (!history.current.length || history.current[history.current.length - 1]!.text !== sheet.text)
              snapshot();
            update({ text: e.target.value });
          }}
          placeholder="Scrivi cosa ti passa per la mente."
          style={{
            fontFamily: sheet.font,
            color: sheet.color,
            fontSize: `${sheet.size / 100}rem`,
            lineHeight: 1.6,
          }}
          className="relative size-full resize-none bg-transparent pl-5 outline-none placeholder:opacity-40"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full touch-none"
          style={{ pointerEvents: mode === "draw" && !popup ? "auto" : "none" }}
          onPointerDown={(e) => {
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            snapshot();
            drawing.current = true;
            const p = pos(e);
            ctx.globalAlpha = sheet.alpha / 100;
            ctx.strokeStyle = sheet.color;
            ctx.lineWidth = Math.max(1, (sheet.size / 100) * 2.5);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + 0.01, p.y);
            ctx.stroke();
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
            const rect = e.currentTarget.getBoundingClientRect();
            const points = events.length
              ? events.map((ev) => ({ x: ev.clientX - rect.left, y: ev.clientY - rect.top }))
              : [pos(e)];
            for (const p of points) ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }}
          onPointerUp={() => {
            if (!drawing.current) return;
            drawing.current = false;
            update({ drawing: canvasRef.current?.toDataURL() ?? null });
          }}
        />
      </div>

      {/* 6 pulsanti */}
      <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto pb-1">
        <ToolButton label="Modalità" active={popup === "mode"} onClick={() => openPopup("mode")}>
          <span className="animate-in fade-in zoom-in duration-200" key={mode}>
            {mode === "write" ? <Type className="size-5" /> : <PenLine className="size-5" />}
          </span>
        </ToolButton>
        <ToolButton label="Dimensione" active={popup === "size"} onClick={() => openPopup("size")}>
          <Baseline className="size-5" />
        </ToolButton>
        <ToolButton label="Colore" active={popup === "color"} onClick={() => openPopup("color")}>
          <Palette className="size-5" />
        </ToolButton>
        <ToolButton
          label={mode === "write" ? "Font" : "Trasparenza"}
          active={popup === "fourth"}
          onClick={() => openPopup("fourth")}
        >
          <span className="animate-in fade-in zoom-in duration-200" key={mode}>
            {mode === "write" ? <Layers className="size-5" /> : <Droplets className="size-5" />}
          </span>
        </ToolButton>
        <ToolButton label="Azioni" active={popup === "actions"} onClick={() => openPopup("actions")}>
          <Undo2 className="size-5" />
        </ToolButton>
        <ToolButton label="Fogli" active={popup === "sheets"} onClick={() => openPopup("sheets")}>
          <Files className="size-5" />
        </ToolButton>
      </div>

      {popup === "mode" && (
        <Popup onClose={close}>
          <div className="flex flex-col gap-2">
            <PopupRow
              onClick={() => {
                setMode("write");
                close();
              }}
            >
              <Type className="size-5" /> Scrittura
              {mode === "write" && <Check className="ml-auto size-4" />}
            </PopupRow>
            <PopupRow
              onClick={() => {
                setMode("draw");
                close();
              }}
            >
              <PenLine className="size-5" /> Disegno
              {mode === "draw" && <Check className="ml-auto size-4" />}
            </PopupRow>
          </div>
        </Popup>
      )}

      {popup === "size" && (
        <Popup onClose={close}>
          <p className="mb-3 text-center text-base font-semibold text-foreground">
            Dimensione: {sheet.size}%
          </p>
          <div className="flex items-center gap-3">
            <ToolButton
              label="Riduci"
              onClick={() => update({ size: Math.max(50, sheet.size - 10) })}
            >
              <Minus className="size-5" />
            </ToolButton>
            <input
              type="range"
              min={50}
              max={300}
              step={5}
              value={sheet.size}
              onChange={(e) => update({ size: Number(e.target.value) })}
              className="flex-1 accent-[color:var(--primary)]"
            />
            <ToolButton
              label="Aumenta"
              onClick={() => update({ size: Math.min(300, sheet.size + 10) })}
            >
              <Plus className="size-5" />
            </ToolButton>
          </div>
          <PopupRow onClick={close}>
            <Check className="size-5" /> Conferma
          </PopupRow>
        </Popup>
      )}

      {popup === "color" && (
        <Popup onClose={close}>
          <div className="grid max-h-64 grid-cols-8 gap-2 overflow-y-auto">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Colore ${c}`}
                onClick={() => {
                  vibrate(10);
                  update({ color: c });
                  close();
                }}
                style={{ backgroundColor: c }}
                className="size-8 rounded-full ring-1 ring-white/70 active:scale-90"
              />
            ))}
          </div>
        </Popup>
      )}

      {popup === "fourth" && mode === "write" && (
        <Popup onClose={close}>
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {FONTS.map((f) => (
              <PopupRow
                key={f.label}
                onClick={() => {
                  update({ font: f.value });
                  close();
                }}
              >
                <span style={{ fontFamily: f.value }}>{f.label}</span>
                {sheet.font === f.value && <Check className="ml-auto size-4" />}
              </PopupRow>
            ))}
          </div>
        </Popup>
      )}

      {popup === "fourth" && mode === "draw" && (
        <Popup onClose={close}>
          <p className="mb-3 text-center text-base font-semibold text-foreground">
            Trasparenza: {100 - sheet.alpha}%
          </p>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={sheet.alpha}
            onChange={(e) => update({ alpha: Number(e.target.value) })}
            className="w-full accent-[color:var(--primary)]"
          />
          <PopupRow onClick={close}>
            <Check className="size-5" /> Conferma
          </PopupRow>
        </Popup>
      )}

      {popup === "actions" && (
        <Popup onClose={close}>
          <div className="flex flex-col gap-2">
            <PopupRow
              disabled={!history.current.length}
              onClick={() => {
                undo();
                close();
              }}
            >
              <Undo2 className="size-5" /> Undo
            </PopupRow>
            <PopupRow
              disabled={!future.current.length}
              onClick={() => {
                redo();
                close();
              }}
            >
              <Redo2 className="size-5" /> Redo
            </PopupRow>
            <PopupRow
              onClick={() => {
                snapshot();
                update({ text: "", drawing: null });
                paint(null);
                close();
              }}
            >
              <Trash2 className="size-5" /> Elimina
            </PopupRow>
          </div>
        </Popup>
      )}

      {popup === "sheets" && (
        <Popup onClose={close}>
          {confirmDelete ? (
            <div className="flex flex-col gap-3">
              <p className="text-center text-base text-foreground">
                Vuoi davvero eliminare questo foglio?
              </p>
              <div className="flex gap-2">
                <PopupRow onClick={() => setConfirmDelete(false)}>Annulla</PopupRow>
                <PopupRow
                  onClick={() => {
                    setSheets((s) => {
                      const next = s.filter((_, i) => i !== index);
                      return next.length ? next : [empty()];
                    });
                    setIndex((i) => Math.max(0, i - 1));
                    close();
                  }}
                >
                  <Trash2 className="size-5" /> Elimina
                </PopupRow>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-center text-base font-semibold text-foreground">
                Foglio {index + 1} di {sheets.length}
              </p>
              <PopupRow
                onClick={() => {
                  setSheets((s) => [...s, empty()]);
                  setIndex(sheets.length);
                  close();
                }}
              >
                <Plus className="size-5" /> Nuovo foglio
              </PopupRow>
              <PopupRow
                disabled={index === 0}
                onClick={() => {
                  setIndex((i) => i - 1);
                  close();
                }}
              >
                <ArrowLeft className="size-5" /> Foglio precedente
              </PopupRow>
              <PopupRow
                disabled={index >= sheets.length - 1}
                onClick={() => {
                  setIndex((i) => i + 1);
                  close();
                }}
              >
                <ArrowRight className="size-5" /> Foglio successivo
              </PopupRow>
              <PopupRow onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-5" /> Cancella foglio
              </PopupRow>
            </div>
          )}
        </Popup>
      )}
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
