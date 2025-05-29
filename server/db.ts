/**
 * Shared Database Connection Module
 * 
 * This module provides a single, consistent database connection pool for the entire application.
 * It prevents the re-analysis loop issue by ensuring both the analysis pipeline and cards endpoint
 * use identical database connections, allowing proper access to stored analysis data.
 * 
 * Key benefits:
 * - Single source of truth for database connections
 * - Prevents connection mismatches between analysis storage and retrieval
 * - Enables efficient caching behavior with Redis/Postgres fallback
 */

import { Pool } from 'pg';

// Single shared connection pool used throughout the application
export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false, // required for hosted databases
  },
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});