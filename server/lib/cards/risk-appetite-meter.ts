import { PsychoCardCalculator } from './base';
import { DUNE_QUERIES } from '../dune';

/**
 * Risk Appetite Meter Card
 * Analyzes wallet's risk tolerance based on trading patterns
 */
export class RiskAppetiteMeterCard extends PsychoCardCalculator {
  cardType = 'risk-appetite-meter';
  duneQueryId = DUNE_QUERIES[this.cardType];
  
  transform(duneData: any): any {
    // Extract relevant metrics from Dune data
    const { rows } = duneData.result || { rows: [] };
    
    if (!rows || rows.length === 0) {
      throw new Error('No data available for risk appetite analysis');
    }
    
    // Extract risk metrics
    const newTokenRatio = parseFloat(rows[0].new_token_ratio || '0');
    const avgPositionSize = parseFloat(rows[0].avg_position_size_usd || '0');
    const maxDrawdown = parseFloat(rows[0].max_drawdown_percent || '0');
    const volatilityPreference = parseFloat(rows[0].high_volatility_token_ratio || '0');
    const rugPullCount = parseInt(rows[0].rug_pull_count || '0');
    const gasToTradeRatio = parseFloat(rows[0].gas_to_trade_value_ratio || '0');
    
    // Calculate risk score (0-100)
    const newTokenScore = newTokenRatio * 20;
    const positionSizeScore = Math.min(avgPositionSize / 1000, 1) * 15;
    const drawdownScore = (maxDrawdown / 100) * 20;
    const volatilityScore = volatilityPreference * 20;
    const rugPullScore = Math.min(rugPullCount / 5, 1) * 15;
    const gasRatioScore = Math.min(gasToTradeRatio * 10, 1) * 10;
    
    const riskScore = Math.round(
      newTokenScore + 
      positionSizeScore + 
      drawdownScore + 
      volatilityScore + 
      rugPullScore + 
      gasRatioScore
    );
    
    // Determine risk profile
    const riskProfile = getRiskProfile(riskScore);
    
    // Generate risk breakdown
    const riskFactors = [
      { 
        name: 'New Token Exploration', 
        score: Math.round(newTokenScore / 0.2), 
        description: `${Math.round(newTokenRatio * 100)}% of trades in newly launched tokens`
      },
      { 
        name: 'Position Sizing', 
        score: Math.round(positionSizeScore / 0.15), 
        description: `Average position: $${Math.round(avgPositionSize)}`
      },
      { 
        name: 'Drawdown Tolerance', 
        score: Math.round(drawdownScore / 0.2), 
        description: `Maximum portfolio drawdown: ${Math.round(maxDrawdown)}%`
      },
      { 
        name: 'Volatility Preference', 
        score: Math.round(volatilityScore / 0.2), 
        description: `${Math.round(volatilityPreference * 100)}% high-volatility assets`
      },
      { 
        name: 'Rug Pull Resilience', 
        score: Math.round(rugPullScore / 0.15), 
        description: `Experienced ${rugPullCount} potential rug pulls`
      }
    ].sort((a, b) => b.score - a.score);
    
    // Generate insights
    const insights = generateInsights(riskProfile, riskScore, riskFactors, {
      newTokenRatio,
      avgPositionSize,
      maxDrawdown,
      volatilityPreference,
      rugPullCount
    });
    
    return {
      riskScore,
      riskProfile,
      riskFactors,
      metrics: {
        newTokenRatio,
        avgPositionSize,
        maxDrawdown,
        volatilityPreference,
        rugPullCount,
        gasToTradeRatio
      },
      insights
    };
  }
}

// Helper functions
function getRiskProfile(score: number): string {
  if (score < 20) return 'Ultra Conservative';
  if (score < 40) return 'Conservative';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'Aggressive';
  return 'Ultra Aggressive';
}

function generateInsights(
  profile: string, 
  score: number, 
  factors: any[], 
  metrics: any
): string[] {
  const insights: string[] = [];
  
  // Overall risk profile insight
  insights.push(`Your risk appetite is ${profile.toLowerCase()} (${score}/100), placing you ${getRiskPercentile(score)}.`);
  
  // Top risk factor insight
  const topFactor = factors[0];
  insights.push(`Your highest risk factor is ${topFactor.name} (${topFactor.score}/100): ${topFactor.description}.`);
  
  // Specific insights based on profile
  switch (profile) {
    case 'Ultra Conservative':
      insights.push(`You prioritize capital preservation, avoiding ${Math.round((1 - metrics.newTokenRatio) * 100)}% of new tokens.`);
      break;
    case 'Conservative':
      insights.push(`You take calculated risks with a ${Math.round(metrics.maxDrawdown)}% maximum drawdown tolerance.`);
      break;
    case 'Moderate':
      insights.push(`Your balanced approach includes moderate position sizes averaging $${Math.round(metrics.avgPositionSize)}.`);
      break;
    case 'Aggressive':
      insights.push(`You actively seek volatility with ${Math.round(metrics.volatilityPreference * 100)}% of capital in high-volatility assets.`);
      break;
    case 'Ultra Aggressive':
      insights.push(`Your extreme risk tolerance has exposed you to ${metrics.rugPullCount} potential rug pulls.`);
      break;
  }
  
  return insights;
}

function getRiskPercentile(score: number): string {
  if (score < 10) return 'in the bottom 5% of traders';
  if (score < 30) return 'in the bottom 25% of traders';
  if (score < 50) return 'near the median';
  if (score < 70) return 'in the top 40% of traders';
  if (score < 90) return 'in the top 20% of traders';
  return 'in the top 5% of risk-takers';
}

export default new RiskAppetiteMeterCard();
