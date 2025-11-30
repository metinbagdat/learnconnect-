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
  max: 2, // Reduced to 2 connections to allow deployment diff checks
  idleTimeoutMillis: 3000, // Close idle connections after 3 seconds
  connectionTimeoutMillis: 3000, // Connection timeout 3 seconds
  statement_timeout: 30000, // Query timeout 30 seconds
});

// Ensure pool closes gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
