/**
 * GeckoTerminalService provides methods for interacting with the GeckoTerminal API
 * to fetch token data for the Wallet Whisperer application.
 */
class GeckoTerminalService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_GECKOTERMINAL_API_URL || 'https://api.geckoterminal.com/api/v2';
  }

  /**
   * Get token information by address
   */
  async getTokenInfo(tokenAddress: string, network = 'solana') {
    try {
      const response = await fetch(`${this.baseUrl}/networks/${network}/tokens/${tokenAddress}`);

      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching token info from GeckoTerminal:', error);
      throw error;
    }
  }

  /**
   * Get token price and market data
   */
  async getTokenMarketData(tokenAddress: string, network = 'solana') {
    try {
      const response = await fetch(`${this.baseUrl}/networks/${network}/tokens/${tokenAddress}/token_market_data`);

      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching token market data from GeckoTerminal:', error);
      throw error;
    }
  }

  /**
   * Get token icon URL
   */
  async getTokenIcon(tokenAddress: string, network = 'solana') {
    try {
      const tokenInfo = await this.getTokenInfo(tokenAddress, network);
      return tokenInfo.attributes.image_url;
    } catch (error) {
      console.error('Error fetching token icon from GeckoTerminal:', error);
      // Return a default icon if there's an error
      return 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
    }
  }

  /**
   * Get top tokens on Solana
   */
  async getTopTokens(network = 'solana', limit = 20) {
    try {
      const response = await fetch(`${this.baseUrl}/networks/${network}/tokens?page=1&per_page=${limit}`);

      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching top tokens from GeckoTerminal:', error);
      throw error;
    }
  }

  /**
   * Get mock token data for development
   */
  getMockTokenData() {
    return {
      So11111111111111111111111111111111111111112: {
        name: 'Solana',
        symbol: 'SOL',
        decimals: 9,
        price_usd: 70.25,
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      },
      EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        price_usd: 1.00,
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      },
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': {
        name: 'Raydium',
        symbol: 'RAY',
        decimals: 6,
        price_usd: 1.21,
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
      },
      DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
        name: 'BONK',
        symbol: 'BONK',
        decimals: 5,
        price_usd: 0.00000503,
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
      },
      '7LmGzEgnXfvuMaRN4cWYJBNGx8pS8NXhbQb6PhSxAuBD': {
        name: 'Jito',
        symbol: 'JTO',
        decimals: 9,
        price_usd: 2.85,
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7LmGzEgnXfvuMaRN4cWYJBNGx8pS8NXhbQb6PhSxAuBD/logo.png',
      },
    };
  }
}

export const geckoTerminalService = new GeckoTerminalService();
