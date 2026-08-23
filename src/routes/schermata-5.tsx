import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";

type Item = {
  title: string;
  description: string;
  to?: string;
};

/** Raccolta centrale dei minigiochi e contenuti delle nuvolette. */
const items: Item[] = [
  { title: "Rabbia", description: "Minigioco scratchcard: gratta via la rabbia.", to: "/nuvola-1" },
  { title: "Panico", description: "Respira con calma: respirazione guidata.", to: "/nuvola-2" },
  { title: "Tristezza", description: "Playlist Spotify per i momenti tristi.", to: "/nuvola-3" },
  { title: "Ansia", description: "Ritorna al presente: esercizio di grounding.", to: "/nuvola-4" },
];

function Card({ item }: { item: Item }) {
  const inner = (
    <GlassPanel className="w-full rounded-3xl px-5 py-4">
      <p className="text-base font-semibold text-foreground">{item.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
    </GlassPanel>
  );

  if (!item.to) return inner;

  return (
    <Link
      to={item.to}
      onClick={() => vibrate(10)}
      className="block transition-transform active:scale-[0.98]"
    >
      {inner}
    </Link>
  );
}

export const Route = createFileRoute("/schermata-5")({
  head: () => ({
    meta: [
      { title: "Minigiochi — Nuvola" },
      { name: "description", content: "Raccolta dei minigiochi e dei contenuti delle nuvolette." },
      { property: "og:title", content: "Minigiochi — Nuvola" },
      { property: "og:description", content: "Raccolta dei minigiochi e dei contenuti delle nuvolette." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <h1 className="px-2 text-center text-[clamp(1.6rem,7.5vw,2.125rem)] font-bold tracking-tight text-foreground">
        Minigiochi
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.title} item={item} />
        ))}
      </div>
    </ScreenLayout>
  ),
});
