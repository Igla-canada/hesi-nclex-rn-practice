# HESI RN & NCLEX-RN Practice

Greenfield practice examination platform for HESI RN–style fixed mocks and NCLEX-RN–aligned practice (2026 Test Plan Client Needs). **Not affiliated with NCSBN, Elsevier, Pearson, or any nursing board.**

- Original / evidence-cited practice items — clinically verified **published** count is **0**
- Compiled bank snapshot: **18 Source verified** items in `data/question-bank/` (not published)
- Server-side scoring (0/1, +/−, rationale) per public NCSBN models
- No fake HESI/NCLEX pass-probability claims

## Stack

- Next.js (App Router) · React · TypeScript · Tailwind CSS
- PostgreSQL via Prisma (Neon / Supabase-compatible)
- Auth.js (NextAuth v5) ready — configure providers in env
- Vitest for scoring / timer / blueprint unit tests

## Local setup

```bash
git clone https://github.com/Igla-canada/hesi-nclex-rn-practice.git
cd hesi-nclex-rn-practice
cp .env.example .env.local
# set DATABASE_URL (Neon/Supabase Postgres) and AUTH_SECRET
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production |
| `npm test` | Unit tests (scoring, timer, blueprint) |
| `npx prisma migrate dev` | Apply migrations |
| `npx prisma db seed` | Seed sources + ~8 EXAMPLE draft items |
| `npx tsx scripts/import-questions.ts file.json` | Minimal draft import hook |
| `npx tsx scripts/import-question-bank.ts` | Import `data/question-bank/question-bank.json` as `SOURCE_VERIFIED` (never auto-publishes) |

## Exam modes (scaffold)

| Mode | Notes |
| --- | --- |
| NCLEX fixed (85 / 150) | Blueprint quotas from 2026 Client Needs midpoints |
| HESI-style mock (~150) | Fixed-form inspired by **public** Elsevier structure only |
| Study / custom / randomized | Tutor rationales; filters by Client Needs / CJMM |
| CAT-lite (planned) | Adaptive practice — **not** official CAT |

Default practice benchmark: **85%** accuracy (configurable). Points and accuracy are reported separately for NGN partial credit.

## Deploy on Vercel

1. Import **`Igla-canada/hesi-nclex-rn-practice`** in the [Vercel dashboard](https://vercel.com/new).
2. Add environment variables from `.env.example` (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, optional OAuth).
3. Use a hosted Postgres (Neon or Supabase). Run migrations (`npx prisma migrate deploy`) in a build/release command or one-off job.
4. Deploy. Set `AUTH_URL` to the production URL.

Do not commit secrets. `.env*` is gitignored except `.env.example`.

## Honesty & content policy

- Do not invent medical facts in seeds; example stems are labeled **EXAMPLE / AWAITING CLINICAL REVIEW**
- Bank status: see `docs/question-bank-status.md` and `docs/source-verification-report.md` (actual counts)
- Cite sources from the project source registry; prefer link-out over verbatim guidelines
- Never ingest Quizlet/dumps/recalled live exam items
- `published` / clinically approved count must equal reviewed items only

## Question bank data

```
data/question-bank/question-bank.json   # compiled Source-verified items
data/question-bank/stats.json           # counts by Client Needs / status
data/question-bank/question-bank.csv    # flat export for review
```

Import into a configured database with `npx tsx scripts/import-question-bank.ts` (needs `DATABASE_URL`).

## License

Application code: private/public repo terms of the owner. Third-party clinical sources remain under their own licenses — see project `source-registry.md`.
