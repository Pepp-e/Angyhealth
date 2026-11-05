import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { adjacentMainPath, commitsSwipe, mainNavigation, springFrames, swipeExcludedSelector, swipeIntent } from "@/lib/main-navigation";
import { SwipePreviewContext } from "@/lib/swipe-preview";

const loaders = {
  "/": () => import("@/routes/index").then((m) => ({ default: m.Index })),
  "/schermata-5": () => import("@/routes/schermata-5").then((m) => ({ default: m.MinigiochiScreen })),
  "/schermata-2": () => import("@/routes/schermata-2").then((m) => ({ default: m.Ricordi })),
  "/schermata-4": () => import("@/routes/schermata-4").then((m) => ({ default: m.AiutoScreen })),
  "/schermata-6": () => import("@/routes/schermata-6").then((m) => ({ default: m.Impostazioni })),
};
const screens = {
  "/": lazy(loaders["/"]),
  "/schermata-5": lazy(loaders["/schermata-5"]),
  "/schermata-2": lazy(loaders["/schermata-2"]),
  "/schermata-4": lazy(loaders["/schermata-4"]),
  "/schermata-6": lazy(loaders["/schermata-6"]),
};
type MainPath = keyof typeof screens;
type Gesture = { x: number; y: number; time: number; dx: number; width: number; horizontal: boolean; samples: { t: number; x: number }[] };
// Already-loaded screens render synchronously, so the incoming preview never shows a blank frame.
const resolved: Partial<Record<MainPath, ComponentType>> = {};
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Only the routed surface moves; the existing navigation and sky stay untouched. */
export function SwipeNavigation({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const host = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const busy = useRef(false);
  const target = useRef<MainPath | undefined>(undefined);
  const frame = useRef(0);
  const suppressClick = useRef(0);
  const animations = useRef<Animation[]>([]);
  const [neighbor, setNeighbor] = useState<MainPath>();
  const [moving, setMoving] = useState(false);

  // Layout effect: the reset after navigation happens before paint, so the hand-off is seamless.
  useIsoLayoutEffect(() => {
    const element = host.current;
    if (!element || !mainNavigation.some((item) => item.to === path)) return;
    let disposed = false;
    // Warm only adjacent code, never mount a speculative screen or its effects.
    for (const dx of [-1, 1]) {
      const adjacent = adjacentMainPath(path, dx);
      if (adjacent && !resolved[adjacent]) void loaders[adjacent]().then((m) => { resolved[adjacent] = m.default; }).catch(() => {});
    }
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reset = () => {
      cancelAnimationFrame(frame.current);
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      if (live.current) live.current.style.removeProperty("transform");
      if (preview.current) preview.current.style.removeProperty("transform");
      gesture.current = null;
      target.current = undefined;
      busy.current = false;
      setMoving(false);
      setNeighbor(undefined);
    };
    const paint = () => {
      const g = gesture.current;
      if (!g) return;
      // Rubber band at the ends: progressive resistance instead of a linear slowdown.
      const dx = target.current ? g.dx : Math.sign(g.dx) * g.width * 0.22 * (1 - Math.exp(-Math.abs(g.dx) / (g.width * 0.6)));
      if (live.current) live.current.style.transform = `translate3d(${dx}px,0,0)`;
      if (preview.current) preview.current.style.transform = `translate3d(${dx + (g.dx < 0 ? g.width : -g.width)}px,0,0)`;
    };
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) { if (gesture.current) void finish(false); return; }
      if (busy.current || document.querySelector('[aria-modal="true"]') || document.documentElement.classList.contains("kb-open")) return;
      const origin = event.target instanceof Element ? event.target : null;
      const focused = document.activeElement;
      if (!origin || origin.closest(swipeExcludedSelector) || focused?.matches('input, textarea, [contenteditable="true"]')) return;
      const touch = event.touches[0];
      if (!touch || touch.clientX < 24 || touch.clientX > window.innerWidth - 24) return; // Keep Safari/Android edge gestures.
      gesture.current = { x: touch.clientX, y: touch.clientY, time: performance.now(), dx: 0, width: window.innerWidth, horizontal: false, samples: [] };
    };
    const move = (event: TouchEvent) => {
      const g = gesture.current;
      const touch = event.touches[0];
      if (!g || busy.current || !touch) return;
      if (event.touches.length !== 1) { void finish(false); return; }
      const dx = touch.clientX - g.x;
      const dy = touch.clientY - g.y;
      if (!g.horizontal) {
        const intent = swipeIntent(dx, dy);
        if (intent === "vertical") { gesture.current = null; return; }
        if (intent !== "horizontal") return;
        g.horizontal = true;
        // Rebase on the intent threshold: the screen starts moving from 0, no 12px jump.
        g.x = touch.clientX - Math.sign(dx);
        setMoving(true);
      }
      if (event.cancelable) event.preventDefault();
      const moved = touch.clientX - g.x;
      g.dx = Math.max(-g.width, Math.min(g.width, moved));
      const now = performance.now();
      g.samples.push({ t: now, x: g.dx });
      while (g.samples.length > 2 && now - g.samples[0].t > 90) g.samples.shift();
      const next = adjacentMainPath(path, g.dx);
      if (next !== target.current) {
        target.current = next;
        setNeighbor(next);
        if (preview.current) preview.current.style.transform = `translate3d(${g.dx + (g.dx < 0 ? g.width : -g.width)}px,0,0)`;
      }
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(paint);
    };
    const finish = async (allowCommit: boolean) => {
      const g = gesture.current;
      if (!g || busy.current) return;
      if (!g.horizontal) { gesture.current = null; return; }
      busy.current = true;
      suppressClick.current = performance.now() + 500;
      cancelAnimationFrame(frame.current);
      paint();
      const next = target.current;
      const commit = allowCommit && next && commitsSwipe(g.dx, g.width, performance.now() - g.time);
      const destination = commit ? (g.dx < 0 ? -g.width : g.width) : 0;
      const initial = next ? g.dx : Math.sign(g.dx) * g.width * 0.22 * (1 - Math.exp(-Math.abs(g.dx) / (g.width * 0.6)));
      const offset = g.dx < 0 ? g.width : -g.width;
      // Finger speed at release (px/ms) so the spring continues the drag without a jolt.
      const first = g.samples[0];
      const last = g.samples[g.samples.length - 1];
      const velocity = first && last && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
      let frames: number[];
      let duration: number;
      if (reduced()) { frames = [initial, destination]; duration = 90; }
      else if (commit) {
        // Completed change: the new screen overshoots the centre visibly, then settles.
        ({ frames, duration } = springFrames(initial, destination, velocity, Math.min(18, g.width * 0.045), Math.min(30, g.width * 0.075)));
      } else {
        ({ frames, duration } = springFrames(initial, 0, next ? velocity : 0, 0, 14));
      }
      const animate = (node: HTMLElement | null, shift: number) => {
        if (!node) return;
        const animation = node.animate(frames.map((x) => ({ transform: `translate3d(${x + shift}px,0,0)` })),
          { duration, easing: "linear", fill: "forwards" });
        animations.current.push(animation);
      };
      animate(live.current, 0);
      if (next) animate(preview.current, offset);
      await Promise.all(animations.current.map((animation) => animation.finished.catch(() => {})));
      if (disposed) return;
      if (commit) {
        try { await navigate({ to: next }); }
        catch { reset(); }
      } else reset();
    };
    const end = () => { void finish(true); };
    const cancel = () => { void finish(false); };
    const click = (event: MouseEvent) => {
      if (performance.now() < suppressClick.current) { event.preventDefault(); event.stopPropagation(); }
    };
    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", cancel);
    element.addEventListener("click", click, true);
    window.addEventListener("resize", cancel);
    return () => {
      disposed = true;
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", cancel);
      element.removeEventListener("click", click, true);
      window.removeEventListener("resize", cancel);
      reset();
    };
  }, [path, navigate]);

  // Keep the newly mounted preview aligned with the current finger position.
  useEffect(() => {
    const g = gesture.current;
    if (g && preview.current) preview.current.style.transform = `translate3d(${g.dx + (g.dx < 0 ? g.width : -g.width)}px,0,0)`;
  }, [neighbor]);

  const Preview = neighbor ? screens[neighbor] : null;
  return (
    <div ref={host} className={`screen-swipe-host${moving ? " screen-swipe-moving" : ""}`}>
      <div ref={live} className="screen-swipe-live">{children}</div>
      {Preview && <div ref={preview} className="screen-swipe-preview" inert aria-hidden="true">
        <SwipePreviewContext.Provider value={true}>
          <Suspense fallback={null}><Preview /></Suspense>
        </SwipePreviewContext.Provider>
      </div>}
    </div>
  );
}