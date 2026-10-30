import { buildPushPayload } from "@block65/webcrypto-web-push";
import { REMINDER, REMINDER_TTL, REMINDER_TIMEZONE, localReminderWindow, allowedPushEndpoint } from "./push-rules";
import { deriveVapidKeys } from "./push-keys.server";

export async function sendDailyReminders(seed: string, now = new Date()) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const vapid = await deriveVapidKeys(seed);
  let scanned = 0;
  let accepted = 0;
  // Cursor pagination and sequential sends stay within the runtime's outbound connection budget.
  let cursor = "";
  for (;;) {
    let query = supabaseAdmin.from("push_subscriptions").select("*").eq("enabled", true).order("id").limit(100);
    if (cursor) query = query.gt("id", cursor);
    const { data: rows, error } = await query;
    if (error) throw new Error("Impossibile leggere le sottoscrizioni push");
    if (!rows?.length) break;
    for (const row of rows) {
      scanned++;
      const window = localReminderWindow(now, REMINDER_TIMEZONE);
      if (!window.due || !allowedPushEndpoint(row.endpoint)) continue;
      const { data: claimed, error: claimError } = await supabaseAdmin.rpc("claim_push_reminder", { subscription_id: row.id, local_day: window.day });
      if (claimError) throw new Error("Impossibile proteggere l’invio dai duplicati");
      if (!claimed) continue;
      // Recheck disabling immediately before dispatch. Claimed attempts are never retried that day.
      const { data: current, error: currentError } = await supabaseAdmin.from("push_subscriptions").select("enabled").eq("id", row.id).single();
      if (currentError || !current?.enabled) continue;
      const expiresAt = now.getTime() + REMINDER_TTL * 1000;
      if (Date.now() >= expiresAt - 1000) continue;
      const status = await deliver(row, window.day, expiresAt, vapid);
      const stale = status === 404 || status === 410;
      const result = await supabaseAdmin.from("push_subscriptions").update({
        last_status: typeof status === "number" ? String(status) : status, ...(stale ? { enabled: false } : {}),
      }).eq("id", row.id);
      if (result.error) console.error("Push status persistence failed");
      if (typeof status === "number" && status >= 200 && status < 300) accepted++;
      else console.error("Push reminder not accepted", status);
    }
    cursor = rows[rows.length - 1]?.id ?? "";
    if (rows.length < 100) break;
  }
  return { scanned, accepted };
}

type PushRow = { endpoint: string; expiration_time: string | null; p256dh: string; auth: string };

/** One immediate retry on transient failures; the worker's per-day dedupe and the push topic make a repeat harmless. */
async function deliver(row: PushRow, day: string, expiresAt: number, vapid: Awaited<ReturnType<typeof deriveVapidKeys>>): Promise<number | string> {
  let outcome: number | string = "failed";
  for (let attempt = 0; attempt < 2; attempt++) {
    const ttl = Math.floor((expiresAt - Date.now()) / 1000);
    if (ttl < 1) return outcome;
    try {
      const payload = await buildPushPayload({
        data: JSON.stringify({ ...REMINDER, day, expiresAt }),
        options: { ttl, urgency: "high", topic: "angyhealth-daily" },
      }, { endpoint: row.endpoint, expirationTime: row.expiration_time ? Date.parse(row.expiration_time) : null, keys: { p256dh: row.p256dh, auth: row.auth } }, vapid);
      // Workers reject redirect: "error"; "manual" keeps redirects from being followed.
      const response = await fetch(row.endpoint, { ...payload, redirect: "manual", signal: AbortSignal.timeout(8000) });
      await response.text();
      outcome = response.status;
      if (response.status !== 429 && response.status < 500) return outcome;
    } catch (error) {
      outcome = "failed";
      console.error("Push delivery error", error instanceof Error ? `${error.name}: ${error.message}` : "unknown");
    }
  }
  return outcome;
}
/** Diagnostic: immediate send to every enabled device, without claiming the day, so today's 16:00 reminder still goes out. */
export async function sendTestReminders(seed: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const vapid = await deriveVapidKeys(seed);
  const { data: rows, error } = await supabaseAdmin.from("push_subscriptions").select("*").eq("enabled", true).limit(20);
  if (error) throw new Error("Impossibile leggere le sottoscrizioni push");
  const results: Array<number | string> = [];
  for (const row of rows ?? []) {
    if (!allowedPushEndpoint(row.endpoint)) continue;
    results.push(await deliver(row, `test-${Date.now()}`, Date.now() + REMINDER_TTL * 1000, vapid));
  }
  return { scanned: rows?.length ?? 0, results };
}
