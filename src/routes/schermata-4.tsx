import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { ContactsSection } from "@/components/ContactsSection";
import { vibrate } from "@/lib/vibration";

export const Route = createFileRoute("/schermata-4")({
  head: () => ({
    meta: [
      { title: "A chi posso chiedere aiuto? — Nuvola" },
      { name: "description", content: "Contatti utili di emergenza a portata di mano." },
      { property: "og:title", content: "A chi posso chiedere aiuto? — Nuvola" },
      { property: "og:description", content: "Contatti utili di emergenza a portata di mano." },
    ],
  }),
  component: () => (
    <ScreenLayout>
      <h1 className="px-2 text-center text-[clamp(1.6rem,7.5vw,2.125rem)] font-bold tracking-tight text-foreground">
        A chi posso chiedere aiuto?
      </h1>

      <div className="mt-6 flex flex-col items-center gap-4">
        <a
          href="tel:112"
          onClick={() => vibrate(10)}
          className="block w-full transition-transform active:scale-[0.98]"
        >
          <GlassPanel className="w-full rounded-3xl px-5 py-4">
            <p className="text-center text-base font-semibold text-foreground">Emergenza 112</p>
          </GlassPanel>
        </a>

        <span
          aria-hidden
          className="h-px w-2/3 rounded-full bg-white/70"
        />

        <ContactsSection />
      </div>
    </ScreenLayout>
  ),
});
