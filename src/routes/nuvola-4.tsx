import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { BackButton } from "@/components/BackButton";
import { GroundingGame } from "@/components/GroundingGame";

export const Route = createFileRoute("/nuvola-4")({
  head: () => ({
    meta: [
      { title: "Sei in ansia? Ritorna al presente — Nuvola" },
      { name: "description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
      { property: "og:title", content: "Sei in ansia? Ritorna al presente — Nuvola" },
      { property: "og:description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <BackButton />
      <h1 className="px-2 text-center text-[clamp(1.6rem,7.5vw,2.125rem)] font-bold tracking-tight text-foreground">
        Sei in ansia? Ritorna al presente
      </h1>
      <GroundingGame />
    </ScreenLayout>
  ),
});
