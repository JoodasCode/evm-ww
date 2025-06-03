// Script to fix RLS policies using Supabase REST API
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Service Key (first 10 chars): ${supabaseServiceKey.substring(0, 10)}...`);

// Function to execute SQL directly via the REST API
async function executeSql(sql) {
  try {
    console.log('Executing SQL:');
    console.log(sql);
    
    // Extract the project reference from the URL
    // Example: https://ncqecpowuzvkgjfgrphz.supabase.co -> ncqecpowuzvkgjfgrphz
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
    
    // Use the SQL API endpoint
    const response = await axios.post(
      `https://api.supabase.com/projects/${projectRef}/sql`,
      { query: sql },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        }
      }
    );
    
    console.log('SQL executed successfully:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error executing SQL:', error.response?.data || error.message);
    throw error;
  }
}

// Main function to update RLS policies
async function updateRlsPolicies() {
  console.log('Updating RLS policies...');
  
  try {
    // First, create a policy for public read access to wallet_profiles
    const walletProfilesPolicy = `
      -- Drop existing policy if it exists
      DROP POLICY IF EXISTS "Allow public read access to wallet_profiles" ON public.wallet_profiles;
      
      -- Create new policy for public read access
      CREATE POLICY "Allow public read access to wallet_profiles"
        ON public.wallet_profiles FOR SELECT
        USING (true);
    `;
    
    await executeSql(walletProfilesPolicy);
    console.log('✅ Updated wallet_profiles RLS policy for public read access');
    
    // Then, create a policy for public read access to user_activity
    const userActivityPolicy = `
      -- Drop existing policy if it exists
      DROP POLICY IF EXISTS "Allow public read access to user_activity" ON public.user_activity;
      
      -- Create new policy for public read access
      CREATE POLICY "Allow public read access to user_activity"
        ON public.user_activity FOR SELECT
        USING (true);
    `;
    
    await executeSql(userActivityPolicy);
    console.log('✅ Updated user_activity RLS policy for public read access');
    
    // Finally, create a policy for public read access to user_profiles
    const userProfilesPolicy = `
      -- Drop existing policy if it exists
      DROP POLICY IF EXISTS "Allow public read access to user_profiles" ON public.user_profiles;
      
      -- Create new policy for public read access
      CREATE POLICY "Allow public read access to user_profiles"
        ON public.user_profiles FOR SELECT
        USING (true);
    `;
    
    await executeSql(userProfilesPolicy);
    console.log('✅ Updated user_profiles RLS policy for public read access');
    
    console.log('All RLS policies updated successfully!');
  } catch (error) {
    console.error('Failed to update RLS policies:', error);
  }
}

// Run the update
updateRlsPolicies();
