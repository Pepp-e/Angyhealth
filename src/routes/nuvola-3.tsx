import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassPanel } from "@/components/GlassPanel";
import { useAppVersion } from "@/lib/version";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";
import spotifyAsset from "@/assets/spotify.png.asset.json";
import appleMusicAsset from "@/assets/apple-music.png.asset.json";

const PLAYLIST_URL = "https://open.spotify.com/playlist/4jZ6SzEt6iawYBYj2kohtL";
const APPLE_MUSIC_URL = "https://music.apple.com/browse";

/** Logo ufficiale Spotify. */
function SpotifyLogo() {
  return (
    <img
      src={spotifyAsset.url}
      alt="Spotify"
      className="size-12 shrink-0 object-contain"
    />
  );
}

/** Logo ufficiale Apple Music. */
function AppleMusicLogo() {
  return (
    <img
      src={appleMusicAsset.url}
      alt="Apple Music"
      className="size-12 shrink-0 object-contain"
    />
  );
}


function MusicTile({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => vibrate(20)}
      className="block w-full transition-transform active:scale-[0.97]"
    >
      <GlassPanel className="flex h-24 w-full items-center gap-4 rounded-[2rem] px-6">
        {children}
        <span className="text-lg font-semibold text-foreground">{label}</span>
      </GlassPanel>
    </a>
  );
}


export const Route = createFileRoute("/nuvola-3")({
  head: () => ({
    meta: [
      { title: "Tristezza — Nuvola" },
      { name: "description", content: "Ascolta un po' di musica nei momenti tristi." },
      { property: "og:title", content: "Tristezza — Nuvola" },
      { property: "og:description", content: "Ascolta un po' di musica nei momenti tristi." },
    ],
  }),
  component: TristezzaScreen,
});

function TristezzaScreen() {
  const version = useAppVersion();
  const t = useT();

  return (
    <ScreenLayout>
      <ScreenHeader title="Sei triste? Ascolta un po di musica!" />

      {version === "0000" ? (
        <div className="mt-6 flex w-full flex-col gap-4">
          <MusicTile href={PLAYLIST_URL} label="Spotify">
            <SpotifyLogo />
          </MusicTile>
          <MusicTile href={APPLE_MUSIC_URL} label="Apple Music">
            <AppleMusicLogo />
          </MusicTile>
        </div>
      ) : (
        <GlassPanel className="mt-6 overflow-hidden rounded-[2rem] p-3">
          <iframe
            title={t("Playlist Spotify")}
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
            {t("Apri la playlist su Spotify")}
          </a>
        </GlassPanel>
      )}
    </ScreenLayout>
  );
}
