/**
 * Redis Service
 * 
 * Handles caching with Redis and in-memory fallback
 */

import NodeCache from 'node-cache';
import config from '../config';

// In-memory cache as fallback when Redis is not available
const memoryCache = new NodeCache({
  stdTTL: config.cache.defaultTtl,
  checkperiod: 120,
  useClones: false
});

// Redis client placeholder - will be null if Redis is not available
let redisClient: any = null;

/**
 * Initialize Redis connection if available
 */
async function initializeRedis(): Promise<boolean> {
  try {
    if (!config.redis.url) {
      console.log('No Redis URL provided, using in-memory cache');
      return false;
    }

    // For now, we'll just use memory cache
    // In production, you would initialize actual Redis client here
    console.log('Redis configuration detected, but using in-memory cache for development');
    return false;
  } catch (error) {
    console.warn('Redis initialization failed, using in-memory cache:', error);
    return false;
  }
}

/**
 * Get data from cache
 */
export async function getCachedData(key: string): Promise<string | null> {
  try {
    // Try Redis first if available
    if (redisClient) {
      return await redisClient.get(key);
    }
    
    // Fallback to memory cache
    const value = memoryCache.get<string>(key);
    return value || null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

/**
 * Set data in cache
 */
export async function setCachedData(key: string, value: string, ttl?: number): Promise<boolean> {
  try {
    // Try Redis first if available
    if (redisClient) {
      if (ttl) {
        await redisClient.setex(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
      return true;
    }
    
    // Fallback to memory cache
    memoryCache.set(key, value, ttl || config.cache.defaultTtl);
    return true;
  } catch (error) {
    console.error('Error setting cached data:', error);
    return false;
  }
}

/**
 * Delete data from cache
 */
export async function deleteCachedData(key: string): Promise<boolean> {
  try {
    if (redisClient) {
      await redisClient.del(key);
      return true;
    }
    
    memoryCache.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting cached data:', error);
    return false;
  }
}

/**
 * Clear all cache data
 */
export async function clearAllCache(): Promise<boolean> {
  try {
    if (redisClient) {
      await redisClient.flushall();
    }
    
    memoryCache.flushAll();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): any {
  return {
    memoryCache: {
      keys: memoryCache.keys().length,
      hits: memoryCache.getStats().hits,
      misses: memoryCache.getStats().misses,
    },
    redisAvailable: !!redisClient
  };
}

// Initialize on module load
initializeRedis();