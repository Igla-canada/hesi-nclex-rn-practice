/**
 * Production build.
 * When DATABASE_URL is set, run `npx prisma migrate deploy` and then the
 * question-bank import before `next build`. When it is unset, skip both so
 * local builds still succeed.
 *
 * Supabase's saved URL is the transaction pooler (port 6543). Migrate needs
 * a session, so the migrate command receives the same URL with port 5432.
 * That value stays in this process's environment and is never printed.
 */
import { spawn } from "node:child_process";
import { redactSecrets, sessionDatabaseUrl } from "../src/lib/database-url";

function run(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  timeoutMs?: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const forward = (stream: NodeJS.WriteStream, buffer: string, chunk: Buffer) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      const rest = lines.pop() ?? "";
      for (const line of lines) stream.write(`${redactSecrets(line)}\n`);
      return rest;
    };
    child.stdout?.on("data", (chunk: Buffer) => {
      stdout = forward(process.stdout, stdout, chunk);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr = forward(process.stderr, stderr, chunk);
    });

    let settled = false;
    let timedOut = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
      if (stdout) process.stdout.write(redactSecrets(stdout));
      if (stderr) process.stderr.write(redactSecrets(stderr));
      fn();
    };
    const timer = timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill("SIGTERM");
        }, timeoutMs)
      : undefined;
    const killTimer =
      timeoutMs
        ? setTimeout(() => {
            if (!settled) child.kill("SIGKILL");
          }, timeoutMs + 5_000)
        : undefined;

    child.on("error", (error) => {
      finish(() => reject(error));
    });
    child.on("close", (code) => {
      finish(() => {
        if (timedOut) reject(new Error(`${command} ${args.join(" ")} timed out`));
        else if (code === 0) resolve();
        else reject(new Error(`${command} ${args.join(" ")} exited ${code ?? "unknown"}`));
      });
    });
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  await run("npx", ["prisma", "generate"], process.env);

  if (!databaseUrl) {
    console.log(
      "DATABASE_URL is not set. Skipping prisma migrate deploy and the question-bank import.",
    );
  } else {
    const sessionUrl = sessionDatabaseUrl(databaseUrl);
    const migrateEnv = { ...process.env, DATABASE_URL: sessionUrl };
    const usedSessionPort = sessionUrl !== databaseUrl;
    console.log(
      usedSessionPort
        ? "DATABASE_URL is set. Running npx prisma migrate deploy using session mode on port 5432 derived from the transaction pooler."
        : "DATABASE_URL is set. Running npx prisma migrate deploy.",
    );
    let importUrl = databaseUrl;
    try {
      await run("npx", ["prisma", "migrate", "deploy"], migrateEnv, 180_000);
      console.log("prisma migrate deploy finished.");
      importUrl = sessionUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "migrate failed";
      console.log(redactSecrets(message));
      console.log(
        usedSessionPort
          ? "prisma migrate deploy did not succeed on the session-mode connection. Applying migration SQL through the transaction pooler without prepared statements."
          : "prisma migrate deploy did not succeed. Applying migration SQL with Prisma Client.",
      );
      await run("npx", ["tsx", "scripts/apply-prisma-migrations.ts"], {
        ...process.env,
        DATABASE_URL: databaseUrl,
      });
    }

    console.log("Importing the question bank.");
    try {
      await run("npx", ["tsx", "scripts/import-question-bank.ts"], {
        ...process.env,
        DATABASE_URL: importUrl,
      });
    } catch (error) {
      if (importUrl === databaseUrl) throw error;
      const message = error instanceof Error ? error.message : "import failed";
      console.log(redactSecrets(message));
      console.log(
        "Question-bank import on the session connection did not succeed. Retrying through the transaction pooler.",
      );
      await run("npx", ["tsx", "scripts/import-question-bank.ts"], {
        ...process.env,
        DATABASE_URL: databaseUrl,
      });
    }
  }

  await run("npx", ["next", "build"], process.env);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "build failed";
  console.error(redactSecrets(message));
  process.exit(1);
});
