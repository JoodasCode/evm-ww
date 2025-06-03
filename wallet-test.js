import { ethers } from 'ethers';
import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:5002/api';
const TEST_WALLET = ethers.Wallet.createRandom();

console.log('=== Wallet Whisperer Authentication Test ===');
console.log(`Test wallet address: ${TEST_WALLET.address}`);

async function runTest() {
  try {
    // Step 1: Get auth message
    console.log('\n1. Getting authentication message...');
    const msgResponse = await axios.get(`${API_URL}/auth/message/${TEST_WALLET.address}`);
    const message = msgResponse.data.data.message;
    console.log(`Message: ${message}`);
    
    // Step 2: Sign message
    console.log('\n2. Signing message with wallet...');
    const signature = await TEST_WALLET.signMessage(message);
    console.log(`Signature: ${signature.substring(0, 20)}...`);
    
    // Step 3: Authenticate
    console.log('\n3. Authenticating with Supabase...');
    const authResponse = await axios.post(`${API_URL}/auth/diag-wallet-auth`, {
      walletAddress: TEST_WALLET.address,
      signature,
      message
    });
    
    // Step 4: Show results
    console.log('\n4. Results:');
    console.log(`✅ Authentication successful: ${authResponse.data.success}`);
    console.log(`✅ Wallet profile ID: ${authResponse.data.data.walletProfile.id}`);
    console.log(`✅ Profile stored in Supabase`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.error || error.message);
    return false;
  }
}

runTest();
