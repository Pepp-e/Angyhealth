import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { z } from "zod";

export const Route = createFileRoute("/api/public/jobs/daily-reminders")({
  server: { handlers: { POST: async ({ request }) => {
    const failure = await authenticateCronRequest(request);
    if (failure) return failure;
    const body = z.object({ kind: z.enum(["daily", "test"]) }).strict().safeParse(await request.json().catch(() => null));
    if (!body.success) return new Response("Invalid request", { status: 400 });
    const seed = process.env['ANGYHEALTH_PUSH_SEED'];
    if (!seed) return new Response("Push not configured", { status: 503 });
    const { sendDailyReminders, sendTestReminders } = await import("@/lib/push-sender.server");
    return Response.json(body.data.kind === "test" ? await sendTestReminders(seed) : await sendDailyReminders(seed));
  } } },
});
