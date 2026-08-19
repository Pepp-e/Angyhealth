/** Piccola freccia curva decorativa che indica una nuvoletta. */
export function CurvedArrow({
  direction,
  delay = "0s",
}: {
  /** Verso cui punta la freccia. */
  direction: "left" | "right";
  delay?: string;
}) {
  return (
    <span
      className="animate-arrow-bounce pointer-events-none inline-block"
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <svg
        viewBox="0 0 60 40"
        className={`h-8 w-12 opacity-60 ${direction === "left" ? "-scale-x-100" : ""}`}
        fill="none"
        stroke="oklch(1 0 0 / 0.85)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 30 C18 8 38 6 50 16" />
        <path d="M50 16 L40 15" />
        <path d="M50 16 L48 26" />
      </svg>
    </span>
  );
}
