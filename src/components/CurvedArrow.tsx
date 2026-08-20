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
        className={`h-9 w-14 opacity-80 ${direction === "left" ? "-scale-x-100" : ""}`}
        fill="none"
        stroke="oklch(1 0 0 / 0.95)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 32 C16 8 38 4 52 15" />
        <path d="M52 15 L39 14" />
        <path d="M52 15 L49 27" />

      </svg>
    </span>
  );
}
