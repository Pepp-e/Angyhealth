import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScreenLayout } from "@/components/ScreenLayout";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useAppVersion } from "@/lib/version";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

/** Chiave locale: le foto restano solo sul dispositivo dell'utente. */
const STORAGE_KEY = "ricordi-photos";

function Ricordi() {
  const version = useAppVersion();
  const t = useT();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPhotos(JSON.parse(raw) as string[]);
    } catch {
      /* ignora */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch {
      /* quota piena */
    }
  }, [photos, loaded]);

  const readFiles = async (files: File[]) => {
    const urls = await Promise.all(
      files.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(f);
          }),
      ),
    );
    setPhotos((p) => [...p, ...urls]);
  };

  return (
    <ScreenLayout>
      <h1 className="text-center text-[clamp(1.4rem,6.2vw,1.8rem)] font-semibold tracking-tight text-foreground">
        {t("Rivivi i tuoi ricordi!")}
      </h1>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void readFiles(files);
          e.target.value = "";
        }}
      />

      <PhotoCarousel
        photos={photos}
        onAdd={() => inputRef.current?.click()}
        onDelete={(i) => setPhotos((p) => p.filter((_, j) => j !== i))}
      />

      {version === "2202" && (
        <Link
          to="/lettera"
          onClick={() => vibrate(20)}
          className="glass mt-4 block rounded-3xl px-6 py-4 text-center text-base font-semibold text-white shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform active:scale-[0.97]"
        >
          {t("Per quando non ti senti abbastanza")}
        </Link>
      )}
    </ScreenLayout>
  );
}

export const Route = createFileRoute("/schermata-2")({
  head: () => ({
    meta: [
      { title: "Rivivi i tuoi ricordi! — AngyHealth" },
      { name: "description", content: "Rivivi i tuoi ricordi con le tue foto più belle." },
      { property: "og:title", content: "Rivivi i tuoi ricordi! — AngyHealth" },
      { property: "og:description", content: "Rivivi i tuoi ricordi con le tue foto più belle." },
    ],
  }),
  component: Ricordi,
});
