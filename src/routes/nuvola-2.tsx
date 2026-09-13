import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { BreathingGame } from "@/components/BreathingGame";

export const Route = createFileRoute("/nuvola-2")({
  head: () => ({
    meta: [
      { title: "Sei in panico? Respira con calma — AngyHealth" },
      { name: "description", content: "Minigioco di respirazione guidata per i momenti di panico." },
      { property: "og:title", content: "Sei in panico? Respira con calma — AngyHealth" },
      { property: "og:description", content: "Minigioco di respirazione guidata per i momenti di panico." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <ScreenHeader title="Sei in panico? Respira con calma" />
      <BreathingGame />
    </ScreenLayout>
  ),
});
