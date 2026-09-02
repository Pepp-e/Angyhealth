import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";

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
        className="glass mt-4 grid h-56 w-full place-items-center rounded-3xl px-6 transition-transform active:scale-[0.98]"
      >
        <span className="text-base font-medium text-foreground">Aggiungi le foto!</span>
      </button>
    );
  }

  return (
    <div className="mt-4">
      <GlassPanel className="relative overflow-hidden p-2">
        <div
          className="touch-pan-y select-none"
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
          <div
            className="flex"
            style={{
              transform: `translateX(${drag}px)`,
              transition: startX.current === null ? "transform 320ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          >
            <div className="w-full shrink-0 px-1">
              <img
                src={photos[current]}
                alt={`Ricordo ${current + 1}`}
                loading="lazy"
                className="mx-auto max-h-72 w-full rounded-2xl object-contain shadow-[0_10px_30px_rgba(30,80,140,0.25)] ring-1 ring-white/60"
              />
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Aggiungi foto"
          onClick={() => {
            vibrate(20);
            onAdd?.();
          }}
          className="glass grid size-12 place-items-center rounded-full text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.95]"
        >
          <Plus className="size-6" />
        </button>

        <div className="flex justify-center gap-2">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`size-2 rounded-full transition-all ${
                i === current ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Elimina foto"
          onClick={() => {
            vibrate(20);
            onDelete?.(current);
            setIndex(0);
          }}
          className="glass grid size-12 place-items-center rounded-full text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.95]"
        >
          <Trash2 className="size-6" />
        </button>
      </div>
    </div>
  );
}
