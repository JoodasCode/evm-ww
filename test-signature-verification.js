// Script to test signature verification
import axios from 'axios';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5002';

async function testSignatureVerification() {
  try {
    console.log('=== SIGNATURE VERIFICATION TEST ===');
    
    // Create a wallet for testing
    const wallet = ethers.Wallet.createRandom();
    console.log('Test wallet address:', wallet.address);
    console.log('Normalized address:', wallet.address.toLowerCase());
    
    // Step 1: Get authentication message from server
    console.log('\nStep 1: Getting auth message from server...');
    const messageResponse = await axios.get(`/api/auth/message/${wallet.address}`);
    const message = messageResponse.data.data.message;
    console.log('Auth message:', message);
    
    // Step 2: Sign the message with the SAME wallet
    console.log('\nStep 2: Signing message with the SAME wallet...');
    const signature = await wallet.signMessage(message);
    console.log('Signature:', signature);
    
    // Step 3: Call the wallet-auth endpoint
    console.log('\nStep 3: Calling wallet-auth endpoint with correct signature...');
    try {
      const authResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${wallet.address.substring(0, 6)}`
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
      
      if (authResponse.data.success) {
        console.log('✅ Signature verification PASSED with same wallet');
      } else {
        console.log('❌ Signature verification FAILED with same wallet');
      }
    } catch (authErr) {
      console.error('❌ Error calling wallet-auth endpoint:', authErr.message);
      if (authErr.response) {
        console.error('Response status:', authErr.response.status);
        console.error('Response data:', JSON.stringify(authErr.response.data, null, 2));
      }
    }
    
    // Step 4: Test with mismatched wallet and signature
    console.log('\nStep 4: Testing with DIFFERENT wallet address but same signature...');
    const differentWallet = ethers.Wallet.createRandom();
    console.log('Different wallet address:', differentWallet.address);
    
    try {
      const mismatchResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: differentWallet.address.toLowerCase(), // Different wallet
        signature, // Signature from original wallet
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${differentWallet.address.substring(0, 6)}`
      });
      
      console.log('Mismatch response status:', mismatchResponse.status);
      console.log('Mismatch response data:', JSON.stringify(mismatchResponse.data, null, 2));
      
      console.log('❌ SECURITY ISSUE: Signature verification passed with mismatched wallet!');
    } catch (mismatchErr) {
      console.log('✅ Signature verification correctly FAILED with mismatched wallet');
      if (mismatchErr.response) {
        console.log('Response status:', mismatchErr.response.status);
        console.log('Response data:', JSON.stringify(mismatchErr.response.data, null, 2));
      }
    }
    
    // Step 5: Test with real wallet but invalid signature
    console.log('\nStep 5: Testing with real wallet but INVALID signature...');
    const invalidSignature = '0x' + '1'.repeat(130); // Create an invalid signature
    
    try {
      const invalidResponse = await axios.post('/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature: invalidSignature,
        message,
        blockchainType: 'evm',
        displayName: `Test Wallet ${wallet.address.substring(0, 6)}`
      });
      
      console.log('Invalid signature response status:', invalidResponse.status);
      console.log('Invalid signature response data:', JSON.stringify(invalidResponse.data, null, 2));
      
      console.log('❌ SECURITY ISSUE: Invalid signature was accepted!');
    } catch (invalidErr) {
      console.log('✅ Invalid signature correctly REJECTED');
      if (invalidErr.response) {
        console.log('Response status:', invalidErr.response.status);
        console.log('Response data:', JSON.stringify(invalidErr.response.data, null, 2));
      }
    }
    
    console.log('\n=== SIGNATURE VERIFICATION TEST COMPLETED ===');
  } catch (error) {
    console.error('\n=== SIGNATURE VERIFICATION TEST FAILED ===');
    console.error('Error:', error);
  }
}

// Run the test
testSignatureVerification().catch(console.error);
