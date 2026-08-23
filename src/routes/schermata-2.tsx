import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/schermata-2")({
  head: () => ({
    meta: [
      { title: "Schermata 2 — Nuvola" },
      { name: "description", content: "Seconda schermata secondaria dell'app Nuvola." },
      { property: "og:title", content: "Schermata 2 — Nuvola" },
      { property: "og:description", content: "Seconda schermata secondaria dell'app Nuvola." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-[clamp(1.6rem,7.5vw,2.125rem)] font-semibold tracking-tight text-foreground">Schermata 2</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
