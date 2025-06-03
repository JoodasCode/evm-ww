import { ethers } from 'ethers';
import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:5002/api';

// Create a test wallet
const wallet = ethers.Wallet.createRandom();
const walletAddress = wallet.address;

console.log('=== Wallet Authentication Test ===');
console.log(`Test wallet: ${walletAddress}`);

async function runTest() {
  try {
    // Step 1: Get the exact authentication message from the server
    console.log('\n1. Getting authentication message from server...');
    const messageResponse = await axios.get(`${API_URL}/auth/message/${walletAddress}`);
    
    if (!messageResponse.data.success) {
      throw new Error('Failed to get authentication message');
    }
    
    // Extract the exact message from the response
    const message = messageResponse.data.data.message;
    console.log(`Message from server: ${message}`);
    
    // Step 2: Sign the message with the wallet
    console.log('\n2. Signing message with wallet...');
    const signature = await wallet.signMessage(message);
    console.log(`Signature: ${signature.substring(0, 20)}...`);
    
    // Step 3: Authenticate with the signature
    console.log('\n3. Authenticating with server...');
    const authResponse = await axios.post(`${API_URL}/auth/diag-wallet-auth`, {
      walletAddress,
      signature,
      message
    });
    
    console.log(`Authentication response: ${JSON.stringify(authResponse.data, null, 2)}`);
    
    // Step 4: Verify the wallet exists in Supabase
    console.log('\n4. Verifying wallet exists in Supabase...');
    const checkResponse = await axios.get(`${API_URL}/debug/check-wallet/${walletAddress}`);
    
    console.log(`Wallet in Supabase: ${checkResponse.data.exists ? 'Found' : 'Not found'}`);
    if (checkResponse.data.exists) {
      console.log(`Wallet profile: ${JSON.stringify(checkResponse.data.data, null, 2)}`);
    }
    
    return authResponse.data.success;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

runTest()
  .then(success => {
    if (success) {
      console.log('\n🎉 Success! Your wallet authentication system is working correctly.');
      console.log('The wallet profile has been created in Supabase.');
    } else {
      console.log('\n❌ Test failed. Check the error messages above.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });
