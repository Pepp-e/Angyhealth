import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { CloudButton } from "@/components/CloudButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuvola — Schermata principale" },
      { name: "description", content: "App mobile-first con sfondo cielo e interfaccia liquid glass." },
      { property: "og:title", content: "Nuvola — Schermata principale" },
      { property: "og:description", content: "App mobile-first con sfondo cielo e interfaccia liquid glass." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ScreenLayout>
      <GlassPanel className="animate-soft-bounce mt-[1.65rem] px-6 py-5">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
          Stai avendo un attacco?
        </h1>
      </GlassPanel>

      <div className="flex flex-1 items-center justify-center">
        <CloudButton to="/schermata-1" label="Vai alla seconda schermata" />
      </div>
    </ScreenLayout>
  );
}
