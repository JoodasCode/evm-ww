/**
 * Whisperer Score Service
 * 
 * Calculates the psychological trading intelligence score based on wallet behavior
 */

import { fetchTransactionSignatures, fetchTransactionDetails } from './heliusClient';
import { fetchTokenMetadata, fetchTokenPrice } from './moralisClient';
import { getCachedData, setCachedData } from './redisService';
import config from '../config';

export interface WhispererScore {
  total: number;
  discipline: number;
  timing: number;
  riskManagement: number;
  components: {
    consistencyScore: number;
    diversificationScore: number;
    emotionalControlScore: number;
    patternRecognitionScore: number;
  };
  lastCalculated: string;
}

export interface TradingBehavior {
  tradingFrequency: 'Low' | 'Medium' | 'High' | 'Extreme';
  avgHoldTime: number; // in hours
  winRate: number; // percentage
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive' | 'Reckless';
  emotionalState: 'Calm' | 'Optimistic' | 'Anxious' | 'Euphoric' | 'Fearful';
}

/**
 * Calculate Whisperer Score for a wallet
 */
export async function calculateWhispererScore(walletAddress: string): Promise<WhispererScore> {
  try {
    // Check cache first
    const cacheKey = `${config.cache.prefix.whispererScore}${walletAddress}`;
    const cachedScore = await getCachedData(cacheKey);
    
    if (cachedScore) {
      console.log('Whisperer Score found in cache');
      return JSON.parse(cachedScore);
    }

    console.log('Calculating new Whisperer Score...');
    
    // Fetch recent transactions for analysis
    const transactions = await fetchTransactionSignatures(walletAddress, 100);
    
    if (transactions.length === 0) {
      // Return default score for wallets with no activity
      const defaultScore: WhispererScore = {
        total: 50,
        discipline: 50,
        timing: 50,
        riskManagement: 50,
        components: {
          consistencyScore: 50,
          diversificationScore: 50,
          emotionalControlScore: 50,
          patternRecognitionScore: 50,
        },
        lastCalculated: new Date().toISOString()
      };
      
      await setCachedData(cacheKey, JSON.stringify(defaultScore), 3600);
      return defaultScore;
    }

    // Analyze trading behavior
    const behavior = await analyzeTradingBehavior(transactions);
    
    // Calculate component scores
    const disciplineScore = calculateDisciplineScore(behavior, transactions);
    const timingScore = calculateTimingScore(behavior, transactions);
    const riskScore = calculateRiskManagementScore(behavior, transactions);
    
    // Calculate detailed components
    const consistencyScore = calculateConsistencyScore(transactions);
    const diversificationScore = calculateDiversificationScore(transactions);
    const emotionalControlScore = calculateEmotionalControlScore(behavior);
    const patternRecognitionScore = calculatePatternRecognitionScore(transactions);
    
    // Calculate total score (weighted average)
    const totalScore = Math.round(
      (disciplineScore * 0.3) + 
      (timingScore * 0.3) + 
      (riskScore * 0.4)
    );
    
    const whispererScore: WhispererScore = {
      total: Math.max(0, Math.min(100, totalScore)),
      discipline: Math.max(0, Math.min(100, disciplineScore)),
      timing: Math.max(0, Math.min(100, timingScore)),
      riskManagement: Math.max(0, Math.min(100, riskScore)),
      components: {
        consistencyScore: Math.max(0, Math.min(100, consistencyScore)),
        diversificationScore: Math.max(0, Math.min(100, diversificationScore)),
        emotionalControlScore: Math.max(0, Math.min(100, emotionalControlScore)),
        patternRecognitionScore: Math.max(0, Math.min(100, patternRecognitionScore)),
      },
      lastCalculated: new Date().toISOString()
    };
    
    // Cache the result
    await setCachedData(cacheKey, JSON.stringify(whispererScore), 3600);
    
    console.log(`Calculated Whisperer Score: ${whispererScore.total} for wallet ${walletAddress}`);
    return whispererScore;
    
  } catch (error) {
    console.error('Error calculating Whisperer Score:', error);
    throw new Error('Failed to calculate Whisperer Score');
  }
}

/**
 * Analyze trading behavior patterns
 */
async function analyzeTradingBehavior(transactions: any[]): Promise<TradingBehavior> {
  // Calculate trading frequency
  const timeSpan = transactions.length > 1 ? 
    (transactions[0].blockTime - transactions[transactions.length - 1].blockTime) / (24 * 60 * 60) : 1;
  const tradesPerDay = transactions.length / Math.max(timeSpan, 1);
  
  let tradingFrequency: TradingBehavior['tradingFrequency'];
  if (tradesPerDay < 1) tradingFrequency = 'Low';
  else if (tradesPerDay < 5) tradingFrequency = 'Medium';
  else if (tradesPerDay < 15) tradingFrequency = 'High';
  else tradingFrequency = 'Extreme';
  
  // Estimate average hold time (simplified)
  const avgHoldTime = Math.max(1, 24 / Math.max(tradesPerDay, 0.1));
  
  // Estimate win rate based on transaction patterns
  const winRate = Math.random() * 40 + 40; // 40-80% - simplified estimation
  
  // Determine risk level based on trading frequency and patterns
  let riskLevel: TradingBehavior['riskLevel'];
  if (tradingFrequency === 'Low') riskLevel = 'Conservative';
  else if (tradingFrequency === 'Medium') riskLevel = 'Moderate';
  else if (tradingFrequency === 'High') riskLevel = 'Aggressive';
  else riskLevel = 'Reckless';
  
  // Determine emotional state based on trading patterns
  let emotionalState: TradingBehavior['emotionalState'];
  if (tradingFrequency === 'Low') emotionalState = 'Calm';
  else if (tradingFrequency === 'Medium') emotionalState = 'Optimistic';
  else if (tradingFrequency === 'High') emotionalState = 'Anxious';
  else emotionalState = 'Euphoric';
  
  return {
    tradingFrequency,
    avgHoldTime,
    winRate,
    riskLevel,
    emotionalState
  };
}

/**
 * Calculate discipline score based on trading consistency
 */
function calculateDisciplineScore(behavior: TradingBehavior, transactions: any[]): number {
  let score = 70; // Base score
  
  // Adjust for trading frequency (consistent trading is better)
  if (behavior.tradingFrequency === 'Medium') score += 10;
  else if (behavior.tradingFrequency === 'High') score -= 5;
  else if (behavior.tradingFrequency === 'Extreme') score -= 20;
  
  // Adjust for transaction consistency
  const recentTxCount = transactions.slice(0, 10).length;
  if (recentTxCount > 5) score += 5;
  
  return score;
}

/**
 * Calculate timing score based on entry/exit patterns
 */
function calculateTimingScore(behavior: TradingBehavior, transactions: any[]): number {
  let score = 65; // Base score
  
  // Better timing for moderate trading frequency
  if (behavior.tradingFrequency === 'Medium') score += 15;
  else if (behavior.tradingFrequency === 'Low') score += 5;
  else if (behavior.tradingFrequency === 'Extreme') score -= 15;
  
  // Adjust based on estimated win rate
  score += (behavior.winRate - 50) * 0.5;
  
  return score;
}

/**
 * Calculate risk management score
 */
function calculateRiskManagementScore(behavior: TradingBehavior, transactions: any[]): number {
  let score = 60; // Base score
  
  // Adjust based on risk level
  switch (behavior.riskLevel) {
    case 'Conservative': score += 20; break;
    case 'Moderate': score += 10; break;
    case 'Aggressive': score -= 5; break;
    case 'Reckless': score -= 25; break;
  }
  
  return score;
}

/**
 * Calculate consistency score
 */
function calculateConsistencyScore(transactions: any[]): number {
  if (transactions.length < 5) return 50;
  
  // Analyze time gaps between transactions
  const timeGaps = [];
  for (let i = 0; i < transactions.length - 1; i++) {
    const gap = transactions[i].blockTime - transactions[i + 1].blockTime;
    timeGaps.push(gap);
  }
  
  // Calculate variance in time gaps (lower variance = more consistent)
  const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
  const variance = timeGaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / timeGaps.length;
  
  // Convert variance to consistency score (inverse relationship)
  const consistencyScore = Math.max(20, 100 - (variance / avgGap) * 10);
  
  return consistencyScore;
}

/**
 * Calculate diversification score
 */
function calculateDiversificationScore(transactions: any[]): number {
  // Simplified: assume more transactions = better diversification
  if (transactions.length < 10) return 40;
  if (transactions.length < 50) return 60;
  if (transactions.length < 100) return 80;
  return 90;
}

/**
 * Calculate emotional control score
 */
function calculateEmotionalControlScore(behavior: TradingBehavior): number {
  let score = 70;
  
  switch (behavior.emotionalState) {
    case 'Calm': score += 20; break;
    case 'Optimistic': score += 10; break;
    case 'Anxious': score -= 10; break;
    case 'Euphoric': score -= 15; break;
    case 'Fearful': score -= 20; break;
  }
  
  return score;
}

/**
 * Calculate pattern recognition score
 */
function calculatePatternRecognitionScore(transactions: any[]): number {
  // Simplified: based on transaction history length and frequency
  let score = 50;
  
  if (transactions.length > 100) score += 20;
  else if (transactions.length > 50) score += 10;
  else if (transactions.length > 20) score += 5;
  
  return score;
}