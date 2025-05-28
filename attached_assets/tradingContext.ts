'use client';

import { PsychometricsResponse } from '@/types/psychometrics';
import { AnalyticsResponse, MissedOpportunity } from '@/types/analytics';
import { InfluenceResponse } from '@/types/influence';
import { v4 as uuidv4 } from 'uuid';

/**
 * Unified trading context that combines psychometrics and analytics data
 */
export interface TradingContext {
  psychometrics: PsychometricsResponse;
  analytics: AnalyticsResponse;
  influence: InfluenceResponse;
  missedOpportunities: MissedOpportunity[];
  integratedInsights: IntegratedInsight[];
}

/**
 * Insight that combines data from both psychometrics and analytics
 */
export interface IntegratedInsight {
  id: string;
  type: 'volatility-trait' | 'performance-archetype' | 'risk-pattern';
  title: string;
  description: string;
  source: {
    psychometric?: {
      type: string;
      data: any;
    };
    analytic?: {
      type: string;
      data: any;
    };
  };
  severity?: number;
  recommendation?: string;
}

/**
 * Fetches unified trading context for a specific wallet address
 * @param walletAddress The wallet address to fetch data for
 * @returns Promise containing the unified trading context
 */
export const fetchTradingContext = async (walletAddress: string): Promise<TradingContext> => {
  try {
    console.log(`Fetching trading context for wallet: ${walletAddress}`);
    
    // Fetch psychometrics data
    const psychometricsResponse = await fetch(`/api/wallet/${walletAddress}/psychometrics`);
    if (!psychometricsResponse.ok) {
      throw new Error(`Psychometrics API error: ${psychometricsResponse.status}`);
    }
    const psychometrics = await psychometricsResponse.json();
    
    // Fetch analytics data
    const analyticsResponse = await fetch(`/api/wallet/${walletAddress}/analytics`);
    if (!analyticsResponse.ok) {
      throw new Error(`Analytics API error: ${analyticsResponse.status}`);
    }
    const analyticsData = await analyticsResponse.json();
    const analytics = analyticsData.data || {};
    
    // For now, use empty influence data
    const influence = {} as InfluenceResponse;
    
    // Extract missed opportunities from analytics
    const missedOpportunities = analytics.missedOpportunities || [];
    
    // Generate integrated insights based on the data
    const integratedInsights = generateIntegratedInsights(psychometrics, analytics);
    
    return {
      psychometrics,
      analytics,
      influence,
      missedOpportunities,
      integratedInsights,
    };
  } catch (error) {
    console.error('Error fetching trading context:', error);
    throw error;
  }
};

/**
 * Generate integrated insights based on psychometrics and analytics data
 * @param psychometrics The psychometrics data
 * @param analytics The analytics data
 * @returns Array of integrated insights
 */
const generateIntegratedInsights = (
  psychometrics: PsychometricsResponse,
  analytics: AnalyticsResponse
): IntegratedInsight[] => {
  const insights: IntegratedInsight[] = [];
  
  // Only generate insights if we have both psychometrics and analytics data
  if (!psychometrics || !analytics) {
    return [];
  }
  
  // Generate insight based on risk appetite and behavioral avatar
  if (analytics.riskAppetite && psychometrics.behavioralAvatar) {
    insights.push({
      id: uuidv4(),
      type: 'risk-pattern',
      title: 'Risk Profile Alignment',
      description: `Your ${psychometrics.behavioralAvatar} trading style aligns with your ${analytics.riskAppetite.score > 70 ? 'high' : analytics.riskAppetite.score > 40 ? 'moderate' : 'low'} risk appetite.`,
      source: {
        psychometric: {
          type: 'behavioralAvatar',
          data: psychometrics.behavioralAvatar,
        },
        analytic: {
          type: 'riskAppetite',
          data: analytics.riskAppetite,
        },
      },
      severity: 65,
      recommendation: 'Consider adjusting position sizes to better match your natural trading style.',
    });
  }
  
  // Generate insight based on mood state and trading patterns
  if (psychometrics.currentMood && analytics.tradingPatterns) {
    insights.push({
      id: uuidv4(),
      type: 'volatility-trait',
      title: 'Emotional Trading Impact',
      description: `Your ${psychometrics.currentMood} mood state may be affecting your trading decisions, particularly in ${analytics.tradingPatterns[0]?.name || 'recent'} patterns.`,
      source: {
        psychometric: {
          type: 'currentMood',
          data: psychometrics.currentMood,
        },
        analytic: {
          type: 'tradingPatterns',
          data: analytics.tradingPatterns,
        },
      },
      severity: 75,
      recommendation: 'Consider taking a break or reducing position sizes when experiencing strong emotional states.',
    });
  }
  
  // Generate insight based on whisperer score and timing accuracy
  if (psychometrics.whispererScore && analytics.timingAccuracy) {
    insights.push({
      id: uuidv4(),
      type: 'performance-archetype',
      title: 'Psychological Edge',
      description: `Your WhispererScore of ${psychometrics.whispererScore.total} correlates with your ${analytics.timingAccuracy.overallScore > 70 ? 'strong' : analytics.timingAccuracy.overallScore > 40 ? 'moderate' : 'weak'} timing accuracy.`,
      source: {
        psychometric: {
          type: 'whispererScore',
          data: psychometrics.whispererScore,
        },
        analytic: {
          type: 'timingAccuracy',
          data: analytics.timingAccuracy,
        },
      },
      severity: 60,
      recommendation: 'Focus on improving your exit timing, which lags behind your entry accuracy.',
    });
  }
  
  return insights;
};

/**
 * Placeholder for future implementation of real trading context data
 * @param walletAddress The wallet address to fetch data for
 * @returns Empty trading context structure
 */
export const getMockTradingContext = async (walletAddress: string): Promise<TradingContext> => {
  // Return empty objects - we're going diehard with no mock data
  return {
    psychometrics: {} as PsychometricsResponse,
    analytics: {} as AnalyticsResponse,
    influence: {} as InfluenceResponse,
    missedOpportunities: [],
    integratedInsights: [],
  };
};
