import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/nuvola-3")({
  head: () => ({
    meta: [
      { title: "Nuvola 3 — Nuvola" },
      { name: "description", content: "Schermata collegata alla nuvola 3." },
      { property: "og:title", content: "Nuvola 3 — Nuvola" },
      { property: "og:description", content: "Schermata collegata alla nuvola 3." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Nuvola 3</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
