/**
 * Helius API Client
 * 
 * Handles all interactions with the Helius API for Solana blockchain data
 * Rate limited to 10 requests/second
 */

import axios from 'axios';
import config from '../config';

// Rate limiting: 10 requests per second
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 1000;
let requestQueue: Array<() => void> = [];
let requestCount = 0;
let windowStart = Date.now();

/**
 * Rate limiter that ensures we don't exceed 10 requests/second
 */
const rateLimiter = (): Promise<void> => {
  return new Promise((resolve) => {
    const now = Date.now();
    
    // Reset window if needed
    if (now - windowStart >= RATE_WINDOW_MS) {
      requestCount = 0;
      windowStart = now;
    }
    
    // If under limit, execute immediately
    if (requestCount < RATE_LIMIT) {
      requestCount++;
      resolve();
      return;
    }
    
    // Otherwise, queue the request
    requestQueue.push(() => {
      requestCount++;
      resolve();
    });
    
    // Process queue after window resets
    setTimeout(() => {
      const nextRequest = requestQueue.shift();
      if (nextRequest) {
        requestCount = 1;
        windowStart = Date.now();
        nextRequest();
      }
    }, RATE_WINDOW_MS - (now - windowStart));
  });
};

const heliusApi = axios.create({
  baseURL: `${config.helius.apiUrl}/?api-key=${config.helius.apiKey}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HeliusTransaction {
  signature: string;
  slot: number;
  err: any;
  memo: string | null;
  blockTime: number;
  confirmationStatus: string;
}

export interface TokenBalance {
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

/**
 * Fetch transaction signatures for a wallet address
 */
export async function fetchTransactionSignatures(
  walletAddress: string,
  limit: number = 100
): Promise<HeliusTransaction[]> {
  try {
    // Apply rate limiting
    await rateLimiter();
    
    const response = await heliusApi.post('', {
      jsonrpc: '2.0',
      id: 'helius-signatures',
      method: 'getSignaturesForAddress',
      params: [
        walletAddress,
        {
          limit,
          commitment: 'confirmed',
        },
      ],
    });

    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching transaction signatures:', error);
    throw new Error('Failed to fetch transaction signatures from Helius');
  }
}

/**
 * Fetch detailed transaction data
 */
export async function fetchTransactionDetails(signature: string): Promise<any> {
  try {
    // Apply rate limiting
    await rateLimiter();
    
    const response = await heliusApi.post('', {
      jsonrpc: '2.0',
      id: 'helius-transaction',
      method: 'getParsedTransaction',
      params: [
        signature,
        {
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0,
        },
      ],
    });

    return response.data.result;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw new Error('Failed to fetch transaction details from Helius');
  }
}

/**
 * Fetch token balances for a wallet
 */
export async function fetchTokenBalances(walletAddress: string): Promise<{ tokens: TokenBalance[] }> {
  try {
    // Apply rate limiting
    await rateLimiter();
    
    const response = await heliusApi.post('', {
      jsonrpc: '2.0',
      id: 'helius-balances',
      method: 'getTokenAccountsByOwner',
      params: [
        walletAddress,
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          encoding: 'jsonParsed',
        },
      ],
    });

    const tokenAccounts = response.data.result?.value || [];
    
    const tokens: TokenBalance[] = tokenAccounts.map((account: any) => ({
      mint: account.account.data.parsed.info.mint,
      owner: account.account.data.parsed.info.owner,
      amount: account.account.data.parsed.info.tokenAmount.amount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
      uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
      uiAmountString: account.account.data.parsed.info.tokenAmount.uiAmountString,
    }));

    return { tokens };
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw new Error('Failed to fetch token balances from Helius');
  }
}