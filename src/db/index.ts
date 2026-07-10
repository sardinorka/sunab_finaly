import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __sunabPool?: Pool;
  __sunabDb?: NodePgDatabase<typeof schema>;
};

function getPool(): Pool {
  if (globalForDb.__sunabPool) return globalForDb.__sunabPool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Set it in your environment variables before running the app."
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__sunabPool = pool;
  }
  return pool;
}

function getDb(): NodePgDatabase<typeof schema> {
  if (globalForDb.__sunabDb) return globalForDb.__sunabDb;
  const db = drizzle(getPool(), { schema });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__sunabDb = db;
  }
  return db;
}

// Lazy proxy: db.* will trigger initialization only on first real access,
// so importing this module at build time (when DATABASE_URL is not yet set)
// will NOT throw. The error surfaces only when a request actually queries
// the database without a configured DATABASE_URL.
export const db: NodePgDatabase<typeof schema> = new Proxy(
  {} as NodePgDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      const real = getDb();
      const value = Reflect.get(real, prop, receiver);
      return typeof value === "function" ? value.bind(real) : value;
    },
  }
);

export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const real = getPool();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
