import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Lazy initialization - only create pool/db when DATABASE_URL is available
// This allows the server to start even without a database connection
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function initializePool(): Pool {
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

  if (!_pool) {
// Configure connection pool - ultra-minimal for Replit deployment constraints
    _pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2, // Minimal pool size - 2 connections max to prevent "too many connections" during deployment
  idleTimeoutMillis: 5000, // Close idle connections quickly
  connectionTimeoutMillis: 15000, // Longer timeout for deployment phases
  statement_timeout: 45000, // Longer query timeout for schema introspection
  application_name: 'learnconnect-app', // Identify connection for debugging
});

// Ensure pool closes gracefully
    _pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
  }
  
  return _pool;
}

// Export pool with lazy initialization
export const pool = {
  get query() {
    return initializePool().query;
  },
  get connect() {
    return initializePool().connect;
  },
  get end() {
    return initializePool().end;
  },
  on(event: string, handler: (err: any) => void) {
    return initializePool().on(event, handler);
  }
} as Pool;

// Export db with lazy initialization
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) {
      _db = drizzle({ client: initializePool(), schema });
    }
    return (_db as any)[prop];
  }
});
