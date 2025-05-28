'use client';

import { PsychometricsResponse } from '@/types/psychometrics';
import { AnalyticsResponse } from '@/types/analytics';
import { fetchWalletPsychometrics, getMockPsychometricsData } from './psychometrics';
import { fetchWalletAnalytics, getMockAnalyticsData } from './analytics';

// Types for cognitive bias profile
export interface CognitiveBiasProfile {
  confirmationBias: {
    score: number; // 0-100
    examples: Array<{
      date: string;
      action: string;
      description: string;
    }>;
    insight: string;
  };
  lossAversion: {
    score: number; // 0-100
    riskAfterGains: number; // 0-100
    riskAfterLosses: number; // 0-100
    insight: string;
  };
  recencyBias: {
    score: number; // 0-100
    recentInfluenceScore: number; // 0-100
    examples: Array<{
      date: string;
      marketEvent: string;
      reaction: string;
    }>;
    insight: string;
  };
  anchoringPoints: Array<{
    price: number;
    token: string;
    strength: number; // 0-100
    description: string;
  }>;
}

// Types for emotional trading patterns
export interface EmotionalTradingPatterns {
  emotionalVolatility: {
    score: number; // 0-100
    timeline: Array<{
      date: string;
      volatility: number; // 0-100
      marketCondition: string;
    }>;
    insight: string;
  };
  fearGreedCycle: {
    currentPosition: 'extreme fear' | 'fear' | 'neutral' | 'greed' | 'extreme greed';
    cycleHistory: Array<{
      date: string;
      position: string;
      action: string;
    }>;
    insight: string;
  };
  emotionalContagion: {
    score: number; // 0-100
    marketSentimentCorrelation: number; // -100 to 100
    insight: string;
  };
  regretMinimization: {
    avoidanceScore: number; // 0-100
    maximizationScore: number; // 0-100
    examples: Array<{
      date: string;
      scenario: string;
      behavior: string;
    }>;
    insight: string;
  };
}

// Types for decision-making framework
export interface DecisionMakingFramework {
  systemBalance: {
    system1Score: number; // 0-100 (intuitive)
    system2Score: number; // 0-100 (deliberate)
    examples: Array<{
      date: string;
      decision: string;
      system: 'system1' | 'system2';
    }>;
    insight: string;
  };
  decisionFatigue: {
    fatigueScore: number; // 0-100
    optimalTradingHours: string[];
    timeline: Array<{
      hour: number;
      quality: number; // 0-100
    }>;
    insight: string;
  };
  convictionStrength: {
    score: number; // 0-100
    holdingStrength: Array<{
      token: string;
      adverseHoldScore: number; // 0-100
    }>;
    insight: string;
  };
  psychologicalCapital: {
    currentReserve: number; // 0-100
    burnoutRisk: number; // 0-100
    recommendations: string[];
    insight: string;
  };
}

// Types for trading identity analysis
export interface TradingIdentityAnalysis {
  tradingPersona: {
    currentPersona: string;
    evolution: Array<{
      date: string;
      persona: string;
      description: string;
    }>;
    insight: string;
  };
  selfNarrative: {
    dominantNarrative: string;
    alternativeNarratives: string[];
    impact: string;
    insight: string;
  };
  identityRiskProfile: {
    selfImageScore: number; // 0-100
    positionSizingCorrelation: number; // -100 to 100
    insight: string;
  };
  psychologicalStrengthsVulnerabilities: {
    strengths: Array<{
      trait: string;
      description: string;
      score: number; // 0-100
    }>;
    vulnerabilities: Array<{
      trait: string;
      description: string;
      score: number; // 0-100
    }>;
    recommendations: string[];
    insight: string;
  };
}

// Comprehensive psychoanalytics data
export interface PsychoanalyticsData {
  cognitiveBiasProfile: CognitiveBiasProfile;
  emotionalTradingPatterns: EmotionalTradingPatterns;
  decisionMakingFramework: DecisionMakingFramework;
  tradingIdentityAnalysis: TradingIdentityAnalysis;
}

/**
 * Calculates confirmation bias score based on trading patterns
 * @param analytics Analytics data containing trade history
 * @returns Confirmation bias metrics
 */
function calculateConfirmationBias(analytics: AnalyticsResponse): CognitiveBiasProfile['confirmationBias'] {
  // In a real implementation, we would analyze:
  // 1. Ratio of buys in rising markets vs. sells in falling markets
  // 2. Concentration in similar token types/narratives
  // 3. Holding duration variance between winning vs. losing positions

  // Mock implementation
  const score = 65 + Math.floor(Math.random() * 20);

  return {
    score,
    examples: [
      {
        date: '2025-04-15',
        action: 'Increased position',
        description: 'Added to SOL position after reading bullish news, despite technical indicators showing overbought conditions',
      },
      {
        date: '2025-03-22',
        action: 'Ignored warning signs',
        description: 'Held BONK through multiple rejection points, focusing only on positive social sentiment',
      },
      {
        date: '2025-02-10',
        action: 'Selective research',
        description: 'Researched only projects aligned with existing portfolio themes, missing sector rotation',
      },
    ],
    insight: score > 70
      ? 'You show strong confirmation bias tendencies, primarily seeking information that validates your existing positions while dismissing contrary indicators.'
      : 'You display moderate confirmation bias, occasionally allowing your existing positions to influence your research and decision-making.',
  };
}

/**
 * Calculates loss aversion metrics based on risk-taking behavior
 * @param analytics Analytics data containing trade history
 * @returns Loss aversion metrics
 */
function calculateLossAversion(analytics: AnalyticsResponse): CognitiveBiasProfile['lossAversion'] {
  // In a real implementation, we would analyze:
  // 1. Position sizing after gains vs. after losses
  // 2. Time to exit losing positions vs. winning positions
  // 3. Re-entry behavior after stopping out

  // Mock implementation
  const score = 55 + Math.floor(Math.random() * 30);
  const riskAfterGains = 70 + Math.floor(Math.random() * 20);
  const riskAfterLosses = 30 + Math.floor(Math.random() * 20);

  return {
    score,
    riskAfterGains,
    riskAfterLosses,
    insight: riskAfterGains - riskAfterLosses > 30
      ? "Your risk appetite increases significantly after gains and decreases after losses, creating a pattern where you're likely to give back profits but lock in losses."
      : 'You show moderate loss aversion, with some tendency to become conservative after losses and aggressive after wins.',
  };
}

/**
 * Generates a complete psychoanalytics profile based on trading data
 * @param walletAddress The wallet address to analyze
 * @returns Promise containing psychoanalytics data
 */
export async function fetchPsychoanalyticsData(walletAddress: string): Promise<PsychoanalyticsData> {
  try {
    // Fetch base data from existing services
    const [psychometrics, analytics] = await Promise.all([
      fetchWalletPsychometrics(walletAddress),
      fetchWalletAnalytics(walletAddress),
    ]);

    // Generate cognitive bias profile
    const cognitiveBiasProfile: CognitiveBiasProfile = {
      confirmationBias: calculateConfirmationBias(analytics),
      lossAversion: calculateLossAversion(analytics),
      recencyBias: {
        score: 72,
        recentInfluenceScore: 85,
        examples: [
          {
            date: '2025-05-10',
            marketEvent: 'Market correction',
            reaction: 'Reduced position sizes across all holdings',
          },
          {
            date: '2025-04-28',
            marketEvent: 'Token X pump',
            reaction: 'Increased allocation to similar tokens',
          },
        ],
        insight: 'You show strong recency bias, with your most recent trading experiences heavily influencing your current decisions, often overriding long-term strategy.',
      },
      anchoringPoints: [
        {
          price: 120,
          token: 'SOL',
          strength: 85,
          description: 'Initial entry point, strongly influences subsequent buy decisions',
        },
        {
          price: 0.00045,
          token: 'BONK',
          strength: 70,
          description: 'Price at first significant profit, creates resistance to selling below this level',
        },
      ],
    };

    // Generate emotional trading patterns
    const emotionalTradingPatterns: EmotionalTradingPatterns = {
      emotionalVolatility: {
        score: 68,
        timeline: [
          {
            date: '2025-05-15',
            volatility: 82,
            marketCondition: 'High volatility',
          },
          {
            date: '2025-05-01',
            volatility: 45,
            marketCondition: 'Low volatility',
          },
          {
            date: '2025-04-15',
            volatility: 75,
            marketCondition: 'Medium volatility',
          },
        ],
        insight: 'Your emotional stability decreases significantly during market volatility, leading to impulsive decisions that deviate from your strategy.',
      },
      fearGreedCycle: {
        currentPosition: 'greed',
        cycleHistory: [
          {
            date: '2025-05-10',
            position: 'greed',
            action: 'Increased leverage',
          },
          {
            date: '2025-04-20',
            position: 'fear',
            action: 'Reduced exposure',
          },
          {
            date: '2025-04-05',
            position: 'extreme fear',
            action: 'Sold at local bottom',
          },
        ],
        insight: "You're currently in the greed phase of your emotional cycle, historically a time when you take on excessive risk.",
      },
      emotionalContagion: {
        score: 75,
        marketSentimentCorrelation: 82,
        insight: "Your trading decisions show high correlation with market sentiment, suggesting you're highly susceptible to emotional contagion from the broader market.",
      },
      regretMinimization: {
        avoidanceScore: 80,
        maximizationScore: 40,
        examples: [
          {
            date: '2025-05-05',
            scenario: 'Missed breakout',
            behavior: 'FOMO entry after 30% move',
          },
          {
            date: '2025-04-10',
            scenario: 'Stop loss hit',
            behavior: 'Immediate re-entry at higher price',
          },
        ],
        insight: 'You prioritize avoiding regret over maximizing gains, often leading to FOMO entries and premature exits.',
      },
    };

    // Generate decision-making framework
    const decisionMakingFramework: DecisionMakingFramework = {
      systemBalance: {
        system1Score: 75, // Intuitive
        system2Score: 45, // Deliberate
        examples: [
          {
            date: '2025-05-12',
            decision: 'Snap entry on token mention by influencer',
            system: 'system1',
          },
          {
            date: '2025-04-25',
            decision: 'Detailed analysis before major position',
            system: 'system2',
          },
        ],
        insight: 'You rely heavily on intuitive (System 1) thinking for trading decisions, often acting quickly without thorough analysis.',
      },
      decisionFatigue: {
        fatigueScore: 65,
        optimalTradingHours: ['09:00-11:00', '15:00-16:00'],
        timeline: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          quality: Math.max(30, 100 - Math.abs(i - 10) * 5 - Math.abs(i - 15) * 5),
        })),
        insight: 'Your decision quality deteriorates significantly after extended trading sessions, with optimal performance in morning and mid-afternoon.',
      },
      convictionStrength: {
        score: 55,
        holdingStrength: [
          {
            token: 'SOL',
            adverseHoldScore: 75,
          },
          {
            token: 'BONK',
            adverseHoldScore: 40,
          },
          {
            token: 'JTO',
            adverseHoldScore: 60,
          },
        ],
        insight: 'You show strong conviction with blue-chip holdings but quickly abandon newer positions during adverse price movements.',
      },
      psychologicalCapital: {
        currentReserve: 55,
        burnoutRisk: 65,
        recommendations: [
          'Implement 24-hour rule for large position entries',
          'Schedule regular trading breaks',
          'Develop pre-defined exit strategies to reduce decision fatigue',
        ],
        insight: 'Your psychological capital is moderately depleted, with signs of decision fatigue and emotional reactivity increasing.',
      },
    };

    // Generate trading identity analysis
    const tradingIdentityAnalysis: TradingIdentityAnalysis = {
      tradingPersona: {
        currentPersona: 'The Momentum Chaser',
        evolution: [
          {
            date: '2025-05',
            persona: 'The Momentum Chaser',
            description: 'Focused on catching trending narratives and tokens',
          },
          {
            date: '2025-03',
            persona: 'The Cautious Accumulator',
            description: 'Focused on building positions during market uncertainty',
          },
          {
            date: '2025-01',
            persona: 'The Degen Explorer',
            description: 'Focused on high-risk, high-reward opportunities',
          },
        ],
        insight: 'Your trading persona has evolved from high-risk exploration to momentum-based strategies, suggesting an adaptation toward more sustainable approaches.',
      },
      selfNarrative: {
        dominantNarrative: "I'm skilled at identifying emerging trends before they become mainstream",
        alternativeNarratives: [
          'I need to be in every significant move to be successful',
          'My edge comes from quick decision-making and rapid execution',
        ],
        impact: 'Your self-narrative drives FOMO behavior when you miss initial moves in new trends',
        insight: 'Your identity as a trend-spotter creates pressure to identify and enter every new narrative, leading to overtrading and scattered focus.',
      },
      identityRiskProfile: {
        selfImageScore: 70,
        positionSizingCorrelation: 85,
        insight: 'Your position sizing strongly correlates with how closely a trade aligns with your self-image as a trend-spotter.',
      },
      psychologicalStrengthsVulnerabilities: {
        strengths: [
          {
            trait: 'Pattern Recognition',
            description: 'Ability to identify emerging market narratives',
            score: 85,
          },
          {
            trait: 'Adaptability',
            description: 'Willingness to shift strategies as market conditions change',
            score: 75,
          },
          {
            trait: 'Recovery Resilience',
            description: 'Ability to bounce back after losses',
            score: 70,
          },
        ],
        vulnerabilities: [
          {
            trait: 'FOMO Susceptibility',
            description: 'Tendency to enter after significant price movement',
            score: 80,
          },
          {
            trait: 'Narrative Attachment',
            description: 'Difficulty exiting when narrative shifts',
            score: 75,
          },
          {
            trait: 'Overconfidence After Wins',
            description: 'Increased risk-taking following successful trades',
            score: 70,
          },
        ],
        recommendations: [
          'Implement pre-defined entry criteria to combat FOMO',
          'Develop systematic narrative evaluation framework',
          'Scale position sizing based on conviction, not recent performance',
        ],
        insight: 'Your psychological profile shows strong pattern recognition abilities counterbalanced by susceptibility to FOMO and narrative attachment.',
      },
    };

    return {
      cognitiveBiasProfile,
      emotionalTradingPatterns,
      decisionMakingFramework,
      tradingIdentityAnalysis,
    };
  } catch (error) {
    console.error('Error fetching psychoanalytics data:', error);
    throw error;
  }
}

/**
 * Generates mock psychoanalytics data for development and testing
 * @param walletAddress The wallet address to generate mock data for
 * @returns Mock psychoanalytics data
 */
export function getMockPsychoanalyticsData(walletAddress: string): PsychoanalyticsData {
  // For mock data, we'll use the same structure but with randomized values
  // In a real implementation, this would be derived from actual wallet data

  return {
    cognitiveBiasProfile: {
      confirmationBias: {
        score: 65 + Math.floor(Math.random() * 20),
        examples: [
          {
            date: '2025-04-15',
            action: 'Increased position',
            description: 'Added to SOL position after reading bullish news, despite technical indicators showing overbought conditions',
          },
          {
            date: '2025-03-22',
            action: 'Ignored warning signs',
            description: 'Held BONK through multiple rejection points, focusing only on positive social sentiment',
          },
          {
            date: '2025-02-10',
            action: 'Selective research',
            description: 'Researched only projects aligned with existing portfolio themes, missing sector rotation',
          },
        ],
        insight: 'You show strong confirmation bias tendencies, primarily seeking information that validates your existing positions while dismissing contrary indicators.',
      },
      lossAversion: {
        score: 55 + Math.floor(Math.random() * 30),
        riskAfterGains: 70 + Math.floor(Math.random() * 20),
        riskAfterLosses: 30 + Math.floor(Math.random() * 20),
        insight: "Your risk appetite increases significantly after gains and decreases after losses, creating a pattern where you're likely to give back profits but lock in losses.",
      },
      recencyBias: {
        score: 72,
        recentInfluenceScore: 85,
        examples: [
          {
            date: '2025-05-10',
            marketEvent: 'Market correction',
            reaction: 'Reduced position sizes across all holdings',
          },
          {
            date: '2025-04-28',
            marketEvent: 'Token X pump',
            reaction: 'Increased allocation to similar tokens',
          },
        ],
        insight: 'You show strong recency bias, with your most recent trading experiences heavily influencing your current decisions, often overriding long-term strategy.',
      },
      anchoringPoints: [
        {
          price: 120,
          token: 'SOL',
          strength: 85,
          description: 'Initial entry point, strongly influences subsequent buy decisions',
        },
        {
          price: 0.00045,
          token: 'BONK',
          strength: 70,
          description: 'Price at first significant profit, creates resistance to selling below this level',
        },
      ],
    },
    emotionalTradingPatterns: {
      emotionalVolatility: {
        score: 68,
        timeline: [
          {
            date: '2025-05-15',
            volatility: 82,
            marketCondition: 'High volatility',
          },
          {
            date: '2025-05-01',
            volatility: 45,
            marketCondition: 'Low volatility',
          },
          {
            date: '2025-04-15',
            volatility: 75,
            marketCondition: 'Medium volatility',
          },
        ],
        insight: 'Your emotional stability decreases significantly during market volatility, leading to impulsive decisions that deviate from your strategy.',
      },
      fearGreedCycle: {
        currentPosition: 'greed',
        cycleHistory: [
          {
            date: '2025-05-10',
            position: 'greed',
            action: 'Increased leverage',
          },
          {
            date: '2025-04-20',
            position: 'fear',
            action: 'Reduced exposure',
          },
          {
            date: '2025-04-05',
            position: 'extreme fear',
            action: 'Sold at local bottom',
          },
        ],
        insight: "You're currently in the greed phase of your emotional cycle, historically a time when you take on excessive risk.",
      },
      emotionalContagion: {
        score: 75,
        marketSentimentCorrelation: 82,
        insight: "Your trading decisions show high correlation with market sentiment, suggesting you're highly susceptible to emotional contagion from the broader market.",
      },
      regretMinimization: {
        avoidanceScore: 80,
        maximizationScore: 40,
        examples: [
          {
            date: '2025-05-05',
            scenario: 'Missed breakout',
            behavior: 'FOMO entry after 30% move',
          },
          {
            date: '2025-04-10',
            scenario: 'Stop loss hit',
            behavior: 'Immediate re-entry at higher price',
          },
        ],
        insight: 'You prioritize avoiding regret over maximizing gains, often leading to FOMO entries and premature exits.',
      },
    },
    decisionMakingFramework: {
      systemBalance: {
        system1Score: 75, // Intuitive
        system2Score: 45, // Deliberate
        examples: [
          {
            date: '2025-05-12',
            decision: 'Snap entry on token mention by influencer',
            system: 'system1',
          },
          {
            date: '2025-04-25',
            decision: 'Detailed analysis before major position',
            system: 'system2',
          },
        ],
        insight: 'You rely heavily on intuitive (System 1) thinking for trading decisions, often acting quickly without thorough analysis.',
      },
      decisionFatigue: {
        fatigueScore: 65,
        optimalTradingHours: ['09:00-11:00', '15:00-16:00'],
        timeline: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          quality: Math.max(30, 100 - Math.abs(i - 10) * 5 - Math.abs(i - 15) * 5),
        })),
        insight: 'Your decision quality deteriorates significantly after extended trading sessions, with optimal performance in morning and mid-afternoon.',
      },
      convictionStrength: {
        score: 55,
        holdingStrength: [
          {
            token: 'SOL',
            adverseHoldScore: 75,
          },
          {
            token: 'BONK',
            adverseHoldScore: 40,
          },
          {
            token: 'JTO',
            adverseHoldScore: 60,
          },
        ],
        insight: 'You show strong conviction with blue-chip holdings but quickly abandon newer positions during adverse price movements.',
      },
      psychologicalCapital: {
        currentReserve: 55,
        burnoutRisk: 65,
        recommendations: [
          'Implement 24-hour rule for large position entries',
          'Schedule regular trading breaks',
          'Develop pre-defined exit strategies to reduce decision fatigue',
        ],
        insight: 'Your psychological capital is moderately depleted, with signs of decision fatigue and emotional reactivity increasing.',
      },
    },
    tradingIdentityAnalysis: {
      tradingPersona: {
        currentPersona: 'The Momentum Chaser',
        evolution: [
          {
            date: '2025-05',
            persona: 'The Momentum Chaser',
            description: 'Focused on catching trending narratives and tokens',
          },
          {
            date: '2025-03',
            persona: 'The Cautious Accumulator',
            description: 'Focused on building positions during market uncertainty',
          },
          {
            date: '2025-01',
            persona: 'The Degen Explorer',
            description: 'Focused on high-risk, high-reward opportunities',
          },
        ],
        insight: 'Your trading persona has evolved from high-risk exploration to momentum-based strategies, suggesting an adaptation toward more sustainable approaches.',
      },
      selfNarrative: {
        dominantNarrative: "I'm skilled at identifying emerging trends before they become mainstream",
        alternativeNarratives: [
          'I need to be in every significant move to be successful',
          'My edge comes from quick decision-making and rapid execution',
        ],
        impact: 'Your self-narrative drives FOMO behavior when you miss initial moves in new trends',
        insight: 'Your identity as a trend-spotter creates pressure to identify and enter every new narrative, leading to overtrading and scattered focus.',
      },
      identityRiskProfile: {
        selfImageScore: 70,
        positionSizingCorrelation: 85,
        insight: 'Your position sizing strongly correlates with how closely a trade aligns with your self-image as a trend-spotter.',
      },
      psychologicalStrengthsVulnerabilities: {
        strengths: [
          {
            trait: 'Pattern Recognition',
            description: 'Ability to identify emerging market narratives',
            score: 85,
          },
          {
            trait: 'Adaptability',
            description: 'Willingness to shift strategies as market conditions change',
            score: 75,
          },
          {
            trait: 'Recovery Resilience',
            description: 'Ability to bounce back after losses',
            score: 70,
          },
        ],
        vulnerabilities: [
          {
            trait: 'FOMO Susceptibility',
            description: 'Tendency to enter after significant price movement',
            score: 80,
          },
          {
            trait: 'Narrative Attachment',
            description: 'Difficulty exiting when narrative shifts',
            score: 75,
          },
          {
            trait: 'Overconfidence After Wins',
            description: 'Increased risk-taking following successful trades',
            score: 70,
          },
        ],
        recommendations: [
          'Implement pre-defined entry criteria to combat FOMO',
          'Develop systematic narrative evaluation framework',
          'Scale position sizing based on conviction, not recent performance',
        ],
        insight: 'Your psychological profile shows strong pattern recognition abilities counterbalanced by susceptibility to FOMO and narrative attachment.',
      },
    },
  };
}
