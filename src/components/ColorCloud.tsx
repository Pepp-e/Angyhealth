import { Link } from "@tanstack/react-router";
import { vibrate } from "@/lib/vibration";

export type CloudColor = "green" | "red" | "blue" | "orange";

const tints: Record<CloudColor, string> = {
  green: "oklch(0.9 0.10 150 / 0.75)",
  red: "oklch(0.9 0.09 30 / 0.75)",
  blue: "oklch(0.78 0.12 245 / 0.8)",
  orange: "oklch(0.88 0.11 70 / 0.75)",
};


/** Sagoma condivisa delle nuvole del progetto (stessa forma, dimensioni diverse). */
const CLOUD_PATH =
  "M40 104 C22 104 14 90 22 78 C27 70 36 68 43 70 C42 54 55 42 71 44 C79 30 100 26 113 36 C122 24 143 25 151 39 C154 45 155 51 154 56 C172 55 183 68 179 83 C176 96 165 104 150 104 Z";

/** Nuvola colorata cliccabile con effetto Liquid Glass, usata nella seconda schermata. */
export function ColorCloud({
  to,
  label,
  color,
  delay = "0s",
  enterFrom,
  enterDelay = "0s",
}: {
  to: string;
  label: string;
  color: CloudColor;
  delay?: string;
  /** Lato da cui la nuvola entra all'apertura della schermata. */
  enterFrom?: "left" | "right";
  enterDelay?: string;
}) {
  return (
    <span
      className={`block w-[44vw] min-w-[9.5rem] max-w-52 shrink-0 ${enterFrom === "left" ? "animate-cloud-in-left" : enterFrom === "right" ? "animate-cloud-in-right" : ""}`}
      style={enterFrom ? { animationDelay: enterDelay } : undefined}
    >
      <Link
        to={to}
        aria-label={label}
        onClick={() => vibrate(45)}
        className="block w-full transition-transform active:scale-[0.96]"
      >
        <span
          className="animate-float relative inline-block w-full"
          style={{ animationDelay: delay }}
        >
          <svg viewBox="0 0 200 130" className="cloud-glow-sm h-auto w-full">
            <path
              d={CLOUD_PATH}
              fill={tints[color]}
              stroke="oklch(1 0 0 / 0.8)"
              strokeWidth="2"
            />
            <ellipse cx="88" cy="52" rx="24" ry="9" fill="oklch(1 0 0 / 0.45)" />
          </svg>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-2 text-center text-base font-semibold text-white">
            {label}
          </span>
        </span>
      </Link>
    </span>
  );
}
