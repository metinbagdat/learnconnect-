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

// Configure connection pool to prevent "too many connections" errors
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Single connection to avoid exhaustion during deployment health checks
  idleTimeoutMillis: 2000, // Close idle connections after 2 seconds
  connectionTimeoutMillis: 3000, // Connection timeout 3 seconds
  statement_timeout: 20000, // Query timeout 20 seconds
});

// Ensure pool closes gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
