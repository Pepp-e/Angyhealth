import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/schermata-5")({
  head: () => ({
    meta: [
      { title: "Schermata 5 — Nuvola" },
      { name: "description", content: "Quinta schermata secondaria dell'app Nuvola." },
      { property: "og:title", content: "Schermata 5 — Nuvola" },
      { property: "og:description", content: "Quinta schermata secondaria dell'app Nuvola." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Schermata 5</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
