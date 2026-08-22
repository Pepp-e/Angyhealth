import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ColorCloud, type CloudColor } from "@/components/ColorCloud";
import { CurvedArrow, type ArrowGlow } from "@/components/CurvedArrow";

/** Testi, colori, ritardi di oscillazione e lato di ingresso delle nuvole. */
const clouds: {
  to: string;
  label: string;
  color: CloudColor;
  align: string;
  delay: string;
  enterFrom: "left" | "right";
  enterDelay: string;
}[] = [
  { to: "/nuvola-1", label: "Rabbia", color: "red", align: "self-start", delay: "0s", enterFrom: "left", enterDelay: "0s" },
  { to: "/nuvola-2", label: "Panico", color: "green", align: "self-end", delay: "0.9s", enterFrom: "right", enterDelay: "0.1s" },
  { to: "/nuvola-3", label: "Tristezza", color: "blue", align: "self-start", delay: "1.8s", enterFrom: "left", enterDelay: "0.2s" },
  { to: "/nuvola-4", label: "Ansia", color: "orange", align: "self-end", delay: "2.7s", enterFrom: "right", enterDelay: "0.3s" },
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
      <div className="flex w-full max-w-full flex-1 flex-col justify-between gap-3 overflow-x-hidden py-2">
        {clouds.map((c, i) => (
          <div
            key={c.to}
            className={`${c.align} ${i === 1 || i === 2 ? "-mt-1" : ""} flex max-w-full items-center gap-1`}
          >
            {c.align === "self-end" && (
              <CurvedArrow
                direction="right"
                delay={`${i * 0.25}s`}
                glow={c.color as ArrowGlow}
                enterFrom={c.enterFrom === "right" ? "left" : "right"}
                enterDelay={c.enterDelay}
              />
            )}
            <ColorCloud
              to={c.to}
              label={c.label}
              color={c.color}
              delay={c.delay}
              enterFrom={c.enterFrom}
              enterDelay={c.enterDelay}
            />
            {c.align === "self-start" && (
              <CurvedArrow
                direction="left"
                delay={`${i * 0.25}s`}
                glow={c.color as ArrowGlow}
                enterFrom={c.enterFrom === "left" ? "right" : "left"}
                enterDelay={c.enterDelay}
              />
            )}
          </div>
        ))}

      </div>
    </ScreenLayout>
  ),
});
