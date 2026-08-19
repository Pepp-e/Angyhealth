import { Link } from "@tanstack/react-router";

/** Grande pulsante a forma di nuvola: tondo, compatto, con ombre morbide e liquid glass. */
export function CloudButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="block transition-transform active:scale-[0.96]"
    >
      <svg
        viewBox="0 0 200 150"
        className="h-auto w-52 drop-shadow-[0_20px_30px_rgba(30,80,140,0.30)]"
        role="img"
        aria-hidden
      >
        <defs>
          <radialGradient id="cloudFill" cx="35%" cy="25%" r="85%">
            <stop offset="0%" stopColor="oklch(1 0 0 / 0.95)" />
            <stop offset="60%" stopColor="oklch(0.98 0.01 240 / 0.85)" />
            <stop offset="100%" stopColor="oklch(0.9 0.03 240 / 0.8)" />
          </radialGradient>
        </defs>
        <g>
          <circle cx="70" cy="70" r="42" fill="url(#cloudFill)" />
          <circle cx="122" cy="66" r="36" fill="url(#cloudFill)" />
          <circle cx="100" cy="46" r="34" fill="url(#cloudFill)" />
          <circle cx="60" cy="95" r="30" fill="url(#cloudFill)" />
          <circle cx="118" cy="98" r="30" fill="url(#cloudFill)" />
          <rect x="55" y="78" width="72" height="38" rx="19" fill="url(#cloudFill)" />
        </g>
        <ellipse cx="90" cy="40" rx="26" ry="10" fill="oklch(1 0 0 / 0.7)" />
      </svg>
    </Link>
  );
}
