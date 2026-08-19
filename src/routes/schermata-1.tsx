import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ColorCloud, type CloudColor } from "@/components/ColorCloud";

/** Testi, colori e ritardi di oscillazione delle nuvole. */
const clouds: { to: string; label: string; color: CloudColor; align: string; delay: string }[] = [
  { to: "/nuvola-1", label: "Rabbia", color: "red", align: "self-start", delay: "0s" },
  { to: "/nuvola-2", label: "Panico", color: "green", align: "self-end", delay: "0.9s" },
  { to: "/nuvola-3", label: "Tristezza", color: "blue", align: "self-start", delay: "1.8s" },
  { to: "/nuvola-4", label: "Ansia", color: "orange", align: "self-end", delay: "2.7s" },
];


export const Route = createFileRoute("/schermata-1")({
  head: () => ({
    meta: [
      { title: "Schermata 1 — Nuvola" },
      { name: "description", content: "Seconda schermata con quattro nuvole colorate." },
      { property: "og:title", content: "Schermata 1 — Nuvola" },
      { property: "og:description", content: "Seconda schermata con quattro nuvole colorate." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <div className="flex flex-1 flex-col justify-between gap-4 py-2">
        {clouds.map((c, i) => (
          <div key={c.to} className={`${c.align} ${i === 1 || i === 2 ? "-mt-2" : ""}`}>
            <ColorCloud to={c.to} label={c.label} color={c.color} delay={c.delay} />
          </div>
        ))}

      </div>
    </ScreenLayout>
  ),
});
