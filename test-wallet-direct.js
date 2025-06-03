import { ethers } from 'ethers';
import axios from 'axios';

// Create a test wallet
const wallet = ethers.Wallet.createRandom();
const walletAddress = wallet.address;

console.log('=== Wallet Authentication Direct Test ===');
console.log(`Test wallet: ${walletAddress}`);

async function runTest() {
  try {
    // Step 1: Force insert the wallet directly with our debug endpoint
    console.log('\n1. Directly inserting wallet to Supabase...');
    const insertResponse = await axios.post('http://localhost:5002/api/debug/force-insert', {
      walletAddress
    });
    
    if (!insertResponse.data.success) {
      throw new Error('Failed to insert wallet directly');
    }
    
    console.log(`✅ Wallet directly inserted to Supabase with ID: ${insertResponse.data.data.directInsert.id}`);
    
    // Step 2: Verify the wallet exists in Supabase
    console.log('\n2. Verifying wallet exists in Supabase...');
    const checkResponse = await axios.get(`http://localhost:5002/api/debug/check-wallet/${walletAddress}`);
    
    if (!checkResponse.data.exists) {
      throw new Error('Wallet not found in Supabase after direct insertion');
    }
    
    console.log('✅ Wallet verified in Supabase database');
    console.log(`Wallet profile: ${JSON.stringify(checkResponse.data.data, null, 2)}`);
    
    // Step 3: Try the regular auth flow
    console.log('\n3. Testing regular authentication flow...');
    // Get auth message
    const messageResponse = await axios.get(`http://localhost:5002/api/auth/message/${walletAddress}`);
    const message = messageResponse.data.data.message;
    console.log(`Auth message: ${message}`);
    
    // Sign message
    const signature = await wallet.signMessage(message);
    console.log(`Signature: ${signature.substring(0, 20)}...`);
    
    // Authenticate
    const authResponse = await axios.post('http://localhost:5002/api/auth/diag-wallet-auth', {
      walletAddress,
      signature,
      message
    });
    
    console.log(`✅ Authentication response: ${authResponse.data.success ? 'Success' : 'Failed'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

runTest()
  .then(success => {
    if (success) {
      console.log('\n🎉 All tests passed! Your Supabase integration is working correctly.');
    } else {
      console.log('\n❌ Test failed. Check the error messages above.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });
