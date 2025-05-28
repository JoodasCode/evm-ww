/**
 * Helius API Client
 * 
 * This client handles all interactions with the Helius API for Solana data.
 */

import config from '../config';

// API key and URL from config
const HELIUS_API_KEY = process.env.HELIUS_API_KEY || config.helius.apiKey;
const HELIUS_API_URL = config.helius.apiUrl;

/**
 * Fetches token balances for a wallet
 * @param walletAddress - The wallet address
 * @returns Token balance data from Helius
 */
export async function fetchTokenBalances(walletAddress: string): Promise<any> {
  try {
    const response = await fetch(`${HELIUS_API_URL}/addresses/${walletAddress}/balances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': HELIUS_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token balances from Helius:', error);
    throw error;
  }
}

/**
 * Fetches transaction history for a wallet
 * @param walletAddress - The wallet address
 * @param options - Query options (limit, before, etc.)
 * @returns Transaction history data from Helius
 */
export async function fetchTransactionHistory(
  walletAddress: string, 
  options: { limit?: number; before?: string; } = {}
): Promise<any> {
  try {
    const limit = options.limit || 100;
    const before = options.before ? `&before=${options.before}` : '';
    
    const response = await fetch(
      `${HELIUS_API_URL}/addresses/${walletAddress}/transactions?limit=${limit}${before}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': HELIUS_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction history from Helius:', error);
    throw error;
  }
}

/**
 * Fetches parsed transactions for a wallet (with type information)
 * @param walletAddress - The wallet address
 * @param options - Query options
 * @returns Parsed transaction data from Helius
 */
export async function fetchParsedTransactions(
  walletAddress: string,
  options: { limit?: number; type?: string; } = {}
): Promise<any> {
  try {
    const limit = options.limit || 100;
    const type = options.type ? `&type=${options.type}` : '';
    
    const response = await fetch(
      `${HELIUS_API_URL}/addresses/${walletAddress}/parsed-transactions?limit=${limit}${type}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': HELIUS_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching parsed transactions from Helius:', error);
    throw error;
  }
}