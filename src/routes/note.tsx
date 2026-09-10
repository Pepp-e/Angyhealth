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
import foglio from "@/assets/foglio.png.asset.json";
import { useT } from "@/lib/i18n";

const STORAGE_KEY = "note-fogli";

type Seg = {
  text: string;
  font: string;
  color: string;
  size: number;
};

type Sheet = {
  segments: Seg[];
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

const empty = (): Sheet => ({ segments: [], drawing: null });

/** 1% → 100% mappati su una progressione morbida di dimensioni. */
const fontRem = (size: number) => 0.6 + (size / 100) * 1.4;
const strokePx = (size: number) => 1 + (size / 100) * 5;

type Popup = "mode" | "size" | "color" | "fourth" | "actions" | "sheets" | null;
type Anim = "open" | "undo" | "redo" | "next" | "prev" | "new" | null;

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

const fullText = (s: Sheet) => s.segments.map((x) => x.text).join("");

function Note() {
  const t = useT();
  const [sheets, setSheets] = useState<Sheet[]>([empty()]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [popup, setPopup] = useState<Popup>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mode, setMode] = useState<"write" | "draw">("write");
  const [anim, setAnim] = useState<Anim>("open");
  // Stile applicato SOLO al testo scritto da ora in poi.
  const [style, setStyle] = useState({
    font: FONTS[0]!.value,
    color: "#112942",
    size: 50,
    alpha: 100,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  // Cronologia indipendente per ogni foglio.
  const history = useRef<Record<number, Sheet[]>>({});
  const future = useRef<Record<number, Sheet[]>>({});
  const [, force] = useState(0);

  const sheet = sheets[index] ?? empty();
  const text = fullText(sheet);

  const play = (a: Anim, ms = 420) => {
    setAnim(a);
    window.setTimeout(() => setAnim(null), ms);
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Sheet[];
        if (parsed.length)
          setSheets(
            parsed.map((s) => ({
              drawing: s.drawing ?? null,
              segments: Array.isArray(s.segments) ? s.segments : [],
            })),
          );
      }
    } catch {
      /* ignora */
    }
    setLoaded(true);
    window.setTimeout(() => setAnim(null), 900);
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
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const data = sheets[index]?.drawing;
    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = data;
    }

  }, [index, loaded]);

  const setSheet = (next: Sheet) => setSheets((all) => all.map((x, i) => (i === index ? next : x)));

  const snapshot = () => {
    const h = (history.current[index] ??= []);
    h.push({ segments: sheet.segments.map((s) => ({ ...s })), drawing: sheet.drawing });
    if (h.length > 30) h.shift();
    future.current[index] = [];
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
    setSheet(s);
    paint(s.drawing);
  };

  const undo = () => {
    const prev = (history.current[index] ??= []).pop();
    if (!prev) return;
    (future.current[index] ??= []).push({ segments: sheet.segments, drawing: sheet.drawing });
    play("undo", 380);
    applySheet(prev);
    force((n) => n + 1);
  };

  const redo = () => {
    const next = (future.current[index] ??= []).pop();
    if (!next) return;
    (history.current[index] ??= []).push({ segments: sheet.segments, drawing: sheet.drawing });
    play("redo", 380);
    applySheet(next);
    force((n) => n + 1);
  };

  /** Aggiunge il testo nuovo con lo stile corrente, lasciando invariato quello già scritto. */
  const onText = (value: string) => {
    if (value === text) return;
    if (!history.current[index]?.length || value.length % 8 === 0) snapshot();

    if (value.length > text.length && value.startsWith(text)) {
      const added = value.slice(text.length);
      const segs = sheet.segments.map((s) => ({ ...s }));
      const last = segs[segs.length - 1];
      if (last && last.font === style.font && last.color === style.color && last.size === style.size)
        last.text += added;
      else segs.push({ text: added, font: style.font, color: style.color, size: style.size });
      setSheet({ ...sheet, segments: segs });
      return;
    }

    // Prefisso comune: conserva stili, il resto prende lo stile corrente.
    let common = 0;
    while (common < value.length && common < text.length && value[common] === text[common]) common++;
    const segs: Seg[] = [];
    let used = 0;
    for (const s of sheet.segments) {
      if (used >= common) break;
      const take = Math.min(s.text.length, common - used);
      if (take > 0) segs.push({ ...s, text: s.text.slice(0, take) });
      used += take;
    }
    const rest = value.slice(common);
    if (rest) {
      const last = segs[segs.length - 1];
      if (last && last.font === style.font && last.color === style.color && last.size === style.size)
        last.text += rest;
      else segs.push({ text: rest, font: style.font, color: style.color, size: style.size });
    }
    setSheet({ ...sheet, segments: segs });
  };

  /** Converte le coordinate del puntatore in coordinate canvas, tenendo conto di eventuali scale/transform. */
  const toPos = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const sx = rect.width ? canvas.clientWidth / rect.width : 1;
    const sy = rect.height ? canvas.clientHeight / rect.height : 1;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => toPos(e.currentTarget, e.clientX, e.clientY);


  const openPopup = (p: Popup) => setPopup((cur) => (cur === p ? null : p));
  const close = () => {
    setPopup(null);
    setConfirmDelete(false);
  };

  const goTo = (i: number, a: Anim) => {
    play(a, 380);
    setIndex(i);
  };

  const animClass =
    anim === "open"
      ? "animate-note-open"
      : anim === "undo"
        ? "animate-note-undo"
        : anim === "redo"
          ? "animate-note-redo"
          : anim === "next"
            ? "animate-note-next"
            : anim === "prev"
              ? "animate-note-prev"
              : anim === "new"
                ? "animate-note-new"
                : "";

  return (
    <ScreenLayout>
      <ScreenHeader title="Le note della tua giornata" />

      {/* Foglio: PNG originale, senza cornici né deformazioni permanenti */}
      <div className="mt-2 flex min-h-0 flex-1 items-center justify-center [perspective:1200px]">
        <div className={`relative max-h-full ${animClass}`} style={{ willChange: "transform" }}>
          <img
            src={foglio.url}
            alt={t("Foglio di carta")}
            draggable={false}
            className="block max-h-[62svh] w-auto max-w-full select-none"
          />

          <div className="absolute inset-[7%]">
            {/* Testo renderizzato (segmenti con stile indipendente) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words text-left"
              style={{ lineHeight: 1.6 }}
            >
              {sheet.segments.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: s.font,
                    color: s.color,
                    fontSize: `${fontRem(s.size)}rem`,
                  }}
                >
                  {s.text}
                </span>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => onText(e.target.value)}
              placeholder={text ? "" : t("Scrivi cosa ti passa per la mente.")}
              spellCheck={false}
              style={{
                fontFamily: style.font,
                fontSize: `${fontRem(style.size)}rem`,
                lineHeight: 1.6,
                caretColor: style.color,
                color: "transparent",
              }}
              className="absolute inset-0 size-full resize-none bg-transparent outline-none placeholder:text-[#112942]/40"
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
                ctx.globalAlpha = style.alpha / 100;
                ctx.strokeStyle = style.color;
                ctx.lineWidth = strokePx(style.size);
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
                const canvas = e.currentTarget;
                const points = events.length
                  ? events.map((ev) => toPos(canvas, ev.clientX, ev.clientY))
                  : [pos(e)];

                for (const p of points) ctx.lineTo(p.x, p.y);
                ctx.stroke();
              }}
              onPointerUp={() => {
                if (!drawing.current) return;
                drawing.current = false;
                setSheet({ ...sheet, drawing: canvasRef.current?.toDataURL() ?? null });
              }}
            />
          </div>
        </div>
      </div>

      {/* 6 pulsanti */}
      <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto pb-1">
        <ToolButton label={t("Modalità")} active={popup === "mode"} onClick={() => openPopup("mode")}>
          <span className="animate-in fade-in zoom-in duration-200" key={mode}>
            {mode === "write" ? <Type className="size-5" /> : <PenLine className="size-5" />}
          </span>
        </ToolButton>
        <ToolButton label={t("Dimensione")} active={popup === "size"} onClick={() => openPopup("size")}>
          <Baseline className="size-5" />
        </ToolButton>
        <ToolButton label={t("Colore")} active={popup === "color"} onClick={() => openPopup("color")}>
          <Palette className="size-5" />
        </ToolButton>
        <ToolButton
          label={mode === "write" ? t("Font") : t("Trasparenza")}
          active={popup === "fourth"}
          onClick={() => openPopup("fourth")}
        >
          <span className="animate-in fade-in zoom-in duration-200" key={mode}>
            {mode === "write" ? <Layers className="size-5" /> : <Droplets className="size-5" />}
          </span>
        </ToolButton>
        <ToolButton label={t("Azioni")} active={popup === "actions"} onClick={() => openPopup("actions")}>
          <Undo2 className="size-5" />
        </ToolButton>
        <ToolButton label={t("Fogli")} active={popup === "sheets"} onClick={() => openPopup("sheets")}>
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
              <Type className="size-5" /> {t("Scrittura")}
              {mode === "write" && <Check className="ml-auto size-4" />}
            </PopupRow>
            <PopupRow
              onClick={() => {
                setMode("draw");
                close();
              }}
            >
              <PenLine className="size-5" /> {t("Disegno")}
              {mode === "draw" && <Check className="ml-auto size-4" />}
            </PopupRow>
          </div>
        </Popup>
      )}

      {popup === "size" && (
        <Popup onClose={close}>
          <p className="mb-3 text-center text-base font-semibold text-foreground">
            {t("Dimensione")}: {style.size}%
          </p>
          <div className="flex items-center gap-3">
            <ToolButton
              label={t("Riduci")}
              onClick={() => setStyle((s) => ({ ...s, size: Math.max(1, s.size - 5) }))}
            >
              <Minus className="size-5" />
            </ToolButton>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={style.size}
              onChange={(e) => setStyle((s) => ({ ...s, size: Number(e.target.value) }))}
              className="flex-1 accent-[color:var(--primary)]"
            />
            <ToolButton
              label={t("Aumenta")}
              onClick={() => setStyle((s) => ({ ...s, size: Math.min(100, s.size + 5) }))}
            >
              <Plus className="size-5" />
            </ToolButton>
          </div>
          <PopupRow onClick={close}>
            <Check className="size-5" /> {t("Conferma")}
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
                aria-label={`${t("Colore")} ${c}`}
                onClick={() => {
                  vibrate(10);
                  setStyle((s) => ({ ...s, color: c }));
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
                  setStyle((s) => ({ ...s, font: f.value }));
                  close();
                }}
              >
                <span style={{ fontFamily: f.value }}>{t(f.label)}</span>
                {style.font === f.value && <Check className="ml-auto size-4" />}
              </PopupRow>
            ))}
          </div>
        </Popup>
      )}

      {popup === "fourth" && mode === "draw" && (
        <Popup onClose={close}>
          <p className="mb-3 text-center text-base font-semibold text-foreground">
            {t("Trasparenza")}: {100 - style.alpha}%
          </p>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={style.alpha}
            onChange={(e) => setStyle((s) => ({ ...s, alpha: Number(e.target.value) }))}
            className="w-full accent-[color:var(--primary)]"
          />
          <PopupRow onClick={close}>
            <Check className="size-5" /> {t("Conferma")}
          </PopupRow>
        </Popup>
      )}

      {popup === "actions" && (
        <Popup onClose={close}>
          <div className="flex flex-col gap-2">
            <PopupRow
              disabled={!history.current[index]?.length}
              onClick={() => {
                close();
                undo();
              }}
            >
              <Undo2 className="size-5" /> Undo
            </PopupRow>
            <PopupRow
              disabled={!future.current[index]?.length}
              onClick={() => {
                close();
                redo();
              }}
            >
              <Redo2 className="size-5" /> Redo
            </PopupRow>
            <PopupRow
              onClick={() => {
                snapshot();
                setSheet({ segments: [], drawing: null });
                paint(null);
                close();
              }}
            >
              <Trash2 className="size-5" /> {t("Elimina")}
            </PopupRow>
          </div>
        </Popup>
      )}

      {popup === "sheets" && (
        <Popup onClose={close}>
          {confirmDelete ? (
            <div className="flex flex-col gap-3">
              <p className="text-center text-base text-foreground">
                {t("Vuoi davvero eliminare questo foglio?")}
              </p>
              <div className="flex gap-2">
                <PopupRow onClick={() => setConfirmDelete(false)}>{t("Annulla")}</PopupRow>
                <PopupRow
                  onClick={() => {
                    setSheets((s) => {
                      const next = s.filter((_, i) => i !== index);
                      return next.length ? next : [empty()];
                    });
                    history.current = {};
                    future.current = {};
                    setIndex((i) => Math.max(0, i - 1));
                    close();
                  }}
                >
                  <Trash2 className="size-5" /> {t("Elimina")}
                </PopupRow>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-center text-base font-semibold text-foreground">
                {t("Foglio")} {index + 1} {t("di")} {sheets.length}
              </p>
              <PopupRow
                onClick={() => {
                  setSheets((s) => [...s, empty()]);
                  goTo(sheets.length, "new");
                  close();
                }}
              >
                <Plus className="size-5" /> {t("Nuovo foglio")}
              </PopupRow>
              <PopupRow
                disabled={index === 0}
                onClick={() => {
                  goTo(index - 1, "prev");
                  close();
                }}
              >
                <ArrowLeft className="size-5" /> {t("Foglio precedente")}
              </PopupRow>
              <PopupRow
                disabled={index >= sheets.length - 1}
                onClick={() => {
                  goTo(index + 1, "next");
                  close();
                }}
              >
                <ArrowRight className="size-5" /> {t("Foglio successivo")}
              </PopupRow>
              <PopupRow onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-5" /> {t("Cancella foglio")}
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
