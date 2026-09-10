import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

/** Titoli della scheda del browser per percorso e lingua. */
const TITLES: Record<string, { it: string; en: string }> = {
  "/": { it: "AngyHealth", en: "AngyHealth" },
  "/schermata-1": { it: "Nuvole - AngyHealth", en: "Clouds - AngyHealth" },
  "/schermata-2": { it: "Ricordi - AngyHealth", en: "Memories - AngyHealth" },
  "/schermata-4": { it: "Contatti - AngyHealth", en: "Contacts - AngyHealth" },
  "/schermata-5": { it: "Minigiochi - AngyHealth", en: "Minigames - AngyHealth" },
  "/schermata-6": { it: "Impostazioni - AngyHealth", en: "Settings - AngyHealth" },
  "/nuvola-1": { it: "Rabbia - AngyHealth", en: "Anger - AngyHealth" },
  "/nuvola-2": { it: "Panico - AngyHealth", en: "Panic - AngyHealth" },
  "/nuvola-3": { it: "Tristezza - AngyHealth", en: "Sadness - AngyHealth" },
  "/nuvola-4": { it: "Ansia - AngyHealth", en: "Anxiety - AngyHealth" },
  "/note": { it: "Note - AngyHealth", en: "Daily Notes - AngyHealth" },
};

export function DocumentTitle() {
  const lang = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const key = pathname.length > 1 ? pathname.replace(/\/$/, "") : "/";
    const entry = TITLES[key];
    document.title = entry ? entry[lang] : "AngyHealth";
  }, [pathname, lang]);

  return null;
}
