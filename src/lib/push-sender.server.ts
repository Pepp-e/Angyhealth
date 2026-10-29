import { buildPushPayload } from "@block65/webcrypto-web-push";
import { REMINDER, REMINDER_TTL, localReminderWindow, allowedPushEndpoint } from "./push-rules";
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
      const window = localReminderWindow(now, row.timezone);
      if (!window.due || !allowedPushEndpoint(row.endpoint)) continue;
      const { data: claimed, error: claimError } = await supabaseAdmin.rpc("claim_push_reminder", { subscription_id: row.id, local_day: window.day });
      if (claimError) throw new Error("Impossibile proteggere l’invio dai duplicati");
      if (!claimed) continue;
      // Recheck disabling immediately before dispatch. Claimed attempts are never retried that day.
      const { data: current, error: currentError } = await supabaseAdmin.from("push_subscriptions").select("enabled").eq("id", row.id).single();
      if (currentError || !current?.enabled) continue;
      const expiresAt = now.getTime() + REMINDER_TTL * 1000;
      if (Date.now() >= expiresAt - 1000) continue;
      try {
        const payload = await buildPushPayload({
          data: JSON.stringify({ ...REMINDER, day: window.day, expiresAt }),
          options: { ttl: Math.max(1, Math.floor((expiresAt - Date.now()) / 1000)), urgency: "high", topic: "angyhealth-daily" },
        }, { endpoint: row.endpoint, expirationTime: row.expiration_time ? Date.parse(row.expiration_time) : null, keys: { p256dh: row.p256dh, auth: row.auth } }, vapid);
        const response = await fetch(row.endpoint, { ...payload, redirect: "error", signal: AbortSignal.timeout(8000) });
        await response.text();
        const stale = response.status === 404 || response.status === 410;
        const result = await supabaseAdmin.from("push_subscriptions").update({
          last_status: String(response.status), ...(stale ? { enabled: false } : {}),
        }).eq("id", row.id);
        if (result.error) console.error("Push status persistence failed");
        if (response.ok) accepted++;
        else console.error("Push service rejected reminder", response.status);
      } catch {
        console.error("Push delivery failed; no retry to avoid duplicate reminders");
        await supabaseAdmin.from("push_subscriptions").update({ last_status: "failed" }).eq("id", row.id);
      }
    }
    cursor = rows[rows.length - 1]?.id ?? "";
    if (rows.length < 100) break;
  }
  return { scanned, accepted };
}