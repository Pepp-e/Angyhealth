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
      <div className="flex flex-1 items-center justify-center">
        <GlassPanel className="flex w-full flex-col items-center gap-6 px-6 py-10">
          <h1 className="text-center text-xl font-semibold tracking-tight text-foreground">
            Tocca la nuvola
          </h1>
          <CloudButton to="/schermata-1" label="Vai alla seconda schermata" />
        </GlassPanel>
      </div>
    </ScreenLayout>
  );
}
