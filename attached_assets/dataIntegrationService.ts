/**
 * Data Integration Service
 * 
 * This service implements the optimal Helius/Moralis combo approach:
 * - Use Helius for base tx pull + NFT indexing (getSignaturesForAddress, getParsedTransaction)
 * - Use Moralis for token trade enrichment (swap events, USD value, token metadata)
 * - Use CoinGecko as fallback price oracle for historical token prices in PnL calculations
 * - Cache Moralis enriched trades to avoid calling both APIs every time
 * 
 * The service coordinates data flow between different services and ensures consistency
 * across the application with standardized caching, validation, and synchronization.
 */

import { v4 as uuidv4 } from 'uuid';
import * as apiRequestManager from '../api/apiRequestManager';
import * as redisService from '../cache/redisService';
import * as enhancedTradingActivityService from '../trading/enhancedTradingActivityService';
import * as labelEngineSyncService from '../label/labelEngineSyncService';
import * as topWalletsService from '../analytics/topWalletsService';

// Define interfaces for the service
interface IntegratedWalletDataOptions {
  useCache?: boolean;
  forceRefresh?: boolean;
  includeTradingActivity?: boolean;
  includeLabels?: boolean;
  limit?: number;
}

interface TopWalletsOptions {
  useCache?: boolean;
  forceRefresh?: boolean;
  includeTradingActivity?: boolean;
  includeLabels?: boolean;
  limit?: number;
  sortBy?: string;
}

interface SynchronizationOptions {
  includeTradingActivity?: boolean;
  includeLabels?: boolean;
  limit?: number;
}

interface SynchronizationResults {
  successful: string[];
  failed: Array<{
    address: string;
    error: string;
  }>;
  processingTime: number;
  timestamp: string;
}

interface IntegratedWalletData {
  walletAddress: string;
  dataVersion: number;
  tradingActivity?: any;
  labelData?: any;
  processingTime: number;
  timestamp: string;
  dataProviders: {
    transactions: string;
    tokenMetadata: string;
    tokenPrices: string;
  };
}

interface IntegratedTopWallet {
  walletAddress: string;
  score: number;
  tradingActivity?: any;
  labelData?: any;
  tier?: string;
  rank?: number;
}

// Cache TTL configuration (in seconds)
export const CACHE_TTL = {
  WALLET_DATA: 3600, // 1 hour
  TOKEN_DATA: 86400, // 24 hours
  AGGREGATED_DATA: 1800, // 30 minutes
  LABEL_DATA: 43200, // 12 hours
  TOP_WALLETS: 7200 // 2 hours
};

// Data version tracking
let currentDataVersion = Date.now();

/**
 * Get integrated wallet data using the optimal Helius/Moralis combo
 * 
 * @param walletAddress - Wallet address to get data for
 * @param options - Options for data retrieval
 * @returns Integrated wallet data
 */
export async function getIntegratedWalletData(
  walletAddress: string, 
  options: IntegratedWalletDataOptions = {}
): Promise<IntegratedWalletData> {
  // Default options
  const {
    useCache = true,
    forceRefresh = false,
    includeTradingActivity = true,
    includeLabels = true,
    limit = 100
  } = options;
  
  // Generate cache key
  const cacheKey = `integrated_${walletAddress}_${limit}_${includeTradingActivity}_${includeLabels}`;
  
  // Check cache if enabled and not forcing refresh
  if (useCache && !forceRefresh) {
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as IntegratedWalletData;
      
      // Check if data is from current version
      if (parsedData.dataVersion === currentDataVersion) {
        console.log(`Using cached integrated data for ${walletAddress}`);
        return parsedData;
      }
    }
  }
  
  // Start timer for performance tracking
  const startTime = Date.now();
  
  // Fetch data in parallel
  const dataPromises: Promise<any>[] = [];
  
  // 1. Trading activity data (using Helius for tx data and Moralis for enrichment)
  let tradingActivity = null;
  if (includeTradingActivity) {
    dataPromises.push(
      enhancedTradingActivityService.getWalletTradingActivity(walletAddress, limit, useCache, forceRefresh)
        .then(data => { tradingActivity = data; })
        .catch(error => {
          console.error(`Error fetching trading activity for ${walletAddress}:`, error);
          return null;
        })
    );
  }
  
  // 2. Label data (psychological profile)
  let labelData = null;
  if (includeLabels) {
    dataPromises.push(
      labelEngineSyncService.syncWalletLabelProfile(walletAddress, limit, forceRefresh)
        .then(data => { labelData = data; })
        .catch(error => {
          console.error(`Error fetching label data for ${walletAddress}:`, error);
          return null;
        })
    );
  }
  
  // Wait for all data fetches to complete
  await Promise.all(dataPromises);
  
  // Prepare integrated result
  const result: IntegratedWalletData = {
    walletAddress,
    dataVersion: currentDataVersion,
    processingTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    dataProviders: {
      transactions: apiRequestManager.ApiProvider.HELIUS,
      tokenMetadata: apiRequestManager.ApiProvider.MORALIS,
      tokenPrices: apiRequestManager.ApiProvider.MORALIS
    }
  };
  
  // Add trading activity if requested
  if (includeTradingActivity) {
    result.tradingActivity = tradingActivity;
  }
  
  // Add label data if requested
  if (includeLabels) {
    result.labelData = labelData;
  }
  
  // Cache the result
  await redisService.set(cacheKey, JSON.stringify(result), CACHE_TTL.WALLET_DATA);
  
  return result;
}

/**
 * Get top wallets with integrated data using the Helius/Moralis combo
 * 
 * @param options - Options for top wallets retrieval
 * @returns Top wallets with integrated data
 */
export async function getTopWalletsIntegrated(
  options: TopWalletsOptions = {}
): Promise<IntegratedTopWallet[]> {
  // Default options
  const {
    useCache = true,
    forceRefresh = false,
    includeTradingActivity = true,
    includeLabels = true,
    limit = 20,
    sortBy = 'score'
  } = options;
  
  // Generate cache key
  const cacheKey = `top_wallets_integrated_${limit}_${includeTradingActivity}_${includeLabels}_${sortBy}`;
  
  // Check cache if enabled and not forcing refresh
  if (useCache && !forceRefresh) {
    const cachedData = await redisService.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as IntegratedTopWallet[];
      return parsedData;
    }
  }
  
  // Get base top wallets list
  const topWallets = await topWalletsService.getTopWallets({ forceRefresh, limit });
  
  // Enrich each wallet with integrated data
  const enrichedWallets: IntegratedTopWallet[] = [];
  
  for (let i = 0; i < topWallets.length; i++) {
    const wallet = topWallets[i];
    try {
      // Get integrated data for this wallet
      const integratedData = await getIntegratedWalletData(wallet.walletAddress, {
        useCache,
        forceRefresh: false, // Don't force refresh for each wallet to avoid API overload
        includeTradingActivity,
        includeLabels
      });
      
      // Add to enriched wallets
      enrichedWallets.push({
        walletAddress: wallet.walletAddress,
        score: wallet.score,
        tradingActivity: integratedData.tradingActivity,
        labelData: integratedData.labelData,
        tier: wallet.tier,
        rank: i + 1
      });
    } catch (error) {
      console.error(`Error enriching top wallet ${wallet.walletAddress}:`, error);
      
      // Add basic wallet info without enrichment
      enrichedWallets.push({
        walletAddress: wallet.walletAddress,
        score: wallet.score,
        tier: wallet.tier,
        rank: i + 1
      });
    }
  }
  
  // Sort by specified metric
  if (sortBy === 'score') {
    enrichedWallets.sort((a, b) => b.score - a.score);
  } else if (sortBy === 'rank') {
    enrichedWallets.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  }
  
  // Cache the result
  await redisService.set(cacheKey, JSON.stringify(enrichedWallets), CACHE_TTL.TOP_WALLETS);
  
  return enrichedWallets;
}

/**
 * Synchronize data for a batch of wallets using the Helius/Moralis combo
 * 
 * @param walletAddresses - Array of wallet addresses to synchronize
 * @param options - Synchronization options
 * @returns Synchronization results
 */
export async function synchronizeWalletsBatch(
  walletAddresses: string[], 
  options: SynchronizationOptions = {}
): Promise<SynchronizationResults> {
  // Default options
  const {
    includeTradingActivity = true,
    includeLabels = true,
    limit = 100
  } = options;
  
  // Start timer for performance tracking
  const startTime = Date.now();
  
  // Process wallets in batches to avoid overwhelming the system
  const batchSize = 5;
  const results: SynchronizationResults = {
    successful: [],
    failed: [],
    processingTime: 0,
    timestamp: new Date().toISOString()
  };
  
  // Process in batches
  for (let i = 0; i < walletAddresses.length; i += batchSize) {
    const batch = walletAddresses.slice(i, i + batchSize);
    
    // Process batch in parallel
    const batchPromises = batch.map(async walletAddress => {
      try {
        // Force refresh data for synchronization
        await getIntegratedWalletData(walletAddress, {
          useCache: false,
          forceRefresh: true,
          includeTradingActivity,
          includeLabels,
          limit
        });
        
        results.successful.push(walletAddress);
        return true;
      } catch (error) {
        console.error(`Error synchronizing wallet ${walletAddress}:`, error);
        results.failed.push({
          address: walletAddress,
          error: (error as Error).message
        });
        return false;
      }
    });
    
    // Wait for batch to complete before moving to next batch
    await Promise.all(batchPromises);
    
    // Small delay between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Update results
  results.processingTime = Date.now() - startTime;
  
  return results;
}

/**
 * Update the data version to force refresh of all cached data
 * 
 * @returns New data version
 */
export function updateDataVersion(): number {
  currentDataVersion = Date.now();
  console.log(`Updated data version to ${currentDataVersion}`);
  return currentDataVersion;
}

/**
 * Get the current data version
 * 
 * @returns Current data version
 */
export function getDataVersion(): number {
  return currentDataVersion;
}

/**
 * Clear all integration caches
 * 
 * @returns Success status
 */
export async function clearAllCaches(): Promise<boolean> {
  try {
    // Clear Redis caches for integrated data
    const keys = await redisService.keys('integrated_*');
    for (const key of keys) {
      await redisService.del(key);
    }
    
    // Clear top wallets cache
    const topWalletsKeys = await redisService.keys('top_wallets_integrated_*');
    for (const key of topWalletsKeys) {
      await redisService.del(key);
    }
    
    // Update data version to force refresh
    updateDataVersion();
    
    // Clear service-specific caches
    await enhancedTradingActivityService.clearAllCaches();
    await apiRequestManager.clearAllCaches();
    
    console.log('All integration caches cleared');
    return true;
  } catch (error) {
    console.error('Error clearing integration caches:', error);
    return false;
  }
}
