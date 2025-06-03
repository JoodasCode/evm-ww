import { ethers } from 'ethers';
import axios from 'axios';

// Create a random wallet for testing
const wallet = ethers.Wallet.createRandom();
console.log('🔑 Test Wallet Address:', wallet.address);

// Function to test wallet authentication
async function testWalletAuth() {
  try {
    // Step 1: Get the authentication message
    console.log('\n📝 Step 1: Getting auth message...');
    const messageResponse = await axios.get(`http://localhost:5002/api/auth/message/${wallet.address}`);
    const { message } = messageResponse.data;
    console.log('Auth Message:', message);

    // Step 2: Sign the message with the wallet
    console.log('\n✍️ Step 2: Signing message...');
    const signature = await wallet.signMessage(message);
    console.log('Signature:', signature);

    // Step 3: Authenticate with the signature
    console.log('\n🔐 Step 3: Authenticating...');
    const authResponse = await axios.post('http://localhost:5002/api/auth/diag-wallet-auth', {
      walletAddress: wallet.address,
      signature,
      message
    });
    
    console.log('\n✅ Authentication Response:');
    console.log(JSON.stringify(authResponse.data, null, 2));
    
    // Step 4: Check wallet profile in Supabase
    console.log('\n🔍 Step 4: Checking wallet profile...');
    const profileResponse = await axios.get(`http://localhost:5002/api/auth/wallet-profile/${wallet.address}`);
    
    console.log('\n📊 Wallet Profile in Supabase:');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    
    // Step 5: Check activity logs
    console.log('\n📈 Step 5: Checking activity logs...');
    const logsResponse = await axios.get(`http://localhost:5002/api/auth/activity-logs/${wallet.address}`);
    
    console.log('\n📝 Activity Logs in Supabase:');
    console.log(JSON.stringify(logsResponse.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Error testing wallet authentication:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testWalletAuth().then(success => {
  if (success) {
    console.log('\n🎉 Wallet authentication test completed successfully!');
    console.log('Your wallet address is now stored in Supabase.');
  } else {
    console.log('\n❌ Wallet authentication test failed.');
  }
});
