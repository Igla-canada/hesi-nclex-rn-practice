/** Split a Prisma migration file into single statements. Semicolons inside quotes stay put. */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < sql.length; i += 1) {
    const ch = sql[i]!;
    if (ch === "'" && !inDouble) {
      if (inSingle && sql[i + 1] === "'") {
        current += "''";
        i += 1;
        continue;
      }
      inSingle = !inSingle;
      current += ch;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
      continue;
    }
    if (ch === ";" && !inSingle && !inDouble) {
      push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  push(current);
  return statements;

  function push(value: string) {
    const statement = value.trim();
    if (!statement) return;
    const meaningful = statement.split("\n").some((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith("--");
    });
    if (meaningful) statements.push(statement);
  }
}
