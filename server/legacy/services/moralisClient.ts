/**
 * Moralis API Client
 * 
 * Handles all interactions with the Moralis API for token metadata and prices
 */

import axios from 'axios';
import config from '../config';

const moralisApi = axios.create({
  baseURL: config.moralis.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.moralis.apiKey,
  },
});

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  category?: string;
}

export interface TokenPrice {
  usdPrice: number;
  '24hrPercentChange'?: number;
  timestamp: number;
}

/**
 * Fetch token metadata from Moralis
 */
export async function fetchTokenMetadata(tokenAddress: string): Promise<TokenMetadata | null> {
  try {
    const response = await moralisApi.get(`/token/${tokenAddress}/metadata`, {
      params: {
        network: 'mainnet',
      },
    });

    const data = response.data;
    
    return {
      name: data.name || 'Unknown Token',
      symbol: data.symbol || 'UNKNOWN',
      decimals: data.decimals || 9,
      logo: data.logo,
      category: data.category,
    };
  } catch (error) {
    console.error('Error fetching token metadata from Moralis:', error);
    return null;
  }
}

/**
 * Fetch token price from Moralis
 */
export async function fetchTokenPrice(tokenAddress: string): Promise<TokenPrice | null> {
  try {
    const response = await moralisApi.get(`/token/${tokenAddress}/price`, {
      params: {
        network: 'mainnet',
      },
    });

    const data = response.data;
    
    return {
      usdPrice: data.usdPrice || 0,
      '24hrPercentChange': data['24hrPercentChange'],
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching token price from Moralis:', error);
    return null;
  }
}

/**
 * Fetch multiple token prices in batch
 */
export async function fetchTokenPricesBatch(tokenAddresses: string[]): Promise<Record<string, TokenPrice>> {
  const prices: Record<string, TokenPrice> = {};
  
  // Process in smaller batches to avoid rate limits
  const batchSize = 5;
  
  for (let i = 0; i < tokenAddresses.length; i += batchSize) {
    const batch = tokenAddresses.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (address) => {
      const price = await fetchTokenPrice(address);
      if (price) {
        prices[address] = price;
      }
    });
    
    await Promise.all(batchPromises);
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < tokenAddresses.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return prices;
}