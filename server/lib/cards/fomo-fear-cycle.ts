import { PsychoCardCalculator } from './base';
import { DUNE_QUERIES } from '../dune';

/**
 * FOMO Fear Cycle Card
 * Analyzes wallet's susceptibility to market FOMO and fear cycles
 */
export class FomoFearCycleCard extends PsychoCardCalculator {
  cardType = 'fomo-fear-cycle';
  duneQueryId = DUNE_QUERIES[this.cardType];
  
  transform(duneData: any): any {
    // Extract relevant metrics from Dune data
    const { rows } = duneData.result || { rows: [] };
    
    if (!rows || rows.length === 0) {
      throw new Error('No data available for FOMO/Fear analysis');
    }
    
    // Extract FOMO metrics
    const peakBuyRatio = parseFloat(rows[0].peak_buy_ratio || '0');
    const panicSellRatio = parseFloat(rows[0].panic_sell_ratio || '0');
    const trendFollowingScore = parseFloat(rows[0].trend_following_score || '0');
    const marketTimingAccuracy = parseFloat(rows[0].market_timing_accuracy || '0');
    const emotionalTradeCount = parseInt(rows[0].emotional_trade_count || '0');
    const contraryTradeRatio = parseFloat(rows[0].contrary_trade_ratio || '0');
    
    // Calculate FOMO and Fear scores (0-100)
    const fomoScore = calculateFomoScore(peakBuyRatio, trendFollowingScore, emotionalTradeCount);
    const fearScore = calculateFearScore(panicSellRatio, contraryTradeRatio, emotionalTradeCount);
    
    // Calculate overall emotional resilience score (inverse of FOMO+Fear)
    const emotionalResilienceScore = Math.max(0, 100 - Math.round((fomoScore + fearScore) / 2));
    
    // Determine emotional trading profile
    const profile = getEmotionalProfile(fomoScore, fearScore);
    
    // Generate cycle analysis
    const cycleAnalysis = analyzeTradingCycles(rows);
    
    // Generate insights
    const insights = generateInsights(profile, fomoScore, fearScore, emotionalResilienceScore, {
      peakBuyRatio,
      panicSellRatio,
      marketTimingAccuracy,
      emotionalTradeCount,
      cycleAnalysis
    });
    
    return {
      fomoScore,
      fearScore,
      emotionalResilienceScore,
      profile,
      cycleAnalysis,
      metrics: {
        peakBuyRatio,
        panicSellRatio,
        trendFollowingScore,
        marketTimingAccuracy,
        emotionalTradeCount,
        contraryTradeRatio
      },
      insights
    };
  }
}

// Helper functions
function calculateFomoScore(peakBuyRatio: number, trendFollowingScore: number, emotionalTradeCount: number): number {
  const peakBuyScore = peakBuyRatio * 50;
  const trendScore = trendFollowingScore * 30;
  const emotionalScore = Math.min(emotionalTradeCount / 10, 1) * 20;
  
  return Math.round(peakBuyScore + trendScore + emotionalScore);
}

function calculateFearScore(panicSellRatio: number, contraryTradeRatio: number, emotionalTradeCount: number): number {
  const panicSellScore = panicSellRatio * 50;
  const contraryScore = (1 - contraryTradeRatio) * 30; // Lower contrary trading = higher fear
  const emotionalScore = Math.min(emotionalTradeCount / 10, 1) * 20;
  
  return Math.round(panicSellScore + contraryScore + emotionalScore);
}

function getEmotionalProfile(fomoScore: number, fearScore: number): string {
  const totalEmotionalScore = (fomoScore + fearScore) / 2;
  
  if (totalEmotionalScore < 30) return 'Stoic Trader';
  if (totalEmotionalScore < 50) return 'Rational Actor';
  if (totalEmotionalScore < 70) return 'Emotion-Aware';
  if (totalEmotionalScore < 85) return 'Emotion-Driven';
  return 'Hyper-Emotional';
}

function analyzeTradingCycles(rows: any[]): any {
  // Extract cycle data if available
  const cycleData = rows[0].cycle_data ? JSON.parse(rows[0].cycle_data) : [];
  
  if (!cycleData || cycleData.length === 0) {
    return {
      cyclesDetected: 0,
      averageCycleDuration: 0,
      largestSwing: 0,
      currentPhase: 'Unknown'
    };
  }
  
  // Calculate cycle metrics
  const cycleDurations = cycleData.map((cycle: any) => cycle.duration_days);
  const avgDuration = cycleDurations.reduce((sum: number, duration: number) => sum + duration, 0) / cycleDurations.length;
  
  const swings = cycleData.map((cycle: any) => Math.abs(cycle.peak_to_trough_percent));
  const maxSwing = Math.max(...swings);
  
  // Determine current cycle phase
  const lastCycle = cycleData[cycleData.length - 1];
  const currentPhase = lastCycle?.current_phase || 'Unknown';
  
  return {
    cyclesDetected: cycleData.length,
    averageCycleDuration: Math.round(avgDuration),
    largestSwing: Math.round(maxSwing),
    currentPhase
  };
}

function generateInsights(
  profile: string,
  fomoScore: number,
  fearScore: number,
  resilienceScore: number,
  metrics: any
): string[] {
  const insights: string[] = [];
  
  // Overall emotional profile insight
  insights.push(`Your trading psychology profile is "${profile}" with ${resilienceScore}/100 emotional resilience.`);
  
  // FOMO vs Fear comparison
  if (fomoScore > fearScore + 20) {
    insights.push(`You're significantly more susceptible to FOMO (${fomoScore}) than fear (${fearScore}).`);
  } else if (fearScore > fomoScore + 20) {
    insights.push(`You're significantly more driven by fear (${fearScore}) than FOMO (${fomoScore}).`);
  } else {
    insights.push(`Your emotional responses are balanced between FOMO (${fomoScore}) and fear (${fearScore}).`);
  }
  
  // Cycle analysis insight
  if (metrics.cycleAnalysis.cyclesDetected > 0) {
    insights.push(`Analysis detected ${metrics.cycleAnalysis.cyclesDetected} emotional cycles averaging ${metrics.cycleAnalysis.averageCycleDuration} days each.`);
    insights.push(`You're currently in the "${metrics.cycleAnalysis.currentPhase}" phase of your emotional cycle.`);
  } else {
    insights.push(`No clear emotional trading cycles detected in your history.`);
  }
  
  // Market timing insight
  insights.push(`Your market timing accuracy is ${Math.round(metrics.marketTimingAccuracy * 100)}%, ${getTimingAssessment(metrics.marketTimingAccuracy)}.`);
  
  return insights;
}

function getTimingAssessment(accuracy: number): string {
  if (accuracy < 0.3) return 'suggesting strong emotional influence';
  if (accuracy < 0.5) return 'indicating some emotional trading';
  if (accuracy < 0.7) return 'showing balanced decision-making';
  return 'demonstrating strong emotional discipline';
}

export default new FomoFearCycleCard();
