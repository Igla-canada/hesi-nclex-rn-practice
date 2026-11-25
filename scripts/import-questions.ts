/**
 * Bulk import hook for JSON/CSV question banks.
 * Usage (after DATABASE_URL is set):
 *   npx tsx scripts/import-questions.ts path/to/items.json
 *
 * Expected JSON: array of { stem, questionType, scoringModel, clientNeeds,
 *   options: [{label,text}], correctOptionLabels: string[], rationale?, sourceUrl? }
 *
 * Imported items default to DRAFT / isExample=false and never auto-publish.
 */
import fs from "fs";
import path from "path";

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/import-questions.ts <file.json|file.csv>");
    process.exit(1);
  }
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  // Dynamic import so script can be committed before client generate
  const { PrismaClient, VerificationStatus } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const raw = fs.readFileSync(abs, "utf8");

  let rows: unknown[] = [];
  if (abs.endsWith(".json")) {
    rows = JSON.parse(raw);
  } else if (abs.endsWith(".csv")) {
    console.error("CSV parser hook: convert to JSON first or extend this script.");
    process.exit(1);
  } else {
    console.error("Unsupported extension");
    process.exit(1);
  }

  if (!Array.isArray(rows)) {
    console.error("JSON root must be an array");
    process.exit(1);
  }

  let created = 0;
  for (const row of rows as Array<Record<string, unknown>>) {
    const stem = String(row.stem ?? "");
    if (!stem) continue;
    // Duplicate detection hook (content hash)
    const crypto = await import("crypto");
    const contentHash = crypto
      .createHash("sha256")
      .update(stem.trim().toLowerCase())
      .digest("hex");
    const dup = await prisma.question.findFirst({ where: { contentHash } });
    if (dup) {
      console.warn("Skipping duplicate stem hash:", contentHash.slice(0, 12));
      continue;
    }
    await prisma.question.create({
      data: {
        stem,
        contentHash,
        verificationStatus: VerificationStatus.DRAFT,
        isExample: false,
      },
    });
    created += 1;
  }

  console.log(`Imported ${created} draft questions (not published).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
