// Comprehensive test script for wallet authentication with RLS disabled
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
console.log('=== WALLET AUTHENTICATION TEST WITH RLS DISABLED ===');
console.log('Test wallet address:', wallet.address);
console.log('Normalized address:', wallet.address.toLowerCase());

// Complete authentication flow
async function testWalletAuthWithRLSDisabled() {
  try {
    // Step 1: Check if we can directly insert into wallet_profiles
    console.log('\nStep 1: Testing direct insert into wallet_profiles...');
    const testWalletData = {
      wallet_address: wallet.address.toLowerCase(),
      blockchain_type: 'evm',
      is_primary: true,
      is_verified: false,
      standalone_wallet: true,
      display_name: `Test Direct Insert ${wallet.address.substring(0, 6)}`,
      avatar_seed: Buffer.from(wallet.address).toString('hex'),
      preferences: {}
    };
    
    const { data: insertedProfile, error: insertError } = await supabase
      .from('wallet_profiles')
      .insert(testWalletData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Direct insert failed:', insertError);
      console.log('This suggests there might still be database permission issues');
    } else {
      console.log('Direct insert successful:', insertedProfile);
      console.log('This confirms we can write to the database with RLS disabled');
      
      // Clean up the test profile
      await supabase
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', wallet.address.toLowerCase());
      console.log('Test profile deleted for clean testing');
    }
    
    // Step 2: Get authentication message from server
    console.log('\nStep 2: Getting auth message from server...');
    const messageResponse = await axios.get(`/api/auth/message/${wallet.address}`);
    const { message } = messageResponse.data.data;
    console.log('Auth message:', message);
    
    // Step 3: Sign the message with wallet
    console.log('\nStep 3: Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log('Signature generated, length:', signature.length);
    
    // Step 4: Call the wallet-auth endpoint to authenticate
    console.log('\nStep 4: Calling wallet-auth endpoint...');
    const authResponse = await axios.post('/api/auth/wallet-auth', {
      walletAddress: wallet.address.toLowerCase(),
      signature,
      message,
      blockchainType: 'evm',
      displayName: `Test Wallet ${wallet.address.substring(0, 6)}`
    });
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
    
    // Step 5: Check if wallet profile was created in database
    console.log('\nStep 5: Checking wallet profile in database...');
    const { data: walletProfile, error } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', wallet.address.toLowerCase())
      .single();
    
    if (error) {
      console.error('Error fetching wallet profile:', error.message);
      console.log('This suggests the profile was not created by the backend');
    } else if (walletProfile) {
      console.log('Wallet profile found in database:', walletProfile);
      console.log('✅ VERIFICATION SUCCESSFUL: Backend created the wallet profile');
    } else {
      console.log('No wallet profile found in database!');
      console.log('This suggests the backend failed to create the profile');
    }
    
    // Step 6: Simulate frontend JWT token storage
    if (authResponse.data.success && authResponse.data.data.token) {
      console.log('\nStep 6: Testing frontend JWT token storage...');
      const token = authResponse.data.data.token;
      
      // Create the proper storage key format that Supabase expects
      const storageKey = `sb-${supabaseUrl.replace(/^https?:\/\/(.*)/, '$1').replace(/\./, '-')}-auth-token`;
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
      
      // Test if we can set the session
      console.log('\nStep 7: Testing session setting...');
      try {
        const sessionResult = await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });
        
        console.log('Session set result:', {
          success: !!sessionResult.data.session,
          hasError: !!sessionResult.error,
          errorMessage: sessionResult.error?.message
        });
      } catch (sessionErr) {
        console.error('Error setting session:', sessionErr);
      }
    }
    
    console.log('\n=== WALLET AUTHENTICATION TEST WITH RLS DISABLED COMPLETED ===');
  } catch (error) {
    console.error('\n=== WALLET AUTHENTICATION TEST WITH RLS DISABLED FAILED ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testWalletAuthWithRLSDisabled().catch(console.error);
