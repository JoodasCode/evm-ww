/**
 * Redis caching service for Wallet Whisperer
 *
 * This service handles caching using Redis for production and
 * falls back to in-memory caching for development.
 */
import { Redis } from 'ioredis';
import NodeCache from 'node-cache';

// Redis client instance
let redisClient: Redis | null = null;

// Simple in-memory cache fallback for development
const memoryCache = new NodeCache({ stdTTL: 600 }); // 10 minutes default

// Redis connection URL from environment variables
const REDIS_URL = process.env.REDIS_URL || '';

/**
 * Initialize Redis client
 * @returns Promise that resolves when Redis is connected
 */
async function initRedis(): Promise<void> {
  // Skip if already initialized or in development with no Redis URL
  if (redisClient || (!REDIS_URL && process.env.NODE_ENV === 'development')) {
    return;
  }

  try {
    // Create Redis client
    redisClient = new Redis(REDIS_URL);

    // Set up error handler
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
      redisClient = null;
    });

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
export async function getCachedData(key: string): Promise<string | null> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      const value = await redisClient.get(key);
      console.log(value ? `Redis cache hit for key: ${key}` : `Redis cache miss for key: ${key}`);
      return value;
    }

    // Fallback to memory cache
    const value = memoryCache.get<string>(key);
    console.log(value ? `Memory cache hit for key: ${key}` : `Memory cache miss for key: ${key}`);
    return value || null;
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
export async function setCachedData(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
  try {
    // Try to use Redis if available
    if (redisClient) {
      await redisClient.set(key, value, 'EX', ttlSeconds);
      console.log(`Redis cached key: ${key} with TTL: ${ttlSeconds}s`);
      return;
    }

    // Fallback to memory cache
    memoryCache.set(key, value, ttlSeconds);
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
      await redisClient.del(key);
      console.log(`Deleted key from Redis: ${key}`);
      return;
    }

    // Fallback to memory cache
    memoryCache.del(key);
    console.log(`Deleted key from memory cache: ${key}`);
  } catch (error) {
    console.error('Error deleting from cache:', error);
  }
}

/**
 * Initialize Redis on module load
 */
initRedis().catch(err => {
  console.error('Error initializing Redis:', err);
});

export { redisClient };