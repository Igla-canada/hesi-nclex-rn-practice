# HESI RN & NCLEX-RN Practice

Greenfield practice examination platform for HESI RN–style fixed mocks and NCLEX-RN–aligned practice (2026 Test Plan Client Needs). **Not affiliated with NCSBN, Elsevier, Pearson, or any nursing board.**

- Original / example items only — clinically verified **published** count starts at **0**
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
| `npm run build` / `npm start` | Production. When `DATABASE_URL` is set, the build runs `npx prisma migrate deploy` and then the question-bank import before `next build`. |
| `npm test` | Unit tests (scoring, timer, blueprint) |
| `npx prisma migrate dev` | Apply migrations |
| `npx prisma db seed` | Seed sources + ~8 EXAMPLE draft items |
| `npx prisma migrate deploy` | Apply migrations on a hosted database |
| `npx tsx scripts/import-question-bank.ts` | Upsert `data/question-bank/question-bank.json` by question id as `SOURCE_VERIFIED` (not clinically approved) |
| `npx tsx scripts/import-questions.ts file.json` | Bulk draft import hook |

## Exam sessions

Exam selection, the live exam, and custom practice prefer **source-verified** items from Postgres (`isExample = false`, `verificationStatus = SOURCE_VERIFIED`). Starting a session from the exam or practice form writes an `Attempt` and immutable `QuestionVersion` rows when the database has those items. Correct answers stay on the server. Items are never marked clinically approved.

`GET /exam?mode=nclex85` (and the other modes) renders a session without writing an attempt. If `DATABASE_URL` is missing, or the database is empty or unreachable, that page loads `data/question-bank/question-bank.json` and says the Supabase import is still pending. Labeled example placeholders are used only when that file cannot be read.

Anonymous sessions are stored on a non-login practice user (`practice-sessions@invalid.local`) so the existing schema can hold them. A signed-in student owns their own attempts.

## Exam modes (scaffold)

| Mode | Notes |
| --- | --- |
| NCLEX practice length (85–150) | 180 minutes, no backtrack. 15 unscored items. Stops early when scored points are clearly away from an 85% practice threshold. Near the line, continues up to 150. **Not** an NCLEX pass, logit, or 95% confidence rule |
| NCLEX fixed (150) | Blueprint quotas from 2026 Client Needs midpoints |
| HESI-style mock (~150) | Fixed-form inspired by **public** Elsevier structure only |
| Study / custom / randomized | Tutor rationales; filters by Client Needs / CJMM |

Default practice benchmark: **85%** accuracy (configurable). Points and accuracy are reported separately for NGN partial credit.

## Deploy on Vercel

1. Import **`Igla-canada/hesi-nclex-rn-practice`** in the [Vercel dashboard](https://vercel.com/new).
2. Add environment variables from `.env.example` (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, optional OAuth).
3. Use a hosted Postgres (Neon or Supabase). A Supabase transaction pooler URL (port 6543) is enough: the production build derives session mode (port 5432) for `npx prisma migrate deploy`, then imports the question bank. Runtime queries add `pgbouncer=true` and do not use prepared statements. Local `npm run build` without `DATABASE_URL` skips both steps.
4. Deploy. Set `AUTH_URL` to the production URL.

Do not commit secrets. `.env*` is gitignored except `.env.example`.

## Honesty & content policy

- Do not invent medical facts in seeds; example stems are labeled **EXAMPLE / AWAITING CLINICAL REVIEW**
- Cite sources from the project source registry; prefer link-out over verbatim guidelines
- Never ingest Quizlet/dumps/recalled live exam items
- `published` / clinically approved count must equal reviewed items only

## License

Application code: private/public repo terms of the owner. Third-party clinical sources remain under their own licenses — see project `source-registry.md`.
