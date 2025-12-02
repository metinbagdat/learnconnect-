import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool - minimal for Replit deployment constraints
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Single connection - Replit health checks need minimal connections
  idleTimeoutMillis: 5000, // Close idle connections quickly
  connectionTimeoutMillis: 10000, // Longer timeout for reliability
  statement_timeout: 30000, // Query timeout 30 seconds
});

// Ensure pool closes gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
