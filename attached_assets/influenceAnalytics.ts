'use client';

import {
  InfluenceResponse, AlphaDetection, WhaleCorrelation, MarketImpact, SocialSentimentCorrelation,
} from '@/types/influence';

interface TokenTransaction {
  timestamp: string;
  tokenAddress: string;
  tokenSymbol: string;
  amount: number;
  direction: 'in' | 'out';
  transactionType: 'swap' | 'transfer' | 'mint' | 'burn';
  price?: number;
}

interface VolumeData {
  timestamp: string;
  volume: number;
  price: number;
}

interface WhaleTransaction {
  walletAddress: string;
  whaleName: string;
  archetype: string;
  transactions: TokenTransaction[];
}

interface SocialSentimentData {
  platform: string;
  token: string;
  timestamp: string;
  sentimentScore: number; // -100 to 100
  volume: number; // number of mentions
}

/**
 * Fetches influence analytics data for a specific wallet address
 * @param walletAddress The wallet address to fetch data for
 * @returns Promise containing the influence analytics data
 */
export const fetchInfluenceAnalytics = async (walletAddress: string): Promise<InfluenceResponse> => {
  try {
    const response = await fetch(`/api/wallet/${walletAddress}/influence`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching influence analytics data:', error);
    throw error;
  }
};

/**
 * Generates mock influence analytics data for development and testing
 * @param walletAddress The wallet address to generate mock data for
 * @returns Mock influence analytics data
 */
export const getMockInfluenceAnalytics = (walletAddress: string): InfluenceResponse => ({
  alphaDetection: getMockAlphaDetection(walletAddress),
  whaleCorrelation: getMockWhaleCorrelation(walletAddress),
  marketImpact: getMockMarketImpact(walletAddress),
  socialSentimentCorrelation: getMockSocialSentimentCorrelation(walletAddress),
});

/**
 * Generates mock alpha detection data
 */
const getMockAlphaDetection = (walletAddress: string): AlphaDetection => ({
  alphaScore: 78,
  earlyEntryRate: 65,
  notableAlphaMoves: [
    { token: 'BONK', timeBeforePump: '3 days', pumpPercentage: 520 },
    { token: 'JUP', timeBeforePump: '12 hours', pumpPercentage: 210 },
    { token: 'WIF', timeBeforePump: '2 days', pumpPercentage: 180 },
  ],
  tokenCategoryBreakdown: [
    { category: 'Meme', alphaScore: 92 },
    { category: 'DeFi', alphaScore: 45 },
    { category: 'NFT', alphaScore: 68 },
    { category: 'Infrastructure', alphaScore: 52 },
  ],
  insight: 'You snipe memecoins 2-4 days early, but lag DeFi rotations by 6-12 hours.',
});

/**
 * Generates mock whale correlation data
 */
const getMockWhaleCorrelation = (walletAddress: string): WhaleCorrelation => ({
  correlations: [
    { whaleName: 'DeGods Whale', correlationPercentage: 82, archetype: 'Narrative Whale' },
    { whaleName: 'Alameda Remnant', correlationPercentage: 76, archetype: 'DeFi Ape' },
    { whaleName: 'Solana Foundation', correlationPercentage: 45, archetype: 'Infrastructure Builder' },
    { whaleName: 'PumpChad', correlationPercentage: 68, archetype: 'Momentum Trader' },
  ],
  averageFollowTimeHours: 4.2,
  shadowingScore: 72,
  insight: 'Your best returns come from following DeGods whale activity with a 2-6 hour lag.',
});

/**
 * Generates mock market impact data
 */
const getMockMarketImpact = (walletAddress: string): MarketImpact => ({
  impactScore: 32,
  highestImpact: {
    token: 'SOL',
    priceImpactPercentage: 0.3,
  },
  volumeContributions: [
    { token: 'BONK', volumePercentage: 0.8 },
    { token: 'JUP', volumePercentage: 0.4 },
    { token: 'SOL', volumePercentage: 0.2 },
  ],
  exitWaves: [
    {
      token: 'WIF',
      exitDate: '2025-01-15',
      subsequentDowntrendPercentage: 12,
      followersCount: 8,
    },
    {
      token: 'PYTH',
      exitDate: '2024-12-03',
      subsequentDowntrendPercentage: 8,
      followersCount: 5,
    },
  ],
  insight: 'You tend to sell tops — others follow your exits within 24-48 hours.',
});

/**
 * Generates mock social sentiment correlation data
 */
const getMockSocialSentimentCorrelation = (walletAddress: string): SocialSentimentCorrelation => ({
  sentimentAlignmentPercentage: 68,
  platforms: [
    { name: 'Twitter', alignmentPercentage: 75 },
    { name: 'Discord', alignmentPercentage: 42 },
  ],
  contrarianScore: 32,
  sentimentTiming: [
    {
      token: 'BONK',
      tradeTimestamp: '2025-01-10T14:30:00Z',
      sentimentSpikeTimestamp: '2025-01-10T12:15:00Z',
      hoursFromSpike: 2.25,
      priceChangeAfterTrade: 18,
    },
    {
      token: 'JUP',
      tradeTimestamp: '2024-12-05T09:45:00Z',
      sentimentSpikeTimestamp: '2024-12-05T08:00:00Z',
      hoursFromSpike: 1.75,
      priceChangeAfterTrade: 12,
    },
    {
      token: 'PYTH',
      tradeTimestamp: '2024-11-20T18:30:00Z',
      sentimentSpikeTimestamp: '2024-11-20T22:00:00Z',
      hoursFromSpike: -3.5,
      priceChangeAfterTrade: -8,
    },
  ],
  insight: "You're most influenced by Twitter sentiment peaks for meme tokens, with a 1-3 hour lag.",
});

/**
 * Calculates alpha detection metrics by analyzing token buys and subsequent volume/price spikes
 * In production, this would use real data from Helius, Birdeye, and Jupiter
 */
export const calculateAlphaDetection = async (
  walletAddress: string,
  transactions: TokenTransaction[],
  volumeData: Record<string, VolumeData[]>,
): Promise<AlphaDetection> =>
  // This would be implemented with real data in production
  // For now, we'll return mock data
  getMockAlphaDetection(walletAddress)
;

/**
 * Analyzes correlation between user's trades and known whale wallets
 * In production, this would use real data from Helius and a whale wallet database
 */
export const calculateWhaleCorrelation = async (
  walletAddress: string,
  transactions: TokenTransaction[],
  whaleTransactions: WhaleTransaction[],
): Promise<WhaleCorrelation> =>
  // This would be implemented with real data in production
  // For now, we'll return mock data
  getMockWhaleCorrelation(walletAddress)
;

/**
 * Measures market impact of user's trades on token price and volume
 * In production, this would use real data from Helius, Birdeye, and Jupiter
 */
export const calculateMarketImpact = async (
  walletAddress: string,
  transactions: TokenTransaction[],
  volumeData: Record<string, VolumeData[]>,
): Promise<MarketImpact> =>
  // This would be implemented with real data in production
  // For now, we'll return mock data
  getMockMarketImpact(walletAddress)
;

/**
 * Analyzes correlation between user's trades and social sentiment
 * In production, this would use real data from Twitter API, Discord, and sentiment analysis
 */
export const calculateSocialSentimentCorrelation = async (
  walletAddress: string,
  transactions: TokenTransaction[],
  sentimentData: SocialSentimentData[],
): Promise<SocialSentimentCorrelation> =>
  // This would be implemented with real data in production
  // For now, we'll return mock data
  getMockSocialSentimentCorrelation(walletAddress);
