/**
 * Test script for Wallet Whisperer authentication endpoints
 * 
 * This script tests both the test-wallet-profile endpoint (which bypasses signature verification)
 * and the diag-wallet-auth endpoint (which includes full diagnostic logging)
 */

import fetch from 'node-fetch';

// Configuration
const API_BASE_URL = 'http://localhost:5002/api/auth';
const TEST_WALLET_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const TEST_SIGNATURE = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
const TEST_MESSAGE = 'Sign this message to verify wallet ownership: 0x1234567890abcdef1234567890abcdef12345678 - Timestamp: 2025-06-02T23:45:00Z';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Test the test-wallet-profile endpoint
 */
async function testWalletProfileEndpoint() {
  console.log(`${colors.bright}${colors.blue}Testing /test-wallet-profile endpoint...${colors.reset}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/test-wallet-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        wallet_address: TEST_WALLET_ADDRESS
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ Test wallet profile endpoint successful!${colors.reset}`);
      console.log(`${colors.dim}Response:${colors.reset}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`${colors.red}❌ Test wallet profile endpoint failed!${colors.reset}`);
      console.log(`${colors.dim}Error:${colors.reset}`, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error calling test wallet profile endpoint:${colors.reset}`, error.message);
  }
  
  console.log('\n');
}

/**
 * Test the diag-wallet-auth endpoint
 */
async function testDiagWalletAuthEndpoint() {
  console.log(`${colors.bright}${colors.blue}Testing /diag-wallet-auth endpoint...${colors.reset}`);
  console.log(`${colors.yellow}Note: This test will likely fail signature verification unless you use a real wallet signature.${colors.reset}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/diag-wallet-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: TEST_WALLET_ADDRESS,
        signature: TEST_SIGNATURE,
        message: TEST_MESSAGE,
        blockchainType: 'evm'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ Diagnostic wallet auth endpoint successful!${colors.reset}`);
      console.log(`${colors.dim}Response:${colors.reset}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`${colors.yellow}⚠️ Diagnostic wallet auth endpoint failed as expected (invalid signature).${colors.reset}`);
      console.log(`${colors.dim}Error:${colors.reset}`, JSON.stringify(data, null, 2));
      console.log(`${colors.cyan}This is expected with a fake signature. Check server logs for diagnostic output.${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error calling diagnostic wallet auth endpoint:${colors.reset}`, error.message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`${colors.bright}${colors.magenta}=== Wallet Whisperer Endpoint Tests ===${colors.reset}\n`);
  
  // Test the test-wallet-profile endpoint
  await testWalletProfileEndpoint();
  
  // Test the diag-wallet-auth endpoint
  await testDiagWalletAuthEndpoint();
  
  console.log(`${colors.bright}${colors.magenta}=== Tests Complete ===${colors.reset}`);
  console.log(`${colors.cyan}Check server logs for detailed diagnostic information.${colors.reset}`);
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
});
