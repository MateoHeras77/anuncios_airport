# Android PWA Installability Verification Checklist (Chrome)

Target URL: https://announcements.swiftshift.digital/

> **Method**: Automated inspection using Playwright in this environment. Network access via `curl` to the site returned 403 from the proxy, so the checks below were performed with Playwright instead.

## 1. Delivery & Security (Non-negotiable)
- ✅ App is served over HTTPS (loaded at `https://announcements.swiftshift.digital/`).
- ⚠️ HTTP → HTTPS redirect observed (final URL becomes HTTPS). Unable to confirm whether any redirect chain could affect service worker scope, since no service worker is registered.
- ⚠️ TLS certificate validity on low-end Android builds **not verified** (certificate chain inspection failed in this environment).

## 2. Web App Manifest (Chrome is strict)
- ✅ `<link rel="manifest" href="/manifest.webmanifest">` exists in `<head>`.
- ✅ Manifest URL returns **200 OK** (no redirect observed).
- ✅ Content-Type is `application/manifest+json; charset=utf-8`.
- ✅ `name` and `short_name` are present and non-empty.
- ✅ `start_url` is `/` and loads without auth redirects in this inspection.
- ✅ `display` is `standalone`.
- ✅ `background_color` and `theme_color` are defined.

## 3. Icons (Extremely Common Android Failure)
- ❌ No **192×192** PNG icon.
- ❌ No **512×512** PNG icon (only SVG provided).
- ❌ Icons are **SVG only** (`/icon.svg`), which Android ignores.
- ⚠️ Transparency not verified (SVG only).
- ❌ Icon content-type is `image/svg+xml`, not `image/png`.
- ✅ Icon URL resolves correctly from manifest path.

## 4. Service Worker (The Real Gatekeeper)
- ❌ No service worker registration detected.
- ❌ `navigator.serviceWorker.controller` is `null` (page is not controlled).
- ⚠️ Service worker file URL not found (no registration code detected in HTML).

## 5. Installability Heuristics (Chrome’s Silent Rules)
- ⚠️ User engagement and visit frequency not measurable here.
- ⚠️ Incognito mode not applicable to this automated check.
- ✅ No immediate hard redirect on load (page loads directly at `/`).
- ⚠️ Crash/error telemetry not available.

## 6. Offline Capability (Required for Android PWA)
- ❌ No service worker → **no offline capability** confirmed.
- ❌ No fetch handler detected (no service worker).

## 7. Caching & Headers (Subtle but Deadly)
- ✅ `manifest.webmanifest` served inline (no `Content-Disposition: attachment`).
- ⚠️ Icons served inline, but only SVG (Android won’t accept). PNG icons needed.
- ⚠️ No service worker file to validate cache headers.

## 8. Android / Chrome Environment Sanity Check
- ⚠️ Device/OS/Chrome version checks must be validated on target Android hardware.

## 9. How to Verify (No Guessing Allowed)
- ⚠️ DevTools/`chrome://inspect` checks require a live Android device; not performed here.
- ⚠️ Lighthouse PWA audit on Android device not performed here.

## 10. Final Reality Check
- **Current state is NOT installable on Android Chrome** because:
  - There is **no service worker** registration.
  - The manifest provides **only SVG icons**, which Android ignores.

## Recommended Fixes (Minimum to Pass Android Installability)
1. **Add a service worker** and ensure it controls the start URL.
2. **Provide PNG icons** in the manifest:
   - 192×192 (PNG)
   - 512×512 (PNG)
3. Confirm service worker scope covers `/` and `navigator.serviceWorker.ready` resolves.
4. Re-run installability checks in Android Chrome (DevTools → Application, `chrome://inspect`).
