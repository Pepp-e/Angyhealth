import { createServerFn } from "@tanstack/react-start";
import { useSession, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { allowedPushEndpoint } from "./push-rules";

const subscriptionSchema = z.object({
  endpoint: z.string().max(2048).refine(allowedPushEndpoint, "Servizio push non supportato"),
  keys: z.object({ p256dh: z.string().regex(/^[\w-]{87,88}$/), auth: z.string().regex(/^[\w-]{22,24}$/) }),
  expirationTime: z.number().nonnegative().nullable(),
});
const timezoneSchema = z.string().min(1).max(100).refine((value) => {
  try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; }
});

export const pushConfiguration = createServerFn({ method: "POST" }).handler(async () => {
  setResponseHeader("Cache-Control", "no-store");
  const seed = process.env['ANGYHEALTH_PUSH_SEED'];
  const secret = process.env['ANGYHEALTH_PUSH_SESSION_SECRET'];
  if (!seed || !secret) return { configured: false as const, publicKey: "" };
  const session = await useSession<{ deviceId: string }>({
    password: secret, name: "angyhealth_push_device", maxAge: 60 * 60 * 24 * 365 * 5,
    cookie: { httpOnly: true, secure: true, sameSite: "strict", path: "/" },
  });
  if (!session.data.deviceId) await session.update({ deviceId: crypto.randomUUID() });
  const { deriveVapidKeys } = await import("./push-keys.server");
  return { configured: true as const, publicKey: (await deriveVapidKeys(seed)).publicKey };
});

export const updatePushDevice = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({
    enabled: z.boolean(), timezone: timezoneSchema, subscription: subscriptionSchema.optional(),
  }).parse(input))
  .handler(async ({ data }) => {
    const secret = process.env['ANGYHEALTH_PUSH_SESSION_SECRET'];
    if (!secret) throw new Error("Notifiche non configurate");
    const session = await useSession<{ deviceId: string }>({
      password: secret, name: "angyhealth_push_device", maxAge: 60 * 60 * 24 * 365 * 5,
      cookie: { httpOnly: true, secure: true, sameSite: "strict", path: "/" },
    });
    const deviceId = session.data.deviceId;
    if (!deviceId) throw new Error("Apri nuovamente le Impostazioni per registrare questo dispositivo");
    // Device ownership is verified with an encrypted HttpOnly cookie, independent of both PIN versions.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.enabled) {
      const { error } = await supabaseAdmin.from("push_subscriptions").update({ enabled: false, updated_at: new Date().toISOString() }).eq("device_id", deviceId);
      if (error) throw new Error("Disattivazione non confermata: riprova quando sei online");
      return { enabled: false };
    }
    const subscription = data.subscription;
    if (!subscription) throw new Error("Registrazione push necessaria");
    const { data: existing, error: readError } = await supabaseAdmin.from("push_subscriptions").select("id,device_id").eq("endpoint", subscription.endpoint).maybeSingle();
    if (readError) throw new Error("Impossibile verificare la registrazione push");
    if (existing && existing.device_id !== deviceId) throw new Error("Registrazione appartenente a un’altra sessione: disattiva e riattiva le notifiche");
    const values = {
      device_id: deviceId, endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth, timezone: data.timezone, enabled: true,
      expiration_time: subscription.expirationTime === null ? null : new Date(subscription.expirationTime).toISOString(),
      updated_at: new Date().toISOString(),
    };
    const result = existing
      ? await supabaseAdmin.from("push_subscriptions").update(values).eq("id", existing.id).eq("device_id", deviceId)
      : await supabaseAdmin.from("push_subscriptions").insert(values);
    if (result.error) throw new Error("Impossibile attivare la pianificazione push");
    return { enabled: true };
  });