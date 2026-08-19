import { Link } from "@tanstack/react-router";

/** Grande pulsante a forma di nuvola: morbido, riconoscibile, con ombre e liquid glass. */
export function CloudButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="block transition-transform active:scale-[0.96]"
    >
      <span className="animate-float inline-block">
        <svg
          viewBox="0 0 200 130"
          className="h-auto w-56 drop-shadow-[0_20px_30px_rgba(30,80,140,0.30)]"
          role="img"
          aria-hidden
        >
          <defs>
            <radialGradient id="cloudFillMain" cx="38%" cy="28%" r="90%">
              <stop offset="0%" stopColor="oklch(1 0 0 / 0.96)" />
              <stop offset="55%" stopColor="oklch(0.98 0.01 240 / 0.88)" />
              <stop offset="100%" stopColor="oklch(0.9 0.03 240 / 0.82)" />
            </radialGradient>
          </defs>
          <path
            d="M45 92
               C35 92 30 80 35 70
               C38 55 55 52 65 58
               C72 42 95 38 110 48
               C120 38 142 40 152 56
               C168 58 175 74 168 88
               C165 102 148 108 132 104
               H 70
               C 55 108 45 102 45 92 Z"
            fill="url(#cloudFillMain)"
          />
          <ellipse cx="92" cy="52" rx="28" ry="11" fill="oklch(1 0 0 / 0.7)" />
        </svg>
      </span>
    </Link>
  );
}
