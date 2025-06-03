// Debug script for wallet signature verification
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

// Create admin client with service key
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5002';

// Get wallet address from command line or use default
const walletAddress = process.argv[2] || '0xb1E918B9286C563Ed4816c0bE14Faa22F359A55B';
const normalizedAddress = walletAddress.toLowerCase();

console.log('=== WALLET SIGNATURE VERIFICATION DEBUG ===');
console.log('Target wallet address:', walletAddress);
console.log('Normalized address:', normalizedAddress);

async function debugSignatureVerification() {
  try {
    // Step 1: Check backend configuration
    console.log('\nStep 1: Checking backend configuration...');
    try {
      const configResponse = await axios.get('/api/debug/config');
      console.log('Backend configuration:', configResponse.data);
    } catch (configErr) {
      console.log('Could not fetch backend configuration, this is expected if the debug endpoint is not available');
    }
    
    // Step 2: Get authentication message from server
    console.log('\nStep 2: Getting auth message from server...');
    let message;
    try {
      const messageResponse = await axios.get(`/api/auth/message/${normalizedAddress}`);
      message = messageResponse.data.data.message;
      console.log('Auth message:', message);
      
      // Analyze the message format
      console.log('Message format analysis:');
      console.log('- Contains wallet address:', message.includes(normalizedAddress));
      console.log('- Contains timestamp:', message.includes('Timestamp:'));
      console.log('- Message length:', message.length);
    } catch (messageErr) {
      console.error('Error getting auth message:', messageErr.message);
      if (messageErr.response) {
        console.error('Response:', messageErr.response.data);
      }
      return;
    }
    
    // Step 3: Test different signature formats and verification methods
    console.log('\nStep 3: Testing different signature formats and verification methods...');
    
    // Create a test wallet for signing
    const testWallet = ethers.Wallet.createRandom();
    console.log('Test wallet address:', testWallet.address);
    
    // Sign the message with the test wallet
    const signature = await testWallet.signMessage(message);
    console.log('Signature:', signature);
    
    // Verify the signature using ethers.js
    console.log('\nVerifying signature with ethers.js:');
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log('Recovered address:', recoveredAddress);
      console.log('Matches test wallet:', recoveredAddress === testWallet.address);
      console.log('Matches test wallet (case-insensitive):', recoveredAddress.toLowerCase() === testWallet.address.toLowerCase());
    } catch (verifyErr) {
      console.error('Error verifying signature with ethers.js:', verifyErr);
    }
    
    // Step 4: Test backend signature verification with different formats
    console.log('\nStep 4: Testing backend signature verification with different formats...');
    
    // Test 1: Standard format
    console.log('\nTest 1: Standard format');
    try {
      const authResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: testWallet.address.toLowerCase(),
        signature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${testWallet.address.substring(0, 6)}`
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response success:', authResponse.data.success);
      
      if (authResponse.data.success) {
        console.log('✅ Standard format works');
      } else {
        console.log('❌ Standard format failed');
        console.log('Error:', authResponse.data.error);
      }
    } catch (authErr) {
      console.error('Error with standard format:', authErr.message);
      if (authErr.response) {
        console.error('Response status:', authErr.response.status);
        console.error('Response data:', authErr.response.data);
      }
    }
    
    // Test 2: Try with original case of wallet address
    console.log('\nTest 2: Original case of wallet address');
    try {
      const authResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: testWallet.address, // Original case
        signature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${testWallet.address.substring(0, 6)}`
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response success:', authResponse.data.success);
      
      if (authResponse.data.success) {
        console.log('✅ Original case works');
      } else {
        console.log('❌ Original case failed');
        console.log('Error:', authResponse.data.error);
      }
    } catch (authErr) {
      console.error('Error with original case:', authErr.message);
      if (authErr.response) {
        console.error('Response status:', authErr.response.status);
        console.error('Response data:', authErr.response.data);
      }
    }
    
    // Test 3: Try with personal message format
    console.log('\nTest 3: Personal message format (with Ethereum prefix)');
    // In Ethereum, some wallets prefix the message with "\x19Ethereum Signed Message:\n" + message.length
    const personalMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
    const personalSignature = await testWallet.signMessage(personalMessage);
    
    try {
      const authResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: testWallet.address.toLowerCase(),
        signature: personalSignature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${testWallet.address.substring(0, 6)}`
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response success:', authResponse.data.success);
      
      if (authResponse.data.success) {
        console.log('✅ Personal message format works');
      } else {
        console.log('❌ Personal message format failed');
        console.log('Error:', authResponse.data.error);
      }
    } catch (authErr) {
      console.error('Error with personal message format:', authErr.message);
      if (authErr.response) {
        console.error('Response status:', authErr.response.status);
        console.error('Response data:', authErr.response.data);
      }
    }
    
    // Step 5: Analyze backend code
    console.log('\nStep 5: Analyzing backend wallet verification code...');
    try {
      const backendCodeResponse = await axios.get('/api/debug/code?file=auth/walletAuth');
      console.log('Backend wallet verification code:', backendCodeResponse.data);
    } catch (codeErr) {
      console.log('Could not fetch backend code, this is expected if the debug endpoint is not available');
      console.log('Recommended verification method:');
      console.log(`
// Standard Ethereum signature verification in Node.js
const ethers = require('ethers');

function verifyWalletSignature(message, signature, expectedAddress) {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Compare with expected address (case-insensitive)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
      `);
    }
    
    // Step 6: Recommendations
    console.log('\n=== RECOMMENDATIONS ===');
    console.log('1. Ensure the backend is using ethers.verifyMessage() for signature verification');
    console.log('2. Make sure all wallet address comparisons are case-insensitive (toLowerCase())');
    console.log('3. Check if the message format matches what the wallet is actually signing');
    console.log('4. Verify that the signature is being passed correctly from frontend to backend');
    console.log('5. Add detailed logging in the backend for signature verification steps');
    
    console.log('\nSuggested backend code fix:');
    console.log(`
// In your wallet authentication endpoint
const ethers = require('ethers');

// Detailed logging for debugging
console.log('Received authentication request:', {
  walletAddress: req.body.walletAddress,
  signatureLength: req.body.signature?.length,
  messagePreview: req.body.message?.substring(0, 30) + '...',
});

// Normalize addresses for comparison
const normalizedWalletAddress = req.body.walletAddress.toLowerCase();

try {
  // Recover the address from the signature
  const recoveredAddress = ethers.verifyMessage(req.body.message, req.body.signature);
  const normalizedRecoveredAddress = recoveredAddress.toLowerCase();
  
  console.log('Signature verification details:', {
    providedAddress: normalizedWalletAddress,
    recoveredAddress: normalizedRecoveredAddress,
    matches: normalizedRecoveredAddress === normalizedWalletAddress
  });
  
  if (normalizedRecoveredAddress === normalizedWalletAddress) {
    // Signature verified successfully
    // Continue with wallet profile creation...
  } else {
    return res.status(403).json({
      success: false,
      error: 'Wallet ownership verification failed. Signature does not match the expected wallet address.'
    });
  }
} catch (error) {
  console.error('Signature verification error:', error);
  return res.status(403).json({
    success: false,
    error: 'Signature verification failed: ' + error.message
  });
}
    `);
  } catch (error) {
    console.error('\n=== DEBUG SCRIPT FAILED ===');
    console.error('Error:', error);
  }
}

// Run the debug
debugSignatureVerification().catch(console.error);
