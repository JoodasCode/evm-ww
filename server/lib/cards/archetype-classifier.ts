import { PsychoCardCalculator } from './base';
import { DUNE_QUERIES } from '../dune';

/**
 * Archetype Classifier Card
 * Analyzes wallet behavior to determine trader archetype
 */
export class ArchetypeClassifierCard extends PsychoCardCalculator {
  cardType = 'archetype-classifier';
  duneQueryId = DUNE_QUERIES[this.cardType];
  
  transform(duneData: any): any {
    // Extract relevant metrics from Dune data
    const { rows } = duneData.result || { rows: [] };
    
    if (!rows || rows.length === 0) {
      throw new Error('No data available for archetype classification');
    }
    
    // Calculate archetype scores based on trading patterns
    const tradeCount = parseInt(rows[0].trade_count || '0');
    const avgHoldTime = parseFloat(rows[0].avg_hold_time_days || '0');
    const nightTradeRatio = parseFloat(rows[0].night_trade_ratio || '0');
    const gasSpent = parseFloat(rows[0].total_gas_spent_usd || '0');
    const uniqueTokens = parseInt(rows[0].unique_tokens || '0');
    const profitLossRatio = parseFloat(rows[0].profit_loss_ratio || '1');
    
    // Calculate archetype scores
    const degenScore = calculateDegenScore(nightTradeRatio, tradeCount, gasSpent);
    const hodlerScore = calculateHodlerScore(avgHoldTime, tradeCount, uniqueTokens);
    const swingTraderScore = calculateSwingTraderScore(avgHoldTime, tradeCount, profitLossRatio);
    const dayTraderScore = calculateDayTraderScore(tradeCount, avgHoldTime, nightTradeRatio);
    const whaleScore = calculateWhaleScore(gasSpent, tradeCount, uniqueTokens);
    
    // Determine primary and secondary archetypes
    const scores = [
      { type: 'Degen', score: degenScore },
      { type: 'Hodler', score: hodlerScore },
      { type: 'Swing Trader', score: swingTraderScore },
      { type: 'Day Trader', score: dayTraderScore },
      { type: 'Whale', score: whaleScore }
    ].sort((a, b) => b.score - a.score);
    
    const primaryArchetype = scores[0];
    const secondaryArchetype = scores[1];
    
    // Generate insights based on archetype
    const insights = generateInsights(primaryArchetype.type, secondaryArchetype.type, {
      tradeCount,
      avgHoldTime,
      nightTradeRatio,
      gasSpent,
      uniqueTokens,
      profitLossRatio
    });
    
    return {
      primaryArchetype: primaryArchetype.type,
      primaryScore: primaryArchetype.score,
      secondaryArchetype: secondaryArchetype.type,
      secondaryScore: secondaryArchetype.score,
      archetypeScores: scores,
      metrics: {
        tradeCount,
        avgHoldTime,
        nightTradeRatio,
        gasSpent,
        uniqueTokens,
        profitLossRatio
      },
      insights
    };
  }
}

// Helper functions for score calculations
function calculateDegenScore(nightTradeRatio: number, tradeCount: number, gasSpent: number): number {
  const nightTradeScore = nightTradeRatio * 40;
  const tradeFrequencyScore = Math.min(tradeCount / 100, 1) * 30;
  const gasSpentScore = Math.min(gasSpent / 1000, 1) * 30;
  
  return Math.round(nightTradeScore + tradeFrequencyScore + gasSpentScore);
}

function calculateHodlerScore(avgHoldTime: number, tradeCount: number, uniqueTokens: number): number {
  const holdTimeScore = Math.min(avgHoldTime / 30, 1) * 50;
  const lowTradeScore = Math.max(1 - (tradeCount / 100), 0) * 30;
  const lowTokenDiversityScore = Math.max(1 - (uniqueTokens / 20), 0) * 20;
  
  return Math.round(holdTimeScore + lowTradeScore + lowTokenDiversityScore);
}

function calculateSwingTraderScore(avgHoldTime: number, tradeCount: number, profitLossRatio: number): number {
  const optimalHoldTime = Math.max(0, 1 - Math.abs((avgHoldTime - 7) / 7)) * 40;
  const moderateTradeScore = Math.max(0, 1 - Math.abs((tradeCount - 50) / 50)) * 30;
  const profitabilityScore = Math.min(profitLossRatio, 2) * 15;
  
  return Math.round(optimalHoldTime + moderateTradeScore + profitabilityScore);
}

function calculateDayTraderScore(tradeCount: number, avgHoldTime: number, nightTradeRatio: number): number {
  const highTradeScore = Math.min(tradeCount / 200, 1) * 40;
  const shortHoldTimeScore = Math.max(1 - (avgHoldTime / 3), 0) * 40;
  const dayTimeTradeScore = (1 - nightTradeRatio) * 20;
  
  return Math.round(highTradeScore + shortHoldTimeScore + dayTimeTradeScore);
}

function calculateWhaleScore(gasSpent: number, tradeCount: number, uniqueTokens: number): number {
  const highGasScore = Math.min(gasSpent / 5000, 1) * 50;
  const highTradeValueScore = Math.min(tradeCount / 50, 1) * 25;
  const tokenDiversityScore = Math.min(uniqueTokens / 30, 1) * 25;
  
  return Math.round(highGasScore + highTradeValueScore + tokenDiversityScore);
}

function generateInsights(primary: string, secondary: string, metrics: any): string[] {
  const insights: string[] = [];
  
  // Primary archetype insights
  switch (primary) {
    case 'Degen':
      insights.push(`You're a true Degen, making ${metrics.tradeCount} trades with ${Math.round(metrics.nightTradeRatio * 100)}% at night.`);
      insights.push(`Your risk tolerance is exceptionally high, spending $${Math.round(metrics.gasSpent)} on gas alone.`);
      break;
    case 'Hodler':
      insights.push(`You're a committed Hodler with an average hold time of ${Math.round(metrics.avgHoldTime)} days.`);
      insights.push(`You've traded only ${metrics.uniqueTokens} unique tokens, showing strong conviction.`);
      break;
    case 'Swing Trader':
      insights.push(`As a Swing Trader, you've mastered the multi-day position with ${Math.round(metrics.avgHoldTime)} day holds.`);
      insights.push(`Your profit/loss ratio of ${metrics.profitLossRatio.toFixed(2)} shows disciplined trading.`);
      break;
    case 'Day Trader':
      insights.push(`Your Day Trader profile shows ${metrics.tradeCount} trades with quick ${metrics.avgHoldTime.toFixed(1)} day turnarounds.`);
      insights.push(`You trade primarily during market hours, with only ${Math.round(metrics.nightTradeRatio * 100)}% night trades.`);
      break;
    case 'Whale':
      insights.push(`As a Whale, you've moved significant capital through ${metrics.uniqueTokens} tokens.`);
      insights.push(`Your gas expenditure of $${Math.round(metrics.gasSpent)} puts you in the top tier of traders.`);
      break;
  }
  
  // Secondary influence insight
  insights.push(`You show strong ${secondary} tendencies as well, creating a hybrid trading style.`);
  
  return insights;
}

export default new ArchetypeClassifierCard();
