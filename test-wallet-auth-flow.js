// Test script for wallet authentication flow
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

// Supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SERVER_URL = 'http://localhost:5002';
const WALLET_ADDRESS = '0xb8a9fb148c43550ea62c427044d63f53e906a63d';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${SUPABASE_URL}`);
console.log(`Using Supabase Service Key (first 10 chars): ${SUPABASE_SERVICE_KEY.substring(0, 10)}...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create a random wallet for testing
const wallet = ethers.Wallet.createRandom();
console.log(`Test wallet address: ${wallet.address}`);

// Test the entire wallet authentication flow
async function testWalletAuthFlow() {
  try {
    console.log('=== TESTING WALLET AUTHENTICATION FLOW ===');
    
    // Step 1: Clear any existing wallet profile for clean testing
    console.log('\n1. Clearing existing wallet profile...');
    await clearWalletProfile(wallet.address);
    
    // Step 2: Get authentication message from server
    console.log('\n2. Getting authentication message from server...');
    const message = await getAuthMessage(wallet.address);
    console.log(`Authentication message: ${message}`);
    
    // Step 3: Sign the message with the wallet
    console.log(`Signing message with wallet: ${wallet.address}...`);
    const signature = await wallet.signMessage(message);
    console.log(`Signature: ${signature.substring(0, 20)}...`);
    
    // Step 4: Send the signature to the server for verification
    console.log('Sending signature to server for verification...');
    const authResult = await walletAuth(wallet.address, signature, message);
    console.log('Authentication result:', authResult);
    
    // Step 5: Verify wallet profile was created in Supabase
    console.log('\n5. Verifying wallet profile in database...');
    const walletProfile = await getWalletProfile(wallet.address);
    console.log('Wallet profile in database:', walletProfile);
    
    console.log('\n=== TEST COMPLETED ===');
    if (walletProfile) {
      console.log('✅ SUCCESS: Wallet profile was created successfully!');
    } else {
      console.log('❌ FAILURE: Wallet profile was not created.');
    }
    
  } catch (error) {
    console.error('Error testing wallet auth flow:', error);
  }
}

// Helper functions
async function clearWalletProfile(address) {
  const normalizedAddress = address.toLowerCase();
  const { error } = await supabase
    .from('wallet_profiles')
    .delete()
    .eq('wallet_address', normalizedAddress);
  
  if (error) {
    console.error('Error clearing wallet profile:', error);
  } else {
    console.log(`Cleared wallet profile for ${normalizedAddress}`);
  }
}

async function getAuthMessage(address) {
  try {
    const response = await axios.get(`${SERVER_URL}/api/auth/message/${address}`);
    return response.data.data.message;
  } catch (error) {
    console.error('Error getting auth message:', error);
    throw error;
  }
}

async function walletAuth(address, signature, message) {
  try {
    const normalizedAddress = address.toLowerCase();
    const displayName = `Wallet ${normalizedAddress.substring(0, 4)}...${normalizedAddress.substring(normalizedAddress.length - 4)}`;
    
    const payload = {
      walletAddress: normalizedAddress,
      signature,
      message,
      blockchainType: 'evm',
      displayName
    };
    
    const response = await axios.post(`${SERVER_URL}/api/auth/wallet-auth`, payload);
    return response.data;
  } catch (error) {
    console.error('Error in wallet auth:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
}

async function getWalletProfile(address) {
  const normalizedAddress = address.toLowerCase();
  const { data, error } = await supabase
    .from('wallet_profiles')
    .select('*')
    .eq('wallet_address', normalizedAddress)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`No wallet profile found for ${normalizedAddress}`);
      return null;
    }
    console.error('Error getting wallet profile:', error);
    return null;
  }
  
  return data;
}

// Run the test
testWalletAuthFlow();
