/**
 * Configuration for Wallet Whisperer backend services
 */

const config = {
  // Helius API configuration
  helius: {
    apiKey: process.env.HELIUS_API_KEY || '',
    apiUrl: 'https://api.helius.xyz/v0'
  },
  
  // Moralis API configuration
  moralis: {
    apiKey: process.env.MORALIS_API_KEY || '',
    apiUrl: 'https://solana-gateway.moralis.io'
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || ''
  },
  
  // Cache configuration
  cache: {
    // Default TTL in seconds
    defaultTtl: 600, // 10 minutes
    
    // Prefix for cache keys
    prefix: {
      tokenBalance: 'token_balance:',
      whispererScore: 'whisperer_score:',
      tradingActivity: 'trading_activity:',
      psychometric: 'psychometric:'
    }
  }
};

export default config;