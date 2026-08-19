import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/schermata-6")({
  head: () => ({
    meta: [
      { title: "Schermata 6 — Nuvola" },
      { name: "description", content: "Sesta schermata secondaria dell'app Nuvola." },
      { property: "og:title", content: "Schermata 6 — Nuvola" },
      { property: "og:description", content: "Sesta schermata secondaria dell'app Nuvola." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Schermata 6</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
