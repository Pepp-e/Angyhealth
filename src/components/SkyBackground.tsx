import { useEffect } from "react";
import { applyNightMode, isNightMode } from "@/lib/theme";

/**
 * Sfondo dell'app: cielo azzurro con nuvolette bianche morbide.
 * Modificabile in un solo punto.
 */
export function SkyBackground() {
  useEffect(() => {
    applyNightMode(isNightMode());
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-sky">
      <div className="cloud-blob left-[-10%] top-[8%] h-40 w-72" />
      <div className="cloud-blob right-[-15%] top-[28%] h-48 w-80" />
      <div className="cloud-blob left-[-5%] top-[58%] h-36 w-64" />
      <div className="cloud-blob right-[-8%] bottom-[6%] h-44 w-72" />
    </div>
  );
}
