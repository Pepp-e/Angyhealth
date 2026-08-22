export type ArrowGlow = "red" | "green" | "blue" | "orange";

const glows: Record<ArrowGlow, string> = {
  red: "oklch(0.9 0.09 30 / 0.75)",
  green: "oklch(0.9 0.10 150 / 0.75)",
  blue: "oklch(0.78 0.12 245 / 0.8)",
  orange: "oklch(0.88 0.11 70 / 0.75)",
};

/** Piccola freccia curva decorativa che indica una nuvoletta. */
export function CurvedArrow({
  direction,
  delay = "0s",
  glow,
  enterFrom,
  enterDelay = "0s",
}: {
  /** Verso cui punta la freccia. */
  direction: "left" | "right";
  delay?: string;
  /** Colore del leggerissimo glow, coerente con la nuvola indicata. */
  glow?: ArrowGlow;
  /** Lato da cui la freccia entra all'apertura della schermata. */
  enterFrom?: "left" | "right";
  enterDelay?: string;
}) {
  return (
    <span
      className={`inline-block shrink-0 ${enterFrom === "left" ? "animate-cloud-in-left" : enterFrom === "right" ? "animate-cloud-in-right" : ""}`}
      style={enterFrom ? { animationDelay: enterDelay } : undefined}
    >
      <span
        className="animate-arrow-bounce pointer-events-none inline-block"
        style={{ animationDelay: delay }}
        aria-hidden
      >
        <svg
          viewBox="0 0 60 40"
          className={`h-9 w-14 opacity-90 ${direction === "left" ? "-scale-x-100" : ""}`}
          fill="none"
          style={{
            filter: glow
              ? `drop-shadow(0 0 5px ${glows[glow]}) drop-shadow(0 0 2px oklch(1 0 0 / 0.6))`
              : "drop-shadow(0 0 3px oklch(1 0 0 / 0.6))",
          }}
        >
          {/* Arco morbido con punta triangolare piena (forma di riferimento) */}
          <path
            d="M6 24 C10 9 30 4 41 17"
            stroke="oklch(1 0 0 / 0.95)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path d="M45 12 L34 17 L48 25 Z" fill="oklch(1 0 0 / 0.95)" />
        </svg>
      </span>
    </span>
  );
}
