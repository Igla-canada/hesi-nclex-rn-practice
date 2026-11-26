/**
 * Supabase keeps one credential for the shared pooler and selects the mode
 * with the port: 6543 is transaction mode, 5432 is session mode.
 * Prisma Migrate needs a session. Prisma Client on 6543 must disable
 * prepared statements. These helpers never log the URL.
 */

const POSTGRES_URL =
  /^(postgres(?:ql)?:\/\/)([^/?#]*@)?(\[[^\]]+\]|[^/:?#]+)(?::(\d+))?([/?#][\s\S]*)?$/i;

const PRISMA_ONLY_PARAMS = [
  "pgbouncer",
  "connection_limit",
  "pool_timeout",
  "statement_cache_size",
  "socket_timeout",
];

function matchPostgresUrl(raw: string): RegExpMatchArray | null {
  return raw.match(POSTGRES_URL);
}

function isSupabaseHost(host: string): boolean {
  return /(?:^|\.)supabase\.(?:com|co)$/i.test(host);
}

function hasParam(url: string, key: string): boolean {
  const withoutHash = url.split("#")[0] ?? url;
  const query = withoutHash.split("?")[1] ?? "";
  return query.split("&").some((part) => part.startsWith(`${key}=`));
}

function addParam(url: string, key: string, value: string): string {
  if (hasParam(url, key)) return url;
  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const joiner = withoutHash.includes("?") ? "&" : "?";
  return `${withoutHash}${joiner}${key}=${value}${hash}`;
}

function stripParam(url: string, key: string): string {
  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const queryIndex = withoutHash.indexOf("?");
  if (queryIndex < 0) return url;
  const path = withoutHash.slice(0, queryIndex);
  const kept = withoutHash
    .slice(queryIndex + 1)
    .split("&")
    .filter((part) => part.length > 0 && !part.startsWith(`${key}=`));
  const next = kept.length > 0 ? `${path}?${kept.join("&")}` : path;
  return next + hash;
}

export function isTransactionPoolerUrl(raw: string): boolean {
  return matchPostgresUrl(raw)?.[4] === "6543";
}

/** Session-mode URL for Prisma Migrate. Same credentials, port 5432, no Prisma pooler flags. */
export function sessionDatabaseUrl(raw: string): string {
  const match = matchPostgresUrl(raw);
  if (!match || match[4] !== "6543") return raw;
  let next = `${match[1]}${match[2] ?? ""}${match[3]}:5432${match[5] ?? ""}`;
  for (const key of PRISMA_ONLY_PARAMS) next = stripParam(next, key);
  if (isSupabaseHost(match[3] ?? "")) next = addParam(next, "sslmode", "require");
  return next;
}

/** Transaction-pooler URL for Prisma Client: pgbouncer=true disables prepared statements. */
export function pooledDatabaseUrl(raw: string): string {
  if (!isTransactionPoolerUrl(raw)) return raw;
  const host = matchPostgresUrl(raw)?.[3] ?? "";
  let next = addParam(raw, "pgbouncer", "true");
  next = addParam(next, "connection_limit", "1");
  if (isSupabaseHost(host)) next = addParam(next, "sslmode", "require");
  return next;
}

/** URL passed into PrismaClient. Pooler flags are added only for port 6543. */
export function prismaClientDatabaseUrl(raw: string): string {
  if (isTransactionPoolerUrl(raw)) return pooledDatabaseUrl(raw);
  return addParam(raw, "connection_limit", "1");
}

export function redactSecrets(text: string): string {
  return text
    .replace(/postgres(?:ql)?:\/\/[^\s'")\]]+/gi, "postgresql://[redacted]")
    .replace(/[a-z0-9.-]*pooler\.supabase\.com(?::\d+)?/gi, "[pooler-host]")
    .replace(/\bdb\.[a-z0-9-]+\.supabase\.co(?::\d+)?/gi, "[db-host]");
}
