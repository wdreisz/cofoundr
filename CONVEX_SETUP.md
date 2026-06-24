# Backend setup — Convex + Clerk

The app ships with a complete Convex backend (`convex/`) and Clerk auth wiring. Until you
provision them, the app runs in **standalone mock mode** (in-memory data, no sign-in). Once
both env vars below are set, it automatically switches to the live, real-time backend with
authentication.

This is the one-time login I couldn't do for you (it needs your accounts).

## 1. Provision Convex

```bash
npx convex dev
```

- Opens a browser to log in / create a project.
- Generates `convex/_generated/` (overwriting the committed placeholders — identical shape).
- Prints your deployment URL and starts watching/deploying the functions in `convex/`.
- **Keep it running** in a second terminal while developing.

Copy the printed deployment URL (e.g. `https://acoustic-fox-123.convex.cloud`).

## 2. Set up Clerk

1. Create an application at [clerk.com](https://clerk.com).
2. **API Keys** → copy the **Publishable key** (`pk_test_…`).
3. **JWT Templates** → **New template** → choose **Convex**. Save it (its name/audience must be
   `convex` — this matches `applicationID: "convex"` in `convex/auth.config.ts`).
4. Copy the template's **Issuer** URL (your Clerk Frontend API domain, e.g.
   `https://your-app.clerk.accounts.dev`).

## 3. Tell Convex about Clerk

In the [Convex dashboard](https://dashboard.convex.dev) → your project → **Settings → Environment
Variables**, add:

```
CLERK_JWT_ISSUER_DOMAIN = https://your-app.clerk.accounts.dev
```

## 4. Local env vars

Create `.env.local` (copy from `.env.example`):

```
VITE_CONVEX_URL=https://acoustic-fox-123.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

## 5. Seed the founder pool

With `npx convex dev` running:

```bash
npx convex run seed:run
```

(or run the `seed:run` mutation from the Convex dashboard). Idempotent — safe to re-run.

## 6. Run it

```bash
npm run dev
```

Visit the app → you'll get a Clerk sign-in → onboard → your profile is written to Convex, the
deck ranks the seeded founders live, matches/chat/saved all persist and update in real time.

---

## Deploying to Vercel with the backend

1. Create a Convex **production** deployment: `npx convex deploy` (gives a prod URL + a deploy key).
2. In Vercel → Project → Settings → Environment Variables, add `VITE_CONVEX_URL` (prod),
   `VITE_CLERK_PUBLISHABLE_KEY`, and `CONVEX_DEPLOY_KEY`.
3. Set the Vercel **Build Command** to `npx convex deploy --cmd 'npm run build'` so the backend
   deploys and `_generated` regenerates as part of each build.
4. In Clerk, add your Vercel domain to the allowed origins, and set `CLERK_JWT_ISSUER_DOMAIN`
   on the Convex **production** deployment too.

## What's where

```
convex/
  schema.ts          Tables: profiles, swipes, matches, messages (+ literal-typed enums)
  profiles.ts        me / upsert (onboarding + edits)
  deck.ts            ranked, unseen candidates per mode (cofounder | romance)
  swipes.ts          connect / skip / save  → creates a match when mutual
  saved.ts           shortlist: list / remove / connect
  matches.ts         match list with last-message previews
  messages.ts        chat: list / send / proposeCall / sendSession + scheduled "them" replies
  seed.ts            seedData.ts → populate the demo founder pool
  lib/matching.ts    scoring (mirrors src/lib/matching.ts)
  auth.config.ts     Clerk → Convex

src/
  convex.tsx         Clerk + Convex providers (env-gated)
  useConvexData.ts   maps Convex queries/mutations to the screen prop shapes
  AppConvex.tsx      live, authed container (used when configured)
  App.tsx            mock container (used when not configured)
  components/AppShell.tsx   shared mobile/desktop chrome
```
