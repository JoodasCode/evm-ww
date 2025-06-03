import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates that the Supabase URL is properly formatted
 */
function validateSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase.co');
  } catch (e) {
    return false;
  }
}

/**
 * Validates that the Supabase service key looks like a JWT token
 */
function validateSupabaseKey(key: string | undefined): boolean {
  if (!key) return false;
  // Simple validation - should be a JWT token with 3 parts separated by dots
  const parts = key.split('.');
  return parts.length === 3 && key.length > 100;
}

// Initialize Supabase admin client with service role key directly from process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validate environment variables
const isUrlValid = validateSupabaseUrl(supabaseUrl);
const isKeyValid = validateSupabaseKey(supabaseServiceKey);

// Log Supabase configuration (without sensitive values)
console.log('Supabase Admin Client Configuration:');
console.log(`- URL: ${supabaseUrl} ${isUrlValid ? '✅' : '❌'}`);
console.log(`- Service Key: ${supabaseServiceKey ? `${supabaseServiceKey.slice(0, 6)}... ${isKeyValid ? '✅' : '❌'}` : 'Not set ❌'}`);

// Check if we have the required environment variables
if (!isUrlValid || !isKeyValid) {
  const errors = [];
  if (!isUrlValid) errors.push('Invalid Supabase URL format');
  if (!isKeyValid) errors.push('Invalid Supabase service key format');
  throw new Error(`Supabase configuration error: ${errors.join(', ')}`);
}

// Create admin client with service role key (full access)
const supabaseAdmin = createClient(supabaseUrl as string, supabaseServiceKey as string, {

  auth: {
    autoRefreshToken: false, // For server-side usage
    persistSession: false
  }
});

// Test the Supabase connection on startup
(async () => {
  if (isAdminClientConfigured()) {
    try {
      console.log('Testing Supabase admin client connection...');
      const { data, error } = await supabaseAdmin.from('wallet_profiles').select('count').limit(1);
      
      if (error) {
        console.error('❌ Supabase connection test failed:', error);
        console.error('Full error details:', JSON.stringify(error));
      } else {
        console.log('✅ Supabase connection test successful!');
        console.log('Connection verified with wallet_profiles table');
      }
    } catch (err) {
      console.error('❌ Supabase connection test failed with exception:', err);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
    }
  } else {
    console.error('❌ Skipping Supabase connection test - client not properly configured');
  }
})();

// Export a function to check if the admin client is properly configured
export function isAdminClientConfigured(): boolean {
  return isUrlValid && isKeyValid;
}

// Export default for convenience
export default supabaseAdmin;

// Helper functions already exported above

/**
 * Verbose logging for Supabase operations in development mode
 * @param operation - The operation being performed
 * @param error - The error object if any
 */
export function logSupabaseOperation(operation: string, error: any = null): void {
  if (process.env.NODE_ENV === 'development') {
    if (error) {
      console.error(`[SUPABASE ERROR] ${operation}:`, error);
    } else {
      console.log(`[SUPABASE] ${operation} completed successfully`);
    }
  }
}
