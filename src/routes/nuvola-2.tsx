import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { BackButton } from "@/components/BackButton";
import { BreathingGame } from "@/components/BreathingGame";

export const Route = createFileRoute("/nuvola-2")({
  head: () => ({
    meta: [
      { title: "Sei in panico? Respira con calma — Nuvola" },
      { name: "description", content: "Minigioco di respirazione guidata per i momenti di panico." },
      { property: "og:title", content: "Sei in panico? Respira con calma — Nuvola" },
      { property: "og:description", content: "Minigioco di respirazione guidata per i momenti di panico." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <BackButton />
      <h1 className="px-2 text-center text-[clamp(1.4rem,6.2vw,1.8rem)] font-bold tracking-tight text-foreground">
        Sei in panico? Respira con calma
      </h1>
      <BreathingGame />
    </ScreenLayout>
  ),
});
