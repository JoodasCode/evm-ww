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

// Legacy PostgreSQL compatibility layer for existing code
import { Pool } from 'pg';
export const pool = new Pool({
  connectionString: `postgresql://postgres.ncqecpowuzvkgjfgrphz:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
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