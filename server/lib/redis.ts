import { Redis } from '@upstash/redis';

// Initialize Redis client with fallback
let redis: Redis;

try {
  // Only initialize if we have valid environment variables
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_URL.startsWith('https://')) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN || ''
    });
    console.log('Redis client initialized successfully');
  } else {
    console.warn('Missing or invalid Redis URL. Using mock Redis client.');
    // Create a mock Redis client for development/testing
    redis = createMockRedisClient();
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
  // Fallback to mock Redis client
  redis = createMockRedisClient();
}

/**
 * Creates a mock Redis client that implements the basic methods
 * used in this application but doesn't actually connect to Redis.
 * This is used as a fallback when Redis is not available.
 */
function createMockRedisClient(): any {
  return {
    get: async () => null,
    set: async () => true,
    del: async () => true,
    // Add other Redis methods as needed
  };
}

/**
 * Get cached card data for a specific wallet and card type
 */
export async function getCachedCardData(wallet: string, cardType: string) {
  const key = `card:${wallet}:${cardType}`;
  
  try {
    const data = await redis.get(key);
    if (data) {
      try {
        return JSON.parse(data as string);
      } catch (error) {
        console.error("Cache corruption detected:", error);
        // Continue to recalculation
      }
    }
    return null;
  } catch (error) {
    console.error("Redis error:", error);
    return null; // Fallback to direct calculation
  }
}

/**
 * Cache card data for a specific wallet and card type
 */
export async function cacheCardData(wallet: string, cardType: string, data: any, ttl: number = 86400) {
  const key = `card:${wallet}:${cardType}`;
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttl }); // Default TTL: 24h
    return true;
  } catch (error) {
    console.error("Redis caching error:", error);
    return false;
  }
}

/**
 * Cache Dune query results
 */
export async function cacheDuneData(queryId: string, params: Record<string, any>, data: any, ttl: number = 3600) {
  // Create a deterministic key from the query ID and parameters
  const paramString = JSON.stringify(params);
  const key = `dune:${queryId}:${Buffer.from(paramString).toString('base64')}`;
  
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttl }); // Default TTL: 1h
    return true;
  } catch (error) {
    console.error("Redis caching error for Dune data:", error);
    return false;
  }
}

/**
 * Get cached Dune query results
 */
export async function getCachedDuneData(queryId: string, params: Record<string, any>) {
  const paramString = JSON.stringify(params);
  const key = `dune:${queryId}:${Buffer.from(paramString).toString('base64')}`;
  
  try {
    const data = await redis.get(key);
    if (data) {
      try {
        return JSON.parse(data as string);
      } catch (error) {
        console.error("Cache corruption detected for Dune data:", error);
        // Continue to fresh fetch
      }
    }
    return null;
  } catch (error) {
    console.error("Redis error for Dune data:", error);
    return null; // Fallback to direct fetch
  }
}

export default redis;
