import { describe, expect, it } from "vitest";
import { REMINDER, REMINDER_TTL, localReminderWindow, allowedPushEndpoint } from "./push-rules";
import { deriveVapidKeys } from "./push-keys.server";
import { buildPushPayload } from "@block65/webcrypto-web-push";
import { p256 } from "@noble/curves/nist.js";

describe("Daily local reminder rules", () => {
  it("is due at 16:00 in Rome in winter", () => {
    expect(localReminderWindow(new Date("2026-10-28T15:00:00Z"), "Europe/Rome")).toEqual({ day: "2026-10-28", due: true });
  });
  it("is due at 16:00 in Rome with daylight saving", () => {
    expect(localReminderWindow(new Date("2026-07-28T14:00:00Z"), "Europe/Rome").due).toBe(true);
    expect(localReminderWindow(new Date("2026-07-28T15:00:00Z"), "Europe/Rome").due).toBe(false);
  });
  it("supports half-hour device zones", () => {
    expect(localReminderWindow(new Date("2026-10-28T10:30:00Z"), "Asia/Kolkata").due).toBe(true);
  });
  it("supports quarter-hour device zones", () => {
    expect(localReminderWindow(new Date("2026-10-28T10:15:00Z"), "Asia/Kathmandu").due).toBe(true);
  });
  it("never sends before 16:00 or stale past the five-minute window", () => {
    expect(localReminderWindow(new Date("2026-10-28T14:59:59Z"), "Europe/Rome").due).toBe(false);
    expect(localReminderWindow(new Date("2026-10-28T15:05:00Z"), "Europe/Rome").due).toBe(false);
    expect(REMINDER_TTL).toBe(300);
  });
  it("uses the required exact payload and existing logo", () => {
    expect(REMINDER).toEqual({ title: "AngyHealth", body: "Come stai oggi?", icon: "/icon-512.png" });
  });
  it("blocks arbitrary URLs, credentials, redirects to private hosts", () => {
    expect(allowedPushEndpoint("http://fcm.googleapis.com/send/x")).toBe(false);
    expect(allowedPushEndpoint("https://127.0.0.1/send/x")).toBe(false);
    expect(allowedPushEndpoint("https://fcm.googleapis.com.evil.test/x")).toBe(false);
    expect(allowedPushEndpoint("https://user:pass@web.push.apple.com/x")).toBe(false);
    expect(allowedPushEndpoint("https://web.push.apple.com/x")).toBe(true);
  });
  it("derives stable valid VAPID keys and interoperable RFC8291 requests", async () => {
    const keys = await deriveVapidKeys("test-only-seed-not-a-production-secret");
    expect(await deriveVapidKeys("test-only-seed-not-a-production-secret")).toEqual(keys);
    expect((await deriveVapidKeys("different-test-seed")).publicKey).not.toBe(keys.publicKey);
    const privateBytes = Buffer.from(keys.privateKey, "base64url");
    expect(Buffer.from(p256.getPublicKey(privateBytes, false)).toString("base64url")).toBe(keys.publicKey);
    const receiver = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    const publicKey = await crypto.subtle.exportKey("raw", receiver.publicKey);
    const payload = await buildPushPayload({ data: JSON.stringify(REMINDER), options: { ttl: 300 } }, {
      endpoint: "https://web.push.apple.com/test", expirationTime: null,
      keys: { p256dh: Buffer.from(publicKey).toString("base64url"), auth: Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64url") },
    }, keys);
    expect(payload.headers['content-encoding']).toBe("aes128gcm");
    expect(payload.headers.authorization).toMatch(/^vapid /);
    expect(payload.headers.ttl).toBe("300");
    expect(payload.body.byteLength).toBeGreaterThan(0);
  });
});