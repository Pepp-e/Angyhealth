import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { vibrate } from "@/lib/vibration";
import { useT } from "@/lib/i18n";

const STORAGE_KEY = "nuvola:contatti";

type Contact = { name: string; tel: string };

function load(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Contact[]) : [];
  } catch {
    return [];
  }
}

/** Contatti personali salvati solo su questo dispositivo (localStorage). */
export function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [manual, setManual] = useState(false);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const t = useT();

  useEffect(() => {
    setContacts(load());
  }, []);

  const save = (next: Contact[]) => {
    setContacts(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* archiviazione non disponibile */
    }
  };

  const addContact = async () => {
    vibrate(15);
    const picker = (navigator as unknown as {
      contacts?: { select: (p: string[], o?: { multiple?: boolean }) => Promise<
        { name?: string[]; tel?: string[] }[]
      > };
    }).contacts;

    if (picker && typeof picker.select === "function") {
      try {
        const picked = await picker.select(["name", "tel"], { multiple: false });
        const c = picked?.[0];
        if (c) {
          save([
            ...contacts,
            { name: c.name?.[0] ?? t("Contatto"), tel: c.tel?.[0] ?? "" },
          ]);
          return;
        }
        return;
      } catch {
        /* permesso negato o non supportato: si passa al form manuale */
      }
    }
    setManual(true);
  };

  return (
    <div className="mt-4 flex w-full max-w-full flex-col gap-3">
      <button type="button" onClick={addContact} className="w-full text-left">
        <GlassPanel className="w-full rounded-3xl px-5 py-4">
          <p className="text-center text-base font-semibold text-foreground">
            {t("Aggiungi un contatto")}
          </p>
        </GlassPanel>
      </button>

      {manual && (
        <GlassPanel className="w-full rounded-3xl px-5 py-4">
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Nome")}
              className="w-full rounded-2xl bg-white/40 px-4 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <input
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              inputMode="tel"
              placeholder={t("Numero di telefono")}
              className="w-full rounded-2xl bg-white/40 px-4 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => {
                if (!name.trim() && !tel.trim()) return;
                vibrate(15);
                save([...contacts, { name: name.trim() || t("Contatto"), tel: tel.trim() }]);
                setName("");
                setTel("");
                setManual(false);
              }}
              className="glass-center rounded-2xl px-4 py-2 text-base font-semibold text-foreground"
            >
              {t("Salva")}
            </button>
          </div>
        </GlassPanel>
      )}

      {contacts.map((c, i) => (
        <a
          key={`${c.name}-${c.tel}-${i}`}
          href={c.tel ? `tel:${c.tel}` : undefined}
          onClick={() => vibrate(15)}
          className="block w-full"
        >
          <GlassPanel className="w-full rounded-3xl px-5 py-4">
            <p className="truncate text-base font-semibold text-foreground">{c.name}</p>
            {c.tel && (
              <p className="truncate text-sm text-muted-foreground">{c.tel}</p>
            )}
          </GlassPanel>
        </a>
      ))}
    </div>
  );
}
