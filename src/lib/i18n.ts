import { useSyncExternalStore } from "react";

/** Sistema di lingua leggero: italiano predefinito, inglese opzionale. */
export type Lang = "it" | "en";

const KEY = "nuvola:lang";

const listeners = new Set<() => void>();

let current: Lang =
  typeof window === "undefined"
    ? "it"
    : window.localStorage.getItem(KEY) === "en"
      ? "en"
      : "it";

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  current = lang;
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* archiviazione non disponibile */
  }
  listeners.forEach((l) => l());
}

export function toggleLang() {
  setLang(current === "it" ? "en" : "it");
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "it" as Lang,
  );
}

/** Traduzioni: chiave = testo italiano originale. */
const EN: Record<string, string> = {
  // Schermata principale
  "Stai avendo un attacco?": "Are you having an attack?",
  "Vai alla seconda schermata": "Go to the second screen",
  "Non ti preoccupare, clicca la tua nuvoletta!":
    "Don't worry, tap your little cloud!",

  // Nuvole
  Rabbia: "Anger",
  Panico: "Panic",
  Tristezza: "Sadness",
  Ansia: "Anxiety",

  // Navigazione
  "Schermata principale": "Home screen",
  "Schermata 2": "Screen 2",
  "Schermata 4": "Screen 4",
  "Schermata 5": "Screen 5",
  "Schermata 6": "Screen 6",
  "Torna indietro": "Go back",

  // Ricordi
  "Rivivi i tuoi ricordi!": "Relive your memories!",
  "Per quando non ti senti abbastanza": "For when you don't feel enough",
  "Spazio per la lettera": "Space for the letter",
  "Aggiungi le foto!": "Add your photos!",
  "Aggiungi foto": "Add photo",
  "Elimina foto": "Delete photo",
  Ricordo: "Memory",

  // Aiuto e contatti
  "A chi posso chiedere aiuto?": "Who can I ask for help?",
  "Emergenza 112": "Emergency 112",
  "Aggiungi un contatto": "Add a contact",
  Nome: "Name",
  "Numero di telefono": "Phone number",
  Salva: "Save",
  Contatto: "Contact",

  // Minigiochi
  Minigiochi: "Mini-games",
  "Minigioco scratchcard: gratta via la rabbia.":
    "Scratchcard mini-game: scratch your anger away.",
  "Respira con calma: respirazione guidata.":
    "Breathe calmly: guided breathing.",
  "Playlist Spotify per i momenti tristi.":
    "Spotify playlist for sad moments.",
  "Ascolta un po' di musica nei momenti tristi.":
    "Listen to some music in sad moments.",
  "Ritorna al presente: esercizio di grounding.":
    "Come back to the present: grounding exercise.",
  "Le note della tua giornata": "Your daily notes",
  "Scrivi cosa ti passa per la mente.": "Write whatever comes to mind.",

  // Impostazioni
  Impostazioni: "Settings",
  Vibrazione: "Vibration",
  "Feedback tattile": "Haptic feedback",
  "Modalità notte": "Night mode",
  "Modalità giorno": "Day mode",
  "Torna al pin": "Back to the pin",
  "Traduci in inglese": "Translate in italian",

  // Rabbia
  "Sei arrabbiata? Gratta via la tua rabbia!":
    "Are you angry? Scratch your anger away!",
  "Aggiungi le tue foto, e gratta via la rabbia!":
    "Add your photos and scratch the anger away!",
  "La tua foto da grattare": "Your photo to scratch",
  "Ricarica il minigioco": "Restart the mini-game",
  "Scegli una nuova foto": "Choose a new photo",

  // Panico
  "Sei in panico? Respira con calma": "Panicking? Breathe calmly",
  Inspira: "Breathe in",
  Trattieni: "Hold",
  Espira: "Breathe out",
  "Hai completato l'esercizio!": "You completed the exercise!",
  Ricomincia: "Start again",
  Pausa: "Pause",
  Riprendi: "Resume",
  "▶ Play": "▶ Play",
  "⏸ Pausa": "⏸ Pause",

  // Tristezza
  "Sei triste? Ascolta un po di musica!": "Feeling sad? Listen to some music!",
  "Apri la playlist su Spotify": "Open the playlist on Spotify",
  "Playlist Spotify": "Spotify playlist",

  // Ansia
  "Sei in ansia? Ritorna al presente": "Feeling anxious? Come back to the present",
  "Trova 5 cose che vedi": "Find 5 things you can see",
  "Trova 4 cose che puoi toccare": "Find 4 things you can touch",
  "Trova 3 cose che puoi ascoltare": "Find 3 things you can hear",
  "Trova 2 cose che ti piacciono": "Find 2 things you like",
  "Scegli una cosa che ti fa stare bene": "Choose one thing that makes you feel good",
  "Brava! Hai completato l'esercizio.": "Well done! You completed the exercise.",
  "Prenditi un momento e continua con calma.":
    "Take a moment and carry on calmly.",

  // PIN
  'Inserisci il codice "0000".': 'Enter the code "0000".',
  "Cifre inserite": "Entered digits",
  "Codice errato": "Wrong code",
  Cancella: "Delete",
  Conferma: "Confirm",

  // Note
  "Foglio di carta": "Sheet of paper",
  Modalità: "Mode",
  Dimensione: "Size",
  Colore: "Color",
  Font: "Font",
  Trasparenza: "Transparency",
  Azioni: "Actions",
  Fogli: "Sheets",
  Scrittura: "Writing",
  Disegno: "Drawing",
  Riduci: "Decrease",
  Aumenta: "Increase",
  Elimina: "Delete",
  Annulla: "Cancel",
  "Nuovo foglio": "New sheet",
  "Foglio precedente": "Previous sheet",
  "Foglio successivo": "Next sheet",
  "Cancella foglio": "Delete sheet",
  "Vuoi davvero eliminare questo foglio?":
    "Do you really want to delete this sheet?",
  Foglio: "Sheet",
  di: "of",
  Corsivo: "Cursive",
  Elegante: "Elegant",
  "Macchina da scrivere": "Typewriter",
};

/** Restituisce la funzione di traduzione per la lingua attiva. */
export function useT() {
  const lang = useLang();
  return (s: string) => (lang === "en" ? (EN[s] ?? s) : s);
}
