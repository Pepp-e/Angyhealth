import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const COOKIE = "nuvola_2202";

/** Verifica il PIN 2202 lato server e apre una sessione con cookie HttpOnly. */
export const verifyPin2202 = createServerFn({ method: "POST" })
  .inputValidator((data: { pin: string }) => ({ pin: String(data?.pin ?? "") }))
  .handler(async ({ data }) => {
    const { isValidPin, createSessionToken } = await import("./pin-2202.server");
    if (!isValidPin(data.pin)) return { ok: false as const };
    setCookie(COOKIE, await createSessionToken(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    return { ok: true as const };
  });

/** Indica se la sessione 2202 corrente è valida. */
export const hasSession2202 = createServerFn({ method: "POST" }).handler(async () => {
  const { isValidSessionToken } = await import("./pin-2202.server");
  return { ok: await isValidSessionToken(getCookie(COOKIE)) };
});

/** Chiude la sessione 2202. */
export const endSession2202 = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true as const };
});
