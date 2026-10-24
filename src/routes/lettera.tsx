import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassPanel } from "@/components/GlassPanel";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/lettera")({
  head: () => ({
    meta: [
      { title: "Per quando non ti senti abbastanza — AngyHealth" },
      { name: "description", content: "Uno spazio dedicato a una lettera per i momenti difficili." },
      { property: "og:title", content: "Per quando non ti senti abbastanza — AngyHealth" },
      {
        property: "og:description",
        content: "Uno spazio dedicato a una lettera per i momenti difficili.",
      },
    ],
  }),
  component: Lettera,
});

const COSE = [
  "Amo la tua risata",
  "Amo i tuoi occhi",
  "Amo la tua empatia",
  "Amo la tua singolarità",
  "Amo il tuo sorriso",
  "Amo la tua sensibilità",
  "Amo i tuoi capelli",
  "Amo la tua gelosia",
  "Amo la tua determinazione",
  "Amo la tua simpatica",
  "Amo la tua intelligenza",
  "Amo la tua voce",
  "Amo la tua forza",
  "Amo la tua dolcezza",
  "Amo il tuo cuore enorme",
  "Amo i tuoi racconti",
  "Amo il tuo nome",
  "Amo la tua pazienza",
  "Amo la tua sincerità",
  "Amo la tua fedeltà",
  "Amo le tue preoccupazioni",
  "Amo il tuo umore",
  "Amo la tua gentilezza",
  "Amo il fatto che ti preoccupi per me",
  "Amo la tua fiducia per me",
  "Amo essere ossessionato da te",
  "Amo il fatto che mi perdoni anche quando ti faccio arrabbiare",
  "Amo che mi aiuti ad essere una persona migliore",
  "Amo il fatto che sei la mia unica ragione per vivere",
  "Amo che ci sei sempre per me",
  "Amo il fatto che mi rassicuri sempre",
  "Amo il fatto che ci sei sempre per me",
  "Amo svegliarmi la mattina con il tuo buongiorno",
  "Amo i nostri discorsi",
  "Amo la tua bellezza",
  "Amo il tuo stile",
  "Amo le nostre promesse",
  "Amo il tuo lato da bimba",
  "Amo il nostro modo di comunicare",
  "Amo i nostri nomignoli",
  "Amo vederti emozionata",
  "Amo prendermi cura di te anche se lontani",
  "Amo che mi fai sentire veramente importante",
  "Amo che non mi giudichi mai",
  "Amo quando mi mandi una foto",
  "Amo quando mi mandi un vocale",
  "Amo quando mi batte fortissimo il cuore con te",
  "Amo quando facciamo entrambi gli stupidi",
  "Amo anche quando sei un po' perversa",
  "Amo che passi tutto questo tempo con me",
  "Amo quando mi dici anche solo un ti amo",
  "Amo che mi fai sentire carino anche quando per me non lo sono",
  "Amo svegliarmi la mattina e guardare i tuoi occhi",
  "Amo parlare dei miei problemi con te",
  "Amo che mi fai sentire al sicuro",
  "Amo passare le giornate con te anche se solo attraverso uno schermo",
  "Amo quando mi chiami bimbo",
  "Amo pensare a te tutto il giorno",
  "Amo parlare del nostro matrimonio",
  "Amo essere me stesso con te",
  "Amo far parte della tua vita privata",
  "Amo quando ti lamenti di qualcosa",
  "Amo la tua lealtà",
  "Amo le piccole cose che fai per me",
  "Amo quando scrivi sui fogli quanto ti piaccio",
  "Amo essere tuo",
  "Amo diventare un bambino con te",
  "Amo provare nuove cose con te",
  "Amo scherzare con te",
  "Amo fare i film mentali con te",
  "Amo quando festeggi le mie vittorie",
  "Amo quando mi rassicuri quando tutto va male",
  "Amo quando ti impegni tantissimo per qualcosa",
  "Amo quando mi dimostri di valere qualcosa",
  "Amo quando mi mostri che mi ami anche tu",
  "Amo parlare del nostro passato",
  "Amo il tuo sarcasmo",
  "Amo tutti i ricordi che ho con te",
  "Amo quando dici che nonostante la distanza noi saremo sempre insieme",
  "Amo le tue vibes",
  "Amo le tue dediche",
  "Amo quando mi mandi tanti messaggi",
  "Amo quando chiedi scusa senza motivo",
  "Amo il fatto che mi rispetti sempre",
  "Amo quando mi fai tante domande",
  "Amo il fatto che sei la ragione per cui sono tornato a sorridere",
  "Amo quando mi parli della tua giornata",
  "Amo il fatto che sei la mia prima ragazza",
  "Amo aver scoperto grazie a te cosa significa l'amore",
  "Amo che mi sopporti",
  "Amo che non ti stanchi mai di me",
  "Amo quando mi prendi in giro",
  "Amo avere occhi solo per te",
  "Amo sentirmi a casa con te",
  "Amo il fatto che sei la mia anima gemella",
  "Amo le farfalle nello stomaco che mi fai venire",
  "Amo come siamo diventati da niente a tutto in poco tempo",
  "Amo come siamo riusciti a legare subito",
  "Amo sentire il cuore pacato da quando sto con te",
  "Amo il fatto che mi completi",
];

const LETTERA_FINALE =
  "Amo tutto di te, qualsiasi cosa, e cento motivi non bastano per dire quanto ti amo, perchè ti amo ancora di più, perché sei perfetta. Anche se ti faccio arrabbiare tu resti sempre, anche se le cose diventano difficili tu mi rassicuri sempre. Io voglio un futuro con te perché mi rendi la vita migliore, mi fai sorridere sia con la bocca che con il cuore, mi fai sentire a casa. Anche se litighiamo tanto io ci provo sempre a fartelo capire che ho occhi solo per te, non importa tutte le volte che litighiamo a me basta che chiariamo e che torniamo più legati di prima. Perché non penso che nessuno mai abbia amato qualcuno come io amo te, e anche se siamo soli io e te contro tutto io combatterò sempre per restare con te, perché io ti amo, io amo Angela, amo la mia principessa, la mia ragazza, la mia puffetta e soprattutto la mia bimba. non smetterò mai di dirlo quanto ti amo. \nAnche a distanza non smetterò mai di prendermi cura di te piccolina mia, anche se sto sempre con la testa fra le nuvole, sei tu la mia nuvoletta.\nGrazie di esserci sempre amore mio, saremo per sempre io e te. Ti amo da morire🩵";

function Lettera() {
  const t = useT();
  return (
    <ScreenLayout>
      <ScreenHeader title="Per quando non ti senti abbastanza" />
      <GlassPanel className="mt-2 flex min-h-40 flex-1 flex-col overflow-hidden px-6 py-6">
        <h2 className="mb-4 text-center text-xl font-medium leading-snug text-[#112942]">
          100 cose che Amo di te🩵:
        </h2>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-base font-medium leading-relaxed text-[#112942]">
          {COSE.map((cosa, i) => (
            <p key={i}>
              {i + 1}. {cosa}
            </p>
          ))}
          <p className="pt-2">101. {LETTERA_FINALE}</p>
          <p className="pt-2">- Il tuo bimbo🩵</p>
          <p className="pt-6 text-center text-[11px] font-normal text-[#112942]">
            By Giuseppe Miranda
          </p>
        </div>
        <span className="sr-only">{t("Spazio per la lettera")}</span>
      </GlassPanel>
    </ScreenLayout>
  );
}
