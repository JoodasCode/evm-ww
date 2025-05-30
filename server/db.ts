/**
 * Shared Database Connection Module
 * 
 * This module provides a single, consistent database connection for the entire application.
 * Now using Supabase for enhanced performance and real-time capabilities while maintaining
 * all existing wallet analysis data and behavioral profiles.
 * 
 * Key benefits:
 * - Single source of truth for database connections
 * - Prevents connection mismatches between analysis storage and retrieval
 * - Enables efficient caching behavior with Redis/Supabase fallback
 * - Real-time subscriptions and automatic API generation
 */

import { createClient } from '@supabase/supabase-js';

// Single shared Supabase client used throughout the application
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// PostgreSQL connection using local database
import { Pool } from 'pg';
export const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});