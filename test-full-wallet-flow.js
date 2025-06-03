// Comprehensive test script for the full wallet authentication flow
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Supabase setup - using both anon key and service key for testing
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Anon Key (first 10 chars): ${supabaseAnonKey.substring(0, 10)}...`);
console.log(`Using Supabase Service Key (first 10 chars): ${supabaseServiceKey.substring(0, 10)}...`);

// Create Supabase clients with both keys
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// Create a test wallet
const wallet = ethers.Wallet.createRandom();
console.log(`Created test wallet with address: ${wallet.address}`);

// Function to clear existing wallet profile using service role
async function clearWalletProfile(walletAddress) {
  console.log(`Clearing wallet profile for address: ${walletAddress}`);
  try {
    // First check if the wallet profile exists
    const { data: existingProfile, error: fetchError } = await supabaseService
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase());
    
    if (fetchError) {
      console.error('Error checking for existing wallet profile:', fetchError);
    } else if (existingProfile && existingProfile.length > 0) {
      console.log('Found existing wallet profile:', existingProfile[0].id);
      
      // Delete the wallet profile
      const { data, error } = await supabaseService
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', walletAddress.toLowerCase());
      
      if (error) {
        console.error('Error clearing wallet profile:', error);
      } else {
        console.log('Wallet profile cleared successfully');
      }
    } else {
      console.log('No existing wallet profile found to clear');
    }
  } catch (error) {
    console.error('Exception clearing wallet profile:', error);
  }
}

// Function to get authentication message
async function getAuthMessage(walletAddress) {
  console.log(`Getting auth message for wallet: ${walletAddress}`);
  try {
    const response = await axios.get(`http://localhost:5002/api/auth/message/${walletAddress}`);
    console.log('Auth message received:', response.data);
    return response.data.data.message;
  } catch (error) {
    console.error('Error getting auth message:', error);
    throw error;
  }
}

// Function to authenticate wallet
async function walletAuth(walletAddress, signature, message) {
  console.log(`Authenticating wallet: ${walletAddress}`);
  try {
    // Create display name from wallet address
    const displayName = `Wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
    
    const response = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
      walletAddress: walletAddress.toLowerCase(),
      signature,
      message,
      blockchainType: 'evm',
      displayName
    });
    console.log('Wallet authentication successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error authenticating wallet:', error);
    throw error;
  }
}

// Function to get wallet profile with anon key
async function getWalletProfileWithAnonKey(walletAddress) {
  console.log(`Getting wallet profile with ANON key for address: ${walletAddress}`);
  try {
    const { data, error } = await supabaseAnon
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase());
    
    if (error) {
      console.error('Error getting wallet profile with ANON key:', error);
      return null;
    } else {
      console.log('Wallet profile retrieved successfully with ANON key');
      return data && data.length > 0 ? data[0] : null;
    }
  } catch (error) {
    console.error('Exception getting wallet profile with ANON key:', error);
    return null;
  }
}

// Function to get wallet profile with service key
async function getWalletProfileWithServiceKey(walletAddress) {
  console.log(`Getting wallet profile with SERVICE key for address: ${walletAddress}`);
  try {
    const { data, error } = await supabaseService
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase());
    
    if (error) {
      console.error('Error getting wallet profile with SERVICE key:', error);
      return null;
    } else {
      console.log('Wallet profile retrieved successfully with SERVICE key');
      return data && data.length > 0 ? data[0] : null;
    }
  } catch (error) {
    console.error('Exception getting wallet profile with SERVICE key:', error);
    return null;
  }
}

// Function to check RLS policies
async function checkRlsPolicies() {
  console.log('Checking RLS policies for wallet_profiles table...');
  try {
    const { data, error } = await supabaseService.rpc('get_policies', { 
      table_name: 'wallet_profiles' 
    });
    
    if (error) {
      console.error('Error checking RLS policies:', error);
    } else {
      console.log('RLS policies for wallet_profiles:', data);
    }
  } catch (error) {
    console.error('Exception checking RLS policies:', error);
  }
}

// Main function to test wallet authentication flow
async function testWalletAuthFlow() {
  try {
    console.log('=== TESTING FULL WALLET AUTHENTICATION FLOW ===');
    
    // Check RLS policies
    await checkRlsPolicies();
    
    // Clear any existing wallet profile
    await clearWalletProfile(wallet.address);
    
    // Get authentication message
    const message = await getAuthMessage(wallet.address);
    
    // Sign the message with the wallet
    console.log('Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log('Message signed successfully:', signature.substring(0, 20) + '...');
    
    // Authenticate the wallet
    const authResult = await walletAuth(wallet.address, signature, message);
    
    // Get the wallet profile from Supabase with anon key
    const walletProfileAnon = await getWalletProfileWithAnonKey(wallet.address);
    console.log('Wallet profile in database (ANON key):', walletProfileAnon);
    
    // Get the wallet profile from Supabase with service key
    const walletProfileService = await getWalletProfileWithServiceKey(wallet.address);
    console.log('Wallet profile in database (SERVICE key):', walletProfileService);
    
    // Verify wallet profile exists and is correct
    if (walletProfileService) {
      console.log('✅ TEST PASSED: Wallet profile created successfully (SERVICE key)');
      console.log(`Wallet address: ${walletProfileService.wallet_address}`);
      console.log(`Display name: ${walletProfileService.display_name}`);
      console.log(`Verified: ${walletProfileService.is_verified}`);
    } else {
      console.log('❌ TEST FAILED: Wallet profile not created (SERVICE key)');
    }
    
    if (walletProfileAnon) {
      console.log('✅ TEST PASSED: Wallet profile accessible with ANON key');
    } else {
      console.log('❌ TEST FAILED: Wallet profile not accessible with ANON key');
      console.log('This is likely due to RLS policies restricting access. Check the RLS policies in Supabase.');
    }
  } catch (error) {
    console.error('Error testing wallet auth flow:', error);
  }
}

// Add a helper function to add a public read policy to wallet_profiles
async function addPublicReadPolicy() {
  console.log('Adding public read policy to wallet_profiles table...');
  try {
    // SQL to create the policy
    const sql = `
      CREATE POLICY IF NOT EXISTS "Allow public read access to wallet_profiles"
        ON public.wallet_profiles FOR SELECT
        USING (true);
    `;
    
    // Execute the SQL using the service role
    const { data, error } = await supabaseService.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error adding public read policy:', error);
      console.log('Trying alternative method to add policy...');
      
      // Try to use the REST API directly
      const { data: restData, error: restError } = await supabaseService
        .from('wallet_profiles')
        .select('count(*)')
        .limit(1);
      
      if (restError) {
        console.error('Error with alternative method:', restError);
      } else {
        console.log('Alternative method successful, but policy may not be added.');
      }
    } else {
      console.log('Public read policy added successfully');
    }
  } catch (error) {
    console.error('Exception adding public read policy:', error);
  }
}

// Run the test with a sequence
async function runTests() {
  // First try to add a public read policy
  await addPublicReadPolicy();
  
  // Then run the full test
  await testWalletAuthFlow();
}

// Run all tests
runTests();
