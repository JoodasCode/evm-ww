// Test script to verify the wallet authentication flow from the client side
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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Anon Key (first 10 chars): ${supabaseAnonKey.substring(0, 10)}...`);

// Create Supabase client with anon key (client-side equivalent)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a test wallet
const wallet = ethers.Wallet.createRandom();
console.log(`Created test wallet with address: ${wallet.address}`);

// Function to clear existing wallet profile
async function clearWalletProfile(walletAddress) {
  console.log(`Clearing wallet profile for address: ${walletAddress}`);
  try {
    const { data, error } = await supabase
      .from('wallet_profiles')
      .delete()
      .eq('wallet_address', walletAddress.toLowerCase())
      .select();
    
    if (error) {
      console.error('Error clearing wallet profile:', error);
    } else {
      console.log('Wallet profile cleared successfully:', data);
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

// Function to get wallet profile directly from Supabase
async function getWalletProfile(walletAddress) {
  console.log(`Getting wallet profile for address: ${walletAddress}`);
  try {
    const { data, error } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();
    
    if (error) {
      console.error('Error getting wallet profile:', error);
      return null;
    } else {
      console.log('Wallet profile retrieved successfully');
      return data;
    }
  } catch (error) {
    console.error('Exception getting wallet profile:', error);
    return null;
  }
}

// Main function to test wallet authentication flow
async function testWalletAuthFlow() {
  try {
    console.log('=== TESTING WALLET AUTHENTICATION FLOW ===');
    
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
    
    // Get the wallet profile from Supabase
    const walletProfile = await getWalletProfile(wallet.address);
    console.log('Wallet profile in database:', walletProfile);
    
    // Verify wallet profile exists and is correct
    if (walletProfile) {
      console.log('✅ TEST PASSED: Wallet profile created successfully');
      console.log(`Wallet address: ${walletProfile.wallet_address}`);
      console.log(`Display name: ${walletProfile.display_name}`);
      console.log(`Verified: ${walletProfile.is_verified}`);
    } else {
      console.log('❌ TEST FAILED: Wallet profile not created');
    }
  } catch (error) {
    console.error('Error testing wallet auth flow:', error);
  }
}

// Run the test
testWalletAuthFlow();
