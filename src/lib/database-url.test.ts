import { describe, expect, it } from "vitest";
import {
  isTransactionPoolerUrl,
  pooledDatabaseUrl,
  prismaClientDatabaseUrl,
  redactSecrets,
  sessionDatabaseUrl,
} from "./database-url";

const userinfo = "postgres.example:fixt%2Fure";
const host = "aws-0-region.pooler.supabase.com";
const transactionUrl = `postgresql://${userinfo}@${host}:6543/postgres?sslmode=require`;

describe("database url modes", () => {
  it("derives session mode from the transaction pooler without changing credentials", () => {
    const session = sessionDatabaseUrl(transactionUrl);
    expect(session.startsWith(`postgresql://${userinfo}@${host}:5432/`)).toBe(true);
    expect(session).toContain("sslmode=require");
    expect(session).not.toContain("pgbouncer");
    expect(session).not.toContain("connection_limit");
    expect(isTransactionPoolerUrl(session)).toBe(false);
  });

  it("strips Prisma pooler flags and keeps the password encoding", () => {
    const raw = `postgresql://${userinfo}@${host}:6543/postgres?pgbouncer=true&connection_limit=4`;
    const session = sessionDatabaseUrl(raw);
    expect(session).toBe(
      `postgresql://${userinfo}@${host}:5432/postgres?sslmode=require`,
    );
  });

  it("disables prepared statements only on the transaction pooler", () => {
    const pooled = pooledDatabaseUrl(transactionUrl);
    expect(pooled).toContain(":6543/");
    expect(pooled).toContain("pgbouncer=true");
    expect(pooled).toContain("connection_limit=1");
    expect(pooled).toContain(userinfo);
    expect(pooledDatabaseUrl(sessionDatabaseUrl(transactionUrl))).toBe(
      sessionDatabaseUrl(transactionUrl),
    );
  });

  it("leaves a local database URL unchanged except for a client connection limit", () => {
    const local = "postgresql://local:fixture@127.0.0.1:5432/hesi";
    expect(sessionDatabaseUrl(local)).toBe(local);
    expect(pooledDatabaseUrl(local)).toBe(local);
    expect(prismaClientDatabaseUrl(local)).toBe(`${local}?connection_limit=1`);
    expect(prismaClientDatabaseUrl(transactionUrl)).toContain("pgbouncer=true");
  });

  it("redacts connection strings before they can be logged", () => {
    const revealed = redactSecrets(
      `connect failed ${transactionUrl} via ${host}:6543`,
    );
    expect(revealed).not.toContain(userinfo);
    expect(revealed).not.toContain(host);
    expect(revealed).toContain("postgresql://[redacted]");
    expect(revealed).toContain("[pooler-host]");
  });
});
