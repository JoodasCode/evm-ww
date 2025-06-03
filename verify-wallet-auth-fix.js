// Verification script for the wallet authentication fix
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
console.log('=== WALLET AUTHENTICATION FIX VERIFICATION ===');
console.log('Test wallet address:', wallet.address);
console.log('Normalized address:', wallet.address.toLowerCase());

// Simulate the fixed frontend wallet connection flow
async function verifyWalletAuthFix() {
  try {
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
    
    // Step 4: Store JWT token with the FIXED format
    console.log('\nStep 4: Storing JWT token with fixed format...');
    const token = authResponse.data.data.token;
    
    // Create the proper storage key format that Supabase expects
    const storageKey = `sb-${supabaseUrl.replace(/^https?:\/\//, '').replace(/\./, '-')}-auth-token`;
    const tokenData = JSON.stringify({
      access_token: token,
      refresh_token: '',
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
      expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      token_type: 'bearer',
      provider: 'custom'
    });
    
    console.log('Storage key format:', storageKey);
    console.log('Token data format:', JSON.stringify(JSON.parse(tokenData), null, 2));
    
    // Step 5: Set session in Supabase client
    console.log('\nStep 5: Setting session in Supabase client...');
    const sessionResult = await supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
    
    console.log('Session set result:', {
      success: !!sessionResult.data.session,
      hasError: !!sessionResult.error,
      errorMessage: sessionResult.error?.message
    });
    
    // Step 6: Fetch wallet profile to verify it exists
    console.log('\nStep 6: Fetching wallet profile to verify it exists...');
    const { data: walletProfile, error: fetchError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', wallet.address.toLowerCase())
      .single();
    
    if (fetchError) {
      console.error('Error fetching wallet profile:', fetchError);
    } else {
      console.log('Wallet profile found in database:', walletProfile);
      console.log('✅ VERIFICATION SUCCESSFUL: Wallet profile exists and can be retrieved');
    }
    
    console.log('\n=== WALLET AUTHENTICATION FIX VERIFICATION COMPLETED ===');
  } catch (error) {
    console.error('\n=== WALLET AUTHENTICATION FIX VERIFICATION FAILED ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the verification
verifyWalletAuthFix().catch(console.error);
