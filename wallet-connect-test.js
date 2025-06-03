// Interactive wallet connection test script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client with service key for admin access
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== WALLET WHISPERER CONNECTION TEST ===');
console.log('This script will help you test the wallet connection flow');
console.log('Follow the steps below:');
console.log('1. Open the Wallet Whisperer app in your browser at http://localhost:5175');
console.log('2. Connect your wallet through the UI');
console.log('3. Sign the authentication message when prompted');
console.log('4. Enter your wallet address below to check if it was added to the database\n');

// Ask for wallet address
rl.question('Enter the wallet address to check (0x...): ', async (walletAddress) => {
  if (!walletAddress || !walletAddress.startsWith('0x')) {
    console.error('Invalid wallet address format. Address should start with 0x');
    rl.close();
    return;
  }

  // Normalize wallet address to lowercase
  const normalizedAddress = walletAddress.toLowerCase();
  console.log('\nChecking wallet profile for address:', normalizedAddress);

  try {
    // First check if the wallet profile exists
    const { data: walletProfile, error } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedAddress);
    
    if (error) {
      console.error('Error fetching wallet profile:', error.message);
      rl.close();
      return;
    }
    
    if (!walletProfile || walletProfile.length === 0) {
      console.log('❌ No wallet profile found for address', normalizedAddress);
      console.log('This suggests that:');
      console.log('1. The wallet connection process failed');
      console.log('2. The backend wallet-auth endpoint was not called');
      console.log('3. The JWT token was not properly stored or the session was not set');
      
      // List recent wallet profiles for reference
      console.log('\nMost recent wallet profiles in the database:');
      const { data: recentProfiles, error: listError } = await supabase
        .from('wallet_profiles')
        .select('wallet_address, display_name, first_seen')
        .order('first_seen', { ascending: false })
        .limit(5);
      
      if (listError) {
        console.error('Error listing wallet profiles:', listError.message);
      } else if (recentProfiles && recentProfiles.length > 0) {
        console.log('Found', recentProfiles.length, 'recent wallet profiles:');
        recentProfiles.forEach((profile, index) => {
          console.log(`${index + 1}. ${profile.wallet_address} (${profile.display_name}) - First seen: ${profile.first_seen}`);
        });
      } else {
        console.log('No wallet profiles found in the database at all');
      }
      
      console.log('\nTroubleshooting steps:');
      console.log('1. Check browser console for errors during wallet connection');
      console.log('2. Verify that the backend server is running on port 5002');
      console.log('3. Ensure you signed the authentication message correctly');
      console.log('4. Try connecting with a different wallet or browser');
    } else {
      console.log('✅ SUCCESS! Wallet profile found:');
      console.log(JSON.stringify(walletProfile[0], null, 2));
      console.log('\nThis confirms that:');
      console.log('1. The wallet connection process worked correctly');
      console.log('2. The backend wallet-auth endpoint was called successfully');
      console.log('3. The wallet profile was created in the database');
      
      // Check localStorage format
      console.log('\nNext steps:');
      console.log('1. Check your browser localStorage to verify the JWT token was stored correctly');
      console.log('   Open browser DevTools > Application > Storage > Local Storage');
      console.log(`   Look for a key starting with "sb-${supabaseUrl.replace(/^https?:\/\//, '').replace(/\./, '-')}-auth-token"`);
      console.log('2. The token should contain an "access_token" field with a JWT token');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    rl.close();
  }
});
