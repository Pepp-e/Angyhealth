import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ColorCloud, type CloudColor } from "@/components/ColorCloud";

/** Testi e destinazioni facilmente sostituibili in futuro. */
const clouds: { to: string; label: string; color: CloudColor; align: string }[] = [
  { to: "/nuvola-1", label: "Testo 1", color: "green", align: "self-start" },
  { to: "/nuvola-2", label: "Testo 2", color: "red", align: "self-end" },
  { to: "/nuvola-3", label: "Testo 3", color: "blue", align: "self-start" },
  { to: "/nuvola-4", label: "Testo 4", color: "orange", align: "self-end" },
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
            <ColorCloud to={c.to} label={c.label} color={c.color} />
          </div>
        ))}
      </div>
    </ScreenLayout>
  ),
});
