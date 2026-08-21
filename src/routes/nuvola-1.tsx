import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
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
      <h1 className="px-2 text-center text-2xl font-bold tracking-tight text-foreground">
        Rabbia
      </h1>
      <ScratchCard />
    </ScreenLayout>
  ),
});
