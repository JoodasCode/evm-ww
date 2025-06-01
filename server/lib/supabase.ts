import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Check if we have the required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Using empty strings which will likely cause errors.');
}

// Create standard client with anon key (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Create admin client with service role key (full access)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : supabase; // Fallback to regular client if no service key
