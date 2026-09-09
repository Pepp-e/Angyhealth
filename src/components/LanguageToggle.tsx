import { useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { toggleLang, useLang } from "@/lib/i18n";

/** Bandiera del Regno Unito, rettangolare con angoli arrotondati. */
function UkFlag() {
  return (
    <svg viewBox="0 0 60 40" className="h-6 w-9 rounded-md shadow-sm ring-1 ring-white/70" aria-hidden>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

/** Bandiera italiana, rettangolare con angoli arrotondati. */
function ItFlag() {
  return (
    <svg viewBox="0 0 60 40" className="h-6 w-9 rounded-md shadow-sm ring-1 ring-white/70" aria-hidden>
      <rect width="20" height="40" fill="#009246" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#CE2B37" />
    </svg>
  );
}

/** Contenitore Liquid Glass per cambiare lingua (italiano ⇄ inglese). */
export function LanguageToggle() {
  const lang = useLang();
  const [pulse, setPulse] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        vibrate(20);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 260);
        toggleLang();
      }}
      className="mt-4 block w-full"
    >
      <GlassPanel
        className={`flex items-center justify-between px-5 py-4 transition-all duration-200 active:scale-[0.98] active:shadow-[0_0_16px_rgba(255,255,255,0.45)] ${
          pulse ? "scale-[0.97] shadow-[0_0_18px_rgba(255,255,255,0.5)]" : ""
        }`}
      >
        <span className="text-base font-medium text-foreground">
          {lang === "it" ? "Traduci in inglese" : "Translate in italian"}
        </span>
        <span className="animate-in fade-in zoom-in duration-200" key={lang}>
          {lang === "it" ? <UkFlag /> : <ItFlag />}
        </span>
      </GlassPanel>
    </button>
  );
}
