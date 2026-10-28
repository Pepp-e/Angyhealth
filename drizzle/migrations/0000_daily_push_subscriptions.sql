CREATE TABLE public.push_subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 device_id uuid NOT NULL,
 endpoint text NOT NULL UNIQUE,
 p256dh text NOT NULL,
 auth text NOT NULL,
 timezone text NOT NULL,
 enabled boolean NOT NULL DEFAULT false,
 expiration_time timestamptz,
 last_attempt_date date,
 last_status text,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE INDEX push_subscriptions_enabled ON public.push_subscriptions (timezone) WHERE enabled;
CREATE OR REPLACE FUNCTION public.claim_push_reminder(subscription_id uuid, local_day date)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE claimed uuid;
BEGIN
 UPDATE public.push_subscriptions SET last_attempt_date = local_day, last_status = 'claimed'
 WHERE id = subscription_id AND enabled AND (last_attempt_date IS NULL OR last_attempt_date < local_day)
 AND (expiration_time IS NULL OR expiration_time > now())
 RETURNING id INTO claimed;
 RETURN claimed IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_push_reminder(uuid, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_push_reminder(uuid, date) TO service_role;