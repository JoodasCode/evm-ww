/**
 * Enhanced Trading Activity Service
 * 
 * This service implements the optimal Helius/Moralis combo approach:
 * - Use Helius for base tx pull + NFT indexing (getSignaturesForAddress, getParsedTransaction)
 * - Use Moralis for token trade enrichment (swap events, USD value, token metadata)
 * - Use CoinGecko as fallback price oracle for historical token prices in PnL calculations
 * - Cache Moralis enriched trades to avoid calling both APIs every time
 * 
 * Enhancements:
 * - Advanced caching with TTL and size limits
 * - Improved rate limiting with exponential backoff
 * - Enhanced metrics for better analysis
 * - Optimized batch processing
 * - Support for Label Engine™ integration
 */

'use strict';

import axios from 'axios';
import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';
import * as heliusService from '../api/heliusService';
import * as apiRequestManager from '../api/apiRequestManager';
import * as analyticsProcessor from '../analytics/analyticsProcessor';
import { getTokenMetadata, getTokenMetadataBatch } from '../token/tokenMetadataService';

// Transaction interface
interface Transaction {
  signature: string;
  timestamp: number;
  blockTime: number;
  tokenTransfers?: TokenTransfer[];
}

// Token transfer interface
interface TokenTransfer {
  mint: string;
  tokenAmount: number;
  decimals?: number;
  metadata?: TokenMetadata;
  price?: TokenPrice;
  usdValue?: number;
  fromAddress?: string;
  toAddress?: string;
  isSwap?: boolean;
}

// Token metadata interface
interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  category?: string;
  isMeme?: boolean;
}

// Token price interface
interface TokenPrice {
  usdPrice: number;
  timestamp: number;
  source?: string;
}

// Trade interface
interface Trade {
  signature: string;
  timestamp: number;
  blockTime: number;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAmount: number;
  solAmount?: number;
  usdValue?: number;
  tradeType: 'buy' | 'sell' | 'unknown';
  category?: string;
  isMeme?: boolean;
  price?: TokenPrice;
}

// Trading statistics interface
interface TradingStatistics {
  totalTrades: number;
  buyCount: number;
  sellCount: number;
  buySellRatio: number;
  tradingFrequency: number;
  averageTradeSize: number;
  largestTrade: number;
  totalVolume: number;
  profitableTrades: number;
  unprofitableTrades: number;
  winRate: number;
  memeTokenPercentage: number;
}

// Advanced metrics interface
interface AdvancedMetrics {
  timeOfDayDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  tokenCategoryBreakdown: Record<string, number>;
  tradeSizeDistribution: {
    small: number;
    medium: number;
    large: number;
    whale: number;
  };
  tradingPatterns: {
    memeTokenTrading: number;
    buySellRatio: number;
    tradingFrequency: number;
  };
}

// Performance metrics interface
interface PerformanceMetrics {
  cachePerformance: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  apiRequests: {
    helius: number;
    moralis: number;
  };
  rateLimitDelays: {
    helius: number;
    moralis: number;
  };
  averageProcessingTimes: {
    transactions: number;
    tokenMetadata: number;
    tradeConversion: number;
  };
  cacheStats: {
    tradingActivity: {
      keys: number;
      maxKeys: number;
    };
    tokenTransfer: {
      keys: number;
      maxKeys: number;
    };
    transaction: {
      keys: number;
      maxKeys: number;
    };
  };
}

// Trading activity result interface
interface TradingActivityResult {
  walletAddress: string;
  trades: Trade[];
  tokenTransfers: TokenTransfer[];
  statistics: TradingStatistics;
  advancedMetrics: AdvancedMetrics;
  timestamp: string;
}

// Rate limit configuration interface
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  backoffFactor: number;
  maxBackoff: number;
}

// Advanced cache configuration
const CACHE_CONFIG = {
  stdTTL: 30 * 60, // 30 minutes in seconds
  checkperiod: 120, // Check for expired entries every 2 minutes
  useClones: false, // Don't clone objects (for performance)
  maxKeys: 1000 // Maximum number of keys in cache
};

// Create separate caches for different data types
const tradingActivityCache = new NodeCache(CACHE_CONFIG);
const tokenTransferCache = new NodeCache(CACHE_CONFIG);
const transactionCache = new NodeCache(CACHE_CONFIG);

// Rate limiting configuration
const RATE_LIMIT: Record<string, RateLimitConfig> = {
  helius: {
    maxRequests: 10,
    windowMs: 1000, // 1 second
    backoffFactor: 1.5, // Exponential backoff factor
    maxBackoff: 10000 // Maximum backoff time in ms
  },
  moralis: {
    maxRequests: 5,
    windowMs: 1000,
    backoffFactor: 2,
    maxBackoff: 15000
  }
};

// Track API request timestamps for rate limiting
const requestTimestamps: Record<string, number[]> = {
  helius: [],
  moralis: []
};

// Metrics tracking
const metrics = {
  cacheHits: 0,
  cacheMisses: 0,
  apiRequests: {
    helius: 0,
    moralis: 0
  },
  rateLimitDelays: {
    helius: 0,
    moralis: 0
  },
  processingTimes: {
    transactions: [] as number[],
    tokenMetadata: [] as number[],
    tradeConversion: [] as number[]
  }
};

/**
 * Applies rate limiting to API requests
 * 
 * @param {string} api - API name ('helius' or 'moralis')
 * @returns {Promise<number>} - Delay in ms before making the request
 */
async function applyRateLimit(api: string): Promise<number> {
  const config = RATE_LIMIT[api];
  const timestamps = requestTimestamps[api];
  
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
    
    console.log(`Rate limit reached for ${api} API. Backing off for ${backoffTime}ms`);
    metrics.rateLimitDelays[api]++;
    
    // Wait for the backoff time
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    
    // Recursive call to check again after backoff
    return applyRateLimit(api);
  }
  
  // Add current timestamp to the list
  timestamps.push(now);
  metrics.apiRequests[api]++;
  
  return 0; // No delay needed
}

/**
 * Gets comprehensive trading activity for a wallet using the optimal Helius/Moralis combo
 * 
 * @param {string} walletAddress - Wallet address to analyze
 * @param {number} limit - Number of transactions to fetch
 * @param {boolean} useCache - Whether to use cached results if available
 * @param {boolean} forceRefresh - Whether to force refresh the data
 * @returns {Promise<TradingActivityResult>} Trading activity data including trades and statistics
 */
async function getWalletTradingActivity(
  walletAddress: string, 
  limit: number = 100, 
  useCache: boolean = true, 
  forceRefresh: boolean = false
): Promise<TradingActivityResult> {
  // Generate cache key
  const cacheKey = `trading_activity_${walletAddress}_${limit}`;
  
  // Check cache first if not forcing refresh
  if (useCache && !forceRefresh) {
    const cachedResult = tradingActivityCache.get<TradingActivityResult>(cacheKey);
    if (cachedResult) {
      metrics.cacheHits++;
      return cachedResult;
    }
    metrics.cacheMisses++;
  }
  
  console.log(`Fetching trading activity for wallet ${walletAddress} with limit ${limit}`);
  
  // Start timing for transactions processing
  const txStartTime = Date.now();
  
  try {
    // Fetch transactions using the API Request Manager
    const transactions = await apiRequestManager.getWalletTransactions(walletAddress, limit);
    
    // Record transaction processing time
    metrics.processingTimes.transactions.push(Date.now() - txStartTime);
    
    // Start timing for token metadata processing
    const metadataStartTime = Date.now();
    
    // Extract token transfers from transactions
    let tokenTransfers: TokenTransfer[] = [];
    transactions.forEach(tx => {
      if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
        tokenTransfers = [...tokenTransfers, ...tx.tokenTransfers];
      }
    });
    
    // Enrich token transfers with metadata and prices
    const enrichedTokenTransfers = await enrichTokenTransfers(tokenTransfers);
    
    // Record token metadata processing time
    metrics.processingTimes.tokenMetadata.push(Date.now() - metadataStartTime);
    
    // Start timing for trade conversion
    const tradeStartTime = Date.now();
    
    // Convert token transfers to trades
    const trades = convertToTrades(enrichedTokenTransfers);
    
    // Calculate trading statistics
    const statistics = calculateTradingStatistics(trades);
    
    // Calculate advanced metrics
    const advancedMetrics = calculateAdvancedMetrics(trades, enrichedTokenTransfers);
    
    // Record trade conversion processing time
    metrics.processingTimes.tradeConversion.push(Date.now() - tradeStartTime);
    
    // Create result
    const result: TradingActivityResult = {
      walletAddress,
      trades,
      tokenTransfers: enrichedTokenTransfers,
      statistics,
      advancedMetrics,
      timestamp: new Date().toISOString()
    };
    
    // Cache result
    tradingActivityCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`Error fetching trading activity for wallet ${walletAddress}:`, error);
    throw error;
  }
}

/**
 * Enriches token transfers with metadata from Moralis and other sources
 * Using the optimal Helius/Moralis combo formula
 * 
 * @param {TokenTransfer[]} tokenTransfers - Token transfers from Helius
 * @returns {Promise<TokenTransfer[]>} Enriched token transfers with metadata
 */
async function enrichTokenTransfers(tokenTransfers: TokenTransfer[]): Promise<TokenTransfer[]> {
  if (!tokenTransfers || tokenTransfers.length === 0) {
    return [];
  }
  
  // Extract unique token mints
  const uniqueMints = [...new Set(tokenTransfers.map(transfer => transfer.mint))];
  
  // Fetch token metadata in batch
  const metadataPromises = uniqueMints.map(async (mint) => {
    try {
      // Apply rate limit for Moralis API
      await applyRateLimit('moralis');
      
      const metadata = await getTokenMetadata(mint);
      return { mint, metadata };
    } catch (error) {
      console.error(`Error fetching metadata for token ${mint}:`, error);
      return { mint, metadata: null };
    }
  });
  
  // Fetch token prices in batch
  const pricePromises = uniqueMints.map(async (mint) => {
    try {
      // Apply rate limit for Moralis API
      await applyRateLimit('moralis');
      
      const price = await apiRequestManager.getTokenPrice(mint);
      return { mint, price };
    } catch (error) {
      console.error(`Error fetching price for token ${mint}:`, error);
      return { mint, price: null };
    }
  });
  
  // Wait for all promises to resolve
  const metadataResults = await Promise.all(metadataPromises);
  const priceResults = await Promise.all(pricePromises);
  
  // Create lookup maps
  const metadataMap: Record<string, TokenMetadata> = {};
  const priceMap: Record<string, TokenPrice> = {};
  
  // Populate metadata map
  metadataResults.forEach(result => {
    if (result.metadata) {
      metadataMap[result.mint] = result.metadata;
      
      // Determine if token is a meme coin
      metadataMap[result.mint].isMeme = determineMemeStatus(result.metadata, result.mint);
    }
  });
  
  // Populate price map
  priceResults.forEach(result => {
    if (result.price) {
      priceMap[result.mint] = result.price;
    }
  });
  
  // Enrich token transfers with metadata and prices
  return tokenTransfers.map(transfer => {
    const enriched = { ...transfer };
    
    if (transfer.mint) {
      enriched.metadata = metadataMap[transfer.mint] || null;
      enriched.price = priceMap[transfer.mint] || null;
      
      // Calculate USD value if price and amount are available
      if (enriched.price && enriched.price.usdPrice && 
          enriched.tokenAmount && enriched.metadata && 
          enriched.metadata.decimals) {
        const decimals = enriched.metadata.decimals;
        const amount = enriched.tokenAmount / Math.pow(10, decimals);
        enriched.usdValue = amount * enriched.price.usdPrice;
      }
    }
    
    return enriched;
  });
}

/**
 * Determines if a token is a meme coin based on metadata and address patterns
 * 
 * @param {TokenMetadata} metadata - Token metadata
 * @param {string} tokenMint - Token mint address
 * @returns {boolean} True if token is likely a meme coin
 */
function determineMemeStatus(metadata: TokenMetadata, tokenMint: string): boolean {
  if (!metadata) return false;
  
  // Check token name and symbol for common meme coin indicators
  const name = metadata.name?.toLowerCase() || '';
  const symbol = metadata.symbol?.toLowerCase() || '';
  
  // Common meme coin indicators in name or symbol
  const memeKeywords = [
    'doge', 'shib', 'inu', 'elon', 'moon', 'safe', 'cum', 'chad',
    'pepe', 'wojak', 'cat', 'floki', 'baby', 'rocket', 'lambo', 'mars',
    'moon', 'pump', 'meme', 'diamond', 'hands', 'ape', 'bonk', 'wif'
  ];
  
  // Check for meme keywords in name or symbol
  const hasMemeKeyword = memeKeywords.some(keyword => 
    name.includes(keyword) || symbol.includes(keyword)
  );
  
  // Check for animal emojis in name or symbol
  const hasAnimalEmoji = /🐕|🐶|🐱|🐭|🐹|🐰|🦊|🐻|🐼|🐨|🐯|🦁|🐮|🐷|🐸|🐵|🐔/.test(name + symbol);
  
  // Check for rocket, moon, or diamond hands emojis
  const hasMemeEmoji = /🚀|🌙|🌕|💎|👐|💰|💵|🔥|⚡|🧠|🦍/.test(name + symbol);
  
  // Check if token has very low value (common for meme coins)
  const isLowValue = metadata.decimals > 6;
  
  // Combine signals
  return hasMemeKeyword || hasAnimalEmoji || hasMemeEmoji || isLowValue;
}

/**
 * Convert token transfers to trades with enhanced classification
 * @param {TokenTransfer[]} tokenTransfers - Array of token transfers
 * @returns {Trade[]} Array of trades with buy/sell classification
 */
function convertToTrades(tokenTransfers: TokenTransfer[]): Trade[] {
  if (!tokenTransfers || tokenTransfers.length === 0) {
    return [];
  }
  
  const trades: Trade[] = [];
  
  // Group transfers by transaction signature
  const transfersBySignature: Record<string, TokenTransfer[]> = {};
  
  tokenTransfers.forEach(transfer => {
    if (!transfer.mint) return;
    
    const signature = transfer.signature;
    if (!transfersBySignature[signature]) {
      transfersBySignature[signature] = [];
    }
    transfersBySignature[signature].push(transfer);
  });
  
  // Process each transaction's transfers
  Object.entries(transfersBySignature).forEach(([signature, transfers]) => {
    if (transfers.length === 0) return;
    
    // Get transaction timestamp from the first transfer
    const timestamp = transfers[0].timestamp;
    const blockTime = transfers[0].blockTime;
    
    // Identify SOL transfers
    const solTransfers = transfers.filter(t => 
      t.mint === 'So11111111111111111111111111111111111111112'
    );
    
    // Identify token transfers (excluding SOL)
    const nonSolTransfers = transfers.filter(t => 
      t.mint !== 'So11111111111111111111111111111111111111112'
    );
    
    // Process each non-SOL token transfer
    nonSolTransfers.forEach(tokenTransfer => {
      // Skip if missing critical data
      if (!tokenTransfer.metadata || !tokenTransfer.mint) return;
      
      // Determine trade type (buy/sell)
      let tradeType: 'buy' | 'sell' | 'unknown' = 'unknown';
      let solAmount: number | undefined = undefined;
      
      // If there's a SOL transfer in the same transaction, use it to determine trade type
      if (solTransfers.length > 0) {
        const solTransfer = solTransfers[0];
        
        // Calculate SOL amount in human-readable format
        solAmount = solTransfer.tokenAmount / Math.pow(10, 9); // SOL has 9 decimals
        
        // If SOL is being sent out and token is coming in, it's a buy
        if (solTransfer.fromAddress === tokenTransfer.toAddress && 
            solTransfer.toAddress !== tokenTransfer.fromAddress) {
          tradeType = 'buy';
        } 
        // If SOL is coming in and token is being sent out, it's a sell
        else if (solTransfer.toAddress === tokenTransfer.fromAddress && 
                solTransfer.fromAddress !== tokenTransfer.toAddress) {
          tradeType = 'sell';
        }
      }
      
      // Create trade object
      const trade: Trade = {
        signature,
        timestamp,
        blockTime,
        tokenMint: tokenTransfer.mint,
        tokenSymbol: tokenTransfer.metadata?.symbol || 'UNKNOWN',
        tokenName: tokenTransfer.metadata?.name || 'Unknown Token',
        tokenAmount: tokenTransfer.tokenAmount,
        solAmount,
        usdValue: tokenTransfer.usdValue,
        tradeType,
        category: tokenTransfer.metadata?.category || 'Unknown',
        isMeme: tokenTransfer.metadata?.isMeme || false,
        price: tokenTransfer.price
      };
      
      trades.push(trade);
    });
  });
  
  return trades;
}

/**
 * Calculates trading statistics
 * 
 * @param {Trade[]} trades - Trades data
 * @returns {TradingStatistics} Trading statistics
 */
function calculateTradingStatistics(trades: Trade[]): TradingStatistics {
  if (!trades || trades.length === 0) {
    return {
      totalTrades: 0,
      buyCount: 0,
      sellCount: 0,
      buySellRatio: 0,
      tradingFrequency: 0,
      averageTradeSize: 0,
      largestTrade: 0,
      totalVolume: 0,
      profitableTrades: 0,
      unprofitableTrades: 0,
      winRate: 0,
      memeTokenPercentage: 0
    };
  }
  
  // Count buys and sells
  const buyCount = trades.filter(t => t.tradeType === 'buy').length;
  const sellCount = trades.filter(t => t.tradeType === 'sell').length;
  
  // Calculate buySellRatio (avoid division by zero)
  const buySellRatio = sellCount > 0 ? buyCount / sellCount : buyCount;
  
  // Calculate trading frequency (trades per day)
  let tradingFrequency = 0;
  if (trades.length > 1) {
    const firstTrade = trades[trades.length - 1];
    const lastTrade = trades[0];
    const tradingDays = (lastTrade.timestamp - firstTrade.timestamp) / (24 * 60 * 60 * 1000);
    tradingFrequency = tradingDays > 0 ? trades.length / tradingDays : trades.length;
  }
  
  // Calculate trade sizes
  const tradesWithValue = trades.filter(t => t.usdValue && t.usdValue > 0);
  const totalVolume = tradesWithValue.reduce((sum, t) => sum + (t.usdValue || 0), 0);
  const averageTradeSize = tradesWithValue.length > 0 ? totalVolume / tradesWithValue.length : 0;
  const largestTrade = tradesWithValue.length > 0 ? 
    Math.max(...tradesWithValue.map(t => t.usdValue || 0)) : 0;
  
  // Count meme tokens
  const memeTokenCount = trades.filter(t => t.isMeme).length;
  const memeTokenPercentage = (memeTokenCount / trades.length) * 100;
  
  // For now, we don't have enough data to calculate profitable trades
  // This would require tracking entry and exit points for each token
  const profitableTrades = 0;
  const unprofitableTrades = 0;
  const winRate = 0;
  
  return {
    totalTrades: trades.length,
    buyCount,
    sellCount,
    buySellRatio,
    tradingFrequency,
    averageTradeSize,
    largestTrade,
    totalVolume,
    profitableTrades,
    unprofitableTrades,
    winRate,
    memeTokenPercentage
  };
}

/**
 * Calculates advanced metrics for deeper analysis
 * 
 * @param {Trade[]} trades - Trades data
 * @param {TokenTransfer[]} tokenTransfers - Token transfers data
 * @returns {AdvancedMetrics} Advanced metrics
 */
function calculateAdvancedMetrics(trades: Trade[], tokenTransfers: TokenTransfer[]): AdvancedMetrics {
  if (!trades || trades.length === 0) {
    return {
      timeOfDayDistribution: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      tokenCategoryBreakdown: {},
      tradeSizeDistribution: { small: 0, medium: 0, large: 0, whale: 0 },
      tradingPatterns: { memeTokenTrading: 0, buySellRatio: 0, tradingFrequency: 0 }
    };
  }
  
  // Time of day distribution
  const timeOfDayDistribution = {
    morning: 0,  // 6am-12pm
    afternoon: 0, // 12pm-6pm
    evening: 0,   // 6pm-12am
    night: 0      // 12am-6am
  };
  
  trades.forEach(trade => {
    const date = new Date(trade.timestamp);
    const hour = date.getHours();
    
    if (hour >= 6 && hour < 12) {
      timeOfDayDistribution.morning++;
    } else if (hour >= 12 && hour < 18) {
      timeOfDayDistribution.afternoon++;
    } else if (hour >= 18 && hour < 24) {
      timeOfDayDistribution.evening++;
    } else {
      timeOfDayDistribution.night++;
    }
  });
  
  // Convert to percentages
  Object.keys(timeOfDayDistribution).forEach(key => {
    timeOfDayDistribution[key as keyof typeof timeOfDayDistribution] = 
      (timeOfDayDistribution[key as keyof typeof timeOfDayDistribution] / trades.length) * 100;
  });
  
  // Token category breakdown
  const tokenCategoryBreakdown: Record<string, number> = {};
  trades.forEach(trade => {
    const category = trade.category || 'Unknown';
    if (!tokenCategoryBreakdown[category]) {
      tokenCategoryBreakdown[category] = 0;
    }
    tokenCategoryBreakdown[category]++;
  });
  
  // Convert to percentages
  Object.keys(tokenCategoryBreakdown).forEach(key => {
    tokenCategoryBreakdown[key] = (tokenCategoryBreakdown[key] / trades.length) * 100;
  });
  
  // Trade size distribution (based on SOL amount)
  const tradeSizeDistribution = {
    small: 0,   // < 0.1 SOL
    medium: 0,  // 0.1 - 1 SOL
    large: 0,   // 1 - 10 SOL
    whale: 0    // > 10 SOL
  };
  
  trades.forEach(trade => {
    if (!trade.solAmount) return;
    
    if (trade.solAmount < 0.1) {
      tradeSizeDistribution.small++;
    } else if (trade.solAmount < 1) {
      tradeSizeDistribution.medium++;
    } else if (trade.solAmount < 10) {
      tradeSizeDistribution.large++;
    } else {
      tradeSizeDistribution.whale++;
    }
  });
  
  // Convert to percentages
  const tradesWithSol = trades.filter(t => t.solAmount).length;
  if (tradesWithSol > 0) {
    Object.keys(tradeSizeDistribution).forEach(key => {
      tradeSizeDistribution[key as keyof typeof tradeSizeDistribution] = 
        (tradeSizeDistribution[key as keyof typeof tradeSizeDistribution] / tradesWithSol) * 100;
    });
  }
  
  // Trading patterns
  const tradingPatterns = {
    // Percentage of trades that are meme coins
    memeTokenTrading: (trades.filter(t => t.category === 'Meme').length / trades.length) * 100,
    
    // Buy/sell ratio
    buySellRatio: trades.filter(t => t.tradeType === 'buy').length / 
                 Math.max(1, trades.filter(t => t.tradeType === 'sell').length),
    
    // Trading frequency (trades per day)
    tradingFrequency: calculateTradingStatistics(trades).tradingFrequency
  };
  
  return {
    timeOfDayDistribution,
    tokenCategoryBreakdown,
    tradeSizeDistribution,
    tradingPatterns
  };
}

/**
 * Gets performance metrics for the trading activity service
 * 
 * @returns {PerformanceMetrics} Performance metrics
 */
function getPerformanceMetrics(): PerformanceMetrics {
  // Calculate average processing times
  const calculateAverage = (arr: number[]) => arr.length > 0 ? 
    arr.reduce((sum, time) => sum + time, 0) / arr.length : 0;
  
  const averageProcessingTimes = {
    transactions: calculateAverage(metrics.processingTimes.transactions),
    tokenMetadata: calculateAverage(metrics.processingTimes.tokenMetadata),
    tradeConversion: calculateAverage(metrics.processingTimes.tradeConversion)
  };
  
  return {
    cachePerformance: {
      hits: metrics.cacheHits,
      misses: metrics.cacheMisses,
      hitRate: metrics.cacheHits + metrics.cacheMisses > 0 ? 
        (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100 : 0
    },
    apiRequests: metrics.apiRequests,
    rateLimitDelays: metrics.rateLimitDelays,
    averageProcessingTimes,
    cacheStats: {
      tradingActivity: {
        keys: tradingActivityCache.keys().length,
        maxKeys: CACHE_CONFIG.maxKeys
      },
      tokenTransfer: {
        keys: tokenTransferCache.keys().length,
        maxKeys: CACHE_CONFIG.maxKeys
      },
      transaction: {
        keys: transactionCache.keys().length,
        maxKeys: CACHE_CONFIG.maxKeys
      }
    }
  };
}

/**
 * Clears all caches
 */
function clearAllCaches(): void {
  tradingActivityCache.flushAll();
  tokenTransferCache.flushAll();
  transactionCache.flushAll();
  console.log('All caches cleared');
}

export {
  getWalletTradingActivity,
  calculateTradingStatistics,
  calculateAdvancedMetrics,
  getPerformanceMetrics,
  clearAllCaches,
  Transaction,
  TokenTransfer,
  TokenMetadata,
  TokenPrice,
  Trade,
  TradingStatistics,
  AdvancedMetrics,
  PerformanceMetrics,
  TradingActivityResult
};

export default {
  getWalletTradingActivity,
  calculateTradingStatistics,
  calculateAdvancedMetrics,
  getPerformanceMetrics,
  clearAllCaches
};
