/**
 * Redis caching service for Wallet Whisperer
 *
 * This service handles caching using Redis for production and
 * falls back to in-memory caching for development.
 */
import { createClient, RedisClientType } from 'redis';

// Redis client instance
let redisClient: RedisClientType | null = null;

// Simple in-memory cache fallback for development
const memoryCache: Record<string, { value: string; expiry: number }> = {};

// Redis connection URL from environment variables
const REDIS_URL = process.env.REDIS_URL || '';

/**
 * Initialize Redis client
 * @returns Promise that resolves when Redis is connected
 */
async function initRedis(): Promise<void> {
  // Skip if already initialized or in development with no Redis URL
  if (redisClient || (process.env.NODE_ENV === 'development' && !REDIS_URL)) {
    return;
  }

  try {
    // Create Redis client
    redisClient = createClient({
      url: REDIS_URL,
    });

    // Set up error handler
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
      redisClient = null;
    });

    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    redisClient = null;
  }
}

/**
 * Gets a value from the cache
 * @param key - Cache key
 * @returns Promise containing the cached value or null if not found/expired
 */
export async function get(key: string): Promise<string | null> {
  return getCachedData(key);
}

/**
 * Gets a value from the cache (alias for get)
 * @param key - Cache key
 * @returns Promise containing the cached value or null if not found/expired
 */
export async function getCachedData(key: string): Promise<string | null> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      // Initialize Redis if not already done
      if (!redisClient.isOpen) {
        await initRedis();
      }

      // Get value from Redis
      const value = await redisClient.get(key);
      console.log(value ? `Redis cache hit for key: ${key}` : `Redis cache miss for key: ${key}`);
      return value;
    }

    // Fallback to memory cache
    const cached = memoryCache[key];
    if (cached && cached.expiry > Date.now()) {
      console.log(`Memory cache hit for key: ${key}`);
      return cached.value;
    }

    // Key doesn't exist or is expired
    console.log(`Memory cache miss for key: ${key}`);

    // Clean up expired key if needed
    if (cached) {
      delete memoryCache[key];
    }

    return null;
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
}

/**
 * Sets a value in the cache with optional TTL
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttlSeconds - Time to live in seconds (default: 3600 = 1 hour)
 * @returns Promise that resolves when the value is cached
 */
export async function set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
  return setCachedData(key, value, ttlSeconds);
}

/**
 * Sets a value in the cache with optional TTL (alias for set)
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttlSeconds - Time to live in seconds (default: 3600 = 1 hour)
 * @returns Promise that resolves when the value is cached
 */
export async function setCachedData(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      // Initialize Redis if not already done
      if (!redisClient.isOpen) {
        await initRedis();
      }

      // Set value in Redis with TTL
      await redisClient.set(key, value, { EX: ttlSeconds });
      console.log(`Redis cached key: ${key} with TTL: ${ttlSeconds}s`);
      return;
    }

    // Fallback to memory cache
    const expiry = Date.now() + (ttlSeconds * 1000);
    memoryCache[key] = { value, expiry };
    console.log(`Memory cached key: ${key} with TTL: ${ttlSeconds}s`);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

/**
 * Removes a value from the cache
 * @param key - Cache key
 * @returns Promise that resolves when the value is removed
 */
export async function del(key: string): Promise<void> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      // Initialize Redis if not already done
      if (!redisClient.isOpen) {
        await initRedis();
      }

      // Delete key from Redis
      await redisClient.del(key);
      console.log(`Deleted key from Redis: ${key}`);
      return;
    }

    // Fallback to memory cache
    delete memoryCache[key];
    console.log(`Deleted key from memory cache: ${key}`);
  } catch (error) {
    console.error('Error deleting from cache:', error);
  }
}

/**
 * Clears all cache entries with keys matching the prefix
 * @param prefix - Prefix to match
 * @returns Promise that resolves when the operation is complete
 */
export async function clearByPrefix(prefix: string): Promise<void> {
  try {
    if (redisClient) {
      // Initialize Redis if not already done
      if (!redisClient.isOpen) {
        await initRedis();
      }

      // Get all keys matching the prefix
      const keys = await redisClient.keys(`${prefix}*`);

      // Delete all matching keys
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cleared ${keys.length} keys with prefix '${prefix}' from Redis`);
      }
    } else {
      // For memory cache, filter keys by prefix
      const keysToDelete = Object.keys(memoryCache).filter((key) => key.startsWith(prefix));
      keysToDelete.forEach((key) => delete memoryCache[key]);
      console.log(`Cleared ${keysToDelete.length} keys with prefix '${prefix}' from memory cache`);
    }
  } catch (error) {
    console.error(`Error clearing cache by prefix ${prefix}:`, error);
  }
}

/**
 * Cleans up expired cache entries
 * @returns Promise that resolves when the cleanup is complete
 */
export async function cleanupExpired(): Promise<void> {
  try {
    if (redisClient) {
      // Redis handles TTL automatically, no need to manually clean up
      console.log('Redis handles TTL automatically, no manual cleanup needed');
    } else {
      // For memory cache, remove expired entries
      const now = Date.now();
      let count = 0;

      Object.keys(memoryCache).forEach((key) => {
        if (memoryCache[key].expiry < now) {
          delete memoryCache[key];
          count++;
        }
      });

      console.log(`Cleaned up ${count} expired cache entries`);
    }
  } catch (error) {
    console.error('Error cleaning up expired cache entries:', error);
  }
}

/**
 * Clears all values from the cache
 * @returns Promise that resolves when the cache is cleared
 */
export async function flushAll(): Promise<void> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      // Initialize Redis if not already done
      if (!redisClient.isOpen) {
        await initRedis();
      }

      // Flush Redis
      await redisClient.flushAll();
      console.log('Redis cache flushed');
    }

    // Fallback to memory cache
    Object.keys(memoryCache).forEach((key) => {
      delete memoryCache[key];
    });
    console.log('Cache flushed');
  } catch (error) {
    console.error('Error flushing cache:', error);
  }
}

/**
 * Gets the Redis client instance
 * @returns The Redis client instance or null if not connected
 */
export function getRedisClient(): RedisClientType | null {
  // Initialize Redis if not already done
  if (redisClient && !redisClient.isOpen) {
    initRedis().catch(err => {
      console.error('Error initializing Redis:', err);
    });
  }
  
  return redisClient;
}
