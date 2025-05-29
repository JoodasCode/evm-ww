export interface WalletContextType {
  wallet: string | null;
  isConnected: boolean;
  isSimulated: boolean;
  isAnalyzing: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  simulateWallet: (address: string) => Promise<void>;
}

export interface WhispererScore {
  id: number;
  address: string;
  whispererScore: number;
  degenScore: number;
  roiScore: number;
  portfolioValue: string;
  dailyChange: string;
  weeklyChange: string;
  currentMood: string;
  tradingFrequency: string;
  riskLevel: string;
  avgTradeSize: string;
  dailyTrades: number;
  profitLoss: string;
  influenceScore: number;
  archetype: string | null;
  isSimulated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenBalance {
  id: number;
  walletAddress: string;
  mint: string;
  symbol: string;
  name: string;
  amount: string;
  decimals: number;
  usdValue: string;
  logo: string | null;
  category: string | null;
  change24h: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TradingActivity {
  id: number;
  walletAddress: string;
  signature: string;
  type: string;
  tokenIn: string | null;
  tokenOut: string | null;
  amountIn: string | null;
  amountOut: string | null;
  usdValue: string | null;
  timestamp: string;
  createdAt: string;
}
