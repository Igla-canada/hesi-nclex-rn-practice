/**
 * Apply prisma/migrations through the transaction pooler.
 * Prisma Migrate itself needs a session connection. This path is used only
 * when that session connection cannot be opened. Prepared statements stay off.
 * The script records the same _prisma_migrations checksum Prisma uses (sha256
 * of the migration file) so a later migrate deploy sees the migration as applied.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { prismaClientDatabaseUrl, redactSecrets } from "../src/lib/database-url";
import { splitSqlStatements } from "../src/lib/sql-statements";

const MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    finished_at TIMESTAMPTZ,
    migration_name VARCHAR(255) NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_steps_count INTEGER NOT NULL DEFAULT 0
)
`;

function isAlreadyApplied(error: unknown): boolean {
  const message = error instanceof Error ? error.message : "";
  if (/prepared statement/i.test(message)) return false;
  return /already exists|42710|42P07|duplicate_object|duplicate_table/i.test(message);
}

function checksumOf(file: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function migrationDirs(root: string): string[] {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url: prismaClientDatabaseUrl(rawUrl) } },
    log: [],
  });

  try {
    await prisma.$executeRawUnsafe(MIGRATIONS_TABLE);
    const applied = await prisma.$queryRawUnsafe<
      { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null }[]
    >(
      `SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations"`,
    );
    const finished = new Set(
      applied
        .filter((row) => row.finished_at && !row.rolled_back_at)
        .map((row) => row.migration_name),
    );

    const root = path.resolve("prisma/migrations");
    for (const name of migrationDirs(root)) {
      if (!/^[A-Za-z0-9_]+$/.test(name)) {
        throw new Error("Unexpected migration directory name");
      }
      if (finished.has(name)) {
        console.log(`Migration ${name} is already applied.`);
        continue;
      }
      const file = path.join(root, name, "migration.sql");
      const statements = splitSqlStatements(fs.readFileSync(file, "utf8"));
      const checksum = checksumOf(file);
      if (!/^[a-f0-9]{64}$/.test(checksum)) {
        throw new Error("Migration checksum was not valid");
      }
      console.log(`Applying migration ${name} (${statements.length} statements).`);
      const id = crypto.randomUUID();
      const recordSql = `INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, started_at, applied_steps_count) VALUES ('${id}', '${checksum}', NOW(), '${name}', NOW(), ${statements.length})`;
      const clearUnfinishedSql = `DELETE FROM "_prisma_migrations" WHERE migration_name = '${name}' AND finished_at IS NULL AND rolled_back_at IS NULL`;
      try {
        await prisma.$transaction(
          async (tx) => {
            for (const statement of statements) {
              await tx.$executeRawUnsafe(statement);
            }
            await tx.$executeRawUnsafe(clearUnfinishedSql);
            await tx.$executeRawUnsafe(recordSql);
          },
          { maxWait: 30_000, timeout: 180_000 },
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (!/transaction|timeout|P2028|prepared statement|already exists/i.test(message)) {
          throw error;
        }
        console.log(
          "Interactive migration transaction was not available. Applying statements one at a time.",
        );
        for (const statement of statements) {
          try {
            await prisma.$executeRawUnsafe(statement);
          } catch (statementError) {
            if (!isAlreadyApplied(statementError)) throw statementError;
          }
        }
        await prisma.$executeRawUnsafe(clearUnfinishedSql);
        await prisma.$executeRawUnsafe(recordSql);
      }
      console.log(`Recorded migration ${name}.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : "migrate failed";
  console.error(redactSecrets(message));
  process.exit(1);
});
