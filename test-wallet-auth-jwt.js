/**
 * Test script to verify wallet authentication flow with JWT token
 * 
 * This script tests the complete wallet authentication flow:
 * 1. Creates a test wallet
 * 2. Gets an authentication message
 * 3. Signs the message
 * 4. Authenticates with the backend
 * 5. Verifies the JWT token is returned
 * 6. Uses the JWT token to fetch the wallet profile
 */

import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Create Supabase clients
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// API base URL
const API_BASE_URL = 'http://localhost:3000';

// Create a test wallet
const wallet = ethers.Wallet.createRandom();
const walletAddress = wallet.address.toLowerCase();

console.log('🧪 Starting wallet authentication flow test with JWT token');
console.log('📝 Test wallet address:', walletAddress);

// Main test function
async function testWalletAuthFlow() {
  try {
    // Step 1: Clear any existing wallet profile for clean testing
    console.log('\n🧹 Clearing any existing wallet profile...');
    const { error: deleteError } = await supabaseService
      .from('wallet_profiles')
      .delete()
      .eq('wallet_address', walletAddress);
    
    if (deleteError) {
      console.warn('⚠️ Error clearing wallet profile:', deleteError);
    } else {
      console.log('✅ Existing wallet profile cleared (if any)');
    }

    // Step 2: Get authentication message
    console.log('\n🔑 Getting authentication message...');
    const messageResponse = await axios.get(`${API_BASE_URL}/api/auth/message/${walletAddress}`);
    const message = messageResponse.data.data.message;
    console.log('📝 Authentication message:', message);

    // Step 3: Sign the message
    console.log('\n✍️ Signing message...');
    const signature = await wallet.signMessage(message);
    console.log('📝 Signature:', signature.substring(0, 20) + '...');

    // Step 4: Authenticate with the backend
    console.log('\n🔐 Authenticating with backend...');
    const authResponse = await axios.post(`${API_BASE_URL}/api/auth/wallet-auth`, {
      walletAddress,
      signature,
      message,
      blockchainType: 'evm',
      displayName: `Test Wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`
    });

    console.log('✅ Authentication successful');
    console.log('📝 Wallet profile created:', authResponse.data.data.id);
    
    // Step 5: Verify JWT token is returned
    const jwtToken = authResponse.data.data.token;
    if (!jwtToken) {
      throw new Error('No JWT token returned from authentication');
    }
    console.log('🎟️ JWT token received:', jwtToken.substring(0, 20) + '...');

    // Step 6: Use JWT token to fetch wallet profile with anon key
    console.log('\n🔍 Fetching wallet profile with JWT token and anon key...');
    
    // Set the JWT token in the Supabase client
    const { error: sessionError } = await supabaseAnon.auth.setSession({
      access_token: jwtToken,
      refresh_token: ''
    });
    
    if (sessionError) {
      console.error('❌ Error setting session:', sessionError);
      throw sessionError;
    }
    
    // Fetch wallet profile
    const { data: walletProfile, error: fetchError } = await supabaseAnon
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching wallet profile with JWT token:', fetchError);
      throw fetchError;
    }
    
    console.log('✅ Successfully fetched wallet profile with JWT token:');
    console.log(walletProfile);
    
    // Step 7: Try to fetch wallet profile without JWT token
    console.log('\n🔍 Trying to fetch wallet profile without JWT token...');
    
    // Create a new Supabase client without session
    const freshAnonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: noAuthProfile, error: noAuthError } = await freshAnonClient
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (noAuthError) {
      console.log('✅ Expected error when fetching without JWT token:', noAuthError.message);
    } else {
      console.log('⚠️ Warning: Able to fetch wallet profile without JWT token. RLS policies may not be properly configured.');
      console.log(noAuthProfile);
    }
    
    console.log('\n🎉 Wallet authentication flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testWalletAuthFlow();
