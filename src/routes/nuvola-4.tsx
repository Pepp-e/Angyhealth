import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GroundingGame } from "@/components/GroundingGame";

export const Route = createFileRoute("/nuvola-4")({
  head: () => ({
    meta: [
      { title: "Sei in ansia? Ritorna al presente — AngyHealth" },
      { name: "description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
      { property: "og:title", content: "Sei in ansia? Ritorna al presente — AngyHealth" },
      { property: "og:description", content: "Esercizio di grounding 5-4-3-2-1 per i momenti di ansia." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <ScreenHeader title="Sei in ansia? Ritorna al presente" />
      <GroundingGame />
    </ScreenLayout>
  ),
});
