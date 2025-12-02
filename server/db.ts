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

// Configure connection pool - ultra-minimal for Replit deployment constraints
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2, // Minimal pool size - 2 connections max to prevent "too many connections" during deployment
  idleTimeoutMillis: 5000, // Close idle connections quickly
  connectionTimeoutMillis: 15000, // Longer timeout for deployment phases
  statement_timeout: 45000, // Longer query timeout for schema introspection
  application_name: 'learnconnect-app', // Identify connection for debugging
});

// Ensure pool closes gracefully
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle({ client: pool, schema });
