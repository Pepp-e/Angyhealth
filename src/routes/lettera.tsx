import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassPanel } from "@/components/GlassPanel";

export const Route = createFileRoute("/lettera")({
  head: () => ({
    meta: [
      { title: "Per quando non ti senti abbastanza — Nuvola" },
      { name: "description", content: "Uno spazio dedicato a una lettera per i momenti difficili." },
      { property: "og:title", content: "Per quando non ti senti abbastanza — Nuvola" },
      {
        property: "og:description",
        content: "Uno spazio dedicato a una lettera per i momenti difficili.",
      },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <ScreenHeader title="Per quando non ti senti abbastanza" />
      {/* Spazio predisposto per la lettera futura */}
      <GlassPanel className="mt-2 min-h-40 px-6 py-8">
        <span className="sr-only">Spazio per la lettera</span>
      </GlassPanel>
    </ScreenLayout>
  ),
});
