import "server-only";
import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "@/server/env";
import * as schema from "./schema";

// Created lazily on first use, so `next build` never needs runtime secrets. Small pool for serverless (05 §2).
const g = globalThis as unknown as { pool?: Pool; db?: NodePgDatabase<typeof schema> };

export function getDb(): NodePgDatabase<typeof schema> {
  if (!g.db) {
    g.pool ??= new Pool({ connectionString: env().DATABASE_URL, max: 3 });
    g.db = drizzle(g.pool, { schema });
  }
  return g.db;
}
