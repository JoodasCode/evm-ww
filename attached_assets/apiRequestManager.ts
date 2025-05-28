/**
 * API Request Manager
 * 
 * Manages API requests between Helius and Moralis with intelligent routing and fallbacks.
 * Implements the optimized Solana wallet stack:
 * - Use Helius for base tx pull (getSignaturesForAddress, getParsedTransaction)
 * - Use Moralis for token trade enrichment (swap events, USD value, token metadata)
 * - Use CoinGecko as fallback price oracle for historical token prices in PnL calculations
 * - Cache Moralis enriched trades to avoid calling both APIs every time
 * - Prioritizes Redis caching to minimize API calls
 */

'use strict';

import axios, { AxiosResponse, AxiosError } from 'axios';
import NodeCache from 'node-cache';
import config from '../../config';
import * as redisService from '../cache/redisService';

// API Provider enum
export enum ApiProvider {
  HELIUS = 'helius',
  MORALIS = 'moralis',
  COINGECKO = 'coingecko'
}

// Request type enum - optimized for Solana wallet setup (NFT tracking removed)
export enum RequestType {
  TRANSACTIONS = 'transactions',
  TOKEN_METADATA = 'token_metadata',
  TOKEN_PRICE = 'token_price',
  ACCOUNT_DATA = 'account_data'
}

// Cache configuration - optimized for Solana wallet data with longer TTLs
const CACHE_CONFIG = {
  stdTTL: 60 * 60, // 60 minutes (increased from 30)
  checkperiod: 120, // Check for expired entries every 2 minutes
  maxKeys: 5000 // Increased to accommodate more wallet data
};

// In-memory cache for when Redis is unavailable
const localCache = new NodeCache(CACHE_CONFIG);

// Redis connection check interval (5 minutes)
const REDIS_CHECK_INTERVAL = 5 * 60 * 1000;
let lastRedisCheck = 0;
let redisAvailable = false;

// API metrics interface
interface ApiMetrics {
  requests: Record<ApiProvider, number>;
  errors: Record<ApiProvider, number>;
  cacheHits: number;
  cacheMisses: number;
  fallbacks: number;
  cacheStats?: {
    hitRate: number;
  };
  timestamp?: string;
}

// Provider routing configuration interface
interface ProviderRouting {
  primary: ApiProvider;
  fallback: ApiProvider | null;
  cacheTTL: number;
}

// API rate limit configuration interface
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  backoffFactor: number;
  maxBackoff: number;
}

// API rate limits
const RATE_LIMITS: Record<ApiProvider, RateLimitConfig> = {
  [ApiProvider.HELIUS]: {
    maxRequests: 10,
    windowMs: 1000, // 1 second
    backoffFactor: 1.5,
    maxBackoff: 10000 // 10 seconds
  },
  [ApiProvider.MORALIS]: {
    maxRequests: 5,
    windowMs: 1000,
    backoffFactor: 2,
    maxBackoff: 15000 // 15 seconds
  },
  [ApiProvider.COINGECKO]: {
    maxRequests: 10,
    windowMs: 60000, // 1 minute (more strict rate limiting)
    backoffFactor: 2.5,
    maxBackoff: 30000 // 30 seconds
  }
};

// Request timestamps for rate limiting
const requestTimestamps: Record<ApiProvider, number[]> = {
  [ApiProvider.HELIUS]: [],
  [ApiProvider.MORALIS]: [],
  [ApiProvider.COINGECKO]: []
};

// API usage metrics
const apiMetrics: ApiMetrics = {
  requests: {
    [ApiProvider.HELIUS]: 0,
    [ApiProvider.MORALIS]: 0,
    [ApiProvider.COINGECKO]: 0
  },
  errors: {
    [ApiProvider.HELIUS]: 0,
    [ApiProvider.MORALIS]: 0,
    [ApiProvider.COINGECKO]: 0
  },
  cacheHits: 0,
  cacheMisses: 0,
  fallbacks: 0
};

// Provider routing rules based on request type - optimized for Solana wallet setup
const PROVIDER_ROUTING: Record<RequestType, ProviderRouting> = {
  [RequestType.TRANSACTIONS]: {
    primary: ApiProvider.HELIUS,
    fallback: null, // No fallback for transactions
    cacheTTL: 3600 // 1 hour cache for transactions
  },
  [RequestType.TOKEN_METADATA]: {
    primary: ApiProvider.MORALIS,
    fallback: ApiProvider.HELIUS,
    cacheTTL: 86400 // 24 hour cache for token metadata
  },
  [RequestType.TOKEN_PRICE]: {
    primary: ApiProvider.MORALIS,
    fallback: ApiProvider.COINGECKO,
    cacheTTL: 300 // 5 minute cache for token prices
  },
  [RequestType.ACCOUNT_DATA]: {
    primary: ApiProvider.HELIUS,
    fallback: null,
    cacheTTL: 1800 // 30 minute cache for account data
  }
};

/**
 * Check Redis connection status to determine caching strategy
 * @returns {Promise<boolean>} Whether Redis is available
 */
async function checkRedisConnection(): Promise<boolean> {
  try {
    lastRedisCheck = Date.now();
    
    // Check if Redis client is available
    const redisClient = redisService.getRedisClient();
    if (!redisClient) {
      return false;
    }
    
    // Try to ping Redis by checking if it's connected
    redisAvailable = redisClient.isOpen;
    return redisAvailable;
    console.log('Redis connection confirmed - using Redis for caching');
    return true;
  } catch (error) {
    redisAvailable = false;
    console.warn('Redis connection failed - falling back to in-memory cache:', (error as Error).message);
    return false;
  }
}

/**
 * Apply rate limiting to API requests
 * 
 * @param {ApiProvider} provider - API provider
 * @returns {Promise<number>} - Delay in ms before making the request
 */
async function applyRateLimit(provider: ApiProvider): Promise<number> {
  const config = RATE_LIMITS[provider];
  const timestamps = requestTimestamps[provider];
  
  // Remove timestamps outside the current window
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Clean up old timestamps
  while (timestamps.length > 0 && timestamps[0] < windowStart) {
    timestamps.shift();
  }
  
  // Check if we're over the limit
  if (timestamps.length >= config.maxRequests) {
    // Calculate backoff time with exponential increase based on overage
    const overage = timestamps.length - config.maxRequests + 1;
    const backoffTime = Math.min(
      config.windowMs * Math.pow(config.backoffFactor, overage),
      config.maxBackoff
    );
    
    console.log(`Rate limit reached for ${provider} API. Backing off for ${backoffTime}ms`);
    
    // Wait for the backoff time
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    
    // Recursive call to check again after backoff
    return applyRateLimit(provider);
  }
  
  // Add current timestamp to the list
  timestamps.push(now);
  apiMetrics.requests[provider]++;
  
  return 0; // No delay needed
}

/**
 * Make an API request with rate limiting and optimized caching for Solana wallet data
 * 
 * @param {ApiProvider} provider - API provider
 * @param {RequestType} requestType - Type of request
 * @param {string} cacheKey - Cache key
 * @param {Function} requestFn - Function that makes the actual request
 * @param {number | null} cacheTTL - Cache TTL in seconds
 * @returns {Promise<any>} - API response
 */
async function makeRequest<T>(
  provider: ApiProvider, 
  requestType: RequestType, 
  cacheKey: string, 
  requestFn: () => Promise<T>, 
  cacheTTL: number | null = null
): Promise<T> {
  try {
    // Use the routing-specific cache TTL if not explicitly provided
    if (cacheTTL === null && PROVIDER_ROUTING[requestType]) {
      cacheTTL = PROVIDER_ROUTING[requestType].cacheTTL || 1800;
    }
    
    // Check Redis connection status
    const isRedisAvailable = await checkRedisConnection();
    
    // Try to get from cache first
    if (isRedisAvailable) {
      // Check Redis cache first (preferred for persistence across server instances)
      const cachedData = await redisService.get(cacheKey);
      if (cachedData) {
        apiMetrics.cacheHits++;
        console.log(`Cache hit (Redis) for ${requestType} from ${provider}`);
        return JSON.parse(cachedData);
      }
    }
    
    // Check local cache as fallback or if Redis is unavailable
    const localCachedData = localCache.get(cacheKey);
    if (localCachedData) {
      apiMetrics.cacheHits++;
      console.log(`Cache hit (local) for ${requestType} from ${provider}`);
      return localCachedData as T;
    }
    
    apiMetrics.cacheMisses++;
    console.log(`Cache miss for ${requestType} from ${provider} - making API request`);
    
    // Apply rate limiting before making the API request
    await applyRateLimit(provider);
    
    // Make the actual API request
    const response = await requestFn();
    
    // Cache the response in both Redis and local cache for redundancy
    const dataToCache = JSON.stringify(response);
    
    // Store in Redis if available
    if (isRedisAvailable && cacheTTL) {
      await redisService.set(cacheKey, dataToCache, cacheTTL);
    }
    
    // Always store in local cache as fallback
    if (cacheTTL) {
      localCache.set(cacheKey, response, cacheTTL);
    }
    console.log(`Cached ${requestType} data from ${provider} (TTL: ${cacheTTL}s)`);
    
    return response;
  } catch (error) {
    apiMetrics.errors[provider]++;
    console.error(`Error making ${requestType} request to ${provider}:`, (error as Error).message);
    
    // Check if we should try fallback
    const routing = PROVIDER_ROUTING[requestType];
    if (routing.fallback && routing.primary === provider) {
      console.log(`Falling back to ${routing.fallback} for ${requestType} request`);
      apiMetrics.fallbacks++;
      
      // Recursive call with fallback provider
      return makeRequest<T>(
        routing.fallback,
        requestType,
        `${cacheKey}_fallback`,
        async () => {
          // Apply rate limiting to fallback
          await applyRateLimit(routing.fallback as ApiProvider);
          
          // Implement fallback request logic based on provider
          switch (routing.fallback) {
            case ApiProvider.MORALIS:
              // Implement Moralis fallback request
              return requestFn();
            case ApiProvider.COINGECKO:
              // Implement CoinGecko fallback request
              return requestFn();
            case ApiProvider.HELIUS:
              // Implement Helius fallback request
              return requestFn();
            default:
              throw new Error(`Unsupported fallback provider: ${routing.fallback}`);
          }
        },
        cacheTTL
      );
    }
    
    throw error;
  }
}

/**
 * Make a request with the optimal provider based on request type
 * 
 * @param {RequestType} requestType - Type of request
 * @param {string} cacheKey - Cache key
 * @param {Function} primaryFn - Function for primary provider
 * @param {Function} fallbackFn - Function for fallback provider
 * @param {number} cacheTTL - Cache TTL in seconds
 * @returns {Promise<any>} - API response
 */
async function requestWithOptimalProvider<T>(
  requestType: RequestType, 
  cacheKey: string, 
  primaryFn: () => Promise<T>, 
  fallbackFn: (() => Promise<T>) | null = null, 
  cacheTTL: number = 1800
): Promise<T> {
  const routing = PROVIDER_ROUTING[requestType];
  
  if (!routing) {
    throw new Error(`Unsupported request type: ${requestType}`);
  }
  
  try {
    return await makeRequest<T>(
      routing.primary,
      requestType,
      cacheKey,
      primaryFn,
      cacheTTL
    );
  } catch (error) {
    if (routing.fallback && fallbackFn) {
      console.log(`Primary provider ${routing.primary} failed, trying fallback ${routing.fallback}`);
      apiMetrics.fallbacks++;
      
      return await makeRequest<T>(
        routing.fallback,
        requestType,
        `${cacheKey}_fallback`,
        fallbackFn,
        cacheTTL
      );
    }
    
    throw error;
  }
}

// Transaction interface
interface Transaction {
  signature: string;
  timestamp: number;
  blockTime: number;
  tokenTransfers?: TokenTransfer[];
  [key: string]: any;
}

// Token transfer interface
interface TokenTransfer {
  mint: string;
  tokenAmount: number;
  decimals?: number;
  metadata?: TokenMetadata;
  price?: TokenPrice;
  usdValue?: number;
  [key: string]: any;
}

// Token metadata interface
interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  [key: string]: any;
}

// Token price interface
interface TokenPrice {
  usdPrice: number;
  timestamp: number;
  [key: string]: any;
}

/**
 * Get wallet transactions with optimal provider routing
 * 
 * @param {string} walletAddress - Wallet address
 * @param {number} limit - Number of transactions to fetch
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise<Array<Transaction>>} - Transactions
 */
async function getWalletTransactions(
  walletAddress: string, 
  limit: number = 100, 
  useCache: boolean = true
): Promise<Transaction[]> {
  const cacheKey = `tx_${walletAddress}_${limit}`;
  
  // If cache is disabled, delete any existing cache entry
  if (!useCache) {
    await redisService.del(cacheKey);
    localCache.del(cacheKey);
  }
  
  return requestWithOptimalProvider<Transaction[]>(
    RequestType.TRANSACTIONS,
    cacheKey,
    async () => {
      // Import heliusService dynamically to avoid circular dependency
      const heliusService = require('./heliusService');
      return await heliusService.getWalletTransactions(walletAddress, limit);
    },
    null, // No fallback for transactions
    PROVIDER_ROUTING[RequestType.TRANSACTIONS].cacheTTL
  );
}

/**
 * Get token metadata with optimal provider routing
 * 
 * @param {string} tokenAddress - Token address
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise<TokenMetadata>} - Token metadata
 */
async function getTokenMetadata(
  tokenAddress: string, 
  useCache: boolean = true
): Promise<TokenMetadata> {
  const cacheKey = `token_meta_${tokenAddress}`;
  
  // If cache is disabled, delete any existing cache entry
  if (!useCache) {
    await redisService.del(cacheKey);
    localCache.del(cacheKey);
  }
  
  return requestWithOptimalProvider<TokenMetadata>(
    RequestType.TOKEN_METADATA,
    cacheKey,
    async (isFallback: boolean = false) => {
      if (!isFallback) {
        // Primary: Use Moralis for token metadata
        const url = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`;
        const response = await axios.get(url, {
          headers: {
            'accept': 'application/json',
            'X-API-Key': config.moralis.apiKey
          }
        });
        return response.data;
      } else {
        // Fallback: Use Helius for token metadata
        const heliusService = require('./heliusService');
        return await heliusService.getTokenMetadata(tokenAddress);
      }
    },
    async () => {
      // Fallback implementation
      const heliusService = require('./heliusService');
      return await heliusService.getTokenMetadata(tokenAddress);
    },
    PROVIDER_ROUTING[RequestType.TOKEN_METADATA].cacheTTL
  );
}

/**
 * Get token price with optimal provider routing
 * 
 * @param {string} tokenAddress - Token address
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise<TokenPrice>} - Token price data
 */
async function getTokenPrice(
  tokenAddress: string, 
  useCache: boolean = true
): Promise<TokenPrice> {
  const cacheKey = `token_price_${tokenAddress}`;
  
  // If cache is disabled, delete any existing cache entry
  if (!useCache) {
    await redisService.del(cacheKey);
    localCache.del(cacheKey);
  }
  
  return requestWithOptimalProvider<TokenPrice>(
    RequestType.TOKEN_PRICE,
    cacheKey,
    async (isFallback: boolean = false) => {
      if (!isFallback) {
        // Primary: Use Moralis for token price
        const url = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`;
        const response = await axios.get(url, {
          headers: {
            'accept': 'application/json',
            'X-API-Key': config.moralis.apiKey
          }
        });
        return response.data;
      } else {
        // Fallback: Use CoinGecko for token price
        const geckoTerminalService = require('../dex/geckoTerminalService');
        return await geckoTerminalService.getTokenPrice(tokenAddress);
      }
    },
    async () => {
      // Fallback implementation
      const geckoTerminalService = require('../dex/geckoTerminalService');
      return await geckoTerminalService.getTokenPrice(tokenAddress);
    },
    PROVIDER_ROUTING[RequestType.TOKEN_PRICE].cacheTTL
  );
}

/**
 * Enrich transaction data with token metadata and prices
 * 
 * @param {Array<Transaction>} transactions - Raw transactions from Helius
 * @returns {Promise<Array<Transaction>>} - Enriched transactions
 */
async function enrichTransactions(transactions: Transaction[]): Promise<Transaction[]> {
  if (!transactions || transactions.length === 0) {
    return [];
  }
  
  // Extract unique token addresses from transactions
  const tokenAddresses = new Set<string>();
  transactions.forEach(tx => {
    if (tx.tokenTransfers) {
      tx.tokenTransfers.forEach(transfer => {
        if (transfer.mint) {
          tokenAddresses.add(transfer.mint);
        }
      });
    }
  });
  
  // Batch fetch token metadata and prices
  const tokenMetadata: Record<string, TokenMetadata | null> = {};
  const tokenPrices: Record<string, TokenPrice | null> = {};
  
  const metadataPromises = Array.from(tokenAddresses).map(async address => {
    try {
      const metadata = await getTokenMetadata(address);
      tokenMetadata[address] = metadata;
    } catch (error) {
      console.error(`Failed to fetch metadata for token ${address}:`, (error as Error).message);
      tokenMetadata[address] = null;
    }
  });
  
  const pricePromises = Array.from(tokenAddresses).map(async address => {
    try {
      const price = await getTokenPrice(address);
      tokenPrices[address] = price;
    } catch (error) {
      console.error(`Failed to fetch price for token ${address}:`, (error as Error).message);
      tokenPrices[address] = null;
    }
  });
  
  // Wait for all metadata and price fetches to complete
  await Promise.all([...metadataPromises, ...pricePromises]);
  
  // Enrich transactions with token metadata and prices
  const enrichedTransactions = transactions.map(tx => {
    const enrichedTx = { ...tx };
    
    if (tx.tokenTransfers) {
      enrichedTx.tokenTransfers = tx.tokenTransfers.map(transfer => {
        const enrichedTransfer = { ...transfer };
        
        if (transfer.mint) {
          enrichedTransfer.metadata = tokenMetadata[transfer.mint] || undefined;
          enrichedTransfer.price = tokenPrices[transfer.mint] || undefined;
          
          // Calculate USD value if price and amount are available
          if (enrichedTransfer.price && enrichedTransfer.price.usdPrice && 
              enrichedTransfer.tokenAmount && enrichedTransfer.metadata && 
              enrichedTransfer.metadata.decimals) {
            const decimals = enrichedTransfer.metadata.decimals;
            const amount = enrichedTransfer.tokenAmount / Math.pow(10, decimals);
            enrichedTransfer.usdValue = amount * enrichedTransfer.price.usdPrice;
          }
        }
        
        return enrichedTransfer;
      });
    }
    
    return enrichedTx;
  });
  
  return enrichedTransactions;
}

/**
 * Get API usage metrics
 * 
 * @returns {ApiMetrics} - API usage metrics
 */
function getApiMetrics(): ApiMetrics {
  return {
    ...apiMetrics,
    cacheStats: {
      hitRate: apiMetrics.cacheHits + apiMetrics.cacheMisses > 0 ? 
        (apiMetrics.cacheHits / (apiMetrics.cacheHits + apiMetrics.cacheMisses)) * 100 : 0
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Clear all caches - optimized for Solana wallet setup
 */
async function clearAllCaches(): Promise<boolean> {
  try {
    // Check Redis connection first
    const isRedisAvailable = await checkRedisConnection();
    
    if (isRedisAvailable) {
      // Clear Redis cache for all API-related keys
      await redisService.clearByPrefix('api_');
      await redisService.clearByPrefix('tx_');
      await redisService.clearByPrefix('token_');
      console.log('Cleared API, transaction, and token keys from Redis cache');
    }
    
    // Always clear local cache
    localCache.flushAll();
    console.log('Local cache cleared');
    
    // Reset metrics
    Object.keys(apiMetrics.requests).forEach(key => {
      apiMetrics.requests[key as ApiProvider] = 0;
    });
    
    Object.keys(apiMetrics.errors).forEach(key => {
      apiMetrics.errors[key as ApiProvider] = 0;
    });
    
    apiMetrics.cacheHits = 0;
    apiMetrics.cacheMisses = 0;
    apiMetrics.fallbacks = 0;
    
    console.log('All API caches and metrics reset');
    return true;
  } catch (error) {
    console.error('Error clearing caches:', (error as Error).message);
    return false;
  }
}

/**
 * Force check Redis connection and report status
 * @returns {Promise<Object>} Connection status and metrics
 */
async function checkRedisStatus(): Promise<{
  redisAvailable: boolean;
  lastCheck: string;
  metrics: ApiMetrics;
  timestamp: string;
}> {
  const isAvailable = await checkRedisConnection();
  return {
    redisAvailable: isAvailable,
    lastCheck: new Date(lastRedisCheck).toISOString(),
    metrics: getApiMetrics(),
    timestamp: new Date().toISOString()
  };
}

// Export types separately to fix 'isolatedModules' issue
export type {
  Transaction,
  TokenTransfer,
  TokenMetadata,
  TokenPrice,
  ApiMetrics
};

// Export functions only (enums are already exported at the top of the file)
export {
  getWalletTransactions,
  getTokenMetadata,
  getTokenPrice,
  enrichTransactions,
  getApiMetrics,
  clearAllCaches,
  checkRedisStatus,
  checkRedisConnection,
  requestWithOptimalProvider
};

// Export default object with functions for convenience
const apiManager = {
  getWalletTransactions,
  getTokenMetadata,
  getTokenPrice,
  enrichTransactions,
  getApiMetrics,
  clearAllCaches,
  checkRedisStatus,
  checkRedisConnection,
  requestWithOptimalProvider
};

export default apiManager;
