export const REMINDER = { title: "AngyHealth", body: "Come stai oggi?", icon: "/icon-512.png" } as const;
export const REMINDER_TTL = 300;

export function localReminderWindow(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    day: `${value("year")}-${value("month")}-${value("day")}`,
    due: value("hour") === "16" && Number(value("minute")) < 5,
  };
}

export function allowedPushEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint);
    const host = url.hostname;
    return url.protocol === "https:" && !url.username && !url.password && !url.port && (
      host === "fcm.googleapis.com" || host === "updates.push.services.mozilla.com" ||
      host === "web.push.apple.com" || host.endsWith(".push.apple.com") ||
      host.endsWith(".notify.windows.com")
    );
  } catch { return false; }
}