/**
 * Mock wallet data for development and testing
 * This file provides sample data for the Wallet Whisperer application
 */

// Sample wallet addresses for testing
export const testWallets = [
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
  'DgHK9mfhMtUwwv9uQe4VRuzNB3xQW5JaKoForvqiSHnJ',
  '5ZPuAVxAwYvptA8Z1dM6DLZr4xfWpMBpkMp3UedR3dVF',
  'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W'
];

// Mock wallet scores
export const mockWalletScores: Record<string, any> = {
  'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W': {
    id: 1,
    wallet: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
    whispererScore: 85,
    degenScore: 45,
    roiScore: 90,
    disciplineScore: 80,
    timingScore: 75,
    diversityScore: 70,
    emotionalScore: 65,
    cognitiveScore: 75,
    ownerSince: new Date('2023-01-15'),
    tradingFrequency: 'Medium',
    riskLevel: 'Moderate',
    avgTradeSize: 500,
    dailyChange: 2.5,
    weeklyChange: 7.8,
    tier: 'Strategic',
    archetype: 'Strategic Momentum Trader',
    riskAppetite: { score: 78, category: 'High' },
    portfolioComposition: {
      categories: [
        { name: 'Meme', percentage: 45 },
        { name: 'DeFi', percentage: 30 },
        { name: 'Infrastructure', percentage: 25 }
      ]
    }
  },
  '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB': {
    id: 2,
    wallet: '8YUkX4ckU6hKDcZvPcS2VVgLHvnkPRnqJFW5Zk8kgLLB',
    whispererScore: 75,
    degenScore: 60,
    roiScore: 85,
    disciplineScore: 70,
    timingScore: 80,
    diversityScore: 65,
    emotionalScore: 75,
    cognitiveScore: 80,
    ownerSince: new Date('2022-11-20'),
    tradingFrequency: 'High',
    riskLevel: 'Aggressive',
    avgTradeSize: 1200,
    dailyChange: 3.2,
    weeklyChange: 12.4,
    tier: 'Alpha Hunter',
    archetype: 'Momentum Degen',
    riskAppetite: { score: 92, category: 'Very High' },
    portfolioComposition: {
      categories: [
        { name: 'Meme', percentage: 65 },
        { name: 'DeFi', percentage: 20 },
        { name: 'Infrastructure', percentage: 15 }
      ]
    }
  }
};

// Mock wallet holdings
export const mockWalletHoldings: Record<string, any[]> = {
  'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W': [
    {
      id: 1,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'SOL',
      value: 1250.0,
      allocation: 45.0,
      entryPrice: 220.0,
      currentPrice: 250.0,
      profitLoss: 13.6,
      holdingPeriod: 30,
      tokenName: 'Solana',
      tokenSymbol: 'SOL',
      tokenIcon: 'sol.png',
    },
    {
      id: 2,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'BONK',
      value: 500.0,
      allocation: 18.0,
      entryPrice: 0.00009,
      currentPrice: 0.0001,
      profitLoss: 11.1,
      holdingPeriod: 5,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      tokenIcon: 'bonk.png',
    },
    {
      id: 3,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'JUP',
      value: 750.0,
      allocation: 27.0,
      entryPrice: 0.45,
      currentPrice: 0.52,
      profitLoss: 15.6,
      holdingPeriod: 12,
      tokenName: 'Jupiter',
      tokenSymbol: 'JUP',
      tokenIcon: 'jup.png',
    }
  ]
};

// Mock trading activity
export const mockTradingActivity: Record<string, any[]> = {
  'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W': [
    {
      id: 1,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'BONK',
      type: 'buy',
      amount: 5000000.0,
      price: 0.0001,
      value: 500.0,
      tokenName: 'Bonk',
      tokenSymbol: 'BONK',
      emotionalState: 'excited',
      timestamp: new Date('2023-10-12'),
    },
    {
      id: 2,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'JUP',
      type: 'buy',
      amount: 1442.0,
      price: 0.52,
      value: 750.0,
      tokenName: 'Jupiter',
      tokenSymbol: 'JUP',
      emotionalState: 'confident',
      timestamp: new Date('2023-10-10'),
    },
    {
      id: 3,
      walletAddress: 'G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W',
      token: 'WIF',
      type: 'sell',
      amount: 2500.0,
      price: 0.18,
      value: 450.0,
      tokenName: 'Dogwifhat',
      tokenSymbol: 'WIF',
      emotionalState: 'cautious',
      timestamp: new Date('2023-10-08'),
    }
  ]
};

// Mock analytics data
export const mockAnalyticsData = {
  riskAppetite: { score: 78 },
  tradeFrequency: { dailyAverage: 3.2 },
  portfolioComposition: {
    categories: [
      { name: 'Meme', percentage: 45 },
      { name: 'DeFi', percentage: 30 },
      { name: 'Infrastructure', percentage: 25 }
    ]
  },
  holdingPatterns: { averageHoldTime: 4.5 }
};

// Mock psychometrics data
export const mockPsychometricsData = {
  behavioralAvatar: 'Strategic Momentum Trader',
  currentMood: 'Cautiously Optimistic',
  riskProfile: 'High Risk, Calculated',
  tradingFrequency: 'Active Swing Trader',
  degenScore: 78,
  fomoScore: 62,
  patienceScore: 45,
  convictionScore: 73
};

export function getMockDataForWallet(walletAddress: string) {
  return {
    score: mockWalletScores[walletAddress] || mockWalletScores['G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W'],
    holdings: mockWalletHoldings[walletAddress] || mockWalletHoldings['G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W'],
    trades: mockTradingActivity[walletAddress] || mockTradingActivity['G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W'],
    analytics: mockAnalyticsData,
    psychometrics: mockPsychometricsData
  };
}