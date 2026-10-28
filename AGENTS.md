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
- Push device ownership uses its own encrypted HttpOnly session cookie and service-only tables, independent of the existing PIN versions, because both versions must work without new account login.
- VAPID keys are derived from a Cloud-generated server-only seed using SHA-256 and P-256; only the public key may be returned to the browser.
- A managed quarter-hour callback checks IANA local time and atomically claims each local day; short TTL, worker expiry checks, and no same-day retries prioritize no stale or duplicate reminders over guaranteed delivery.
