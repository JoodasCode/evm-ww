/**
 * Moralis API Client
 * 
 * This client handles all interactions with the Moralis API for token data.
 */

import config from '../../config';

// API key and URL from config
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || config.moralis.apiKey;
const MORALIS_API_URL = config.moralis.apiUrl;

/**
 * Fetches token price data
 * @param tokenAddress - The token mint address
 * @returns Token price data from Moralis
 */
export async function fetchTokenPrice(tokenAddress: string): Promise<any> {
  try {
    const response = await fetch(`${MORALIS_API_URL}/token/mainnet/${tokenAddress}/price`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Token not found
      }
      throw new Error(`Moralis API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price from Moralis:', error);
    return null;
  }
}

/**
 * Fetches token metadata
 * @param tokenAddress - The token mint address
 * @returns Token metadata from Moralis
 */
export async function fetchTokenMetadata(tokenAddress: string): Promise<any> {
  try {
    const response = await fetch(`${MORALIS_API_URL}/token/mainnet/${tokenAddress}/metadata`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Token not found
      }
      throw new Error(`Moralis API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata from Moralis:', error);
    return null;
  }
}

/**
 * Fetches price history for a token
 * @param tokenAddress - The token mint address
 * @param days - Number of days of history to fetch
 * @returns Token price history from Moralis
 */
export async function fetchTokenPriceHistory(tokenAddress: string, days: number = 7): Promise<any> {
  try {
    const response = await fetch(`${MORALIS_API_URL}/token/mainnet/${tokenAddress}/price-history?days=${days}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Token not found
      }
      throw new Error(`Moralis API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price history from Moralis:', error);
    return null;
  }
}

/**
 * Fetches multiple token prices in a single request
 * @param tokenAddresses - Array of token mint addresses
 * @returns Object with token prices keyed by address
 */
export async function fetchMultipleTokenPrices(tokenAddresses: string[]): Promise<Record<string, any>> {
  try {
    // Moralis doesn't have a bulk endpoint, so we need to make multiple requests
    const promises = tokenAddresses.map(address => fetchTokenPrice(address));
    const results = await Promise.all(promises);
    
    // Create a map of address to price data
    const priceMap: Record<string, any> = {};
    tokenAddresses.forEach((address, index) => {
      priceMap[address] = results[index];
    });
    
    return priceMap;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    return {};
  }
}
