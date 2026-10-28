import { p256 } from "@noble/curves/nist.js";

/** Secret seed is stored by Cloud; only the public key leaves the server. */
export async function deriveVapidKeys(seed: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`AngyHealth Web Push v1:${seed}`)));
  // P-256 scalar mapping: ensure 1 <= d < n, including the vanishingly rare boundary case.
  const number = BigInt(`0x${Buffer.from(digest).toString("hex")}`);
  const scalar = number % (p256.Point.Fn.ORDER - 1n) + 1n;
  const privateBytes = Uint8Array.from(Buffer.from(scalar.toString(16).padStart(64, "0"), "hex"));
  return {
    subject: "https://angyhealth.lovable.app",
    publicKey: Buffer.from(p256.getPublicKey(privateBytes, false)).toString("base64url"),
    privateKey: Buffer.from(privateBytes).toString("base64url"),
  };
}