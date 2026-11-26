# Compiled question bank snapshot

**Generated:** 2026-11-25  
**Active items:** 750  
**Status:** Source verified (AI author pass) — **0** clinically reviewed / published

Import:

```bash
# with DATABASE_URL set
npx tsx scripts/import-question-bank.ts
```

Maps to Prisma `SOURCE_VERIFIED`, `isExample=false`. Upserts by question id, so running it again does not duplicate items. Does not create published exams and does not mark items clinically approved.
Json `answerKey` fields use `Prisma.InputJsonValue` casts in the import script.
