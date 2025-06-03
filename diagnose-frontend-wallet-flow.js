// Diagnostic script for frontend wallet connection flow
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
console.log('=== FRONTEND WALLET FLOW DIAGNOSTIC ===');
console.log('Test wallet address:', wallet.address);
console.log('Normalized address:', wallet.address.toLowerCase());

// Simulate the frontend wallet connection flow
async function diagnoseWalletFlow() {
  try {
    // Step 1: Get authentication message from server (same as useWalletAuth.getAuthMessage)
    console.log('\nStep 1: Getting auth message from server...');
    const messageResponse = await axios.get(`/api/auth/message/${wallet.address}`);
    const { message } = messageResponse.data.data;
    console.log('Auth message:', message);
    
    // Step 2: Sign the message with wallet (same as useWalletAuth using signMessageAsync)
    console.log('\nStep 2: Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log('Signature generated, length:', signature.length);
    
    // Step 3: Call the wallet-auth endpoint to authenticate (same as useWalletAuth.authenticateWallet)
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
    
    // Step 4: Store JWT token in localStorage (simulated)
    console.log('\nStep 4: Storing JWT token (simulated localStorage)...');
    const token = authResponse.data.data.token;
    console.log('JWT token received, length:', token.length);
    
    // Step 5: Set session in Supabase client (same as in useWalletAuth)
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
    
    // Step 6: Fetch wallet profile (same as useWalletAuth.fetchWalletProfile)
    console.log('\nStep 6: Fetching wallet profile with token...');
    const { data: walletProfile, error: fetchError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', wallet.address.toLowerCase())
      .single();
    
    if (fetchError) {
      console.error('Error fetching wallet profile with token:', fetchError);
      
      // Step 6b: Try direct database query as a diagnostic step
      console.log('\nStep 6b: Trying direct database query...');
      const { data: directData, error: directError } = await supabase
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', wallet.address.toLowerCase())
        .single();
      
      if (directError) {
        console.error('Direct database query failed:', directError);
      } else if (directData) {
        console.log('Direct database query found wallet profile:', directData);
        console.log('This suggests an RLS policy issue rather than missing data');
      } else {
        console.log('Direct database query found no wallet profile');
        console.log('This suggests the wallet profile does not exist in the database');
      }
    } else {
      console.log('Wallet profile fetched successfully:', walletProfile);
    }
    
    // Step 7: Check RLS policies
    console.log('\nStep 7: Checking RLS policies...');
    try {
      const { data: rlsData, error: rlsError } = await supabase.rpc('debug_check_rls_policies', {
        wallet_address_param: wallet.address.toLowerCase()
      });
      
      if (rlsError) {
        console.error('RLS policy check failed:', rlsError);
      } else {
        console.log('RLS policy check result:', rlsData);
      }
    } catch (rlsErr) {
      console.log('RLS policy check function not available:', rlsErr.message);
    }
    
    console.log('\n=== FRONTEND WALLET FLOW DIAGNOSTIC COMPLETED ===');
  } catch (error) {
    console.error('\n=== FRONTEND WALLET FLOW DIAGNOSTIC FAILED ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the diagnostic
diagnoseWalletFlow().catch(console.error);
