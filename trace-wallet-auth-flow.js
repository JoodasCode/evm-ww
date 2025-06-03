// Complete tracing script for wallet authentication flow
import axios from 'axios';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client with service key for admin access
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'fallback-key';

console.log('Supabase URL:', supabaseUrl);
console.log('Service key available:', !!supabaseServiceKey);
console.log('Anon key available:', !!supabaseAnonKey);

// Create admin client with service key
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// Create regular client with anon key (simulating frontend)
const frontendClient = createClient(supabaseUrl, supabaseAnonKey);

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5002';

// Create a wallet for testing or use provided wallet
const walletAddress = process.argv[2] || ethers.Wallet.createRandom().address;
const normalizedAddress = walletAddress.toLowerCase();

console.log('=== COMPLETE WALLET AUTHENTICATION FLOW TRACE ===');
console.log('Testing with wallet address:', normalizedAddress);

async function traceWalletAuthFlow() {
  try {
    // Step 1: Check if RLS is disabled by trying a direct insert
    console.log('\nStep 1: Verifying RLS is disabled...');
    try {
      const testData = {
        wallet_address: `test-${Date.now()}`,
        blockchain_type: 'evm',
        is_primary: false,
        is_verified: false,
        standalone_wallet: true,
        display_name: 'RLS Test',
        avatar_seed: 'test',
        preferences: {}
      };
      
      const { data: insertTest, error: insertError } = await adminClient
        .from('wallet_profiles')
        .insert(testData)
        .select();
      
      if (insertError) {
        console.error('❌ RLS test failed, cannot insert directly:', insertError);
        console.log('Please disable RLS on the wallet_profiles table in Supabase');
        return;
      } else {
        console.log('✅ RLS test passed, direct insert successful');
        
        // Clean up test data
        await adminClient
          .from('wallet_profiles')
          .delete()
          .eq('wallet_address', testData.wallet_address);
      }
    } catch (rlsErr) {
      console.error('❌ RLS test error:', rlsErr);
      return;
    }
    
    // Step 2: Check if wallet profile already exists
    console.log('\nStep 2: Checking if wallet profile already exists...');
    const { data: existingProfile, error: existingError } = await adminClient
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedAddress)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('❌ Error checking existing profile:', existingError);
    } else if (existingProfile) {
      console.log('✅ Wallet profile already exists:', existingProfile);
      console.log('Deleting existing profile for clean test...');
      
      await adminClient
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', normalizedAddress);
      
      console.log('Existing profile deleted');
    } else {
      console.log('✅ No existing wallet profile found, proceeding with clean test');
    }
    
    // Step 3: Get authentication message from server
    console.log('\nStep 3: Getting auth message from server...');
    let message;
    try {
      const messageResponse = await axios.get(`/api/auth/message/${normalizedAddress}`);
      message = messageResponse.data.data.message;
      console.log('✅ Auth message received:', message);
    } catch (messageErr) {
      console.error('❌ Error getting auth message:', messageErr);
      if (messageErr.response) {
        console.error('Response:', messageErr.response.data);
      }
      return;
    }
    
    // Step 4: Sign the message with wallet
    console.log('\nStep 4: Signing message with wallet...');
    let signature;
    try {
      // Create a new wallet for testing
      const wallet = ethers.Wallet.createRandom();
      console.log('Test wallet address:', wallet.address);
      console.log('Test wallet private key:', wallet.privateKey);
      
      signature = await wallet.signMessage(message);
      console.log('✅ Signature generated:', signature);
    } catch (signErr) {
      console.error('❌ Error signing message:', signErr);
      return;
    }
    
    // Step 5: Call the wallet-auth endpoint directly
    console.log('\nStep 5: Calling wallet-auth endpoint directly...');
    let authResponse;
    let token;
    try {
      authResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: normalizedAddress,
        signature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${normalizedAddress.substring(0, 6)}`
      });
      
      console.log('✅ Auth response status:', authResponse.status);
      console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
      
      if (authResponse.data.success && authResponse.data.data.token) {
        token = authResponse.data.data.token;
        console.log('✅ JWT token received');
      } else {
        console.error('❌ No token in response');
        return;
      }
    } catch (authErr) {
      console.error('❌ Error calling wallet-auth endpoint:', authErr);
      if (authErr.response) {
        console.error('Response:', authErr.response.data);
      }
      return;
    }
    
    // Step 6: Check if wallet profile was created in database
    console.log('\nStep 6: Checking if wallet profile was created...');
    const { data: createdProfile, error: createdError } = await adminClient
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedAddress)
      .single();
    
    if (createdError) {
      console.error('❌ Error checking created profile:', createdError);
      console.log('This suggests the backend did not create the wallet profile');
      
      // Check backend logs
      console.log('\nChecking backend logs for wallet-auth endpoint...');
      try {
        const logsResponse = await axios.get('/api/debug/logs?endpoint=wallet-auth');
        console.log('Backend logs:', logsResponse.data);
      } catch (logsErr) {
        console.error('Could not fetch backend logs:', logsErr);
      }
    } else if (createdProfile) {
      console.log('✅ Wallet profile created successfully:', createdProfile);
    } else {
      console.log('❌ No wallet profile found after authentication');
    }
    
    // Step 7: Test setting the JWT token in a frontend client
    console.log('\nStep 7: Testing JWT token with frontend client...');
    try {
      const sessionResult = await frontendClient.auth.setSession({
        access_token: token,
        refresh_token: ''
      });
      
      console.log('Session set result:', {
        success: !!sessionResult.data.session,
        hasError: !!sessionResult.error,
        errorMessage: sessionResult.error?.message
      });
      
      if (sessionResult.data.session) {
        console.log('✅ Session set successfully');
        
        // Try to fetch the wallet profile with the authenticated client
        const { data: authFetchData, error: authFetchError } = await frontendClient
          .from('wallet_profiles')
          .select('*')
          .eq('wallet_address', normalizedAddress)
          .single();
        
        if (authFetchError) {
          console.error('❌ Error fetching wallet profile with authenticated client:', authFetchError);
          console.log('This suggests RLS policies may be preventing access');
        } else if (authFetchData) {
          console.log('✅ Successfully fetched wallet profile with authenticated client:', authFetchData);
          console.log('This confirms the JWT token is working correctly');
        }
      } else {
        console.error('❌ Failed to set session with JWT token');
      }
    } catch (sessionErr) {
      console.error('❌ Error setting session:', sessionErr);
    }
    
    // Step 8: Check JWT token claims
    console.log('\nStep 8: Analyzing JWT token claims...');
    try {
      // Decode JWT token (without verification)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('❌ Invalid JWT token format');
        return;
      }
      
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('JWT payload:', payload);
      
      // Check for essential claims
      const essentialClaims = ['role', 'aud', 'wallet_address', 'exp', 'iat'];
      const missingClaims = essentialClaims.filter(claim => !(claim in payload));
      
      if (missingClaims.length > 0) {
        console.error(`❌ Missing essential claims in JWT token: ${missingClaims.join(', ')}`);
      } else {
        console.log('✅ JWT token contains all essential claims');
      }
      
      // Check if wallet_address claim matches
      if (payload.wallet_address && payload.wallet_address.toLowerCase() === normalizedAddress) {
        console.log('✅ wallet_address claim matches test wallet');
      } else {
        console.error('❌ wallet_address claim does not match test wallet');
        console.log(`Expected: ${normalizedAddress}, Found: ${payload.wallet_address || 'missing'}`);
      }
      
      // Check token expiration
      const expirationDate = new Date(payload.exp * 1000);
      console.log(`Token expires on: ${expirationDate.toISOString()}`);
      
      if (expirationDate > new Date()) {
        console.log('✅ Token is not expired');
      } else {
        console.error('❌ Token is already expired');
      }
    } catch (jwtErr) {
      console.error('❌ Error analyzing JWT token:', jwtErr);
    }
    
    console.log('\n=== WALLET AUTHENTICATION FLOW TRACE COMPLETED ===');
    console.log('Summary:');
    if (createdProfile) {
      console.log('✅ Backend successfully created wallet profile');
    } else {
      console.log('❌ Backend failed to create wallet profile');
    }
    
    console.log('\nNext steps:');
    console.log('1. Check the backend logs for any errors during wallet-auth');
    console.log('2. Verify that RLS policies are correctly configured');
    console.log('3. Test the complete flow in the browser with console open');
  } catch (error) {
    console.error('\n=== WALLET AUTHENTICATION FLOW TRACE FAILED ===');
    console.error('Error:', error);
  }
}

// Run the trace
traceWalletAuthFlow().catch(console.error);
