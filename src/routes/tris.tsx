import { createFileRoute } from "@tanstack/react-router";
import { ScreenLayout } from "@/components/ScreenLayout";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TrisGame } from "@/components/TrisGame";

export const Route = createFileRoute("/tris")({
  head: () => ({ meta: [
    { title: "Tris — AngyHealth" },
    { name: "description", content: "Gioca a Tris contro il computer o in coppia sullo stesso dispositivo." },
    { property: "og:title", content: "Tris — AngyHealth" },
    { property: "og:description", content: "Gioca a Tris contro il computer o in coppia sullo stesso dispositivo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: TrisScreen,
});

function TrisScreen() {
  return <ScreenLayout><ScreenHeader title="Tris" /><TrisGame /></ScreenLayout>;
}