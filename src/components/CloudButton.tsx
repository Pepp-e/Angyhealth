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
          className="h-auto w-72 drop-shadow-[0_20px_30px_rgba(30,80,140,0.30)]"
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
          {/* Sagoma nuvola: cumuli tondi con base piatta */}
          <path
            d="M40 104
               C22 104 14 90 22 78
               C27 70 36 68 43 70
               C42 54 55 42 71 44
               C79 30 100 26 113 36
               C122 24 143 25 151 39
               C154 45 155 51 154 56
               C172 55 183 68 179 83
               C176 96 165 104 150 104
               Z"
            fill="url(#cloudFillMain)"
          />
          <ellipse cx="92" cy="52" rx="28" ry="11" fill="oklch(1 0 0 / 0.7)" />
        </svg>
      </span>
    </Link>
  );
}
