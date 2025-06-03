import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { ethers } from 'ethers';

// Initialize dotenv
config({ path: '.env.local' });

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a wallet for testing
const wallet = ethers.Wallet.createRandom();
const testWalletAddress = wallet.address;
const testPrivateKey = wallet.privateKey;

console.log(`Created test wallet: ${testWalletAddress}`);

// Set up axios with base URL
const api = axios.create({
  baseURL: 'http://localhost:5005',
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testWalletAuthFlow() {
  try {
    console.log('\n=== TESTING WALLET AUTH FLOW ===\n');
    
    // Step 1: Get authentication message
    console.log('Step 1: Getting authentication message...');
    const messageResponse = await api.get(`/api/auth/message/${testWalletAddress}`);
    
    if (!messageResponse.data.success) {
      throw new Error(`Failed to get auth message: ${messageResponse.data.error}`);
    }
    
    const message = messageResponse.data.data.message;
    console.log(`Got auth message: ${message}`);
    
    // Step 2: Sign the message with the wallet
    console.log('\nStep 2: Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log(`Message signed, signature: ${signature.substring(0, 20)}...`);
    
    // Step 3: Authenticate with the backend
    console.log('\nStep 3: Authenticating with backend...');
    const authResponse = await api.post('/api/auth/wallet-auth', {
      walletAddress: testWalletAddress,
      signature,
      message,
      blockchainType: 'evm',
      displayName: `Test Wallet ${testWalletAddress.substring(0, 6)}`
    });
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
    
    if (!authResponse.data.success) {
      throw new Error(`Authentication failed: ${authResponse.data.error}`);
    }
    
    const { token, id: walletProfileId } = authResponse.data.data;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    console.log(`Authentication successful! Wallet profile ID: ${walletProfileId}`);
    console.log(`JWT Token: ${token.substring(0, 20)}...`);
    
    // Step 4: Verify the wallet profile was created in Supabase
    console.log('\nStep 4: Verifying wallet profile in Supabase...');
    const { data: walletProfile, error: fetchError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', testWalletAddress.toLowerCase())
      .single();
    
    if (fetchError) {
      throw new Error(`Error fetching wallet profile: ${fetchError.message}`);
    }
    
    if (!walletProfile) {
      throw new Error('Wallet profile not found in Supabase');
    }
    
    console.log('Wallet profile found in Supabase:', walletProfile);
    
    // Step 5: Manually create an activity log with the wallet_profile_id
    console.log('\nStep 5: Creating activity log in Supabase...');
    const { data: activityLog, error: createActivityError } = await supabase
      .from('activity_logs')
      .insert({
        activity_type: 'TEST_AUTH_FLOW',
        wallet_address: testWalletAddress.toLowerCase(),
        wallet_profile_id: walletProfileId,
        details: { test: true, success: true },
        blockchain_type: 'evm'
      })
      .select()
      .single();
    
    if (createActivityError) {
      throw new Error(`Error creating activity log: ${createActivityError.message}`);
    }
    
    console.log('Activity log created successfully:', activityLog);
    
    // Step 6: Verify activity log was created
    console.log('\nStep 6: Verifying activity logs in Supabase...');
    const { data: activityLogs, error: activityError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('wallet_address', testWalletAddress.toLowerCase())
      .order('timestamp', { ascending: false });
    
    if (activityError) {
      throw new Error(`Error fetching activity logs: ${activityError.message}`);
    }
    
    if (!activityLogs || activityLogs.length === 0) {
      throw new Error('No activity logs found for wallet');
    }
    
    console.log(`Found ${activityLogs.length} activity logs:`, activityLogs);
    
    console.log('\n=== WALLET AUTH FLOW TEST COMPLETED SUCCESSFULLY ===\n');
    
  } catch (error) {
    console.error('\n=== WALLET AUTH FLOW TEST FAILED ===\n');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Execute the test
testWalletAuthFlow();
