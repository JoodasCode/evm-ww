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
  'https://ncqecpowuzvkgjfgrphz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWVjcG93dXp2a2dqZmdycGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzYxMjY1NCwiZXhwIjoyMDYzMTg4NjU0fQ.LVTzTREeNN9yONGjwg_ed6LeiOemDYc5LSnpNtHzMCA'
);

// PostgreSQL connection using Supabase database
import { Pool } from 'pg';
export const pool = new Pool({
  connectionString: 'postgresql://postgres:p78z9WNgIJt8MbrW@db.ncqecpowuzvkgjfgrphz.supabase.co:5432/postgres',
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