import { useRef, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";

/**
 * Carosello foto touch riutilizzabile (versione 0000 e 2202).
 * `photos` sono URL: in futuro la 2202 può passare foto predefinite.
 */
export function PhotoCarousel({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);

  if (photos.length === 0) {
    return (
      <GlassPanel className="mt-4 grid h-56 place-items-center px-6">
        <p className="text-center text-sm text-foreground/80">Nessuna foto ancora</p>
      </GlassPanel>
    );
  }

  const clamp = (i: number) => Math.max(0, Math.min(photos.length - 1, i));

  return (
    <div className="mt-4">
      <GlassPanel
        className="overflow-hidden p-2"
        // eslint-disable-next-line
      >
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
            if (Math.abs(drag) > 50) setIndex((i) => clamp(i + (drag < 0 ? 1 : -1)));
            setDrag(0);
            startX.current = null;
          }}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${drag}px))`,
              transition: startX.current === null ? "transform 320ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          >
            {photos.map((src, i) => (
              <div key={src + i} className="w-full shrink-0 px-1">
                <img
                  src={src}
                  alt={`Ricordo ${i + 1}`}
                  loading="lazy"
                  className="mx-auto max-h-72 w-full rounded-2xl object-contain shadow-[0_10px_30px_rgba(30,80,140,0.25)] ring-1 ring-white/60"
                />
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="mt-3 flex justify-center gap-2">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`size-2 rounded-full transition-all ${
              i === index ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
