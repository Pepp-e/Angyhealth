import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScratchCard } from "@/components/ScratchCard";

export const Route = createFileRoute("/nuvola-1")({
  head: () => ({
    meta: [
      { title: "Rabbia — AngyHealth" },
      { name: "description", content: "Minigioco scratchcard: aggiungi una foto e gratta via la rabbia." },
      { property: "og:title", content: "Rabbia — AngyHealth" },
      { property: "og:description", content: "Minigioco scratchcard: aggiungi una foto e gratta via la rabbia." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <ScreenHeader title="Sei arrabbiata? Gratta via la tua rabbia!" />
      <ScratchCard />
    </ScreenLayout>
  ),
});
