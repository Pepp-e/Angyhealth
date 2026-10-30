<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Daily notifications use native Web Push and a messaging-only worker, never app-shell caching, to preserve the existing PWA behavior.
- Notification UI stores canonical translation keys and scopes theme styling to its own wrapper; navigation depth is a pointer-transparent decoration inside the fixed navigation stacking context, so unrelated screens and navigation geometry remain unchanged.
- Push device ownership uses its own encrypted HttpOnly session cookie and service-only tables, independent of the existing PIN versions, because both versions must work without new account login.
- VAPID keys are derived from a Cloud-generated server-only seed using SHA-256 and P-256; only the public key may be returned to the browser.
- A managed callback runs at 14:00 and 15:00 UTC and sends only when the reminder timezone (push-rules) reads 16:00, so DST needs no schedule change; each day is atomically claimed, with one immediate retry on transient errors because the worker dedupes per day.
- Push sends run on workerd: fetch must use redirect "manual" ("error" throws there), and `{"kind":"test"}` on the cron route is the authenticated immediate diagnostic send.
