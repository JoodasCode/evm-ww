/**
 * Shared Database Connection Module
 * Ensures consistent database access across the entire application
 */

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for hosted databases like Supabase/Render
  },
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});