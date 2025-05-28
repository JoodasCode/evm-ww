'use client';

import {
  PortfolioPerformanceData,
  VolatilityAlert,
  AnalyticsResponse,
  MissedOpportunity,
  TradePattern,
  TimingAccuracy,
  ConvictionPoint,
  ConvictionMap,
  RiskAppetite,
  TradeFrequency,
  PortfolioComposition,
  HoldingPatterns,
} from '@/types/analytics';

/**
 * Fetches analytics data for a specific wallet address
 * @param walletAddress The Solana wallet address to fetch data for
 * @returns Promise containing the analytics data
 */
export const fetchWalletAnalytics = async (walletAddress: string): Promise<AnalyticsResponse> => {
  try {
    const response = await fetch(`/api/wallet/${walletAddress}/analytics`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

/**
 * Generates mock analytics data for development and testing
 * @param walletAddress The wallet address to generate mock data for
 * @returns Mock analytics data
 */
export const getMockAnalyticsData = (walletAddress: string): AnalyticsResponse =>
  // Mock data with the wallet address included to simulate personalized data
  ({
    portfolioPerformance: [
      { date: 'Jan', value: 4000, event: null },
      { date: 'Feb', value: 3000, event: null },
      { date: 'Mar', value: 5000, event: 'buy' },
      { date: 'Apr', value: 2780, event: null },
      { date: 'May', value: 1890, event: 'sell' },
      { date: 'Jun', value: 2390, event: null },
      { date: 'Jul', value: 3490, event: 'buy' },
      { date: 'Aug', value: 4000, event: null },
      { date: 'Sep', value: 4500, event: null },
      { date: 'Oct', value: 5200, event: 'buy' },
      { date: 'Nov', value: 4800, event: 'sell' },
      { date: 'Dec', value: 6000, event: null },
    ],
    volatilityAlerts: [
      {
        id: 1,
        title: 'Impulse surge',
        description: '3 buys in 30 mins after idle',
        severity: 80,
        timestamp: '2h ago',
      },
      {
        id: 2,
        title: 'Revenge trading',
        description: 'Doubled position after 15% loss',
        severity: 95,
        timestamp: '1d ago',
      },
      {
        id: 3,
        title: 'FOMO pattern',
        description: 'Bought at local top after 30% rally',
        severity: 70,
        timestamp: '3d ago',
      },
      {
        id: 4,
        title: 'Panic selling',
        description: 'Sold entire position at support',
        severity: 85,
        timestamp: '1w ago',
      },
    ],
    riskAppetite: {
      score: 78,
      factors: [
        { name: 'Position Sizing', value: 65 },
        { name: 'Diversification', value: 45 },
        { name: 'Volatility Preference', value: 92 },
        { name: 'Token Selection', value: 85 },
      ],
      insight: 'High appetite for volatile assets with limited diversification.',
    },
    tradeFrequency: {
      dailyAverage: 3.2,
      weeklyPattern: [5, 2, 7, 4, 3, 1, 0],
      hourlyPattern: [0, 0, 0, 0, 0, 0, 1, 2, 5, 7, 8, 6, 4, 5, 7, 8, 6, 4, 3, 2, 1, 0, 0, 0],
      insight: 'Most active during market volatility, particularly mid-week.',
    },
    portfolioComposition: {
      categories: [
        { name: 'DeFi', percentage: 35 },
        { name: 'Meme', percentage: 25 },
        { name: 'Gaming', percentage: 15 },
        { name: 'Infrastructure', percentage: 20 },
        { name: 'Other', percentage: 5 },
      ],
      insight: 'Balanced between established protocols and speculative assets.',
    },
    holdingPatterns: {
      averageHoldTime: 14.3, // days
      longestHold: 62, // days
      shortestHold: 0.2, // days
      insight: 'Quick to take profits on speculative positions.',
    },
    missedOpportunities: [
      {
        token: 'BONK',
        tokenIcon: '/tokens/bonk.png',
        category: 'Meme',
        buyPrice: 0.000012,
        sellPrice: 0.000018,
        highPrice: 0.000076,
        sellDate: '2024-12-15',
        highDate: '2025-01-10',
        missedGainPercent: 322,
        daysAfterSell: 26,
      },
      {
        token: 'JTO',
        tokenIcon: '/tokens/jto.png',
        category: 'Infrastructure',
        buyPrice: 2.14,
        sellPrice: 2.87,
        highPrice: 5.62,
        sellDate: '2024-11-20',
        highDate: '2024-12-05',
        missedGainPercent: 96,
        daysAfterSell: 15,
      },
      {
        token: 'PYTH',
        tokenIcon: '/tokens/pyth.png',
        category: 'Oracle',
        buyPrice: 0.35,
        sellPrice: 0.42,
        highPrice: 0.67,
        sellDate: '2025-01-05',
        highDate: '2025-01-28',
        missedGainPercent: 59,
        daysAfterSell: 23,
      },
      {
        token: 'RNDR',
        tokenIcon: '/tokens/rndr.png',
        category: 'AI',
        buyPrice: 3.25,
        sellPrice: 3.10,
        highPrice: 6.80,
        sellDate: '2024-10-12',
        highDate: '2024-11-30',
        missedGainPercent: 119,
        daysAfterSell: 49,
      },
    ],
    tradingPatterns: [
      {
        name: 'Low-cap Pre-Pump',
        tag: 'Sniper',
        successRate: 82,
        avgReturn: 145,
        occurrences: 17,
      },
      {
        name: 'Dip Buying',
        tag: 'Value',
        successRate: 65,
        avgReturn: 38,
        occurrences: 24,
      },
      {
        name: 'Momentum Riding',
        tag: 'Trend',
        successRate: 71,
        avgReturn: 52,
        occurrences: 31,
      },
      {
        name: 'News Reaction',
        tag: 'Event',
        successRate: 45,
        avgReturn: 67,
        occurrences: 12,
      },
    ],
    timingAccuracy: {
      entryScore: 82,
      exitScore: 45,
      overallScore: 64,
      entryAvgDistanceFromBottom: '12%',
      exitAvgDistanceFromTop: '38%',
    },
    convictionMap: {
      points: [
        { holdingDuration: 0.5, roi: 35, tokenSymbol: 'BONK' },
        { holdingDuration: 1.2, roi: 42, tokenSymbol: 'JTO' },
        { holdingDuration: 3.5, roi: 65, tokenSymbol: 'SOL' },
        { holdingDuration: 0.8, roi: 28, tokenSymbol: 'PYTH' },
        { holdingDuration: 2.1, roi: -15, tokenSymbol: 'RNDR' },
        { holdingDuration: 5.3, roi: -32, tokenSymbol: 'APT' },
        { holdingDuration: 7.2, roi: -45, tokenSymbol: 'SUI' },
        { holdingDuration: 4.5, roi: -22, tokenSymbol: 'ARB' },
        { holdingDuration: 1.5, roi: 52, tokenSymbol: 'WIF' },
        { holdingDuration: 0.3, roi: 18, tokenSymbol: 'BOOK' },
        { holdingDuration: 6.8, roi: -38, tokenSymbol: 'OP' },
        { holdingDuration: 3.2, roi: 5, tokenSymbol: 'INJ' },
      ],
      averageWinnerHoldTime: 1.2,
      averageLoserHoldTime: 5.4,
    },
  });
