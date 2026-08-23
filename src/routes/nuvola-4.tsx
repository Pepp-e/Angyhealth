import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GroundingGame } from "@/components/GroundingGame";

export const Route = createFileRoute("/nuvola-4")({
  head: () => ({
    meta: [
      { title: "Ritorna al presente — Nuvola" },
      { name: "description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
      { property: "og:title", content: "Ritorna al presente — Nuvola" },
      { property: "og:description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <h1 className="px-2 text-center text-2xl font-bold tracking-tight text-foreground">
        Ritorna al presente
      </h1>
      <GroundingGame />
    </ScreenLayout>
  ),
});
