import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/schermata-3")({
  head: () => ({
    meta: [
      { title: "Schermata 3 — AngyHealth" },
      { name: "description", content: "Terza schermata secondaria dell'app AngyHealth." },
      { property: "og:title", content: "Schermata 3 — AngyHealth" },
      { property: "og:description", content: "Terza schermata secondaria dell'app AngyHealth." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-[clamp(1.4rem,6.2vw,1.8rem)] font-semibold tracking-tight text-foreground">Schermata 3</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
