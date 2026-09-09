import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

const THRESHOLD = 100;

/** Disegna la patina: cielo scuro stellato con stelline morbide e arrotondate. */
function paintPatina(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0b1533");
  g.addColorStop(1, "#1b2a55");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const count = Math.round((w * h) / 3200);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.8 + Math.random() * 2.2;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    halo.addColorStop(0, "rgba(255,255,255,0.9)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Minigioco scratchcard: gratta la patina stellata per rivelare la foto. */
export function ScratchCard() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const drawing = useRef(false);
  const lastVibe = useRef(0);
  const t = useT();

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintPatina(ctx, rect.width, rect.height);
    setPercent(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (photo) reset();
  }, [photo, reset]);

  const measure = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++;
      if ((data[i] ?? 255) < 40) clear++;
    }
    return total ? Math.round((clear / total) * 100) : 0;
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || done) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 24, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastVibe.current > 90) {
      lastVibe.current = now;
      vibrate(8);
    }

    const p = measure();
    setPercent(p);
    if (p >= THRESHOLD) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      setPercent(100);
      setDone(true);
      setStars(true);
      window.setTimeout(() => setStars(false), 1000);
    }
  };

  const pickPhoto = () => inputRef.current?.click();

  return (
    <div className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPhoto(URL.createObjectURL(file));
          e.target.value = "";
        }}
      />

      <GlassPanel className="relative overflow-hidden rounded-[2rem] p-3">
        <div
          ref={wrapRef}
          className="relative h-[380px] w-full overflow-hidden rounded-[1.5rem]"
        >
          {photo ? (
            <>
              <img
                src={photo}
                alt={t("La tua foto da grattare")}
                className="absolute inset-0 h-full w-full rounded-[1.5rem] object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full touch-none rounded-[1.5rem]"
                onPointerDown={(e) => {
                  drawing.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  scratch(e);
                }}
                onPointerMove={scratch}
                onPointerUp={() => (drawing.current = false)}
                onPointerCancel={() => (drawing.current = false)}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={pickPhoto}
              className="glass-center flex h-full w-full flex-col items-center justify-center gap-3 rounded-[1.5rem] px-6"
            >
              <span className="text-6xl font-light leading-none text-foreground">+</span>
              <span className="text-center text-base font-medium text-foreground">
                {t("Aggiungi le tue foto, e gratta via la rabbia!")}
              </span>
            </button>
          )}

          {stars && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 46 }).map((_, i) => {
                const size = 10 + ((i * 7) % 5) * 4 + (i % 3) * 3;
                const round = 3 + (i % 4);
                return (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className="animate-star-fall absolute"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${(i * 17.3 + (i % 5) * 4) % 96}%`,
                      top: `${-6 - (i % 7) * 8}%`,
                      ["--fall" as string]: `${320 + (i % 6) * 40}px`,
                      ["--drift" as string]: `${((i % 7) - 3) * 14}px`,
                      ["--spin" as string]: `${((i % 5) - 2) * 90}deg`,
                      ["--dur" as string]: `${0.85 + (i % 4) * 0.08}s`,
                      animationDelay: `${(i % 8) * 0.05}s`,
                    }}
                  >
                    <path
                      d="M12 3.2 L14.3 9 L20.4 9.4 L15.7 13.4 L17.2 19.3 L12 16 L6.8 19.3 L8.3 13.4 L3.6 9.4 L9.7 9 Z"
                      fill="#FFD84D"
                      stroke="#FFD84D"
                      strokeWidth={round}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                );
              })}
            </div>
          )}

        </div>
      </GlassPanel>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full border border-white/60 bg-white/20 backdrop-blur-md">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-[width] duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-12 text-right text-sm font-semibold text-foreground">
          {percent}%
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          aria-label={t("Ricarica il minigioco")}
          onClick={() => {
            vibrate(10);
            reset();
          }}
          className="glass-center grid size-12 place-items-center rounded-full text-foreground"
        >
          <RotateCcw className="size-5" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          aria-label={t("Scegli una nuova foto")}
          onClick={() => {
            vibrate(10);
            pickPhoto();
          }}
          className="glass-center grid size-12 place-items-center rounded-full text-2xl font-light leading-none text-foreground"
        >
          +
        </button>
      </div>
    </div>
  );
}
