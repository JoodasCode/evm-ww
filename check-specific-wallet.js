// Script to check if a specific wallet address exists in the database
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client with service key for admin access
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if a wallet address exists in the database
async function checkWalletProfile(walletAddress) {
  if (!walletAddress) {
    console.error('Please provide a wallet address as an argument');
    console.log('Usage: node check-specific-wallet.js 0x1234...');
    process.exit(1);
  }
  
  // Normalize the wallet address
  const normalizedAddress = walletAddress.toLowerCase();
  console.log(`Checking wallet profile for address: ${normalizedAddress}`);
  
  try {
    // Query the wallet_profiles table
    const { data: walletProfile, error } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedAddress)
      .single();
    
    if (error) {
      console.error('Error fetching wallet profile:', error.message);
      
      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        console.log(`✅ No wallet profile found for address ${normalizedAddress}`);
        console.log('This is expected if the wallet has never connected to your app');
      }
    } else if (walletProfile) {
      console.log('✅ Wallet profile found in database:');
      console.log(JSON.stringify(walletProfile, null, 2));
      console.log('\nKey details:');
      console.log('- ID:', walletProfile.id);
      console.log('- First seen:', new Date(walletProfile.first_seen).toLocaleString());
      console.log('- Is verified:', walletProfile.is_verified);
      console.log('- Display name:', walletProfile.display_name);
    } else {
      console.log(`❌ No wallet profile found for address ${normalizedAddress}`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Get wallet address from command line argument
const walletAddress = process.argv[2];
checkWalletProfile(walletAddress);
