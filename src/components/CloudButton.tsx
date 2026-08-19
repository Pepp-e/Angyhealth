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
        <path
          d="M45 94c-16 0-27-11-27-24 0-12 9-22 21-24 2-19 18-33 37-33 15 0 28 8 34 21 3-1 6-2 9-2 14 0 25 11 25 25 0 1 0 2-1 3 10 3 17 12 17 22 0 7-5 12-12 12H45z"
          fill="url(#cloudFill)"
        />
        <ellipse cx="90" cy="34" rx="26" ry="10" fill="oklch(1 0 0 / 0.65)" />

      </svg>
    </Link>
  );
}
