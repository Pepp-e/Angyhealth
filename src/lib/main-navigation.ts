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

const FRAME = 1000 / 60;

function simulateSpring(from: number, to: number, velocity: number, omega: number, zeta: number) {
  let x = from;
  let v = velocity;
  const frames = [from];
  const dir = Math.sign(to - from) || 1;
  let peak = 0;
  for (let t = 1; t <= 1500; t++) {
    const a = -omega * omega * (x - to) - 2 * zeta * omega * v;
    v += a;
    x += v;
    peak = Math.max(peak, (x - to) * dir);
    if (t % Math.round(FRAME) === 0) frames.push(x);
    if (t > 120 && Math.abs(x - to) < 0.4 && Math.abs(v) < 0.01) break;
  }
  frames.push(to);
  return { frames, overshoot: peak };
}

/**
 * Underdamped spring sampled at 60 fps (play with linear easing). Starts from the
 * finger position and speed, then overshoots in the direction of travel and settles.
 * Overshoot is kept between min and max px so it is always visible but never large.
 */
export function springFrames(from: number, to: number, velocity: number, minOvershoot = 0, maxOvershoot = Infinity) {
  const omega = 0.018; // rad/ms
  const dir = Math.sign(to - from) || 1;
  let v = Math.max(-3, Math.min(3, velocity));
  let zeta = 0.58;
  let result = simulateSpring(from, to, v, omega, zeta);
  for (let i = 0; i < 40 && result.overshoot < minOvershoot; i++) {
    v += dir * 0.08;
    result = simulateSpring(from, to, v, omega, zeta);
  }
  for (let i = 0; i < 40 && result.overshoot > maxOvershoot; i++) {
    if (v * dir > 0) v -= dir * Math.min(0.08, Math.abs(v)); else zeta += 0.03;
    result = simulateSpring(from, to, v, omega, zeta);
  }
  return { frames: result.frames, duration: (result.frames.length - 1) * FRAME, overshoot: result.overshoot };
}
