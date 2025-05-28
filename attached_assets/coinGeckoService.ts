/**
 * CoinGeckoService provides methods for interacting with the CoinGecko API
 * to fetch token price data for the Wallet Whisperer application.
 */
class CoinGeckoService {
  private apiKey: string;

  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '';
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  /**
   * Get current price for a specific token
   */
  async getTokenPrice(tokenId: string, currency = 'usd') {
    try {
      const url = `${this.baseUrl}/simple/price?ids=${tokenId}&vs_currencies=${currency}`;
      const headers: HeadersInit = {};

      if (this.apiKey) {
        headers['x-cg-pro-api-key'] = this.apiKey;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data[tokenId][currency];
    } catch (error) {
      console.error('Error fetching token price from CoinGecko:', error);
      throw error;
    }
  }

  /**
   * Get historical price data for a specific token
   */
  async getTokenHistoricalData(tokenId: string, days = 30, currency = 'usd') {
    try {
      const url = `${this.baseUrl}/coins/${tokenId}/market_chart?vs_currency=${currency}&days=${days}`;
      const headers: HeadersInit = {};

      if (this.apiKey) {
        headers['x-cg-pro-api-key'] = this.apiKey;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching token historical data from CoinGecko:', error);
      throw error;
    }
  }

  /**
   * Get market data for multiple tokens
   */
  async getMarketData(tokenIds: string[], currency = 'usd') {
    try {
      const url = `${this.baseUrl}/coins/markets?vs_currency=${currency}&ids=${tokenIds.join(',')}&order=market_cap_desc&per_page=${tokenIds.length}&page=1&sparkline=false`;
      const headers: HeadersInit = {};

      if (this.apiKey) {
        headers['x-cg-pro-api-key'] = this.apiKey;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market data from CoinGecko:', error);
      throw error;
    }
  }

  /**
   * Get token information by contract address
   */
  async getTokenByContractAddress(contractAddress: string, platform = 'solana') {
    try {
      const url = `${this.baseUrl}/coins/${platform}/contract/${contractAddress}`;
      const headers: HeadersInit = {};

      if (this.apiKey) {
        headers['x-cg-pro-api-key'] = this.apiKey;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching token by contract address from CoinGecko:', error);
      throw error;
    }
  }

  /**
   * Get mock price data for development
   */
  getMockTokenPrices() {
    // Sample price data for development
    return {
      solana: 70.25,
      'usd-coin': 1.00,
      raydium: 1.21,
      bonk: 0.00000503,
      'jito-network': 2.85,
      'render-token': 4.12,
      'pyth-network': 0.45,
    };
  }

  /**
   * Get mock historical data for development
   */
  getMockHistoricalData(tokenId: string, days = 30) {
    // Generate mock price data with some volatility
    const prices: [number, number][] = [];
    const volumes: [number, number][] = [];
    const marketCaps: [number, number][] = [];

    const basePrice = this.getMockTokenPrices()[tokenId as keyof ReturnType<typeof this.getMockTokenPrices>] || 1;
    const now = Date.now();

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60 * 1000;
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const price = basePrice * randomFactor;
      const volume = basePrice * 1000000 * (0.5 + Math.random());
      const marketCap = basePrice * 10000000 * (0.9 + Math.random() * 0.2);

      prices.push([timestamp, price]);
      volumes.push([timestamp, volume]);
      marketCaps.push([timestamp, marketCap]);
    }

    return {
      prices,
      market_caps: marketCaps,
      total_volumes: volumes,
    };
  }
}

export const coinGeckoService = new CoinGeckoService();
