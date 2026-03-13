import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use DATABASE_URL or NEXT_PUBLIC_DATABASE_URL, with fallback for build time
const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

let db;
try {
  if (databaseUrl) {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  } else {
    // During build time or when no database URL is available
    console.warn('No database URL provided, using mock database connection');
    db = null;
  }
} catch (error) {
  console.warn('Failed to initialize database connection:', error.message);
  db = null;
}

export { db };


