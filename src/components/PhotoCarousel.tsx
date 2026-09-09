import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

/**
 * Carosello foto touch riutilizzabile (versione 0000 e 2202).
 * Scorrimento circolare, pulsante "+" e cestino.
 */
export function PhotoCarousel({
  photos,
  onAdd,
  onDelete,
}: {
  photos: string[];
  /** Apre il selettore file del dispositivo. */
  onAdd?: () => void;
  /** Elimina la foto all'indice indicato. */
  onDelete?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);
  const t = useT();

  const count = photos.length;
  const current = count ? ((index % count) + count) % count : 0;

  if (count === 0) {
    return (
      <button
        type="button"
        onClick={() => {
          vibrate(20);
          onAdd?.();
        }}
        className="glass mx-auto mt-4 grid aspect-[3/4] w-full max-w-[19rem] place-items-center rounded-[1.6rem] px-6 shadow-[0_12px_34px_rgba(30,80,140,0.25)] transition-transform active:scale-[0.98]"
      >
        <span className="text-base font-medium text-foreground">{t("Aggiungi le foto!")}</span>
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div
        className="touch-pan-y mx-auto w-full max-w-[19rem] select-none"
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(e) => {
          if (startX.current === null) return;
          setDrag((e.touches[0]?.clientX ?? 0) - startX.current);
        }}
        onTouchEnd={() => {
          if (Math.abs(drag) > 50) setIndex((i) => i + (drag < 0 ? 1 : -1));
          setDrag(0);
          startX.current = null;
        }}
      >
        <GlassPanel
          className="rounded-[1.6rem] p-3 pb-10 shadow-[0_14px_38px_rgba(30,80,140,0.28)]"
        >
          <div
            style={{
              transform: `translateX(${drag}px) rotate(${drag * 0.02}deg)`,
              transition:
                startX.current === null ? "transform 320ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.1rem] ring-1 ring-white/60">
              <img
                src={photos[current]}
                alt={`${t("Ricordo")} ${current + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          aria-label={t("Aggiungi foto")}
          onClick={() => {
            vibrate(20);
            onAdd?.();
          }}
          className="glass-dark grid size-12 place-items-center rounded-full text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.95]"
        >
          <Plus className="size-6" />
        </button>

        <div className="flex h-3 items-center justify-center gap-2">
          {(() => {
            const max = 14;
            let start = 0;
            if (count > max) {
              start = Math.min(Math.max(current - Math.floor(max / 2), 0), count - max);
            }
            const end = count > max ? start + max : count;
            return photos.slice(start, end).map((_, i) => {
              const idx = start + i;
              return (
                <span
                  key={idx}
                  className={`size-2 shrink-0 rounded-full transition-all ${
                    idx === current
                      ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                      : "bg-white/40"
                  }`}
                />
              );
            });
          })()}
        </div>

        <button
          type="button"
          aria-label={t("Elimina foto")}
          onClick={() => {
            vibrate(20);
            onDelete?.(current);
            setIndex(current >= count - 1 ? 0 : current);
          }}
          className="glass-dark grid size-12 place-items-center rounded-full text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.95]"
        >
          <Trash2 className="size-6" />
        </button>
      </div>
    </div>
  );
}
