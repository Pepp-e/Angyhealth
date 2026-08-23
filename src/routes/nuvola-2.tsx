import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { BreathingGame } from "@/components/BreathingGame";

export const Route = createFileRoute("/nuvola-2")({
  head: () => ({
    meta: [
      { title: "Respira con calma — Nuvola" },
      { name: "description", content: "Minigioco di respirazione guidata per i momenti di panico." },
      { property: "og:title", content: "Respira con calma — Nuvola" },
      { property: "og:description", content: "Minigioco di respirazione guidata per i momenti di panico." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <h1 className="px-2 text-center text-2xl font-bold tracking-tight text-foreground">
        Respira con calma
      </h1>
      <BreathingGame />
    </ScreenLayout>
  ),
});
