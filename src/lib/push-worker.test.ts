import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

function harness() {
  const listeners: Record<string, (event: unknown) => void> = {};
  const buckets = new Map<string, Map<string, Response>>();
  const notifications: unknown[] = [];
  const caches = { open: async (name: string) => {
    const entries = buckets.get(name) ?? new Map<string, Response>(); buckets.set(name, entries);
    return {
      match: async (key: string) => entries.get(key)?.clone(),
      put: async (key: string, value: Response) => { entries.set(key, value); },
      keys: async () => [...entries.keys()].map((key) => ({ url: `https://angyhealth.lovable.app${key}` })),
      delete: async (key: { url: string }) => entries.delete(new URL(key.url).pathname),
    };
  } };
  runInNewContext(readFileSync("public/angyhealth-push-sw.js", "utf8"), {
    self: { addEventListener: (name: string, fn: (event: unknown) => void) => { listeners[name] = fn; },
      registration: { showNotification: async (title: string, options: unknown) => notifications.push({ title, options }), getNotifications: async () => [] },
    }, caches, Date, Response, URL,
  });
  const dispatch = async (name: string, data: unknown) => {
    let work: Promise<unknown> = Promise.resolve();
    listeners[name]?.({ data: name === "push" ? { json: () => data } : data, ports: [], waitUntil: (promise: Promise<unknown>) => { work = promise; } });
    await work;
  };
  return { notifications, dispatch };
}
const reminder = () => ({ title: "AngyHealth", body: "Come stai oggi?", day: "2026-10-28", expiresAt: Date.now() + 300000 });
describe("Messaging worker delivery guards", () => {
  it("shows the exact reminder and official icon", async () => {
    const h = harness(); await h.dispatch("push", reminder());
    expect(h.notifications).toEqual([{ title: "AngyHealth", options: { body: "Come stai oggi?", icon: "/icon-512.png", badge: "/favicon.png", tag: "angyhealth-daily", data: { path: "/" } } }]);
  });
  it("never shows a duplicate local day", async () => {
    const h = harness(); await h.dispatch("push", reminder()); await h.dispatch("push", reminder());
    expect(h.notifications).toHaveLength(1);
  });
  it("blocks delivery while disabled and resumes when re-enabled", async () => {
    const h = harness(); await h.dispatch("message", { type: "angyhealth-push-preference", enabled: false });
    await h.dispatch("push", reminder()); expect(h.notifications).toHaveLength(0);
    await h.dispatch("message", { type: "angyhealth-push-preference", enabled: true });
    await h.dispatch("push", reminder()); expect(h.notifications).toHaveLength(1);
  });
  it("discards expired offline reminders", async () => {
    const h = harness(); await h.dispatch("push", { ...reminder(), expiresAt: Date.now() - 1 });
    expect(h.notifications).toHaveLength(0);
  });
});