import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { BackButton } from "@/components/BackButton";
import { ScratchCard } from "@/components/ScratchCard";

export const Route = createFileRoute("/nuvola-1")({
  head: () => ({
    meta: [
      { title: "Rabbia — Nuvola" },
      { name: "description", content: "Minigioco scratchcard: aggiungi una foto e gratta via la rabbia." },
      { property: "og:title", content: "Rabbia — Nuvola" },
      { property: "og:description", content: "Minigioco scratchcard: aggiungi una foto e gratta via la rabbia." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <BackButton />
      <h1 className="px-2 text-center text-[clamp(1.6rem,7.5vw,2.125rem)] font-bold tracking-tight text-foreground">
        Sei arrabbiata? Gratta via la tua rabbia!
      </h1>
      <ScratchCard />
    </ScreenLayout>
  ),
});
