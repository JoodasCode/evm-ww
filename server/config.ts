/**
 * Configuration for Wallet Whisperer backend services
 */

const config = {
  // Dune Analytics configuration
  dune: {
    apiKey: process.env.DUNE_API_KEY || '',
    apiUrl: 'https://api.dune.com/api/v1',
    workerProxyUrl: process.env.DUNE_WORKER_PROXY || ''
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  
  // Database configuration for Prisma
  database: {
    url: process.env.DATABASE_URL || ''
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
      psychoCard: 'psycho_card:',
      duneQuery: 'dune_query:',
      authToken: 'auth_token:',
      userSession: 'user_session:'
    }
  }
};

export default config;