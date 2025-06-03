import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service key (admin access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkWalletProfiles() {
  console.log('Checking wallet_profiles table...');
  
  // Get all wallet profiles
  const { data, error } = await supabase
    .from('wallet_profiles')
    .select('*')
    .order('last_updated', { ascending: false });
  
  if (error) {
    console.error('Error fetching wallet profiles:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No wallet profiles found in the database.');
    return;
  }
  
  console.log(`Found ${data.length} wallet profiles:`);
  data.forEach((profile, index) => {
    console.log(`\nProfile #${index + 1}:`);
    console.log(`  ID: ${profile.id}`);
    console.log(`  Wallet Address: ${profile.wallet_address}`);
    console.log(`  Display Name: ${profile.display_name}`);
    console.log(`  Verified: ${profile.is_verified}`);
    console.log(`  Created: ${profile.first_seen}`);
    console.log(`  Last Updated: ${profile.last_updated}`);
  });
}

// Run the check
checkWalletProfiles().catch(console.error);
