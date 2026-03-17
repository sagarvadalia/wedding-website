# Wedding Website – Full Audit (Expanded)

**Date:** March 17, 2025  
**Scope:** Business logic, email, security, frontend, API, data layer, performance, and operations.

---

## 1. Email Logic

### 1.1 RSVP confirmation email (fire-and-forget)

- **Location:** `server/src/controllers/rsvpController.ts` → `sendRsvpConfirmation(groupId).catch(...)`  
- **Behavior:** After a successful RSVP submit, the server sends a confirmation email in the background and does **not** wait for success/failure before responding.
- **Fixed:** The client used to show: *"A confirmation email has been sent to {email}"* even when email could fail or be skipped. Copy was updated to: *"If you provided an email, we'll send a confirmation to {email} shortly."*
- **Optional:** To show "sent" only when delivery is confirmed, you could await the send (with timeout) and return e.g. `confirmationEmailSent: boolean`. Original recommendation was:
  - **Option A:** Change copy to something like: *"If you provided an email, we’ll send a confirmation there shortly."* so the promise is accurate, or  
  - **Option B:** Await the email send (with timeout) and return e.g. `confirmationEmailSent: boolean` so the UI can show "sent" only when true (adds latency and failure surface for the HTTP response).

### 1.2 When confirmation email is skipped

- **Location:** `server/src/services/emailService.ts` – `sendRsvpConfirmation()`
- **Skipped when:**
  - `CONFIRMATION_EMAIL_ENABLED === false` (env)
  - `GMAIL_USER` or `GMAIL_APP_PASSWORD` missing/empty
  - Group or guests not found for `groupId`
  - First guest in the group has no email
- **Behavior:** Logs at info/warn and returns; no feedback to the client. The updated UI copy (1.1) no longer promises delivery, so this is acceptable.

### 1.3 Reminder emails (RSVP / Travel)

- **Location:** `server/src/services/emailService.ts` – `sendRsvpReminder()`, `sendTravelReminder()`
- **Behavior:** Return `ReminderResult` with `sent`, `skipped`, and `errors`; admin UI shows these. If Gmail is not configured, a single error entry is pushed and returned.
- **No critical bug:** Failures are reported to the caller and surfaced in the admin reminder UI.

### 1.4 Env and credentials

- **loadEnv:** `server/src/loadEnv.ts` loads `server/.env`. It is imported first via `server/src/instrument.ts`, which is the first import in `server/src/index.ts`, so env is loaded before routes and `emailService`.
- **RESEND_API_KEY:** Referenced in `loadEnv` comment but **not used**; email is sent via **nodemailer + Gmail** (`GMAIL_USER`, `GMAIL_APP_PASSWORD`). No bug, just unused/legacy reference.
- **Missing Gmail:** If `GMAIL_USER` or `GMAIL_APP_PASSWORD` is missing, confirmation is skipped (see 1.2); reminder endpoints return a clear error in the response.

---

## 2. Business Logic

### 2.1 RSVP submit

- **Validation:** `submitRsvpSchema` (Zod) validates `groupId`, `guests` array, and per-guest fields. Mailing address is required in the **controller** for attending guests (`rsvpController.ts`), not in the schema; invalid payloads get 400 with a clear message.
- **Email uniqueness:** When updating a guest’s email on submit, the controller checks `Guest.findOne({ email: trimmedEmail, _id: { $ne: guest._id } })` and returns 400 if taken. Correct.
- **Idempotency:** Same endpoint for submit and edit; guest IDs must belong to the group. No double-submit or wrong-group issues found.
- **Event types:** Only allowed `EventType[]` values are applied via `toEventTypes()`; invalid event IDs are filtered out (no crash).

### 2.2 Admin guest update

- **updateGuest:** Uses `updateGuestSchema`; `firstName`/`lastName` have `.min(1)`, so empty strings are rejected by validation. Controller only assigns when fields are present; no risk of saving empty names via validated requests.
- **Email:** Schema uses `.email()` so empty string is invalid; clearing email via API would require a schema change (e.g. allow empty or omit).

### 2.3 Admin reminder handlers

- **sendRsvpReminderHandler / sendTravelReminderHandler:** Body validated with `sendReminderSchema` (`guestIds`: array of Mongo IDs, 1–500). Invalid or missing `guestIds` get 400 before the controller runs. No unvalidated iteration.

### 2.4 Guest import

- **importGuests:** Body validated with `importGuestsSchema`; each row has required `firstName`/`lastName`. Duplicates skipped by `firstName|lastName` (case-insensitive). New groups created when `group` name doesn’t exist. Errors per row collected and returned. No obvious logic bug.

### 2.5 RSVP deadline (config)

- **Location:** `server/src/config.ts` – `getRsvpByDate()`, `isRsvpOpen()`
- **Behavior:** `RSVP_BY_DATE` is parsed as `new Date(raw)` (UTC midnight if only date). `isRsvpOpen()` compares local midnight “today” with that date. So the effective “close” moment can vary by server timezone (e.g. PST vs UTC). Acceptable for a single-timezone wedding; document or set env in the desired timezone.

### 2.6 Guestbook

- **createEntry:** Validated with `createGuestbookEntrySchema` (name and message required, length limits). Rate-limited (10 per 15 min). No business-logic bug found.
- **deleteEntry:** UploadThing file delete failures are logged but do not block entry deletion; entry is still removed. Intentional best-effort cleanup.

---

## 3. Error Handling & Safety

- **RSVP submit:** Try/catch returns 500 and logs; confirmation email failure is logged in the `.catch()` and does not affect the response. No unhandled rejection.
- **Reminder handlers:** Try/catch return 500 with a single error entry in the same shape as `ReminderResult`. Consistent for client.
- **Global:** `errorHandler` middleware and Sentry are in place; async route errors should be passed to `next(err)` or caught and responded. Controllers use try/catch and send status + JSON.

### 3.1 Auth

- **ADMIN_TOKEN:** Default is `'demo-token'` if `process.env.ADMIN_TOKEN` is unset. In production, env must be set to a strong secret or admin is unprotected.

---

## 4. Security

### 4.1 Admin authentication (critical)

- **Location:** `client/src/pages/AdminPage.tsx` (handleLogin), `server/src/middleware/auth.ts`
- **Issue:** Admin “login” is entirely client-side. The password `wedding2027` is hardcoded in the client bundle; anyone can open DevTools or view source, see the check `password === 'wedding2027'`, and then set `localStorage.setItem('adminToken', 'demo-token')` to gain admin access without ever sending the password to the server.
- **Server:** The server only checks that the request carries `Authorization: Bearer <token>` and that the token equals `process.env.ADMIN_TOKEN ?? 'demo-token'`. It does not verify a password. So if `ADMIN_TOKEN` is unset in production, anyone who knows the client flow (or reads the README, which documents the default password) can use `demo-token` to access all admin endpoints.
- **Recommendation:** Move authentication to the server: add `POST /api/admin/login` that accepts password (or username/password), checks against a hash or env secret, and returns a short-lived token (e.g. JWT). Remove the hardcoded password and client-side token assignment. Ensure `ADMIN_TOKEN` is set to a strong random value in production and is not the same as the value used after “password” check in the client.

### 4.2 Rate limiting

- **Guestbook:** `POST /api/guestbook` is rate-limited (10 requests per 15 minutes per IP). OK.
- **RSVP:** `GET /api/rsvp/lookup` and `POST /api/rsvp` have **no rate limiting**. An attacker can enumerate names (lookup) or spam RSVP submissions. Recommend adding a moderate rate limit (e.g. 30 lookups and 10 submits per 15 min per IP) to reduce abuse and scraping.
- **Admin:** Admin routes are protected by auth but have no rate limit. Brute force is not applicable (no server-side password check), but token abuse could be throttled (e.g. 200 req/min per IP for `/api/admin/*`).

### 4.3 Guestbook file keys

- **Location:** `server/src/controllers/guestbookController.ts` – createEntry
- **Behavior:** Client uploads to UploadThing, receives `photoKey` / `audioClipKey`, then sends them in the guestbook create payload. Server stores whatever keys are sent.
- **Issue:** Server does not verify that the keys were just issued to this request/session. A user could pass another user’s UploadThing key and associate that file with their entry (abuse/confusion), or pass arbitrary keys. Low severity for a wedding site but worth noting; consider server-side callback from UploadThing or short-lived tokens if you need strict binding.

### 4.4 Sensitive data in client

- **Venmo URL:** `client/src/lib/constants.ts` exports `HONEYMOON_FUND_VENMO_URL` (Venmo profile). Public by design; no change needed.
- **PostHog:** Uses `persistence: 'localStorage+cookie'`; only project key and host are in env (VITE_*). Acceptable.
- **No `dangerouslySetInnerHTML`** or other raw HTML injection in the audited code; user content is not rendered as HTML.

---

## 5. Frontend & UX

### 5.1 Error boundary

- **Location:** `client/src/main.tsx` wraps the app in `<ErrorBoundary>`; `ErrorBoundary` reports to Sentry and shows a “Something went wrong” message with Refresh / Go Home. Good.

### 5.2 Unhandled async errors (Express)

- **Location:** All async route handlers (rsvp, admin, guestbook) use try/catch and call `res.status(500).json(...)` (or 400/404) on failure; they do **not** call `next(err)`.
- **Implication:** The global `errorHandler` and `wideEventErrorMiddleware` only run when something calls `next(err)`. If a controller ever throws or rejects without catching, the request can hang (Express 4 does not automatically catch async rejections). Risk is low while every handler has try/catch; consider wrapping async handlers in a `asyncHandler(fn)` that forwards rejections to `next(err)` for consistency and future safety.

### 5.3 Admin error feedback

- **Location:** `client/src/pages/AdminPage.tsx`
- **Behavior:** Many handlers use `alert(...)` for errors and `console.error`. Works but is brittle (e.g. `(error as { response?: { data?: { error?: string } } })?.response?.data?.error`). Consider a small toast or inline error state for better UX and consistent error shape.

### 5.4 Navigation / routes

- **The Cast** is commented out in `Navigation.tsx` but the route `/the-cast` still exists in `App.tsx`; direct URL works. Intentional or clean up.
- **Footer** uses `<a href="/registry">` and `<a href="/guestbook">` (full reload). Could use `<Link>` for SPA navigation; minor.

### 5.5 RSVP copy (fixed)

- Confirmation email message was updated to: “If you provided an email, we'll send a confirmation to {email} shortly.” So the UI no longer promises delivery when email is fire-and-forget.

---

## 6. API & Server

### 6.1 CORS

- **Location:** `server/src/index.ts` – `getAllowedOrigins()` builds origins from `CLIENT_URL` (plus www and scheme variants). Credentials allowed. Good for a known client.

### 6.2 Body size

- **Limit:** `express.json({ limit: '512kb' })`. Sufficient for RSVP, admin import, and guestbook; large imports (e.g. 500 guests) stay under this.

### 6.3 Health check

- **Route:** `GET /api/health` returns `{ status: 'ok', message: '...' }`. Does not check MongoDB or external services; suitable for a simple liveness check.

### 6.4 MongoDB connection at startup

- **Location:** `server/src/index.ts` – startServer()
- **Behavior:** If `initDb()` throws, the server still calls `app.listen()` and logs “starting server anyway”. All RSVP/admin/guestbook routes use MongoDB; they will return 500 until the DB is available. Consider failing fast in production (exit if DB connect fails) or adding a readiness probe that checks MongoDB.

---

## 7. Process & Shutdown

### 7.1 Duplicate signal handlers

- **Location:** `server/src/db.ts` registers `SIGINT` and `SIGTERM` and closes Mongoose then `process.exit`. `server/src/index.ts` also registers `SIGINT` and `SIGTERM` and runs `gracefulShutdown()` (PostHog flush, then `process.exit(0)`).
- **Issue:** Both run on the same signal. Order depends on registration; you may get Mongoose close + exit from db and then index, or vice versa. Can lead to double-close or one handler not running. Prefer a single shutdown path: e.g. index.ts handles signals, calls a shared `shutdown()` that closes DB and PostHog, then exits.

---

## 8. Dependencies & Config

### 8.1 ESLint (server)

- **Issue:** Server lint fails when run on `server/scripts/sync-guest-indexes.ts` because a rule that requires type information (`@typescript-eslint/await-thenable`) is used without a type-aware parser config for that script. Fix by excluding `scripts/` from typed lint or adding appropriate `parserOptions` / project references for scripts.

### 8.2 Env documentation

- **Server:** `.env.example` documents `ADMIN_TOKEN`, Gmail, MongoDB, etc. `loadEnv` comment mentions `RESEND_API_KEY` but the app uses Gmail only; consider removing or clarifying the comment.
- **Client:** `.env.example` documents VITE_* for Sentry, PostHog, etc. No secrets should be required in client env for auth (once login is server-side).

---

## 9. Summary Table

| Area                         | Status    | Notes                                                                 |
|------------------------------|-----------|-----------------------------------------------------------------------|
| Confirmation email UX        | **Fixed** | Copy updated to not promise delivery.                                 |
| Reminder emails              | OK        | Errors returned and shown in admin.                                   |
| Env / loadEnv                | OK        | loadEnv runs first via instrument.                                   |
| RSVP submit logic            | OK        | Validation, email uniqueness, mailing address rules correct.         |
| Admin guest/group CRUD       | OK        | Schemas and controller checks consistent.                            |
| Guest import                 | OK        | Validation and per-row errors.                                       |
| Guestbook create/list        | OK        | Validated and rate-limited.                                           |
| Guestbook file keys          | **Note**  | Server does not verify UploadThing keys; minor abuse possible.       |
| RSVP deadline                | Note      | Timezone-dependent; document or set env in desired TZ.                |
| ADMIN_TOKEN default          | **Risk**  | Set strong token in production.                                      |
| Admin auth (client-side)     | **Critical** | Password in client bundle; anyone can set token. Move login to server. |
| RSVP rate limiting           | **Gap**   | Lookup and submit have no rate limit; add moderate limits.           |
| Admin rate limiting          | **Optional** | Throttle admin routes to limit token abuse.                          |
| Async errors → next(err)     | **Optional** | Use asyncHandler or next(err) so global error handler always runs.   |
| MongoDB fail at startup      | **Note**  | Server starts anyway; consider fail-fast in production.               |
| Duplicate SIGINT/SIGTERM    | **Fix**   | Single shutdown path (index closes DB + PostHog, then exit).          |
| ESLint server scripts        | **Fix**   | Exclude scripts from typed rules or add parser config.                |
| Error boundary               | OK        | Wraps app; Sentry + fallback UI.                                     |
| CORS / body size / health    | OK        | Configured appropriately.                                            |

---

## 10. Recommended Fixes (Priority)

**Critical**

1. **Admin authentication:** Move login to the server. Add `POST /api/admin/login` that validates password (or env secret) and returns a short-lived token (e.g. JWT). Remove hardcoded password from the client. Set `ADMIN_TOKEN` to a strong random value in production (and do not use it as the “password” checked in the client).

**High**

2. **ADMIN_TOKEN / Gmail (ops):** Ensure `ADMIN_TOKEN`, `GMAIL_USER`, and `GMAIL_APP_PASSWORD` are set in production; set `CONFIRMATION_EMAIL_ENABLED` if confirmation emails are desired.
3. **RSVP rate limiting:** Add rate limits for `GET /api/rsvp/lookup` and `POST /api/rsvp` (e.g. 30 lookups and 10 submits per 15 min per IP) to reduce enumeration and spam.
4. **Shutdown:** Consolidate SIGINT/SIGTERM handling in one place (e.g. index.ts); that path should close MongoDB and PostHog, then exit.

**Medium**

5. **Async error handling:** Wrap async route handlers so rejections are passed to `next(err)` (e.g. `asyncHandler`), ensuring the global error handler and Sentry always see uncaught route errors.
6. **MongoDB at startup:** In production, consider failing fast if MongoDB connection fails instead of starting the server anyway.
7. **Admin error UX:** Replace or supplement `alert()` for admin errors with a toast or inline error state and consistent error parsing.

**Low**

8. **ESLint server scripts:** Exclude `server/scripts/` from type-aware ESLint rules or add appropriate config so lint passes.
9. **RSVP_BY_DATE:** Document timezone behavior in README or config.
10. **loadEnv comment:** Remove or update the `RESEND_API_KEY` reference in loadEnv comment (app uses Gmail only).
11. **Footer / Nav:** Use `<Link>` in Footer for SPA navigation; uncomment or remove “The Cast” in nav to match routing.
