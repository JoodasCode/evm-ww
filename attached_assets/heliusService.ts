/**
 * HeliusService provides methods for interacting with the Helius API
 * to fetch Solana transaction data for the Wallet Whisperer application.
 */
class HeliusService {
  private apiKey: string;

  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '219e827e-614e-46ab-8cfd-2858cbf8370b';
    this.baseUrl = 'https://api.helius.xyz/v0';
  }

  /**
   * Get transactions for a specific wallet address
   */
  async getTransactions(walletAddress: string, limit = 100) {
    try {
      const response = await fetch(
        `${this.baseUrl}/addresses/${walletAddress}/transactions?api-key=${this.apiKey}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions from Helius:', error);
      throw error;
    }
  }

  /**
   * Get token balances for a specific wallet address
   */
  async getTokenBalances(walletAddress: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/addresses/${walletAddress}/balances?api-key=${this.apiKey}`,
      );

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching token balances from Helius:', error);
      throw error;
    }
  }

  /**
   * Get NFTs for a specific wallet address
   */
  async getNFTs(walletAddress: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/addresses/${walletAddress}/nfts?api-key=${this.apiKey}`,
      );

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching NFTs from Helius:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for a specific wallet address
   * with parsed and enriched data
   */
  async getEnrichedTransactions(walletAddress: string, limit = 100) {
    try {
      const response = await fetch(`${this.baseUrl}/addresses/${walletAddress}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'api-key': this.apiKey,
          options: {
            limit,
            'transaction-details': 'full',
            encoding: 'jsonParsed',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching enriched transactions from Helius:', error);
      throw error;
    }
  }

  /**
   * Get mock transaction data for development
   */
  getMockTransactions(walletAddress: string) {
    // Sample transaction data for development
    return [
      {
        signature: 'mock-signature-1',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
        type: 'SWAP',
        sourceToken: 'SOL',
        destinationToken: 'USDC',
        amount: 2.5,
        usdValue: 175.25,
        fee: 0.000005,
      },
      {
        signature: 'mock-signature-2',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
        type: 'SWAP',
        sourceToken: 'USDC',
        destinationToken: 'RAY',
        amount: 100,
        usdValue: 100,
        fee: 0.000005,
      },
      {
        signature: 'mock-signature-3',
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 12, // 12 hours ago
        type: 'TRANSFER',
        sourceToken: 'SOL',
        destinationAddress: 'Another-wallet-address',
        amount: 0.5,
        usdValue: 35.05,
        fee: 0.000005,
      },
    ];
  }

  /**
   * Get mock token balances for development
   */
  getMockTokenBalances(walletAddress: string) {
    // Sample token balance data for development
    return [
      {
        mint: 'SOL',
        amount: 5.75,
        usdValue: 402.5,
      },
      {
        mint: 'USDC',
        amount: 250.5,
        usdValue: 250.5,
      },
      {
        mint: 'RAY',
        amount: 100,
        usdValue: 120.75,
      },
      {
        mint: 'BONK',
        amount: 1000000,
        usdValue: 50.25,
      },
    ];
  }
}

export const heliusService = new HeliusService();
