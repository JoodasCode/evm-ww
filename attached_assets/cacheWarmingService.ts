/**
 * Cache Warming Service
 * 
 * Proactively warms caches for frequently accessed wallets to prevent cold cache misses
 * Implements the optimal Helius/Moralis combo formula caching strategy
 */

'use strict';

import { v4 as uuidv4 } from 'uuid';
import config from '../../config';
import * as apiRequestManager from '../api/apiRequestManager';
import * as enhancedTradingActivityService from '../trading/enhancedTradingActivityService';
import * as topWalletsService from '../analytics/topWalletsService';
import * as addressValidator from '../../utils/addressValidator';
import * as redisService from '../cache/redisService';

// Service settings interface
interface CacheWarmingSettings {
  enabled: boolean;
  interval: number;
  topWalletsCount: number;
  customWallets: string[];
  concurrency: number;
  transactionLimit: number;
}

// Warming result interface
interface WarmingResult {
  address: string;
  status: 'success' | 'error' | 'skipped';
  transactionCount?: number;
  error?: string;
  reason?: string;
}

// Warming statistics interface
interface WarmingStats {
  totalRuns: number;
  successCount: number;
  failureCount: number;
  lastRunDuration: number;
  walletsWarmed: string[];
  errors: Array<{ address: string; error: string }>;
}

// Warming job result interface
interface WarmingJobResult {
  status: 'success' | 'error' | 'skipped';
  timestamp: string;
  duration: number;
  results?: {
    success: number;
    error: number;
    skipped: number;
    total: number;
  };
  error?: string;
  reason?: string;
}

// Service stats interface
interface ServiceStats extends WarmingStats {
  settings: CacheWarmingSettings;
  isRunning: boolean;
  lastRunTimestamp: string | null;
  nextRunTimestamp: string | null;
}

// Default settings
const DEFAULT_SETTINGS: CacheWarmingSettings = {
  enabled: config.cache.prefetch?.enabled || true,
  interval: config.cache.prefetch?.interval || 3600000, // 1 hour in milliseconds
  topWalletsCount: config.cache.prefetch?.topWalletsCount || 20,
  customWallets: [], // Additional wallets to warm
  concurrency: 3, // Number of wallets to process concurrently
  transactionLimit: 100 // Number of transactions to fetch per wallet
};

// Service state
let settings: CacheWarmingSettings = { ...DEFAULT_SETTINGS };
let isRunning = false;
let lastRunTimestamp: string | null = null;
let scheduledJobId: NodeJS.Timeout | null = null;
let warmingStats: WarmingStats = {
  totalRuns: 0,
  successCount: 0,
  failureCount: 0,
  lastRunDuration: 0,
  walletsWarmed: [],
  errors: []
};

/**
 * Initialize the cache warming service
 * 
 * @param {Partial<CacheWarmingSettings>} options - Service options
 * @returns {Promise<boolean>} - Whether initialization was successful
 */
async function initialize(options: Partial<CacheWarmingSettings> = {}): Promise<boolean> {
  try {
    // Update settings with provided options
    settings = {
      ...settings,
      ...options
    };
    
    console.log('Cache warming service initialized with settings:', settings);
    
    // Start scheduled job if enabled
    if (settings.enabled) {
      scheduleWarmingJob();
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing cache warming service:', error);
    return false;
  }
}

/**
 * Schedule the cache warming job
 * 
 * @returns {NodeJS.Timeout} - Job ID
 */
function scheduleWarmingJob(): NodeJS.Timeout {
  // Clear existing job if any
  if (scheduledJobId) {
    clearInterval(scheduledJobId);
  }
  
  // Schedule new job
  scheduledJobId = setInterval(async () => {
    if (!isRunning) {
      await warmCaches();
    }
  }, settings.interval);
  
  console.log(`Cache warming job scheduled to run every ${settings.interval / 1000} seconds`);
  
  return scheduledJobId;
}

/**
 * Process wallets in batches with limited concurrency
 * 
 * @param {string[]} wallets - Wallets to process
 * @param {(wallet: string) => Promise<WarmingResult>} processFn - Function to process each wallet
 * @returns {Promise<PromiseSettledResult<WarmingResult>[]>} - Results
 */
async function processBatch(
  wallets: string[],
  processFn: (wallet: string) => Promise<WarmingResult>
): Promise<PromiseSettledResult<WarmingResult>[]> {
  const results: PromiseSettledResult<WarmingResult>[] = [];
  
  // Process in batches with limited concurrency
  for (let i = 0; i < wallets.length; i += settings.concurrency) {
    const batch = wallets.slice(i, i + settings.concurrency);
    
    // Process batch in parallel
    const batchPromises = batch.map(wallet => processFn(wallet));
    const batchResults = await Promise.allSettled(batchPromises);
    
    // Add results
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Warm caches for a specific wallet
 * 
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<WarmingResult>} - Result
 */
async function warmWalletCache(walletAddress: string): Promise<WarmingResult> {
  try {
    // Validate wallet address
    const validation = addressValidator.validateAndNormalize(walletAddress);
    if (!validation.isValid) {
      throw new Error(`Invalid wallet address: ${walletAddress}`);
    }
    
    const normalizedAddress = validation.address;
    
    // Check if wallet data is already cached and fresh
    const cacheKey = `wallet_${normalizedAddress}_${settings.transactionLimit}`;
    const cachedData = await redisService.get(cacheKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cacheAge = Date.now() - new Date(parsedData.timestamp).getTime();
      
      // If cache is fresh (less than half the TTL), skip warming
      if (cacheAge < (config.cache.ttl.wallet * 1000) / 2) {
        return {
          address: normalizedAddress,
          status: 'skipped',
          reason: 'fresh_cache'
        };
      }
    }
    
    // Fetch transactions using API Request Manager
    const transactions = await apiRequestManager.getWalletTransactions(
      normalizedAddress,
      settings.transactionLimit,
      false // Force fresh data
    );
    
    // Enrich transactions with token metadata and prices
    await apiRequestManager.enrichTransactions(transactions);
    
    // Get trading activity using Enhanced Trading Activity Service
    await enhancedTradingActivityService.getWalletTradingActivity(
      normalizedAddress,
      settings.transactionLimit,
      false // Force fresh data
    );
    
    return {
      address: normalizedAddress,
      status: 'success',
      transactionCount: transactions.length
    };
  } catch (error) {
    console.error(`Error warming cache for wallet ${walletAddress}:`, error);
    
    return {
      address: walletAddress,
      status: 'error',
      error: (error as Error).message
    };
  }
}

/**
 * Warm caches for all configured wallets
 * 
 * @returns {Promise<WarmingJobResult>} - Warming results
 */
async function warmCaches(): Promise<WarmingJobResult> {
  if (isRunning) {
    console.log('Cache warming already in progress, skipping');
    return {
      status: 'skipped',
      reason: 'already_running',
      timestamp: new Date().toISOString(),
      duration: 0
    };
  }
  
  isRunning = true;
  const startTime = Date.now();
  
  try {
    console.log('Starting cache warming process');
    
    // Get top wallets
    let topWallets: string[] = [];
    try {
      const topWalletsData = await topWalletsService.getTopWallets({
        limit: settings.topWalletsCount,
        sortBy: 'score',
        useCache: true
      });
      
      topWallets = topWalletsData.wallets.map(w => w.address);
    } catch (error) {
      console.error('Error fetching top wallets:', error);
    }
    
    // Combine with custom wallets
    const walletsToWarm = [
      ...new Set([...topWallets, ...settings.customWallets])
    ];
    
    console.log(`Warming caches for ${walletsToWarm.length} wallets`);
    
    // Process wallets in batches
    const results = await processBatch(walletsToWarm, warmWalletCache);
    
    // Calculate statistics
    const successResults = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success');
    const errorResults = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'error'));
    const skippedResults = results.filter(r => r.status === 'fulfilled' && r.value.status === 'skipped');
    
    // Update warming stats
    warmingStats.totalRuns++;
    warmingStats.successCount += successResults.length;
    warmingStats.failureCount += errorResults.length;
    warmingStats.lastRunDuration = Date.now() - startTime;
    warmingStats.walletsWarmed = successResults
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<WarmingResult>).value.address);
    
    warmingStats.errors = errorResults.map(r => {
      if (r.status === 'rejected') {
        return { address: 'unknown', error: r.reason.message };
      }
      const result = (r as PromiseFulfilledResult<WarmingResult>).value;
      return { address: result.address, error: result.error || 'Unknown error' };
    });
    
    console.log(`Cache warming completed in ${warmingStats.lastRunDuration}ms`);
    console.log(`Success: ${successResults.length}, Errors: ${errorResults.length}, Skipped: ${skippedResults.length}`);
    
    lastRunTimestamp = new Date().toISOString();
    
    return {
      status: 'success',
      timestamp: lastRunTimestamp,
      duration: warmingStats.lastRunDuration,
      results: {
        success: successResults.length,
        error: errorResults.length,
        skipped: skippedResults.length,
        total: results.length
      }
    };
  } catch (error) {
    console.error('Error during cache warming:', error);
    
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      error: (error as Error).message
    };
  } finally {
    isRunning = false;
  }
}

/**
 * Get cache warming statistics
 * 
 * @returns {ServiceStats} - Statistics
 */
function getStats(): ServiceStats {
  return {
    ...warmingStats,
    settings,
    isRunning,
    lastRunTimestamp,
    nextRunTimestamp: lastRunTimestamp 
      ? new Date(new Date(lastRunTimestamp).getTime() + settings.interval).toISOString()
      : null
  };
}

/**
 * Update cache warming settings
 * 
 * @param {Partial<CacheWarmingSettings>} newSettings - New settings
 * @returns {CacheWarmingSettings} - Updated settings
 */
function updateSettings(newSettings: Partial<CacheWarmingSettings>): CacheWarmingSettings {
  settings = {
    ...settings,
    ...newSettings
  };
  
  // Restart job if interval changed
  if (newSettings.interval !== undefined || newSettings.enabled !== undefined) {
    if (settings.enabled) {
      scheduleWarmingJob();
    } else if (scheduledJobId) {
      clearInterval(scheduledJobId);
      scheduledJobId = null;
    }
  }
  
  return settings;
}

/**
 * Add custom wallets to warm
 * 
 * @param {string | string[]} wallets - Wallet addresses to add
 * @returns {string[]} - Updated custom wallets list
 */
function addCustomWallets(wallets: string | string[]): string[] {
  if (!Array.isArray(wallets)) {
    wallets = [wallets];
  }
  
  // Validate wallets
  const validWallets = wallets
    .map(w => addressValidator.validateAndNormalize(w))
    .filter(v => v.isValid)
    .map(v => v.address);
  
  // Add to custom wallets (deduplicated)
  settings.customWallets = [...new Set([...settings.customWallets, ...validWallets])];
  
  return settings.customWallets;
}

/**
 * Remove custom wallets
 * 
 * @param {string | string[]} wallets - Wallet addresses to remove
 * @returns {string[]} - Updated custom wallets list
 */
function removeCustomWallets(wallets: string | string[]): string[] {
  if (!Array.isArray(wallets)) {
    wallets = [wallets];
  }
  
  // Normalize wallets for comparison
  const normalizedWallets = wallets
    .map(w => addressValidator.normalizeSolanaAddress(w));
  
  // Remove from custom wallets
  settings.customWallets = settings.customWallets.filter(
    w => !normalizedWallets.includes(addressValidator.normalizeSolanaAddress(w))
  );
  
  return settings.customWallets;
}

/**
 * Manually trigger cache warming
 * 
 * @param {Partial<CacheWarmingSettings>} options - Warming options
 * @returns {Promise<WarmingJobResult>} - Warming results
 */
async function triggerWarming(options: Partial<CacheWarmingSettings> = {}): Promise<WarmingJobResult> {
  // Save current settings
  const currentSettings = { ...settings };
  
  try {
    // Apply temporary settings if provided
    if (Object.keys(options).length > 0) {
      updateSettings(options);
    }
    
    // Run warming
    return await warmCaches();
  } finally {
    // Restore original settings
    settings = currentSettings;
  }
}

export {
  initialize,
  warmCaches,
  getStats,
  updateSettings,
  addCustomWallets,
  removeCustomWallets,
  triggerWarming,
  CacheWarmingSettings,
  WarmingResult,
  WarmingStats,
  WarmingJobResult,
  ServiceStats
};

export default {
  initialize,
  warmCaches,
  getStats,
  updateSettings,
  addCustomWallets,
  removeCustomWallets,
  triggerWarming
};
