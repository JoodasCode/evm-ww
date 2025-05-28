import { heliusService } from './heliusService';
import { geckoTerminalService } from './geckoTerminalService';
import { prismaService } from './prismaService';

/**
 * PsychometricService provides methods for calculating psychological metrics
 * based on wallet data for the Wallet Whisperer application.
 */
class PsychometricService {
  /**
   * Calculate the WhispererScore for a wallet
   * This is a composite score of various psychological metrics
   */
  async calculateWhispererScore(walletAddress: string) {
    try {
      // Use mock data if feature flag is enabled
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return this.getMockPsychometricData(walletAddress);
      }

      // Get wallet data
      const transactions = await heliusService.getEnrichedTransactions(walletAddress);
      const tokenBalances = await heliusService.getTokenBalances(walletAddress);

      // Calculate component scores
      const disciplineScore = this.calculateDisciplineScore(transactions);
      const timingScore = this.calculateTimingScore(transactions);
      const diversityScore = this.calculateDiversityScore(tokenBalances);
      const emotionalScore = this.calculateEmotionalScore(transactions);
      const riskAppetite = this.calculateRiskAppetite(transactions, tokenBalances);

      // Calculate WhispererScore (weighted average of component scores)
      const whispererScore = (
        disciplineScore * 0.25
        + timingScore * 0.25
        + diversityScore * 0.2
        + emotionalScore * 0.3
      );

      // Calculate trading archetype
      const archetype = this.determineTradingArchetype({
        disciplineScore,
        timingScore,
        diversityScore,
        emotionalScore,
        riskAppetite,
        transactions,
      });

      // Calculate behavior tags
      const behaviorTags = this.calculateBehaviorTags({
        disciplineScore,
        timingScore,
        diversityScore,
        emotionalScore,
        riskAppetite,
        transactions,
        tokenBalances,
      });

      // Save data to database
      await this.saveWalletPsychometrics(walletAddress, {
        whispererScore,
        disciplineScore,
        timingScore,
        diversityScore,
        emotionalScore,
        riskAppetite,
        archetype,
        behaviorTags,
      });

      return {
        whispererScore,
        disciplineScore,
        timingScore,
        diversityScore,
        emotionalScore,
        riskAppetite,
        archetype,
        behaviorTags,
      };
    } catch (error) {
      console.error('Error calculating WhispererScore:', error);
      throw error;
    }
  }

  /**
   * Calculate discipline score based on transaction patterns
   * Measures consistency, position sizing, and adherence to strategy
   */
  private calculateDisciplineScore(transactions: any[]) {
    // This would be a complex algorithm analyzing:
    // - Consistency of position sizes
    // - Regular trading intervals vs. erratic trading
    // - Holding periods (consistency)
    // - Profit taking patterns
    // - Stop loss adherence

    // Simplified implementation for now
    return 75; // Placeholder score
  }

  /**
   * Calculate timing score based on transaction timing relative to market movements
   */
  private calculateTimingScore(transactions: any[]) {
    // This would analyze:
    // - Entry points relative to local bottoms
    // - Exit points relative to local tops
    // - Buying during downtrends vs. uptrends
    // - Selling during downtrends vs. uptrends

    // Simplified implementation for now
    return 68; // Placeholder score
  }

  /**
   * Calculate diversity score based on token holdings
   */
  private calculateDiversityScore(tokenBalances: any) {
    // This would analyze:
    // - Number of different tokens
    // - Distribution of value across tokens
    // - Correlation between tokens
    // - Exposure to different sectors/categories

    // Simplified implementation for now
    return 82; // Placeholder score
  }

  /**
   * Calculate emotional score based on transaction patterns
   */
  private calculateEmotionalScore(transactions: any[]) {
    // This would analyze:
    // - Panic selling during market downturns
    // - FOMO buying during market uptrends
    // - Revenge trading patterns
    // - Holding through volatility

    // Simplified implementation for now
    return 65; // Placeholder score
  }

  /**
   * Calculate risk appetite based on transaction patterns and token holdings
   */
  private calculateRiskAppetite(transactions: any[], tokenBalances: any) {
    // This would analyze:
    // - Allocation to high-risk assets
    // - Position sizing relative to portfolio
    // - Trading frequency
    // - Use of leverage (if detectable)

    // Simplified implementation for now
    return 78; // Placeholder score
  }

  /**
   * Determine trading archetype based on psychological metrics
   */
  private determineTradingArchetype(metrics: any) {
    // Based on the Label Engine™ archetypes:
    // - The Prophet: Enters early, exits late
    // - The Sniper: Precise entries, low frequency
    // - The Degen: Overtrades, loves memes
    // - The Monk: One token, no trades
    // - The Birdbrain: Chases green, sells red
    // - The Addict: Trades daily, no edge
    // - The Ghost: Barely trades

    // Simplified implementation for now
    const archetypes = [
      'The Momentum Chaser',
      'The Degen Explorer',
      'The Calculated Tactician',
      'The Patient Accumulator',
      'The Trend Follower',
      'The Contrarian',
      'The Swing Trader',
    ];

    // Choose archetype based on metrics
    if (metrics.riskAppetite > 70 && metrics.emotionalScore < 60) {
      return 'The Degen Explorer';
    } if (metrics.timingScore > 70 && metrics.disciplineScore > 70) {
      return 'The Calculated Tactician';
    } if (metrics.disciplineScore > 70 && metrics.emotionalScore > 70) {
      return 'The Patient Accumulator';
    }
    return 'The Momentum Chaser'; // Default
  }

  /**
   * Calculate behavior tags based on psychological metrics
   */
  private calculateBehaviorTags(metrics: any) {
    // Based on the Label Engine™ emotional states and behavioral traits
    const tags = [];

    // Emotional states
    if (metrics.emotionalScore < 50 && metrics.riskAppetite > 70) {
      tags.push({ tag: 'Greedy', confidence: 0.85 });
    }

    if (metrics.timingScore < 50 && metrics.emotionalScore < 60) {
      tags.push({ tag: 'Panic', confidence: 0.78 });
    }

    if (metrics.disciplineScore > 75 && metrics.emotionalScore > 75) {
      tags.push({ tag: 'Cold-Blooded', confidence: 0.92 });
    }

    // Behavioral traits
    if (metrics.transactions.length > 0) {
      // Analyze transaction timestamps to determine trading times
      const nightOwl = this.checkNightOwlPattern(metrics.transactions);
      if (nightOwl) {
        tags.push({ tag: 'Night Owl', confidence: 0.88 });
      }

      // Check for bag holding behavior
      const bagHolder = this.checkBagHolderPattern(metrics.tokenBalances);
      if (bagHolder) {
        tags.push({ tag: 'Bag Holder', confidence: 0.75 });
      }
    }

    return tags;
  }

  /**
   * Check if wallet shows night owl trading pattern
   */
  private checkNightOwlPattern(transactions: any[]) {
    // This would analyze transaction timestamps to see if trading happens late at night
    return false; // Placeholder
  }

  /**
   * Check if wallet shows bag holder pattern
   */
  private checkBagHolderPattern(tokenBalances: any) {
    // This would analyze token holdings to see if wallet is holding significant losses
    return false; // Placeholder
  }

  /**
   * Save wallet psychometric data to database
   */
  private async saveWalletPsychometrics(walletAddress: string, data: any) {
    try {
      // Update wallet scores
      await prismaService.updateWalletScores(walletAddress, {
        whisperer_score: data.whispererScore,
        degen_score: data.riskAppetite,
        discipline_score: data.disciplineScore,
        timing_score: data.timingScore,
        diversity_score: data.diversityScore,
        emotional_score: data.emotionalScore,
      });

      // Update wallet behavior
      await prismaService.updateWalletBehavior(walletAddress, {
        archetype: data.archetype,
        risk_appetite: data.riskAppetite,
      });

      // Update behavior tags
      const tagData = data.behaviorTags.map((tag: any) => ({
        wallet_address: walletAddress,
        tag: tag.tag,
        confidence: tag.confidence,
      }));

      await prismaService.updateWalletBehaviorTags(walletAddress, tagData);

      return true;
    } catch (error) {
      console.error('Error saving wallet psychometrics:', error);
      throw error;
    }
  }

  /**
   * Get mock psychometric data for development
   */
  getMockPsychometricData(walletAddress: string) {
    return {
      whispererScore: 78,
      disciplineScore: 72,
      timingScore: 68,
      diversityScore: 82,
      emotionalScore: 65,
      riskAppetite: 75,
      archetype: 'The Momentum Chaser',
      secondaryArchetype: 'The Degen Explorer',
      emotionalState: 'Overconfident',
      behaviorTags: [
        { tag: 'FOMO susceptibility', confidence: 0.85 },
        { tag: 'Narrative Follower', confidence: 0.78 },
        { tag: 'Quick Rotator', confidence: 0.65 },
      ],
      history: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), score: 65, annotation: 'Market Downturn' },
        { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), score: 68 },
        { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), score: 72, annotation: 'Strategy Shift' },
        { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), score: 75 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), score: 73 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 76, annotation: 'Improved Timing' },
        { date: new Date(), score: 78 },
      ],
      insights: [
        'Your best returns occur during neutral and patient emotional states',
        'You tend to overtrade during market uptrends, diluting your edge by ~22%',
        'Your evening trades show 45% lower win rate due to decision fatigue',
      ],
      blindSpots: [
        {
          title: 'Narrative Attachment',
          description: 'Difficulty exiting positions when the narrative shifts',
          impact: 'High',
          recommendation: 'Set concrete exit criteria based on price action, not narrative',
        },
        {
          title: 'Post-Win Overconfidence',
          description: 'Increased risk-taking after successful trades',
          impact: 'Critical',
          recommendation: 'Implement fixed position sizing regardless of recent performance',
        },
        {
          title: 'FOMO Entry Patterns',
          description: 'Entering after significant price movement',
          impact: 'Medium',
          recommendation: 'Create a watchlist system with pre-defined entry points',
        },
      ],
      performanceCorrelation: {
        emotionalStates: [
          { state: 'Greed', winRate: 0.35, avgReturn: -2.8 },
          { state: 'Fear', winRate: 0.62, avgReturn: 1.2 },
          { state: 'Neutral', winRate: 0.58, avgReturn: 3.5 },
          { state: 'Overconfidence', winRate: 0.28, avgReturn: -4.2 },
          { state: 'Patience', winRate: 0.75, avgReturn: 5.1 },
        ],
        insight: 'Your best returns occur during neutral and patient emotional states',
      },
      optimalTradingHours: [
        { hour: 9, quality: 85 },
        { hour: 10, quality: 88 },
        { hour: 11, quality: 92 },
        { hour: 12, quality: 87 },
        { hour: 13, quality: 75 },
        { hour: 14, quality: 72 },
        { hour: 15, quality: 68 },
        { hour: 16, quality: 65 },
        { hour: 17, quality: 58 },
        { hour: 18, quality: 52 },
        { hour: 19, quality: 48 },
        { hour: 20, quality: 45 },
      ],
    };
  }
}

export const psychometricService = new PsychometricService();
