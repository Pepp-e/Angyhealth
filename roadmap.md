# Daily push notifications
- [x] Adapt notification text to existing language/theme and verify bottom navigation depth effect (Chromium mobile, translation coverage, 16 existing push tests); physical iOS safe-area/PWA verification unavailable.
- [x] Confirm compatible Web Push implementation and secure device ownership.
- [x] Add persistent subscriptions, authenticated sender, and daily local-time scheduling.
- [x] Add Notifications preference and explicit permission request below haptic feedback.
- [x] Test available UI flows, controlled dispatcher, timezone/DST, duplicates, expiry, and authenticated callback.
- [x] Report publication/device checks in PUSH_NOTIFICATIONS_REPORT.md.
- [ ] Verify real push subscription and closed-page delivery after publishing; blocked by sandbox push registration denial and no physical iPhone/Android device.