/**
 * Token Balance Service
 * 
 * This service handles fetching and enriching token balance data using
 * Helius for Solana data and Moralis for price information.
 */

import { fetchTokenBalances } from './heliusClient';
import { fetchTokenPrice, fetchTokenMetadata } from './moralisClient';
import { getCachedData, setCachedData } from './redisService';
import config from '../config';

export interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdValue: number;
  logo?: string;
  category?: string;
  change24h?: number;
}

/**
 * Gets enriched token balances for a wallet
 * @param walletAddress - The wallet address
 * @returns Array of enriched token balances
 */
export async function getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    // Check cache first
    const cacheKey = `${config.cache.prefix.tokenBalance}${walletAddress}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Token balances found in cache');
      return JSON.parse(cachedData);
    }

    console.log('Fetching token balances from Helius...');
    
    // Fetch raw balance data from Helius
    const heliusData = await fetchTokenBalances(walletAddress);
    
    if (!heliusData || !heliusData.tokens) {
      console.log('No token data found from Helius');
      return [];
    }

    // Enrich each token with price and metadata
    const enrichedBalances: TokenBalance[] = [];
    
    for (const token of heliusData.tokens) {
      try {
        // Get price data from Moralis
        const priceData = await fetchTokenPrice(token.mint);
        const metadata = await fetchTokenMetadata(token.mint);
        
        const balance: TokenBalance = {
          mint: token.mint,
          symbol: token.symbol || metadata?.symbol || 'UNKNOWN',
          name: token.name || metadata?.name || 'Unknown Token',
          amount: token.amount || 0,
          decimals: token.decimals || 9,
          usdValue: priceData?.usdPrice ? (token.amount * priceData.usdPrice) : 0,
          logo: metadata?.logo,
          category: metadata?.category,
          change24h: priceData?.['24hrPercentChange']
        };

        enrichedBalances.push(balance);
      } catch (error) {
        console.error(`Error enriching token ${token.mint}:`, error);
        
        // Add basic token info even if enrichment fails
        enrichedBalances.push({
          mint: token.mint,
          symbol: token.symbol || 'UNKNOWN',
          name: token.name || 'Unknown Token',
          amount: token.amount || 0,
          decimals: token.decimals || 9,
          usdValue: 0
        });
      }
    }

    // Cache the enriched data
    await setCachedData(cacheKey, JSON.stringify(enrichedBalances), config.cache.defaultTtl);
    
    console.log(`Fetched and enriched ${enrichedBalances.length} token balances`);
    return enrichedBalances;
    
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}