import { useRouter } from "@tanstack/react-router";
import { vibrate } from "@/lib/vibration";

/** Pulsante "Indietro" Liquid Glass, torna alla schermata precedente. */
export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Torna indietro"
      onClick={() => {
        vibrate(10);
        router.history.back();
      }}
      className="glass mb-3 inline-flex w-fit items-center gap-1.5 self-start rounded-full py-2 pl-3 pr-4 text-sm font-semibold text-foreground transition-transform active:scale-[0.96]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <path
          d="M15 5 L8 12 L15 19"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Indietro
    </button>
  );
}
