import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ enabled: true, claimed: false, status: "", claimCalls: 0 }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {
  from: () => ({
    select: (columns: string) => columns === "enabled"
      ? { eq: () => ({ single: async () => ({ data: { enabled: state.enabled }, error: null }) }) }
      : { eq: () => ({ order: () => ({ limit: async () => ({ data: state.enabled ? [{
        id: "test-subscription", endpoint: "https://web.push.apple.com/test", timezone: "Europe/Rome",
        p256dh: "test", auth: "test", expiration_time: null,
      }] : [], error: null }) }) }) },
    update: (values: { enabled?: boolean; last_status?: string }) => ({ eq: async () => {
      if (values.enabled !== undefined) state.enabled = values.enabled;
      if (values.last_status !== undefined) state.status = values.last_status;
      return { error: null };
    } }),
  }),
  rpc: async () => { state.claimCalls++; const first = !state.claimed && state.enabled; state.claimed = true; return { data: first, error: null }; },
} }));
vi.mock("@block65/webcrypto-web-push", () => ({ buildPushPayload: async () => ({ method: "POST", body: "encrypted-test-payload" }) }));
import { sendDailyReminders } from "./push-sender.server";
describe("Scheduled server dispatcher", () => {
  beforeEach(() => { state.enabled = true; state.claimed = false; state.status = ""; state.claimCalls = 0; vi.unstubAllGlobals(); });
  it("dispatches at local 16:00 only once despite repeated callbacks", async () => {
    const fetch = vi.fn(async () => new Response("", { status: 201 })); vi.stubGlobal("fetch", fetch);
    const hour = new Date("2026-10-28T15:00:00Z");
    vi.useFakeTimers(); vi.setSystemTime(hour);
    try {
      expect(await sendDailyReminders("test-seed", hour)).toEqual({ scanned: 1, accepted: 1 });
      expect(await sendDailyReminders("test-seed", hour)).toEqual({ scanned: 1, accepted: 0 });
      expect(fetch).toHaveBeenCalledTimes(1);
    } finally { vi.useRealTimers(); }
  });
  it("does not dispatch a disabled subscription", async () => {
    state.enabled = false; const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    await sendDailyReminders("test-seed", new Date("2026-10-28T15:00:00Z"));
    expect(fetch).not.toHaveBeenCalled(); expect(state.claimCalls).toBe(0);
  });
  it("does not claim before local 16:00", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    await sendDailyReminders("test-seed", new Date("2026-10-28T14:59:00Z"));
    expect(fetch).not.toHaveBeenCalled(); expect(state.claimCalls).toBe(0);
  });
  it("disables expired registrations after a 410 provider reply", async () => {
    const now = new Date("2026-10-28T15:00:00Z"); vi.useFakeTimers(); vi.setSystemTime(now);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("expired", { status: 410 })));
    try { await sendDailyReminders("test-seed", now); expect(state.enabled).toBe(false); expect(state.status).toBe("410"); }
    finally { vi.useRealTimers(); }
  });
  it("never uses redirect: error, which the live server runtime rejects", async () => {
    const now = new Date("2026-10-28T15:00:00Z"); vi.useFakeTimers(); vi.setSystemTime(now);
    const fetch = vi.fn(async (_url: string, init: RequestInit) => new Response("", { status: init.redirect === "error" ? 599 : 201 }));
    vi.stubGlobal("fetch", fetch);
    try { expect(await sendDailyReminders("test-seed", now)).toEqual({ scanned: 1, accepted: 1 }); expect(fetch.mock.calls[0]![1].redirect).toBe("manual"); }
    finally { vi.useRealTimers(); }
  });
  it("retries once immediately on a temporary push service error", async () => {
    const now = new Date("2026-10-28T15:00:00Z"); vi.useFakeTimers(); vi.setSystemTime(now);
    const fetch = vi.fn().mockResolvedValueOnce(new Response("", { status: 503 })).mockResolvedValueOnce(new Response("", { status: 201 }));
    vi.stubGlobal("fetch", fetch);
    try { expect(await sendDailyReminders("test-seed", now)).toEqual({ scanned: 1, accepted: 1 }); expect(fetch).toHaveBeenCalledTimes(2); }
    finally { vi.useRealTimers(); }
  });
  it("uses Europe/Rome 16:00 in summer time too", async () => {
    const now = new Date("2026-07-15T14:00:00Z"); vi.useFakeTimers(); vi.setSystemTime(now);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 201 })));
    try { expect(await sendDailyReminders("test-seed", now)).toEqual({ scanned: 1, accepted: 1 }); }
    finally { vi.useRealTimers(); }
  });
});
