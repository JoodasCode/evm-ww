/**
 * Wallet Whisperer Backend
 * 
 * Main entry point for the backend services.
 */

import dotenv from 'dotenv';
import { getTokenBalances } from './lib/services/wallet/tokenBalanceService';
import { getWhispererScore, getOrCreateWhispererScore } from './lib/services/analytics/whispererScoreService';
import * as heliusClient from './lib/services/api/heliusClient';
import * as moralisClient from './lib/services/api/moralisClient';
import * as redisService from './lib/services/cache/redisService';

// Load environment variables
dotenv.config();

// Export all services for use in other applications
export {
  // Wallet services
  getTokenBalances,
  
  // Analytics services
  getWhispererScore,
  getOrCreateWhispererScore,
  
  // API clients
  heliusClient,
  moralisClient,
  
  // Cache services
  redisService
};

// Example usage
async function example() {
  try {
    // Example wallet address (Solana)
    const walletAddress = 'YOUR_WALLET_ADDRESS';
    
    // Get token balances
    console.log('Fetching token balances...');
    const tokens = await getTokenBalances(walletAddress);
    console.log(`Found ${tokens.length} tokens`);
    
    // Get Whisperer Score
    console.log('Fetching Whisperer Score...');
    const score = await getOrCreateWhispererScore(walletAddress);
    console.log('Whisperer Score:', score?.whisperer_score);
    
    // Clean up and exit
    process.exit(0);
  } catch (error) {
    console.error('Error in example:', error);
    process.exit(1);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  example();
}
