import { useRouter } from "@tanstack/react-router";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

/** Pulsante "Indietro" Liquid Glass, torna alla schermata precedente. */
export function BackButton() {
  const router = useRouter();
  const t = useT();

  return (
    <button
      type="button"
      aria-label={t("Torna indietro")}
      onClick={() => {
        vibrate(10);
        router.history.back();
      }}
      className="glass mb-2 grid size-11 shrink-0 place-items-center self-start rounded-full text-foreground transition-transform active:scale-[0.96]"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M15 5 L8 12 L15 19"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

  );
}
