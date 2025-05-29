/**
 * WALLET WHISPERER CARD CONTROLLER ENGINE
 * 
 * Smart intermediary between the bulletproof pipeline and UI cards.
 * Handles data routing, calculation batching, and card-specific math.
 * 
 * Architecture: Central Pipeline → Card Controller → Individual Cards
 */

import { WalletDataConsumer } from './centralDataPipeline.js';
import { Redis } from '@upstash/redis';

export interface CardData {
  cardType: string;
  data: any;
  loading: boolean;
  error?: string;
  lastUpdated: number;
  staleness: 'fresh' | 'recent' | 'stale' | 'archived';
}

export interface CardRequest {
  walletAddress: string;
  cardTypes: string[];
  forceRefresh?: boolean;
}

export class CardController {
  private consumer: WalletDataConsumer;
  private redis: Redis;
  private calculationCache: Map<string, any> = new Map();

  constructor() {
    this.consumer = new WalletDataConsumer();
    this.redis = new Redis({
      url: process.env.REDIS_URL || 'https://tender-cougar-30690.upstash.io',
      token: process.env.REDIS_TOKEN || 'AXfiAAIjcDEzN2NmM2Y0YTk3MmI1MjhmOTkxZjYzYXAxMA'
    });
  }

  /**
   * MAIN CARD REQUEST HANDLER
   * Routes card requests and returns calculated data
   */
  async getCards(request: CardRequest): Promise<CardData[]> {
    const { walletAddress, cardTypes, forceRefresh } = request;
    
    try {
      // Get base data from pipeline (uses smart caching)
      const transactions = forceRefresh 
        ? await this.consumer.forceRefreshWallet(walletAddress)
        : await this.consumer.getCleanTransactions(walletAddress);
      
      const analysis = await this.consumer.getPsychologicalAnalysis(walletAddress);
      
      if (!transactions || transactions.length === 0) {
        return this.createErrorCards(cardTypes, 'No transaction data available');
      }

      // Batch calculate all requested cards
      const cardResults = await this.batchCalculateCards(
        walletAddress, 
        cardTypes, 
        transactions, 
        analysis
      );

      return cardResults;

    } catch (error) {
      console.error('Card controller failed:', error);
      return this.createErrorCards(cardTypes, error.message);
    }
  }

  /**
   * BATCH CALCULATION ENGINE
   * Runs multiple card calculations in parallel on shared data
   */
  private async batchCalculateCards(
    walletAddress: string,
    cardTypes: string[],
    transactions: any[],
    analysis: any
  ): Promise<CardData[]> {
    const cacheKey = `cards:${walletAddress}`;
    
    // Check if calculations are cached
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const requestedCards = cardTypes.map(type => cachedData[type]).filter(Boolean);
      if (requestedCards.length === cardTypes.length) {
        return requestedCards;
      }
    }

    // Calculate cards in parallel
    const calculationPromises = cardTypes.map(async (cardType) => {
      const calculator = this.cardCalculators[cardType];
      if (!calculator) {
        return this.createErrorCard(cardType, `Unknown card type: ${cardType}`);
      }

      try {
        const result = await calculator(transactions, analysis);
        return this.createSuccessCard(cardType, result);
      } catch (error) {
        return this.createErrorCard(cardType, error.message);
      }
    });

    const results = await Promise.all(calculationPromises);
    
    // Cache results for 30 minutes
    const cacheData = {};
    results.forEach(card => {
      cacheData[card.cardType] = card;
    });
    await this.redis.set(cacheKey, JSON.stringify(cacheData), { ex: 1800 });

    return results;
  }

  /**
   * CARD CALCULATION REGISTRY
   * Each card has its own specialized calculation function
   */
  private cardCalculators = {
    'conviction-collapse': this.calculateConvictionCollapse.bind(this),
    'degen-score': this.calculateDegenScore.bind(this),
    'position-sizing': this.calculatePositionSizing.bind(this),
    'portfolio-performance': this.calculatePortfolioPerformance.bind(this),
    'risk-appetite': this.calculateRiskAppetite.bind(this),
    'trading-frequency': this.calculateTradingFrequency.bind(this),
    'token-loyalty': this.calculateTokenLoyalty.bind(this),
    'fomo-behavior': this.calculateFomoBehavior.bind(this),
    'whale-following': this.calculateWhaleFollowing.bind(this),
    'meta-freshness': this.calculateMetaFreshness.bind(this)
  };

  /**
   * INDIVIDUAL CARD CALCULATIONS
   * Each function processes transactions and returns card-specific metrics
   */

  private async calculateConvictionCollapse(transactions: any[], analysis: any) {
    const tokens = this.groupTransactionsByToken(transactions);
    let collapseEvents = 0;
    let totalLossPercent = 0;

    Object.entries(tokens).forEach(([token, txs]: [string, any[]]) => {
      const buyTxs = txs.filter(tx => tx.type === 'buy').sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const sellTxs = txs.filter(tx => tx.type === 'sell').sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      buyTxs.forEach(buy => {
        const quickSell = sellTxs.find(sell => 
          new Date(sell.timestamp).getTime() - new Date(buy.timestamp).getTime() < 24 * 60 * 60 * 1000 && // Within 24 hours
          sell.usd_value < buy.usd_value * 0.8 // Sold for less than 80% of buy price
        );
        
        if (quickSell) {
          collapseEvents++;
          totalLossPercent += ((buy.usd_value - quickSell.usd_value) / buy.usd_value) * 100;
        }
      });
    });

    const avgLossPercent = collapseEvents > 0 ? totalLossPercent / collapseEvents : 0;
    const score = Math.max(0, 100 - (collapseEvents * 20));

    return {
      score,
      events: collapseEvents,
      avgLossPercent: Math.round(avgLossPercent),
      pattern: collapseEvents === 0 ? 'Stable Conviction' : 
               collapseEvents < 3 ? 'Occasional Doubt' : 'Frequent Collapse',
      insight: `Analyzed ${Object.keys(tokens).length} tokens. ${collapseEvents} rapid reversals detected (${((collapseEvents / Object.keys(tokens).length) * 100).toFixed(1)}% rate).`
    };
  }

  private async calculateDegenScore(transactions: any[], analysis: any) {
    const riskFactors = {
      newTokenRatio: 0,
      avgTransactionSize: 0,
      nightTradingRatio: 0,
      impulsiveTrading: 0
    };

    // Calculate risk factors
    const totalValue = transactions.reduce((sum, tx) => sum + (tx.usd_value || 0), 0);
    const avgTxValue = totalValue / transactions.length;
    
    // Night trading (10PM - 6AM)
    const nightTrades = transactions.filter(tx => {
      const hour = new Date(tx.timestamp).getHours();
      return hour >= 22 || hour <= 6;
    });
    
    riskFactors.nightTradingRatio = nightTrades.length / transactions.length;
    riskFactors.avgTransactionSize = avgTxValue > 1000 ? 0.8 : avgTxValue > 100 ? 0.5 : 0.2;
    
    const degenScore = Math.round(
      (riskFactors.nightTradingRatio * 40) +
      (riskFactors.avgTransactionSize * 30) +
      (riskFactors.impulsiveTrading * 30)
    );

    return {
      score: degenScore,
      level: degenScore < 20 ? 'Conservative' : 
             degenScore < 50 ? 'Calculated Risk' : 
             degenScore < 80 ? 'High Risk' : 'Extreme Degen',
      factors: {
        nightTrading: Math.round(riskFactors.nightTradingRatio * 100),
        avgTransactionSize: avgTxValue,
        totalRiskEvents: nightTrades.length
      },
      insight: `${degenScore}/100 degen score based on ${transactions.length} transactions. ${nightTrades.length} night trades detected.`
    };
  }

  private async calculatePositionSizing(transactions: any[], analysis: any) {
    const positionSizes = transactions.map(tx => tx.usd_value || 0).filter(value => value > 0);
    const avgPosition = positionSizes.reduce((sum, size) => sum + size, 0) / positionSizes.length;
    const maxPosition = Math.max(...positionSizes);
    const minPosition = Math.min(...positionSizes);
    
    const consistency = 1 - ((maxPosition - minPosition) / avgPosition);
    const sizingScore = Math.round(consistency * 100);

    return {
      score: sizingScore,
      avgPositionSize: Math.round(avgPosition),
      maxPosition: Math.round(maxPosition),
      minPosition: Math.round(minPosition),
      consistency: Math.round(consistency * 100),
      pattern: sizingScore > 80 ? 'Highly Consistent' :
               sizingScore > 60 ? 'Moderately Consistent' : 
               'Erratic Sizing',
      insight: `Position sizing consistency: ${sizingScore}%. Average position: $${Math.round(avgPosition)}`
    };
  }

  private async calculatePortfolioPerformance(transactions: any[], analysis: any) {
    const buys = transactions.filter(tx => tx.type === 'buy');
    const sells = transactions.filter(tx => tx.type === 'sell');
    
    const totalInvested = buys.reduce((sum, tx) => sum + (tx.usd_value || 0), 0);
    const totalRealized = sells.reduce((sum, tx) => sum + (tx.usd_value || 0), 0);
    
    const roi = totalInvested > 0 ? ((totalRealized - totalInvested) / totalInvested) * 100 : 0;
    const winRate = sells.length > 0 ? (sells.filter(sell => {
      const buyPrice = buys.find(buy => buy.token === sell.token)?.usd_value || 0;
      return sell.usd_value > buyPrice;
    }).length / sells.length) * 100 : 0;

    return {
      roi: Math.round(roi * 100) / 100,
      totalInvested: Math.round(totalInvested),
      totalRealized: Math.round(totalRealized),
      winRate: Math.round(winRate),
      totalTrades: transactions.length,
      performance: roi > 20 ? 'Excellent' :
                   roi > 0 ? 'Profitable' :
                   roi > -20 ? 'Break Even' : 'Needs Improvement',
      insight: `${roi.toFixed(1)}% ROI across ${transactions.length} transactions. Win rate: ${winRate.toFixed(1)}%`
    };
  }

  private async calculateRiskAppetite(transactions: any[], analysis: any) {
    const riskScore = analysis?.risk_score || 50;
    const highRiskTxs = transactions.filter(tx => (tx.risk || 0) > 70);
    const riskRatio = highRiskTxs.length / transactions.length;

    return {
      score: riskScore,
      level: riskScore < 30 ? 'Conservative' :
             riskScore < 60 ? 'Moderate' :
             riskScore < 80 ? 'Aggressive' : 'Extreme Risk',
      highRiskTrades: highRiskTxs.length,
      riskRatio: Math.round(riskRatio * 100),
      insight: `Risk appetite: ${riskScore}/100. ${highRiskTxs.length} high-risk transactions identified.`
    };
  }

  private async calculateTradingFrequency(transactions: any[], analysis: any) {
    const timespan = this.calculateTimespan(transactions);
    const frequency = timespan > 0 ? transactions.length / timespan : 0;
    
    return {
      frequency: Math.round(frequency * 100) / 100,
      timespan: Math.round(timespan),
      totalTransactions: transactions.length,
      pattern: frequency > 5 ? 'High Frequency' :
               frequency > 1 ? 'Active' :
               frequency > 0.5 ? 'Moderate' : 'Infrequent',
      insight: `${frequency.toFixed(1)} transactions per day over ${Math.round(timespan)} days`
    };
  }

  private async calculateTokenLoyalty(transactions: any[], analysis: any) {
    const tokens = this.groupTransactionsByToken(transactions);
    const loyaltyScores = Object.entries(tokens).map(([token, txs]: [string, any[]]) => {
      const timespan = this.calculateTimespan(txs);
      return { token, timespan, trades: txs.length };
    });

    const avgLoyalty = loyaltyScores.reduce((sum, t) => sum + t.timespan, 0) / loyaltyScores.length;
    
    return {
      avgHoldTime: Math.round(avgLoyalty),
      topTokens: loyaltyScores.sort((a, b) => b.timespan - a.timespan).slice(0, 3),
      uniqueTokens: Object.keys(tokens).length,
      loyaltyPattern: avgLoyalty > 30 ? 'Long-term Holder' :
                      avgLoyalty > 7 ? 'Medium-term' : 'Short-term Trader',
      insight: `Average hold time: ${avgLoyalty.toFixed(1)} days across ${Object.keys(tokens).length} tokens`
    };
  }

  private async calculateFomoBehavior(transactions: any[], analysis: any) {
    const fomoScore = analysis?.fomo_score || 50;
    const quickBuys = transactions.filter(tx => 
      tx.type === 'buy' && (tx.confidence || 0) < 50
    );

    return {
      score: fomoScore,
      level: fomoScore < 25 ? 'Controlled' :
             fomoScore < 50 ? 'Occasional FOMO' :
             fomoScore < 75 ? 'Frequent FOMO' : 'FOMO Driven',
      impulsiveTrades: quickBuys.length,
      fomoRatio: Math.round((quickBuys.length / transactions.length) * 100),
      insight: `FOMO score: ${fomoScore}/100. ${quickBuys.length} potentially impulsive trades detected.`
    };
  }

  private async calculateWhaleFollowing(transactions: any[], analysis: any) {
    // This would need additional data about whale movements
    // For now, return placeholder based on available data
    const influenceScore = analysis?.influence_score || 50;
    
    return {
      score: influenceScore,
      following: influenceScore > 70 ? 'High Whale Influence' :
                 influenceScore > 40 ? 'Moderate Influence' : 'Independent Trading',
      confidence: 60, // Would be calculated from actual whale correlation data
      insight: `Influence score: ${influenceScore}/100. Moderate correlation with market movements.`
    };
  }

  private async calculateMetaFreshness(transactions: any[], analysis: any) {
    const lastUpdate = analysis?.last_analyzed || transactions.metadata?.lastUpdated;
    const dataAge = lastUpdate ? Date.now() - new Date(lastUpdate).getTime() : 0;
    const ageMinutes = Math.floor(dataAge / 60000);
    
    const staleness = dataAge < 1800000 ? 'fresh' :
                      dataAge < 3600000 ? 'recent' :
                      dataAge < 21600000 ? 'stale' : 'archived';

    return {
      lastUpdated: lastUpdate,
      ageMinutes,
      staleness,
      shouldRefresh: dataAge > 3600000,
      dataQuality: transactions.length > 50 ? 'High' :
                   transactions.length > 10 ? 'Medium' : 'Limited',
      insight: `Data is ${ageMinutes} minutes old. ${transactions.length} transactions analyzed.`
    };
  }

  /**
   * HELPER FUNCTIONS
   */
  private groupTransactionsByToken(transactions: any[]): Record<string, any[]> {
    return transactions.reduce((groups, tx) => {
      const token = tx.token || 'unknown';
      if (!groups[token]) groups[token] = [];
      groups[token].push(tx);
      return groups;
    }, {});
  }

  private calculateTimespan(transactions: any[]): number {
    if (transactions.length < 2) return 0;
    
    const timestamps = transactions.map(tx => new Date(tx.timestamp).getTime()).sort();
    const oldest = timestamps[0];
    const newest = timestamps[timestamps.length - 1];
    
    return (newest - oldest) / (24 * 60 * 60 * 1000); // Days
  }

  private createSuccessCard(cardType: string, data: any): CardData {
    return {
      cardType,
      data,
      loading: false,
      lastUpdated: Date.now(),
      staleness: 'fresh'
    };
  }

  private createErrorCard(cardType: string, error: string): CardData {
    return {
      cardType,
      data: null,
      loading: false,
      error,
      lastUpdated: Date.now(),
      staleness: 'archived'
    };
  }

  private createErrorCards(cardTypes: string[], error: string): CardData[] {
    return cardTypes.map(type => this.createErrorCard(type, error));
  }
}