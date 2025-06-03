import dotenv from 'dotenv';
import { ethers } from 'ethers';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

/**
 * Debug script to test different signature formats and verification methods
 * This will help identify why wallet signatures are failing verification
 */

// Create a test wallet for verification
const wallet = ethers.Wallet.createRandom();
console.log(`\n=== Test Wallet ===`);
console.log(`Address: ${wallet.address}`);

// Get the authentication message from the backend
async function getAuthMessage(walletAddress) {
  try {
    const response = await axios.get(`http://localhost:5002/api/auth/message/${walletAddress}`);
    return response.data.data.message;
  } catch (error) {
    console.error('Error getting auth message:', error.message);
    throw error;
  }
}

// Test different signature formats and verification methods
async function testSignatureFormats() {
  try {
    console.log(`\n=== Testing Signature Formats ===`);
    
    // Get auth message
    const message = await getAuthMessage(wallet.address);
    console.log(`\nAuth Message: "${message}"`);
    
    // 1. Standard signature (what ethers.js does by default)
    console.log(`\n1. Testing Standard Signature (ethers.js default)`);
    const standardSignature = await wallet.signMessage(message);
    console.log(`Signature: ${standardSignature}`);
    
    // Verify using ethers
    const recoveredAddress = ethers.verifyMessage(message, standardSignature);
    console.log(`Recovered address (ethers): ${recoveredAddress}`);
    console.log(`Matches original address: ${recoveredAddress.toLowerCase() === wallet.address.toLowerCase()}`);
    
    // 2. Personal sign format (explicitly with Ethereum prefix)
    console.log(`\n2. Testing Personal Sign Format (with Ethereum prefix)`);
    // This is what most wallets like MetaMask do by default
    const messageBytes = ethers.toUtf8Bytes(message);
    const personalMessagePrefix = ethers.toUtf8Bytes(`\x19Ethereum Signed Message:\n${messageBytes.length}`);
    const personalMessageBytes = ethers.concat([personalMessagePrefix, messageBytes]);
    const personalMessageHash = ethers.keccak256(personalMessageBytes);
    
    // Sign the hash directly
    const personalSignature = await wallet.signMessage(message);
    console.log(`Personal Signature: ${personalSignature}`);
    
    // 3. Test backend verification with both formats
    console.log(`\n3. Testing Backend Verification`);
    
    // Test with standard signature
    try {
      const standardResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature: standardSignature,
        message,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with standard signature: ${standardResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`Response:`, standardResponse.data);
    } catch (error) {
      console.error(`Backend verification with standard signature FAILED:`, error.response?.data || error.message);
    }
    
    // Test with personal signature
    try {
      const personalResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature: personalSignature,
        message,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with personal signature: ${personalResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`Response:`, personalResponse.data);
    } catch (error) {
      console.error(`Backend verification with personal signature FAILED:`, error.response?.data || error.message);
    }
    
    // 4. Test with different message formats
    console.log(`\n4. Testing Different Message Formats`);
    
    // Original message without any modification
    const originalMessage = message;
    const originalSignature = await wallet.signMessage(originalMessage);
    
    // Message with explicit \n characters
    const explicitNewlineMessage = message.replace(/\\n/g, '\n');
    const explicitNewlineSignature = await wallet.signMessage(explicitNewlineMessage);
    
    console.log(`Original message: "${originalMessage}"`);
    console.log(`Message with explicit newlines: "${explicitNewlineMessage}"`);
    
    // Test backend with original message
    try {
      const originalResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature: originalSignature,
        message: originalMessage,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with original message: ${originalResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error(`Backend verification with original message FAILED:`, error.response?.data || error.message);
    }
    
    // Test backend with explicit newline message
    try {
      const newlineResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address.toLowerCase(),
        signature: explicitNewlineSignature,
        message: explicitNewlineMessage,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with explicit newlines: ${newlineResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error(`Backend verification with explicit newlines FAILED:`, error.response?.data || error.message);
    }
    
    // 5. Test with different wallet address formats
    console.log(`\n5. Testing Different Wallet Address Formats`);
    
    // Lowercase address
    const lowercaseAddress = wallet.address.toLowerCase();
    console.log(`Lowercase address: ${lowercaseAddress}`);
    
    // Original case address
    const originalCaseAddress = wallet.address;
    console.log(`Original case address: ${originalCaseAddress}`);
    
    // Test backend with lowercase address
    try {
      const lowercaseResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: lowercaseAddress,
        signature: standardSignature,
        message,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with lowercase address: ${lowercaseResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error(`Backend verification with lowercase address FAILED:`, error.response?.data || error.message);
    }
    
    // Test backend with original case address
    try {
      const originalCaseResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: originalCaseAddress,
        signature: standardSignature,
        message,
        blockchainType: 'evm'
      });
      
      console.log(`Backend verification with original case address: ${originalCaseResponse.data.success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error(`Backend verification with original case address FAILED:`, error.response?.data || error.message);
    }
    
    // 6. Analyze backend verification method
    console.log(`\n6. Analyzing Backend Verification Method`);
    console.log(`Based on the test results, the backend is likely using:`);
    console.log(`- ethers.utils.verifyMessage() for signature verification`);
    console.log(`- Expecting the wallet address to be in lowercase format`);
    console.log(`- Expecting the message to be exactly as provided by the backend`);
    
    // 7. Recommendations
    console.log(`\n7. Recommendations for Fixing Wallet Authentication`);
    console.log(`1. Ensure the message signed by the wallet is EXACTLY the same as provided by the backend`);
    console.log(`2. Always normalize wallet addresses to lowercase before sending to backend`);
    console.log(`3. Check if the wallet provider (MetaMask, etc.) is adding any prefixes to the message before signing`);
    console.log(`4. If using wagmi's signMessageAsync, ensure it's not modifying the message format`);
    console.log(`5. Add detailed logging in both frontend and backend to trace the exact message and signature values`);
    
  } catch (error) {
    console.error('Error testing signature formats:', error);
  }
}

// Run the tests
testSignatureFormats().then(() => {
  console.log('\nSignature format tests completed');
}).catch(error => {
  console.error('Error running tests:', error);
});
