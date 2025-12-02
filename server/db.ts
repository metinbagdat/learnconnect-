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
  idleTimeoutMillis: 1000, // Close idle connections after 1 second
  connectionTimeoutMillis: 2000, // Connection timeout 2 seconds
  statement_timeout: 15000, // Query timeout 15 seconds
});

// Ensure pool closes gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
