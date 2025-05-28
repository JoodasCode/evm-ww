/**
 * Mock wallet data for development and testing
 * This file provides sample data for the Wallet Whisperer application
 * when direct database access is disabled or unavailable.
 */

// Type definitions for mock data
type WalletAddress = string;

interface WalletScore {
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
  avg_trade_size: number | null;
  daily_change: number | null;
  weekly_change: number | null;
  created_at: Date;
  updated_at: Date;
}

interface WalletHolding {
  id: number;
  wallet_address: string;
  token: string;
  value: number;
  allocation: number;
  entry_price: number | null;
  current_price: number | null;
  profit_loss: number | null;
  holding_period: number | null;
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
}

interface WalletBehavior {
  id: number;
  wallet_address: string;
  archetype: string | null;
  secondary_archetype: string | null;
  emotional_state: string | null;
  risk_appetite: number | null;
  fomo_score: number | null;
  patience_score: number | null;
  conviction_score: number | null;
  adaptability_score: number | null;
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
  connected_address: string;
  connection_strength: number;
  connection_type: string;
  created_at: Date;
  updated_at: Date;
}

interface WalletActivity {
  id: number;
  wallet_address: string;
  date: Date;
  transaction_count: number;
  volume_usd: number;
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

interface WalletData {
  scores: WalletScore | null;
  holdings: WalletHolding[];
  trades: WalletTrade[];
  behavior: WalletBehavior | null;
  behaviorTags: WalletBehaviorTag[];
  connections: WalletConnection[];
  activity: WalletActivity[];
  network: WalletNetwork | null;
}

// Sample wallet addresses for testing
export const testWallets = [
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
  'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
];

// Mock wallet scores
export const mockWalletScores: Record<WalletAddress, WalletScore> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': {
    id: 1,
    wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
    whisperer_score: 85,
    degen_score: 45,
    roi_score: 90,
    discipline_score: 80,
    timing_score: 75,
    diversity_score: 70,
    emotional_score: 65,
    cognitive_score: 75,
    owner_since: new Date('2023-01-15'),
    trading_frequency: 'Medium',
    risk_level: 'Moderate',
    avg_trade_size: 500,
    daily_change: 2.5,
    weekly_change: 7.8,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-15'),
  },
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: {
    id: 2,
    wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
    whisperer_score: 75,
    degen_score: 30,
    roi_score: 85,
    discipline_score: 90,
    timing_score: 70,
    diversity_score: 65,
    emotional_score: 80,
    cognitive_score: 85,
    owner_since: new Date('2022-11-20'),
    trading_frequency: 'Low',
    risk_level: 'Conservative',
    avg_trade_size: 2000,
    daily_change: 1.2,
    weekly_change: 3.5,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-16'),
  },
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': {
    id: 3,
    wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
    whisperer_score: 45,
    degen_score: 60,
    roi_score: 75,
    discipline_score: 30,
    timing_score: 60,
    diversity_score: 40,
    emotional_score: 50,
    cognitive_score: 45,
    owner_since: new Date('2023-05-05'),
    trading_frequency: 'High',
    risk_level: 'Aggressive',
    avg_trade_size: 200,
    daily_change: 5.8,
    weekly_change: 15.2,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-14'),
  },
};

// Mock wallet holdings
export const mockWalletHoldings: Record<WalletAddress, WalletHolding[]> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': [
    {
      id: 1,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      token: 'SOL',
      value: 1250.0,
      allocation: 45.0,
      entry_price: 220.0,
      current_price: 250.0,
      profit_loss: 13.6,
      holding_period: 30,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
    {
      id: 2,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      token: 'USDC',
      value: 1000.0,
      allocation: 36.0,
      entry_price: 1.0,
      current_price: 1.0,
      profit_loss: 0.0,
      holding_period: 45,
      tokenName: 'USD Coin',
      tokenSymbol: 'USDC',
      tokenIcon: 'usdc.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
    {
      id: 3,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      token: 'BONK',
      value: 500.0,
      allocation: 18.0,
      entry_price: 0.00009,
      current_price: 0.0001,
      profit_loss: 11.1,
      holding_period: 5,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      tokenIcon: 'bonk.png',
      created_at: new Date('2023-10-12'),
      updated_at: new Date('2023-10-15'),
    },
  ],
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: [
    {
      id: 4,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'SOL',
      value: 5000.0,
      allocation: 20.0,
      entry_price: 80.0,
      current_price: 100.0,
      profit_loss: 25.0,
      holding_period: 30,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 5,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'USDC',
      value: 10000.0,
      allocation: 40.0,
      entry_price: 1.0,
      current_price: 1.0,
      profit_loss: 0.0,
      holding_period: 45,
      tokenName: 'USD Coin',
      tokenSymbol: 'USDC',
      tokenIcon: 'usdc.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 6,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'SAMO',
      value: 10000.0,
      allocation: 40.0,
      entry_price: 0.08,
      current_price: 0.1,
      profit_loss: 25.0,
      holding_period: 30,
      tokenName: 'Samoyed Coin',
      tokenSymbol: 'SAMO',
      tokenIcon: 'samo.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
  ],
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': [
    {
      id: 7,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      token: 'SOL',
      value: 250.0,
      allocation: 50.0,
      entry_price: 100.0,
      current_price: 100.0,
      profit_loss: 0.0,
      holding_period: 30,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
    {
      id: 8,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      token: 'BONK',
      value: 250.0,
      allocation: 50.0,
      entry_price: 0.0001,
      current_price: 0.0001,
      profit_loss: 0.0,
      holding_period: 30,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      tokenIcon: 'bonk.png',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
  ],
};

// Mock wallet trades
export const mockWalletTrades: Record<WalletAddress, WalletTrade[]> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': [
    {
      id: 1,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      token: 'SOL',
      type: 'buy',
      amount: 5.0,
      price: 250.0,
      value: 1250.0,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-10'),
    },
    {
      id: 2,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      token: 'BONK',
      type: 'buy',
      amount: 5000000.0,
      price: 0.0001,
      value: 500.0,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      tokenIcon: 'bonk.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'excited',
      timestamp: new Date('2023-10-12'),
    },
  ],
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: [
    {
      id: 3,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'SOL',
      type: 'buy',
      amount: 20.0,
      price: 80.0,
      value: 1600.0,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-09-15'),
    },
    {
      id: 4,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'SOL',
      type: 'buy',
      amount: 30.0,
      price: 95.0,
      value: 2850.0,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-01'),
    },
    {
      id: 5,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      token: 'SAMO',
      type: 'buy',
      amount: 100000.0,
      price: 0.08,
      value: 8000.0,
      tokenName: 'Samoyed Coin',
      tokenSymbol: 'SAMO',
      tokenIcon: 'samo.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-05'),
    },
  ],
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': [
    {
      id: 6,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      token: 'SOL',
      type: 'buy',
      amount: 1.0,
      price: 100.0,
      value: 100.0,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-01'),
    },
    {
      id: 7,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      token: 'SOL',
      type: 'buy',
      amount: 1.5,
      price: 100.0,
      value: 150.0,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-02'),
    },
    {
      id: 8,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      token: 'BONK',
      type: 'buy',
      amount: 2500000.0,
      price: 0.0001,
      value: 250.0,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      tokenIcon: 'bonk.png',
      exit_type: null,
      profit_loss: null,
      holding_period: null,
      emotional_state: 'confident',
      timestamp: new Date('2023-10-03'),
    },
  ],
};

// Mock wallet behavior tags data - will be used later

// Mock wallet behavior tags
export const mockWalletBehaviorTags: Record<WalletAddress, WalletBehaviorTag[]> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': [
    {
      id: 1,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      tag: 'early_adopter',
      confidence: 0.85,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
    {
      id: 2,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      tag: 'swing_trader',
      confidence: 0.75,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
  ],
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: [
    {
      id: 3,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      tag: 'Night Owl',
      confidence: 0.90,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 4,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      tag: 'Alpha Seeker',
      confidence: 0.95,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 5,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      tag: 'Opportunist',
      confidence: 0.85,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
  ],
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': [
    {
      id: 6,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      tag: 'Bag Holder',
      confidence: 0.95,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
    {
      id: 7,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      tag: 'Narrative Follower',
      confidence: 0.90,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
    {
      id: 8,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      tag: 'Streak Breaker',
      confidence: 0.80,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
  ],
};

// Mock wallet connections
export const mockWalletConnections: Record<WalletAddress, WalletConnection[]> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': [
    {
      id: 1,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      connected_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      connection_strength: 0.5,
      connection_type: 'transaction',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
  ],
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: [
    {
      id: 2,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      connected_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      connection_strength: 0.6,
      connection_type: 'transaction',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 3,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      connected_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      connection_strength: 0.3,
      connection_type: 'transaction',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-16'),
    },
  ],
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': [
    {
      id: 4,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      connected_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      connection_strength: 0.3,
      connection_type: 'transaction',
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-14'),
    },
  ],
};

// Mock wallet activity
export const mockWalletActivity: Record<WalletAddress, WalletActivity[]> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': [
    {
      id: 1,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      date: new Date('2023-10-10'),
      transaction_count: 3,
      volume_usd: 450.0,
      created_at: new Date('2023-10-10'),
      updated_at: new Date('2023-10-15'),
    },
    {
      id: 2,
      wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
      date: new Date('2023-10-12'),
      transaction_count: 1,
      volume_usd: 500.0,
      created_at: new Date('2023-10-12'),
      updated_at: new Date('2023-10-15'),
    },
  ],
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: [
    {
      id: 3,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      date: new Date('2023-09-15'),
      transaction_count: 2,
      volume_usd: 1600.0,
      created_at: new Date('2023-09-15'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 4,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      date: new Date('2023-10-01'),
      transaction_count: 1,
      volume_usd: 2850.0,
      created_at: new Date('2023-10-01'),
      updated_at: new Date('2023-10-16'),
    },
    {
      id: 5,
      wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
      date: new Date('2023-10-05'),
      transaction_count: 1,
      volume_usd: 8000.0,
      created_at: new Date('2023-10-05'),
      updated_at: new Date('2023-10-16'),
    },
  ],
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': [
    {
      id: 6,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      date: new Date('2023-10-01'),
      transaction_count: 1,
      volume_usd: 100.0,
      created_at: new Date('2023-10-01'),
      updated_at: new Date('2023-10-14'),
    },
    {
      id: 7,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      date: new Date('2023-10-02'),
      transaction_count: 1,
      volume_usd: 150.0,
      created_at: new Date('2023-10-02'),
      updated_at: new Date('2023-10-14'),
    },
    {
      id: 8,
      wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
      date: new Date('2023-10-03'),
      transaction_count: 1,
      volume_usd: 250.0,
      created_at: new Date('2023-10-03'),
      updated_at: new Date('2023-10-14'),
    },
  ],
};

// Mock wallet network
export const mockWalletNetwork: Record<WalletAddress, WalletNetwork> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': {
    id: 1,
    wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
    influence_score: 65,
    network_size: 3,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-15'),
  },
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: {
    id: 2,
    wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
    influence_score: 85,
    network_size: 2,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-16'),
  },
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': {
    id: 3,
    wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
    influence_score: 35,
    network_size: 1,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-14'),
  },
};

// Mock wallet behavior
export const mockWalletBehavior: Record<WalletAddress, WalletBehavior> = {
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': {
    id: 1,
    wallet_address: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
    archetype: 'Swing Trader',
    secondary_archetype: 'Value Investor',
    emotional_state: 'Optimistic',
    risk_appetite: 65,
    fomo_score: 45,
    patience_score: 70,
    conviction_score: 75,
    adaptability_score: 60,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-15'),
  },
  DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ: {
    id: 2,
    wallet_address: 'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
    archetype: 'Hodler',
    secondary_archetype: 'Fundamentalist',
    emotional_state: 'Confident',
    risk_appetite: 35,
    fomo_score: 20,
    patience_score: 90,
    conviction_score: 85,
    adaptability_score: 40,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-16'),
  },
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF': {
    id: 3,
    wallet_address: '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
    archetype: 'Degen',
    secondary_archetype: 'Momentum Trader',
    emotional_state: 'Excited',
    risk_appetite: 90,
    fomo_score: 85,
    patience_score: 30,
    conviction_score: 40,
    adaptability_score: 75,
    created_at: new Date('2023-10-10'),
    updated_at: new Date('2023-10-14'),
  },
};

// Helper function to get mock data for a specific wallet
export const getMockDataForWallet = (walletAddress: WalletAddress): WalletData => ({
  scores: mockWalletScores[walletAddress] || null,
  holdings: mockWalletHoldings[walletAddress] || [],
  trades: mockWalletTrades[walletAddress] || [],
  behavior: mockWalletBehavior[walletAddress] || null,
  behaviorTags: mockWalletBehaviorTags[walletAddress] || [],
  connections: mockWalletConnections[walletAddress] || [],
  activity: mockWalletActivity[walletAddress] || [],
  network: mockWalletNetwork[walletAddress] || null,
});

// All mock data is exported via individual export statements
