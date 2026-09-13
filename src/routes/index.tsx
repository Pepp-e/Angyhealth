import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { GlassPanel } from "@/components/GlassPanel";
import { CloudButton } from "@/components/CloudButton";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AngyHealth — Una nuvola per la tua salute" },
      {
        name: "description",
        content:
          "AngyHealth è una nuvola per la tua salute: uno spazio digitale pensato per aiutarti a gestire ansia, panico, rabbia e tristezza.",
      },
      { property: "og:title", content: "AngyHealth — Una nuvola per la tua salute" },
      {
        property: "og:description",
        content:
          "AngyHealth è una nuvola per la tua salute: uno spazio digitale pensato per aiutarti a gestire ansia, panico, rabbia e tristezza.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://angyhealth.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AngyHealth — Una nuvola per la tua salute" },
      {
        name: "twitter:description",
        content:
          "AngyHealth è una nuvola per la tua salute: uno spazio digitale pensato per aiutarti a gestire ansia, panico, rabbia e tristezza.",
      },
    ],
    links: [{ rel: "canonical", href: "https://angyhealth.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AngyHealth",
          url: "https://angyhealth.lovable.app/",
          description: "AngyHealth è una nuvola per la tua salute.",
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const t = useT();
  return (
    <ScreenLayout>
      <GlassPanel className="animate-soft-bounce mt-[1.65rem] px-6 py-5">
        <h1 className="text-center text-[clamp(1.4rem,6.2vw,1.8rem)] font-bold tracking-tight text-foreground">
          {t("Stai avendo un attacco?")}
        </h1>
      </GlassPanel>

      <div className="flex flex-1 items-center justify-center">
        <CloudButton to="/schermata-1" label={t("Vai alla seconda schermata")} />
      </div>

      <p className="animate-quick-bounce mb-[12svh] text-center text-base font-medium text-foreground">
        {t("Non ti preoccupare, clicca la tua nuvoletta!")}
      </p>

    </ScreenLayout>
  );
}
