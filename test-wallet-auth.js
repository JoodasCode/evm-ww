// Test script for wallet authentication
import axios from 'axios';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5002';

// Create a wallet for testing
const wallet = ethers.Wallet.createRandom();
console.log('=== WALLET AUTHENTICATION TEST ===');
console.log('Test wallet address:', wallet.address);
console.log('Normalized address:', wallet.address.toLowerCase());

// Complete authentication flow
async function testWalletAuth() {
  try {
    // Step 0: Check if wallet profile already exists in database
    console.log('\nStep 0: Checking if wallet profile already exists...');
    const { data: existingProfile, error: existingError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', wallet.address.toLowerCase())
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', existingError.message);
    } else if (existingProfile) {
      console.log('Existing wallet profile found:', existingProfile);
      console.log('Deleting existing profile for clean test...');
      
      const { error: deleteError } = await supabase
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', wallet.address.toLowerCase());
      
      if (deleteError) {
        console.error('Error deleting existing profile:', deleteError.message);
      } else {
        console.log('Existing profile deleted successfully');
      }
    } else {
      console.log('No existing wallet profile found, proceeding with clean test');
    }
    
    // Step 1: Get authentication message from server
    console.log('\nStep 1: Getting auth message from server...');
    const messageResponse = await axios.get(`/api/auth/message/${wallet.address}`);
    const { message } = messageResponse.data.data;
    console.log('Auth message:', message);
    
    // Step 2: Sign the message with wallet
    console.log('\nStep 2: Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log('Signature generated, length:', signature.length);
    
    // Step 3: Call the wallet-auth endpoint to authenticate
    console.log('\nStep 3: Calling wallet-auth endpoint...');
    const authResponse = await axios.post('/api/auth/wallet-auth', {
      walletAddress: wallet.address.toLowerCase(),
      signature,
      message,
      blockchainType: 'evm',
      displayName: `Test Wallet ${wallet.address.substring(0, 6)}`
    });
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
    
    // Step 4: Check if wallet profile was created in database
    console.log('\nStep 4: Checking if wallet profile was persisted in database...');
    
    // Wait a moment to ensure database operations complete
    console.log('Waiting 2 seconds for database operations to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Query wallet profile directly using service key
    const { data: walletProfile, error: profileError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', wallet.address.toLowerCase())
      .single();
    
    if (profileError) {
      console.error('Error fetching wallet profile:', profileError.message);
      console.error('Full error:', profileError);
    } else if (walletProfile) {
      console.log('SUCCESS: Wallet profile found in database:');
      console.log(JSON.stringify(walletProfile, null, 2));
    } else {
      console.error('FAILURE: No wallet profile found in database!');
      
      // Try a direct check with the debug endpoint
      console.log('\nStep 5: Using debug endpoint to check wallet profile...');
      try {
        const debugResponse = await axios.get(`/api/debug/check-wallet/${wallet.address.toLowerCase()}`);
        console.log('Debug endpoint response:', JSON.stringify(debugResponse.data, null, 2));
      } catch (debugError) {
        console.error('Error calling debug endpoint:', debugError.message);
      }
    }
    
    console.log('\n=== WALLET AUTHENTICATION TEST COMPLETED ===');
  } catch (error) {
    console.error('\n=== WALLET AUTHENTICATION TEST FAILED ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testWalletAuth().catch(console.error);
