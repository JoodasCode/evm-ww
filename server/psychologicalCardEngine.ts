/**
 * PSYCHOLOGICAL CARD ENGINE
 * 
 * Central orchestration for all psychological analysis cards.
 * Fetches clean data once and runs all card logic in a unified way.
 */

import { WalletDataConsumer } from './centralDataPipeline.js';

export interface PsychologicalAnalysis {
  archetype: string;
  whispererScore: number;
  degenScore: number;
  positionSizing: {
    style: string;
    consistency: number;
    avgSize: number;
  };
  convictionCollapse: {
    trend: string;
    score: number;
    volatility: number;
  };
  diversification: {
    type: string;
    tokenCount: number;
    top3Percentage: number;
  };
  gasStrategy: {
    type: string;
    avgFee: number;
    efficiency: string;
  };
  tradingFrequency: {
    pattern: string;
    tradesPerWeek: number;
    consistency: number;
  };
  riskProfile: {
    level: string;
    score: number;
    tolerance: string;
  };
  performanceMetrics: {
    totalVolume: number;
    avgValue: number;
    timespan: number;
  };
}

export class PsychologicalCardEngine {
  private wallet: string;
  private consumer: WalletDataConsumer;
  
  constructor(walletAddress: string) {
    this.wallet = walletAddress;
    this.consumer = new WalletDataConsumer();
  }

  /**
   * Main method: Run all psychological cards at once
   */
  async runAllCards(): Promise<PsychologicalAnalysis> {
    const cleanData = await this.fetchCleanData();
    
    if (!cleanData || !cleanData.length) {
      throw new Error('No clean transaction data available for analysis');
    }

    const analysis: PsychologicalAnalysis = {
      archetype: this.getArchetype(cleanData),
      whispererScore: this.getWhispererScore(cleanData),
      degenScore: this.getDegenScore(cleanData),
      positionSizing: this.analyzePositionSizing(cleanData),
      convictionCollapse: this.analyzeConvictionCollapse(cleanData),
      diversification: this.analyzeDiversification(cleanData),
      gasStrategy: this.analyzeGasStrategy(cleanData),
      tradingFrequency: this.analyzeTradingFrequency(cleanData),
      riskProfile: this.analyzeRiskProfile(cleanData),
      performanceMetrics: this.calculatePerformanceMetrics(cleanData)
    };

    return analysis;
  }

  /**
   * Fetch clean transaction data from the consumer
   */
  private async fetchCleanData() {
    return await this.consumer.getCleanTransactions(this.wallet);
  }

  /**
   * Position Sizing Analysis
   */
  private analyzePositionSizing(transactions: any[]) {
    const values = transactions
      .filter(tx => tx.usd_value > 0)
      .map(tx => tx.usd_value);
    
    if (values.length === 0) {
      return { style: 'Unknown', consistency: 0, avgSize: 0 };
    }

    const avgSize = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avgSize, 2), 0) / values.length;
    const consistency = Math.max(0, 100 - (Math.sqrt(variance) / avgSize * 100));
    
    const style = consistency > 80 ? 'Systematic' :
                 consistency > 60 ? 'Structured' :
                 consistency > 40 ? 'Variable' : 'Chaotic';

    return { style, consistency: Math.round(consistency), avgSize: Math.round(avgSize) };
  }

  /**
   * Conviction Collapse Analysis
   */
  private analyzeConvictionCollapse(transactions: any[]) {
    const buys = transactions.filter(tx => tx.type === 'buy');
    const sells = transactions.filter(tx => tx.type === 'sell');
    
    if (buys.length === 0 || sells.length === 0) {
      return { trend: 'Insufficient Data', score: 50, volatility: 0 };
    }

    // Calculate time between buys and sells for same tokens
    let holdTimes: number[] = [];
    const tokenMap = new Map();
    
    buys.forEach(buy => {
      const token = buy.token;
      if (!tokenMap.has(token)) tokenMap.set(token, []);
      tokenMap.get(token).push({ type: 'buy', timestamp: new Date(buy.timestamp).getTime() });
    });
    
    sells.forEach(sell => {
      const token = sell.token;
      if (tokenMap.has(token)) {
        tokenMap.get(token).push({ type: 'sell', timestamp: new Date(sell.timestamp).getTime() });
      }
    });

    // Calculate average hold time
    let totalHoldTime = 0;
    let holdCount = 0;
    
    for (const [token, actions] of tokenMap) {
      actions.sort((a: any, b: any) => a.timestamp - b.timestamp);
      
      for (let i = 0; i < actions.length - 1; i++) {
        if (actions[i].type === 'buy' && actions[i + 1].type === 'sell') {
          const holdTime = actions[i + 1].timestamp - actions[i].timestamp;
          holdTimes.push(holdTime);
          totalHoldTime += holdTime;
          holdCount++;
        }
      }
    }

    if (holdCount === 0) {
      return { trend: 'No Pairs Found', score: 50, volatility: 0 };
    }

    const avgHoldTime = totalHoldTime / holdCount;
    const variance = holdTimes.reduce((sum, time) => sum + Math.pow(time - avgHoldTime, 2), 0) / holdTimes.length;
    const volatility = Math.sqrt(variance) / avgHoldTime;
    
    const score = Math.max(0, Math.min(100, 100 - (volatility * 100)));
    const trend = score > 70 ? 'Steady' : score > 40 ? 'Volatile' : 'Erratic';

    return { trend, score: Math.round(score), volatility: Math.round(volatility * 100) };
  }

  /**
   * Diversification Analysis
   */
  private analyzeDiversification(transactions: any[]) {
    const tokenVolumes = new Map();
    
    transactions.forEach(tx => {
      const token = tx.token;
      const volume = tx.usd_value || 0;
      tokenVolumes.set(token, (tokenVolumes.get(token) || 0) + volume);
    });

    const sortedVolumes = Array.from(tokenVolumes.values()).sort((a, b) => b - a);
    const totalVolume = sortedVolumes.reduce((sum, vol) => sum + vol, 0);
    const top3Volume = sortedVolumes.slice(0, 3).reduce((sum, vol) => sum + vol, 0);
    const top3Percentage = Math.round((top3Volume / totalVolume) * 100);
    
    const tokenCount = tokenVolumes.size;
    const type = tokenCount < 3 ? 'Concentrated' :
                tokenCount < 8 ? 'Moderate' : 'Diversified';

    return { type, tokenCount, top3Percentage };
  }

  /**
   * Gas Strategy Analysis
   */
  private analyzeGasStrategy(transactions: any[]) {
    const fees = transactions
      .filter(tx => tx.fee && tx.fee > 0)
      .map(tx => tx.fee);
    
    if (fees.length === 0) {
      return { type: 'Unknown', avgFee: 0, efficiency: 'No Data' };
    }

    const avgFee = fees.reduce((sum, fee) => sum + fee, 0) / fees.length;
    
    const type = avgFee > 0.005 ? 'Premium' :
                avgFee > 0.002 ? 'Standard' : 'Economy';
    
    const efficiency = avgFee < 0.001 ? 'Highly Efficient' :
                      avgFee < 0.003 ? 'Efficient' : 'Standard';

    return { type, avgFee: Math.round(avgFee * 10000) / 10000, efficiency };
  }

  /**
   * Trading Frequency Analysis
   */
  private analyzeTradingFrequency(transactions: any[]) {
    if (transactions.length === 0) {
      return { pattern: 'No Activity', tradesPerWeek: 0, consistency: 0 };
    }

    const timestamps = transactions.map(tx => new Date(tx.timestamp).getTime());
    const timespan = Math.max(...timestamps) - Math.min(...timestamps);
    const weeks = timespan / (7 * 24 * 60 * 60 * 1000);
    const tradesPerWeek = weeks > 0 ? transactions.length / weeks : 0;

    const pattern = tradesPerWeek > 10 ? 'High Frequency' :
                   tradesPerWeek > 3 ? 'Active' :
                   tradesPerWeek > 1 ? 'Moderate' : 'Casual';

    // Calculate consistency (regularity of trading)
    const consistency = Math.min(100, Math.max(0, 100 - (Math.abs(tradesPerWeek - 3) * 10)));

    return { 
      pattern, 
      tradesPerWeek: Math.round(tradesPerWeek * 10) / 10, 
      consistency: Math.round(consistency) 
    };
  }

  /**
   * Risk Profile Analysis
   */
  private analyzeRiskProfile(transactions: any[]) {
    const riskScores = transactions.map(tx => tx.risk || 0);
    const avgRisk = riskScores.reduce((sum, risk) => sum + risk, 0) / riskScores.length;
    
    const level = avgRisk > 0.7 ? 'High Risk' :
                 avgRisk > 0.4 ? 'Moderate Risk' : 'Conservative';
    
    const tolerance = avgRisk > 0.8 ? 'Extreme' :
                     avgRisk > 0.6 ? 'High' :
                     avgRisk > 0.3 ? 'Moderate' : 'Low';

    return { 
      level, 
      score: Math.round(avgRisk * 100), 
      tolerance 
    };
  }

  /**
   * Performance Metrics Calculation
   */
  private calculatePerformanceMetrics(transactions: any[]) {
    const totalVolume = transactions.reduce((sum, tx) => sum + (tx.usd_value || 0), 0);
    const avgValue = totalVolume / transactions.length;
    
    const timestamps = transactions.map(tx => new Date(tx.timestamp).getTime());
    const timespan = (Math.max(...timestamps) - Math.min(...timestamps)) / (24 * 60 * 60 * 1000); // days

    return {
      totalVolume: Math.round(totalVolume),
      avgValue: Math.round(avgValue),
      timespan: Math.round(timespan)
    };
  }

  /**
   * Determine overall archetype
   */
  private getArchetype(transactions: any[]) {
    const positionSizing = this.analyzePositionSizing(transactions);
    const conviction = this.analyzeConvictionCollapse(transactions);
    const diversification = this.analyzeDiversification(transactions);
    const frequency = this.analyzeTradingFrequency(transactions);

    // Complex logic to determine archetype based on multiple factors
    if (frequency.tradesPerWeek > 8 && positionSizing.consistency < 50) {
      return 'Chaos Trader';
    } else if (conviction.score > 70 && diversification.tokenCount < 5) {
      return 'Conviction Chaser';
    } else if (positionSizing.consistency > 80 && diversification.type === 'Diversified') {
      return 'Systematic Builder';
    } else if (frequency.pattern === 'High Frequency') {
      return 'Active Degen';
    } else {
      return 'Balanced Explorer';
    }
  }

  /**
   * Calculate Whisperer Score (sophisticated trading)
   */
  private getWhispererScore(transactions: any[]): number {
    const positionSizing = this.analyzePositionSizing(transactions);
    const conviction = this.analyzeConvictionCollapse(transactions);
    const diversification = this.analyzeDiversification(transactions);
    
    return Math.round(
      (positionSizing.consistency * 0.4) +
      (conviction.score * 0.3) +
      (Math.min(100, diversification.tokenCount * 10) * 0.3)
    );
  }

  /**
   * Calculate Degen Score (risk/frequency)
   */
  private getDegenScore(transactions: any[]): number {
    const frequency = this.analyzeTradingFrequency(transactions);
    const riskProfile = this.analyzeRiskProfile(transactions);
    const gasStrategy = this.analyzeGasStrategy(transactions);
    
    const frequencyScore = Math.min(100, frequency.tradesPerWeek * 10);
    const gasScore = gasStrategy.avgFee > 0.003 ? 80 : 40;
    
    return Math.round(
      (frequencyScore * 0.4) +
      (riskProfile.score * 0.4) +
      (gasScore * 0.2)
    );
  }
}