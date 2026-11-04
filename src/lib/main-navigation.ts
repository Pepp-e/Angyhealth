import { Cloud, Compass, Heart, Settings, User } from "lucide-react";

export const mainNavigation = [
  { to: "/schermata-5", icon: Compass, label: "Schermata 5" },
  { to: "/schermata-2", icon: Heart, label: "Schermata 2" },
  { to: "/", icon: Cloud, label: "Schermata principale", center: true },
  { to: "/schermata-4", icon: User, label: "Schermata 4" },
  { to: "/schermata-6", icon: Settings, label: "Schermata 6" },
] as const;

export function adjacentMainPath(path: string, dx: number) {
  const index = mainNavigation.findIndex((item) => item.to === path);
  if (index < 0 || dx === 0) return undefined;
  return mainNavigation[index + (dx < 0 ? 1 : -1)]?.to;
}

export function swipeIntent(dx: number, dy: number): "pending" | "horizontal" | "vertical" {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return "pending";
  return Math.abs(dx) > Math.abs(dy) * 1.5 ? "horizontal" : "vertical";
}

export function commitsSwipe(dx: number, width: number, elapsed: number) {
  return Math.abs(dx) >= Math.min(width * 0.25, 110) ||
    (Math.abs(dx) >= 45 && Math.abs(dx) / Math.max(elapsed, 1) > 0.5);
}

export const swipeExcludedSelector = 'button, a, input, textarea, select, label, canvas, img, video, audio, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="switch"], [role="slider"], [draggable="true"], [data-no-screen-swipe], .touch-pan-y, .touch-none';