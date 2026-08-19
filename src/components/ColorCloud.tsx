import { Link } from "@tanstack/react-router";

export type CloudColor = "green" | "red" | "blue" | "orange";

const tints: Record<CloudColor, string> = {
  green: "oklch(0.9 0.10 150 / 0.75)",
  red: "oklch(0.9 0.09 30 / 0.75)",
  blue: "oklch(0.9 0.08 240 / 0.75)",
  orange: "oklch(0.88 0.11 70 / 0.75)",
};

/** Nuvola colorata cliccabile con effetto Liquid Glass, usata nella seconda schermata. */
export function ColorCloud({
  to,
  label,
  color,
  delay = "0s",
}: {
  to: string;
  label: string;
  color: CloudColor;
  delay?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative block w-52 transition-transform active:scale-[0.96]"
    >
      <span
        className="animate-float inline-block"
        style={{ animationDelay: delay }}
      >
        <svg viewBox="0 0 200 130" className="h-auto w-full drop-shadow-[0_16px_26px_rgba(30,80,140,0.25)]">
          <g fill={tints[color]}>
            <circle cx="68" cy="62" r="38" />
            <circle cx="126" cy="60" r="32" />
            <circle cx="98" cy="42" r="31" />
            <circle cx="58" cy="84" r="27" />
            <circle cx="130" cy="86" r="27" />
            <rect x="52" y="70" width="82" height="36" rx="18" />
          </g>
          <ellipse cx="88" cy="38" rx="24" ry="9" fill="oklch(1 0 0 / 0.45)" />
        </svg>
      </span>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-2 text-center text-base font-semibold text-foreground">
        {label}
      </span>
    </Link>
  );
}
