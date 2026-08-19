import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/nuvola-4")({
  head: () => ({
    meta: [
      { title: "Nuvola 4 — Nuvola" },
      { name: "description", content: "Schermata collegata alla nuvola 4." },
      { property: "og:title", content: "Nuvola 4 — Nuvola" },
      { property: "og:description", content: "Schermata collegata alla nuvola 4." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <GlassPanel className="px-6 py-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Nuvola 4</h1>
      </GlassPanel>
    </ScreenLayout>
  ),
});
