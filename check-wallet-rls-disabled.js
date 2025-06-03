// Script to check if a specific wallet exists in the database with RLS disabled
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client with service key for admin access
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get wallet address from command line arguments
const walletAddress = process.argv[2];

if (!walletAddress) {
  console.error('Please provide a wallet address as an argument');
  console.error('Usage: node check-wallet-rls-disabled.js 0x1234abcd...');
  process.exit(1);
}

// Normalize wallet address to lowercase
const normalizedAddress = walletAddress.toLowerCase();
console.log('Checking wallet profile for address:', normalizedAddress);

async function checkWalletProfile() {
  try {
    // First check if the wallet profile exists
    const { data: walletProfile, error } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedAddress);
    
    if (error) {
      console.error('Error fetching wallet profile:', error.message);
      return;
    }
    
    if (!walletProfile || walletProfile.length === 0) {
      console.log('❌ No wallet profile found for address', normalizedAddress);
      console.log('This wallet has not been authenticated yet');
      
      // List all wallet profiles in the database for reference
      console.log('\nListing all wallet profiles in the database:');
      const { data: allProfiles, error: listError } = await supabase
        .from('wallet_profiles')
        .select('wallet_address, display_name, first_seen')
        .order('first_seen', { ascending: false })
        .limit(10);
      
      if (listError) {
        console.error('Error listing wallet profiles:', listError.message);
      } else if (allProfiles && allProfiles.length > 0) {
        console.log('Found', allProfiles.length, 'wallet profiles:');
        allProfiles.forEach((profile, index) => {
          console.log(`${index + 1}. ${profile.wallet_address} (${profile.display_name}) - First seen: ${profile.first_seen}`);
        });
      } else {
        console.log('No wallet profiles found in the database at all');
      }
    } else {
      console.log('✅ Wallet profile found!');
      console.log(JSON.stringify(walletProfile[0], null, 2));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkWalletProfile();
