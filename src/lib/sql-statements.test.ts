import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { splitSqlStatements } from "./sql-statements";

describe("splitSqlStatements", () => {
  it("keeps quoted semicolons together and splits the init migration", () => {
    expect(splitSqlStatements("SELECT 'a;b'; SELECT 1")).toEqual([
      "SELECT 'a;b'",
      "SELECT 1",
    ]);
    const file = path.join(
      process.cwd(),
      "prisma/migrations/20261125102658_init/migration.sql",
    );
    const statements = splitSqlStatements(fs.readFileSync(file, "utf8"));
    expect(statements.length).toBeGreaterThan(40);
    expect(statements[0]).toContain('CREATE TYPE "Role"');
    expect(statements.every((statement) => !statement.endsWith(";"))).toBe(true);
    expect(statements.some((statement) => statement.includes("CREATE TABLE \"Question\""))).toBe(
      true,
    );
  });
});
