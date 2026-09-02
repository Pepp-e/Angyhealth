import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useAppVersion } from "@/lib/version";
import { vibrate } from "@/lib/vibration";

/** Foto predefinite della versione 2202 (da inserire in futuro). */
const PHOTOS_2202: string[] = [];

function Ricordi() {
  const version = useAppVersion();
  const [photos, setPhotos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const carouselPhotos = version === "2202" ? [...PHOTOS_2202, ...photos] : photos;

  return (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-[clamp(1.4rem,6.2vw,1.8rem)] font-semibold tracking-tight text-foreground">
          Rivivi i tuoi ricordi!
        </h1>
      </GlassPanel>

      {version === "0000" && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) setPhotos((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => {
              vibrate(20);
              inputRef.current?.click();
            }}
            className="glass mt-4 w-full rounded-3xl px-6 py-4 text-base font-semibold text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97]"
          >
            Aggiungi foto
          </button>
        </>
      )}

      <PhotoCarousel photos={carouselPhotos} />

      {version === "2202" && (
        <Link
          to="/lettera"
          onClick={() => vibrate(20)}
          className="glass mt-4 block rounded-3xl px-6 py-4 text-center text-base font-semibold text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97]"
        >
          Per quando non ti senti abbastanza
        </Link>
      )}
    </ScreenLayout>
  );
}

export const Route = createFileRoute("/schermata-2")({
  head: () => ({
    meta: [
      { title: "Rivivi i tuoi ricordi! — Nuvola" },
      { name: "description", content: "Rivivi i tuoi ricordi con le tue foto più belle." },
      { property: "og:title", content: "Rivivi i tuoi ricordi! — Nuvola" },
      { property: "og:description", content: "Rivivi i tuoi ricordi con le tue foto più belle." },
    ],
  }),
  component: Ricordi,
});
