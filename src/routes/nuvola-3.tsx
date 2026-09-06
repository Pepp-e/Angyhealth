import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassPanel } from "@/components/GlassPanel";
import { useAppVersion } from "@/lib/version";
import { vibrate } from "@/lib/vibration";

const PLAYLIST_URL = "https://open.spotify.com/playlist/4jZ6SzEt6iawYBYj2kohtL";
const APPLE_MUSIC_URL = "https://music.apple.com/browse";

/** Logo ufficiale Spotify (cerchio verde con le tre onde). */
function SpotifyLogo() {
  return (
    <svg viewBox="0 0 168 168" className="size-12 shrink-0" role="img" aria-label="Spotify">
      <circle cx="84" cy="84" r="84" fill="#1ED760" />
      <g stroke="#000" fill="none" strokeLinecap="round">
        <path d="M38 62c30-9 62-6 88 9" strokeWidth="15" />
        <path d="M45 88c24-7 50-4 70 8" strokeWidth="12" />
        <path d="M52 112c18-5 38-3 54 6" strokeWidth="10" />
      </g>
    </svg>
  );
}

/** Logo ufficiale Apple Music (nota doppia su gradiente rosa/rosso). */
function AppleMusicLogo() {
  return (
    <svg viewBox="0 0 64 64" className="size-12 shrink-0" role="img" aria-label="Apple Music">
      <defs>
        <linearGradient id="am-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FA233B" />
          <stop offset="100%" stopColor="#FB5C74" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#am-g)" />
      <path
        d="M44 14.2 27 18.1v22.5a6.2 6.2 0 1 0 3.5 5.6V25.4L44 22.2v13.1a6.2 6.2 0 1 0 3.5 5.6V14.2Z"
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
