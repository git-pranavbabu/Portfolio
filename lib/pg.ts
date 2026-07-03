import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (globalThis.__pgPool) return globalThis.__pgPool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({
    connectionString,
    max: 4,
    idleTimeoutMillis: 30_000,
  });
  globalThis.__pgPool = pool;
  return pool;
}
