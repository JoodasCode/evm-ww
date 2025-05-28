import { PsychometricsResponse } from '@/types/psychometrics';

/**
 * Fetches psychometrics data for a specific wallet address
 * @param walletAddress The Solana wallet address to fetch data for
 * @returns Promise containing the psychometrics data
 */
export const fetchWalletPsychometrics = async (walletAddress: string): Promise<PsychometricsResponse> => {
  try {
    const response = await fetch(`/api/wallet/${walletAddress}/psychometrics`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching psychometrics data:', error);
    throw error;
  }
};

/**
 * Generates mock psychometrics data for development and testing
 * @param walletAddress The wallet address to generate mock data for
 * @returns Mock psychometrics data
 */
export const getMockPsychometricsData = (walletAddress: string): PsychometricsResponse =>
  // Mock data with the wallet address included to simulate personalized data
  ({
    whispererScore: {
      total: 78,
      breakdown: {
        discipline: 19,
        timing: 21,
        risk: 17,
        diversity: 21,
      },
      insight: "Your trading psychology is strong. You show good discipline and risk management, though there's room to improve your emotional control during volatile markets.",
      history: [
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30, score: 65, annotation: 'Market crash' },
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 25, score: 68 },
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20, score: 72 },
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15, score: 70 },
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, score: 74 },
        { timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, score: 76 },
        { timestamp: Date.now(), score: 78, annotation: 'New ATH' },
      ],
      // Added trend data
      trend: {
        percentage: 5.2,
        direction: 'up',
        period: '7d',
      },
      // Added last updated timestamp
      lastUpdated: Date.now(),
    },
    behavioralAvatar: 'Strategist',
    currentMood: 'Greedy',
    // Added behavioral avatar details
    behavioralAvatarDetails: {
      type: 'Strategist',
      description: 'You approach trading with a methodical mindset, carefully analyzing risk-reward ratios before entering positions. You prefer quality over quantity and have a strong sense of market timing.',
      icon: '🎯',
      stats: {
        discipline: 82,
        risk: 65,
        timing: 78,
        consistency: 75,
      },
    },
    // Added behavioral labels
    behavioralLabels: [
      {
        name: 'Narrative Follower',
        icon: '📈',
        description: 'You tend to follow established market narratives, often entering trends after they\'ve been validated.',
        category: 'trait',
      },
      {
        name: 'Bag Holder',
        icon: '💼',
        description: 'You sometimes hold onto losing positions longer than optimal, hoping for recovery.',
        category: 'behavior',
      },
      {
        name: 'Opportunist',
        icon: '⚡',
        description: 'You\'re quick to capitalize on market opportunities when they present themselves.',
        category: 'trait',
      },
      {
        name: 'Greedy',
        icon: '🤑',
        description: 'You tend to chase profits and may take on excessive risk during bull markets.',
        category: 'mood',
      },
    ],
  });
