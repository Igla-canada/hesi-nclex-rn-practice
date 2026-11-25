# Compiled question bank snapshot

**Generated:** 2026-11-25  
**Active items:** 181  
**Status:** Source verified (AI author pass) — **0** clinically reviewed / published

Import:

```bash
# with DATABASE_URL set
npx tsx scripts/import-question-bank.ts
```

Maps to Prisma `SOURCE_VERIFIED`, `isExample=false`. Does not create published exams.
Json `answerKey` fields use `Prisma.InputJsonValue` casts in the import script.
