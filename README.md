# Feedants Competition Details: Full-Stack Module

A working version of the Feedants **Competition Details** screen. It's a React Native (Expo + TypeScript) app backed by a Node.js + Express + TypeScript API and MongoDB.

Everything on the screen comes from the API: the competition, judge, dates, rewards, winners, spots left, the countdown and your registration state. The actions on the screen work too: registering and paying, uploading and viewing a submission, copying and sharing a referral link, playing videos, switching between English and Hindi, and reading reviews.

---

## Quick Start

### Prerequisites

- **Node.js** 18 or later
- **MongoDB** on `localhost:27017`, or set `MONGODB_URI`
- **Expo Go** (SDK 52) on a phone, or an Android emulator or iOS simulator

### 1. Backend

**Demo mode** (recommended for a quick look — no database setup, nothing saved):

```bash
cd server
npm install
npm run demo                # http://localhost:3001
```

This starts a throwaway in-memory MongoDB, seeds it and exposes `POST /api/demo/reset`.
The app calls that on every launch, so each fresh open starts from the seeded state:
registration open, 19 spots left, no registration or submission. Closing the server
discards everything.

**Persistent mode** (a real MongoDB, data survives restarts — needed for the `state:*` scripts):

```bash
cd server
npm install
cp ../.env.example .env     # optional; the defaults work for local MongoDB
npm run seed                # competition, demo user and reviews
npm run dev                 # http://localhost:3001
```

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start --lan
```

Scan the QR code with Expo Go, or enter `exp://<your-computer-ip>:8081` in Expo Go. The phone and the computer must be on the **same Wi-Fi network**.

**How the app finds the API:**

1. `EXPO_PUBLIC_API_URL`, if you set it (for example a tunnel or a deployed server).
2. The machine running Metro, on port 3001. When the app runs in Expo Go, this is found automatically, so you don't need to edit any IP address.
3. `10.0.2.2:3001` (Android emulator), then `localhost:3001` (iOS simulator).

If the phone can't connect, allow Node.js through the Windows or macOS firewall on private networks.

### 3. Tests

```bash
cd server
npm test
```

There are 23 tests in 3 suites: registration, concurrency and submission (which also covers the reviews endpoint). They run against an in-memory MongoDB (`mongodb-memory-server`), so you don't need a database for them.

### 4. Trying every state

These need **persistent mode** (`npm run dev`); in demo mode the data lives in the
server process, so use a fresh launch to reset instead.

```bash
cd server
npm run state:open        # registration open, 19 spots left
npm run state:full        # every spot taken
npm run state:closed      # deadline passed
npm run state:registered  # user paid, can upload
npm run state:submitted   # user uploaded a submission
```

Pull down on the screen to refresh. The app also refreshes every 30 seconds.

### 5. Test payments

Checkout is a simulated Razorpay flow with no real gateway. These inputs follow Razorpay's test-mode conventions:

| Method | Succeeds | Fails |
|---|---|---|
| UPI | any valid ID, e.g. `success@razorpay` | `failure@razorpay` |
| Card | `4111 1111 1111 1111`, any future expiry, any 3-digit CVV | `4000 0000 0000 0002` |
| Netbanking / Wallet | always | — |

In development builds (`__DEV__`), the form is pre-filled with the success values and the failure values are active. In release builds, nothing is pre-filled and the gateway decides the outcome. The cardholder name comes from the user's profile.

---

## Environment Variables

**Server (`server/.env`)**

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/feedants` | MongoDB connection string |
| `PORT` | `3001` | API port |
| `JWT_SECRET` | `dev-secret` | Reserved for real auth. The demo uses a stub header (see below). |
| `NODE_ENV` | — | Set to `production` to turn off the demo-user fallback. Requests must then send a user. |
| `DEMO_MODE` | `false` | Set by `npm run demo`. Uses an in-memory database (unless `MONGODB_URI` is set) and enables `POST /api/demo/reset`. |
| `DEMO_USER_ID` | `000000000000000000000001` | The seeded demo user, and the fallback user outside production |
| `MAX_UPLOAD_MB` | `200` | Hard limit for any upload. Each competition can set a lower one (`submissionRules.maxSizeMb`). |

The server, the seed script and the `state:*` scripts all read these from one place, `server/src/config.ts`.

**Mobile (optional)**

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Overrides API discovery, e.g. `https://my-tunnel.trycloudflare.com/api` |
| `EXPO_PUBLIC_API_PORT` | API port used for automatic discovery (default `3001`) |
| `EXPO_PUBLIC_COMPETITION_SLUG` | Competition shown on launch (default `feedants-classical-dance`) |
| `EXPO_PUBLIC_DEMO_USER_ID` | User sent in the stub auth header |
| `EXPO_PUBLIC_RESET_ON_LAUNCH` | `false` keeps demo data between launches (default: reset on every launch) |

The app reads these in `mobile/src/config.ts`. Components never contain hardcoded URLs, IDs or slugs.

---

## What's Implemented

This table maps the assignment's requirements to where each is handled.

| Assignment requirement | How it is handled |
|---|---|
| Dynamic data, nothing hardcoded | `GET /api/competitions/:slug` returns every value on the screen: title, tags, prize pool, fee, capacity, judge, dates, about, judging criteria, rules, rewards, winners, disclaimer and referral settings. It's seeded from `design/seed-competition.json`. |
| Competition info and availability | Spots left are computed on the server as `capacity − bookedCount`, together with a booked progress bar. The app refreshes every 30 seconds, on pull-to-refresh and when it regains focus. |
| User registration state | The server works out the user's state: `open`, `pending`, `registered`, `submitted`, `full` or `closed`. The sticky CTA's title, subtitle, colour and action all change with that state. |
| Dates and lifecycle | Registration deadline, submission window and result date. The server rejects registration after the deadline and uploads outside the submission window. |
| Time-dependent information | A live countdown uses the server's clock (`serverTime` offset), so a wrong phone clock doesn't matter. When it reaches zero, the app refetches and the screen switches to "closed". |
| Actions follow the state | Register and pay, then upload a video, then view the submission. A pending payment can be completed later. Full and closed states disable the CTA. |
| Consistency with many users | Spots are reserved with an atomic conditional `$inc`, so two users can't both take the last spot (there's a concurrency test for this). Idempotency keys make a double-tapped Pay safe. Unique indexes allow one registration and one submission per user. |
| Validations and edge cases | Checks for full, closed, already registered, outside the submission window, not registered, a failed payment (which releases the spot), a retry after failure, confirming someone else's registration, file type on upload, and payment form fields (UPI ID, card number, expiry, CVV). |
| Scale | Rate limiting, indexed queries, stateless API servers (can scale horizontally), and a read-heavy GET endpoint suitable for caching (see "Production improvements"). |
| Design accuracy | Same section order, colours, icons and hierarchy as the reference, sized for real phones. On large phones the design's side-by-side rows come back (see "Responsive layout"). |
| No hardcoded content | Competition, judge, winners, rewards, reviews, videos, upload limits and prices all come from the API. Money goes through one formatter (Indian digit grouping, currency from the API), and colours through theme tokens. |
| Language toggle | The ENG / हिंदी toggle switches every label, sheet and message (`mobile/src/i18n`), and refetches the content (title, judge, About, Judging Parameters, Rules, rewards, winners, reviews) in Hindi from the API. |

---

## Architecture

```
├── server/                     Node + Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── models/             Competition, User, Registration, Submission, Testimonial, Referral
│   │   ├── routes/             competitions.ts, registrations.ts, testimonials.ts
│   │   ├── middleware/         auth (stub), idempotency, rate limiting, error handler
│   │   ├── scripts/            state:* demo scripts
│   │   ├── demo.ts             in-memory demo entry point (npm run demo)
│   │   ├── seed.ts             seeds from design/seed-competition.json
│   │   ├── config.ts           env-based config shared by server, seed and scripts
│   │   ├── app.ts / index.ts
│   └── __tests__/              Jest + Supertest + mongodb-memory-server
│
├── mobile/                     React Native (Expo SDK 52 + TypeScript)
│   ├── App.tsx                 fonts, React Query, safe area, locale providers
│   └── src/
│       ├── api/                typed client, React Query hooks, types
│       ├── components/         one component per section, plus shared pieces
│       │                       (LoadingImage, RazorpayLogo, BottomSheet, VideoModal)
│       ├── screens/            CompetitionDetailScreen + sheets (Payment, Upload,
│       │                       Submission, Reviews)
│       ├── i18n/               en.ts, hi.ts, LocaleContext
│       ├── utils/format.ts     money, date, time and file-size formatting
│       ├── config.ts           EXPO_PUBLIC_* runtime config
│       └── theme.ts            colour, spacing, radius, icon and type tokens, plus useLayout()
│
├── assets/thumbs/              optimised images the API links to (served at /assets, cached 7 days)
├── design/seed-competition.json  seed data, including Hindi translations
└── MOBILE_SIZING.md            sizing spec for real devices
```

### API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/competitions/:slug?lang=hi` | Competition in the requested language (or `Accept-Language`), the user's `me` block (status, registration id, referral URL, avatar), `spotsLeft`, `serverTime` |
| `POST` | `/api/competitions/:id/registrations` | Reserves a spot atomically. Requires an `Idempotency-Key` header. Returns `201` with a `pending_payment` registration, or `409` with `FULL`, `CLOSED` or `ALREADY_REGISTERED`. |
| `POST` | `/api/registrations/:id/confirm-payment` | `{ success, paymentId }`. Success sets the registration to `confirmed`. Failure sets it to `cancelled` and releases the spot. Only the owner can call it. |
| `POST` | `/api/competitions/:id/submissions` | Multipart video upload. Only allowed for a confirmed registration, inside the submission window. |
| `GET` | `/api/competitions/:id/submissions/me` | The user's submission: file name, size, upload time and `playbackPath` |
| `GET` | `/api/competitions/:id/submissions/me/file` | Streams the user's own video (owner only, supports Range for seeking) |
| `GET` | `/api/testimonials?limit=10&lang=hi` | Published reviews for "Hear From Our Users", newest first (cacheable) |
| `POST` | `/api/demo/reset` | Demo mode only: restores the seeded state and clears uploads. The app calls it on launch. |

Error responses use stable codes the app can map to messages: `FULL`, `CLOSED`, `ALREADY_REGISTERED`, `FILE_REQUIRED`, `UNSUPPORTED_FORMAT` (415), `FILE_TOO_LARGE` (413), `OUTSIDE_SUBMISSION_WINDOW`, `NOT_REGISTERED`, `ALREADY_SUBMITTED`, `INVALID_ID` (400) and `UNAUTHORIZED` / `INVALID_USER` (401).

The user is identified by the `X-Demo-User-Id` header (stub auth).

### Data model

- **Competition** holds everything shown on the screen, plus `capacity`, `bookedCount`, `prizeInfoVideoUrl` and `submissionRules { maxSizeMb, acceptedFormats }`. Rewards, winners and dates are embedded, because they're always read together with the competition.
- **Registration** is `{ competitionId, userId, status: pending_payment | confirmed | cancelled, paymentId, idempotencyKey }`. It has a unique index on `(competitionId, userId)` and an index on `idempotencyKey`.
- **Submission** is `{ competitionId, userId, fileUrl, fileName, fileSize, status, submittedAt }`, with a unique index on `(competitionId, userId)`.
- **Testimonial** is `{ name, meta, rating, text, published, createdAt }`, with an index on `(published, createdAt)`.
- **User** is `{ name, avatarUrl, referralCode, language }`.

---

## Assumptions

- **Dates.** The design shows only day, month and '26, so the year is taken as 2026 and the timezone as IST (+05:30). The design's submission start (6 Aug) falls before its registration deadline (10 Aug); that was kept as designed. If the seeded dates are already past, `npm run seed` moves them all forward by the same amount, so registration closes in 1d 06h 28m, as in the design.
- **One demo user.** Auth is out of scope, so a stub `X-Demo-User-Id` header identifies the user. Without the header, the server falls back to the demo user.
- **Demo runs are disposable.** In demo mode the data lives only in the server process and the app resets it on launch, so anyone opening the link sees the same starting state. Persistent mode behaves like a normal deployment.
- **Payment.** A simulated Razorpay checkout stands in for the real gateway. The server stores the returned `paymentId` and treats "confirm" as the payment webhook.
- **Placeholder content.** The design's placeholders (judging criteria, rules, reviews, videos) are filled with realistic sample content, stored in the database and served by the API. The videos are public sample clips.
- **Spots.** A spot is held from registration until payment succeeds. A failed payment releases it immediately.
- **Language.** English and Hindi. Content translations are stored with the data (`translations.hi` on competitions and testimonials). Any field without a translation falls back to English, so a partial translation never shows blanks.

---

## Technical Decisions

### Atomic spot booking
Registration uses a single `findOneAndUpdate` with the filter `{ $expr: { $lt: ['$bookedCount', '$capacity'] }, 'dates.registrationClosesAt': { $gt: now } }` and the update `{ $inc: { bookedCount: 1 } }`. The capacity check and the increment happen in one atomic operation on one document, so when one spot is left, only one of any number of simultaneous requests can succeed. This needs no transactions and no locks. A concurrency test fires parallel requests at the last spot and checks this.

### Idempotency and retries
Every registration request carries an `Idempotency-Key`, and repeating a key returns the original registration. So a double-tap or a network retry never books two spots. After a failed payment, the cancelled registration is reused for the retry, which keeps the unique `(competitionId, userId)` index valid. If saving the registration fails, the reserved spot is released.

### Status computed on the server
The server works out `me.registrationStatus` from its own clock and data, and the app only displays it. This keeps the business rules in one place and stops a wrong phone clock or an outdated app from showing an action that's no longer allowed.

### Countdown using server time
Every response includes `serverTime`. The app stores the difference `serverTime − deviceTime` and counts down with it, so the countdown is correct even when the phone's clock is wrong. When it reaches zero, the app refetches and the screen switches to "closed".

### Data fetching with React Query
Caching, background refetch every 30 seconds, refetch when the app regains focus, and pull-to-refresh. After a mutation, the competition query is invalidated, so spots left and status update straight away.

### Responsive layout
`useLayout()` in `mobile/src/theme.ts` reads the window width on every render, so rotation, split screen and foldables all work:

| Width | Devices | Layout |
|---|---|---|
| < 360pt | small phones | Important Dates falls back to one column |
| 360–409pt | most phones (iPhone 15, Pixel 7a) | Stacked rows from `MOBILE_SIZING.md` §4: spots block full width, prize and trust rows stacked, scrollable tabs, Refer buttons stacked |
| ≥ 410pt | large phones (Pixel 8 Pro, iPhone Plus/Pro Max) | The design's side-by-side rows: Prize Pool, Entry Fee and Spots as three columns; prize video next to the trust rows; three equal tabs; Refer Now next to the earnings caption |
| tablets | — | The content column is capped at 560pt and centred |

The countdown stays on two lines on every phone. Its single-line design needs about 460pt at readable sizes, more than any phone offers.

### Images
The images in `assets/` are 1.5–2 MB each. The API links to optimised copies in `assets/thumbs/`: 256px for avatars and 360px for winner tiles, about 140 KB for all six. Remote images show a spinner until they load. Tapping anywhere on the judge card or a winner tile plays the video, not just the small play button.

### Mobile sizing
Type and tap targets are scaled to the platform minimums, because the design image is a compressed full-page capture. Type, icons and spacing are about 1.6× the reference, every tap target is at least 44pt, cards size to their content, and the screen scrolls between the header and the sticky CTA. Rows that no longer fit side by side wrap or stack, as described in [MOBILE_SIZING.md](MOBILE_SIZING.md) §4. The tokens are in `mobile/src/theme.ts`.

### Component structure
Each section of the design is its own component with typed props (`CompetitionCard`, `JudgeCard`, `CountdownStrip`, `DatesGrid`, `WinnersList`, `InfoTabs`, `RewardsList`, `PrizeTrustCard`, `ReferCard` and others). The screen fetches the data and passes it down. Sheets and modals share a `BottomSheet` component. Remote images use `LoadingImage`, which shows a spinner until the image has loaded.

### Internationalisation
- **Interface text:** every label, sheet, toast and error message comes from `en.ts` / `hi.ts`. A small `fmt()` helper fills in values, for example `Only {n} spots left`.
- **Content:** the API localises it (`server/src/utils/localize.ts`). Each document stores per-language overrides in `translations`, and the API merges them over the English base for `?lang=hi`. The raw `translations` map is never sent to the app.
- **Switching language:** the language is part of the React Query key, so switching refetches in the new language. The current content stays on screen until it arrives.

### Bottom sheets
Sheets close with a tap on the backdrop, the Android back button, or a swipe down on the handle, or on the content when it's scrolled to the top. The sheet follows your finger and the backdrop fades as you drag. Sheets can't be dismissed while a payment or upload is running.

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| Atomic `$inc` instead of transactions | Works on a standalone MongoDB and is fast. Creating the registration is a separate step: if it fails, the spot is released explicitly, but a server crash between the two steps could strand a spot until it's cleaned up. A replica-set transaction would close that gap. |
| Simulated payment | No real Razorpay keys are needed and the flow is easy to demo, but there's no real signature verification. |
| Spots held while payment is pending | Paying is fair to whoever started first, but someone who abandons checkout keeps the spot until they return. In production, pending registrations should expire after a few minutes (for example with a TTL job). |
| Polling every 30s instead of WebSockets | Simple and cache-friendly, but spots left can be up to 30 seconds out of date. The server still enforces the real limit when you register. |
| Uploads to local disk (`multer`) | Nothing to set up, but it doesn't scale across servers. Production would use S3 signed upload URLs. |
| Stub header auth | Keeps the demo simple, but it isn't secure. |
| `expo-document-picker` for video | Works in Expo Go, but some devices don't filter the list to videos only. |

---

## Production Improvements

- **Real auth:** JWT or session tokens instead of `X-Demo-User-Id`. Production mode already rejects requests without a user.
- **Real Razorpay:** create the order on the server, then verify payment with signed webhooks. Webhooks, not the client, would confirm registrations.
- **Pending-payment expiry:** a TTL or cron job that cancels stale `pending_payment` registrations and releases their spots.
- **Transactions** for booking a spot and creating the registration, on a replica set.
- **Caching:** the competition document with ETag or Cache-Control headers, or Redis, with the per-user `me` block fetched separately. That makes the read-heavy endpoint cheap for thousands of users.
- **Redis** for rate limiting and idempotency keys across multiple API servers.
- **Real-time spots** over WebSockets or SSE when capacity changes.
- **Uploads straight to S3/GCS** with signed URLs, plus server-side video checks (length, format, size) and transcoding.
- **Observability:** structured logs, Sentry or Crashlytics, and an error boundary in the app.
- **More languages:** add a locale file in the app and a `translations.<lang>` entry in the data. No code changes needed.
- **CI/CD:** tests, type checks and linting on every pull request. EAS builds for the app.

---

## Demo Recording

The assignment asks for a short screen recording. It should show:

1. The open state and the live countdown.
2. Registering and paying: one failed payment (`failure@razorpay`), then a successful one.
3. The registered state, then uploading a video.
4. The submitted state and viewing the submission.
5. The full and closed states, using `npm run state:*`.
6. The Hindi toggle, videos, reviews and Copy Link.
