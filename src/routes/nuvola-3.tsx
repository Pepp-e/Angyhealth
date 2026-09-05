import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassPanel } from "@/components/GlassPanel";
import { useAppVersion } from "@/lib/version";
import { vibrate } from "@/lib/vibration";

const PLAYLIST_URL = "https://open.spotify.com/playlist/4jZ6SzEt6iawYBYj2kohtL";
const APPLE_MUSIC_URL = "https://music.apple.com/browse";

/** Logo Spotify stilizzato (cerchio con onde). */
function SpotifyLogo() {
  return (
    <svg viewBox="0 0 64 64" className="size-14" role="img" aria-label="Spotify">
      <circle cx="32" cy="32" r="30" fill="#1DB954" />
      <g stroke="#0b0b0b" strokeLinecap="round" fill="none">
        <path d="M17 24c10-3 22-2 31 3" strokeWidth="5.5" />
        <path d="M19.5 33c8.5-2.4 18.5-1.6 26 2.6" strokeWidth="4.5" />
        <path d="M22 41.5c7-2 15-1.3 21 2.1" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

/** Logo Apple Music stilizzato (nota musicale su sfondo sfumato). */
function AppleMusicLogo() {
  return (
    <svg viewBox="0 0 64 64" className="size-14" role="img" aria-label="Apple Music">
      <defs>
        <linearGradient id="am-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FA57C1" />
          <stop offset="100%" stopColor="#FC3C44" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#am-g)" />
      <path
        d="M41 15.5 26 19.2v20.2a5.6 5.6 0 1 0 3.2 5v-16l11.8-2.9v11.6a5.6 5.6 0 1 0 3.2 5V15.5Z"
        fill="#fff"
      />
    </svg>
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
      className="block flex-1 transition-transform active:scale-[0.97]"
    >
      <GlassPanel className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[2rem]">
        {children}
        <span className="text-sm font-semibold text-foreground">{label}</span>
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

  return (
    <ScreenLayout>
      <ScreenHeader title="Sei triste? Ascolta un po di musica!" />

      {version === "0000" ? (
        <div className="mt-6 flex w-full gap-4">
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
      )}
    </ScreenLayout>
  );
}
