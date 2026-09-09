/**
 * Modulo server-only: il PIN della versione 2202 non viene mai inviato al browser.
 * (I file *.server.ts sono esclusi dal bundle client.)
 */
const PIN_2202 = process.env["PIN_2202"] ?? "2202";
const SECRET = process.env["PIN_2202_SECRET"] ?? "nuvola-2202-session-secret";

export const SESSION_COOKIE = "nuvola_2202";

async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isValidPin(pin: string): boolean {
  return pin === PIN_2202;
}

export async function createSessionToken(): Promise<string> {
  const payload = `2202.${Date.now()}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  if (!payload.startsWith("2202.")) return false;
  return token.slice(idx + 1) === (await hmac(payload));
}
