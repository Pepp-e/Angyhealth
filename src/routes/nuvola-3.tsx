import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { BackButton } from "@/components/BackButton";
import { GlassPanel } from "@/components/GlassPanel";

const PLAYLIST_URL =
  "https://open.spotify.com/playlist/4jZ6SzEt6iawYBYj2kohtL";

export const Route = createFileRoute("/nuvola-3")({
  head: () => ({
    meta: [
      { title: "Tristezza — Nuvola" },
      { name: "description", content: "Ascolta la playlist Spotify pensata per i momenti di tristezza." },
      { property: "og:title", content: "Tristezza — Nuvola" },
      { property: "og:description", content: "Ascolta la playlist Spotify pensata per i momenti di tristezza." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <BackButton />
      <h1 className="px-2 text-center text-[clamp(1.6rem,7.5vw,2.125rem)] font-bold tracking-tight text-foreground">
        Sei triste? Ascolta un po di musica!
      </h1>

      <GlassPanel className="mt-6 overflow-hidden rounded-[2rem] p-3">
        <iframe
          title="Playlist Spotify"
          src="https://open.spotify.com/embed/playlist/4jZ6SzEt6iawYBYj2kohtL?utm_source=generator"
          className="h-[352px] w-full rounded-[1.5rem] border-0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-2xl px-4 py-2 text-center text-sm font-semibold text-foreground"
        >
          Apri la playlist su Spotify
        </a>
      </GlassPanel>
    </ScreenLayout>
  ),
});
