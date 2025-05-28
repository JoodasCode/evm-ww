import { geckoTerminalService } from './geckoTerminalService';
import { prismaService } from './prismaService';
import { psychometricService } from './psychometricService';
import { heliusService } from './heliusService';

// Type definitions
interface WalletData {
  walletAddress: string;
  scores?: WalletScores;
  holdings?: WalletHolding[];
  trades?: WalletTrade[];
  behavior?: WalletBehavior;
  behaviorTags?: WalletBehaviorTag[];
  connections?: WalletConnection[];
  activity?: WalletActivity[];
  network?: WalletNetwork;
}

interface WalletScores {
  id: number;
  wallet_address: string;
  whisperer_score: number;
  degen_score: number;
  roi_score: number;
  discipline_score: number;
  timing_score: number;
  diversity_score: number;
  emotional_score: number;
  cognitive_score?: number;
  owner_since: Date;
  trading_frequency: string | null;
  risk_level: string | null;
  avg_trade_size: number;
  daily_change: number;
  weekly_change: number;
  created_at: Date;
  updated_at: Date;
}

interface WalletHolding {
  id: number;
  wallet_address: string;
  token: string;
  value: number;
  allocation: number;
  entry_price: number;
  current_price: number;
  profit_loss: number;
  holding_period: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenIcon?: string;
  created_at: Date;
  updated_at: Date;
}

interface WalletTrade {
  id: number;
  wallet_address: string;
  token: string;
  type: string;
  amount: number;
  price: number;
  value: number;
  timestamp: Date;
  exit_type: string | null;
  profit_loss: number | null;
  holding_period: number | null;
  emotional_state: string | null;
  tokenName?: string;
  tokenSymbol?: string;
  tokenIcon?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface WalletBehavior {
  id: number;
  wallet_address: string;
  archetype: string;
  secondary_archetype: string | null;
  emotional_state: string;
  risk_appetite: number;
  fomo_score: number;
  patience_score: number;
  conviction_score: number;
  adaptability_score: number;
  created_at: Date;
  updated_at: Date;
}

interface WalletBehaviorTag {
  id: number;
  wallet_address: string;
  tag: string;
  confidence: number;
  created_at: Date;
  updated_at: Date;
}

interface WalletConnection {
  id: number;
  wallet_address: string;
  connected_at: Date;
  disconnected_at: Date | null;
  session_duration: number | null;
  created_at: Date;
  updated_at: Date;
}

interface WalletActivity {
  id: number;
  wallet_address: string;
  activity_type: string;
  timestamp: Date;
  details: string | null;
  created_at: Date;
  updated_at: Date;
}

interface WalletNetwork {
  id: number;
  wallet_address: string;
  network_size: number;
  influence_score: number;
  created_at: Date;
  updated_at: Date;
}

// Token data types
interface TokenData {
  address: string;
  name: string;
  symbol: string;
  price_usd: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  icon?: string;
}

interface TokenDataMap {
  [key: string]: TokenData;
}

/**
 * DataService is the main service that provides access to
 * all the services in the Wallet Whisperer application.
 */
class DataService {
  /**
   * Get wallet data including psychological metrics
   */
  async getWalletData(walletAddress: string): Promise<WalletData> {
    try {
      // Get wallet data from various services
      const [
        walletScores,
        walletHoldings,
        walletTrades,
        walletBehavior,
        walletBehaviorTags,
        walletNetwork,
        walletConnections,
        walletActivity,
      ] = await Promise.all([
        prismaService.getWalletScores(walletAddress),
        prismaService.getWalletHoldings(walletAddress),
        prismaService.getWalletTrades(walletAddress),
        prismaService.getWalletBehavior(walletAddress),
        prismaService.getWalletNetwork(walletAddress),
        prismaService.getWalletConnections(walletAddress),
        prismaService.getWalletActivity(walletAddress),
        prismaService.getWalletBehaviorTags(walletAddress),
      ]);

      // Return the combined data
      return {
        walletAddress,
        scores: walletScores,
        holdings: walletHoldings,
        trades: walletTrades,
        behavior: walletBehavior,
        behaviorTags: walletBehaviorTags,
        network: walletNetwork,
        connections: walletConnections,
        activity: walletActivity,
      };
    } catch (error) {
      console.error('Error getting wallet data:', error);
      throw error;
    }
  }

  /**
   * Get token data for a specific token
   */
  async getTokenData(tokenAddress: string): Promise<TokenData | null> {
    try {
      return await geckoTerminalService.getTokenData(tokenAddress);
    } catch (error) {
      console.error('Error getting token data:', error);
      return null;
    }
  }

  /**
   * Get token data for multiple tokens
   */
  async getTokensData(tokenAddresses: string[]): Promise<TokenDataMap> {
    try {
      return await geckoTerminalService.getTokensData(tokenAddresses);
    } catch (error) {
      console.error('Error getting tokens data:', error);
      return {};
    }
  }

  /**
   * Get the top wallets by whisperer score
   */
  async getTopWallets(limit: number = 10): Promise<WalletScores[]> {
    try {
      return prismaService.getTopWallets(limit);
    } catch (error) {
      console.error('Error getting top wallets:', error);
      throw error;
    }
  }

  // No mock data methods - only real wallet data is used
}

// Export singleton instance
export const dataService = new DataService();
