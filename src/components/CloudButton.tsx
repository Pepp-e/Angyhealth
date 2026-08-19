import { Link } from "@tanstack/react-router";

/** Grande pulsante a forma di nuvola, con ombre morbide ed effetto 3D leggero. */
export function CloudButton({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} aria-label={label} className="block active:scale-[0.97] transition-transform">
      <svg
        viewBox="0 0 200 120"
        className="h-auto w-56 drop-shadow-[0_18px_28px_rgba(30,80,140,0.28)]"
        role="img"
        aria-hidden
      >
        <defs>
          <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(1 0 0)" />
            <stop offset="100%" stopColor="oklch(0.93 0.02 240)" />
          </linearGradient>
        </defs>
        <g fill="url(#cloudFill)">
          <circle cx="65" cy="60" r="34" />
          <circle cx="105" cy="45" r="40" />
          <circle cx="140" cy="65" r="30" />
          <rect x="60" y="62" width="85" height="32" rx="16" />
        </g>
        <ellipse cx="95" cy="38" rx="34" ry="14" fill="oklch(1 0 0 / 0.7)" />
      </svg>
    </Link>
  );
}
