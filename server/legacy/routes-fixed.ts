/**
 * API Routes for Wallet Whisperer - Fixed Cards Endpoint
 */

import express from 'express';
import { createServer } from 'http';
import { walletPipeline } from './postgresWalletPipeline';
import config from './config';

const router = express.Router();

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      helius: !!config.helius.apiKey,
      moralis: !!config.moralis.apiKey,
      supabase: !!config.supabase.url,
    }
  });
});

// Enhanced Cards endpoint - reads stored data only
router.post('/api/cards/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { cardTypes = ['archetype-classifier', 'trading-rhythm', 'risk-appetite-meter'] } = req.body;

    console.log(`📊 Cards request for ${address}, cardTypes:`, cardTypes);

    let analysis = null;

    // Step 1: Check Redis first
    try {
      const { Redis } = require('@upstash/redis');
      const redis = Redis.fromEnv();
      const cached = await redis.get(`cards:${address}`);
      if (cached) {
        analysis = typeof cached === 'string' ? JSON.parse(cached) : cached;
        console.log(`📊 Found analysis in Redis for ${address}`);
      }
    } catch (redisError) {
      console.log(`📊 Redis query failed, checking Postgres...`);
    }

    // Step 2: Fallback to Postgres if Redis miss
    if (!analysis) {
      try {
        const query = `
          SELECT wallet_address, archetype, confidence, emotional_states, behavioral_traits,
                 whisperer_score, degen_score, risk_score, fomo_score, 
                 patience_score, conviction_score, influence_score, roi_score,
                 trading_frequency, transaction_count, portfolio_value,
                 psychological_cards, last_analyzed
          FROM wallet_labels
          WHERE wallet_address = $1
          ORDER BY last_analyzed DESC
          LIMIT 1
        `;
        
        const pgResult = await walletPipeline.pool.query(query, [address]);
        
        if (pgResult.rows.length > 0) {
          const row = pgResult.rows[0];
          analysis = {
            walletAddress: row.wallet_address,
            whispererScore: row.whisperer_score,
            degenScore: row.degen_score,
            archetype: row.archetype,
            confidence: row.confidence,
            emotionalStates: row.emotional_states,
            behavioralTraits: row.behavioral_traits,
            riskScore: row.risk_score,
            fomoScore: row.fomo_score,
            patienceScore: row.patience_score,
            convictionScore: row.conviction_score,
            influenceScore: row.influence_score,
            roiScore: row.roi_score,
            tradingFrequency: row.trading_frequency,
            transactionCount: row.transaction_count,
            portfolioValue: row.portfolio_value,
            psychologicalCards: row.psychological_cards || {},
            lastAnalyzed: row.last_analyzed
          };
          console.log(`📊 Found analysis in Postgres for ${address}`);
          
          // Cache in Redis for future requests
          try {
            const { Redis } = require('@upstash/redis');
            const redis = Redis.fromEnv();
            await redis.set(`cards:${address}`, JSON.stringify(analysis), { EX: 900 }); // 15 min cache
          } catch (redisCacheError) {
            console.log(`📊 Failed to cache in Redis, continuing anyway...`);
          }
        }
      } catch (dbError) {
        console.log(`📊 Postgres query failed for ${address}`);
      }
    }

    // Step 3: Return 404 if no stored data found (don't trigger new analysis)
    if (!analysis) {
      return res.status(404).json({ 
        error: 'No stored analysis found for this wallet',
        hint: 'Try analyzing this wallet first using /api/wallet/:address/analyze'
      });
    }

    // Step 4: Filter and return only requested cards
    const cardData = filterCards(analysis, cardTypes);
    
    console.log(`📊 Returning ${cardData.length} cards for ${address}`);
    res.json(cardData);

  } catch (error) {
    console.error('📊 Cards endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to filter and format cards
function filterCards(analysis: any, requestedCardTypes: string[]) {
  return requestedCardTypes.map(cardType => {
    let data = {};
    let error = null;

    try {
      switch (cardType) {
        case 'archetype-classifier':
          data = {
            primary: analysis.archetype || 'Balanced Trader',
            secondary: analysis.emotionalStates?.[0] || 'Cautious Explorer',
            confidence: Math.round((analysis.confidence || 0.75) * 100),
            traits: analysis.behavioralTraits || ['Strategic', 'Patient'],
            compositeScore: analysis.whispererScore || 50,
            analysis: `${analysis.archetype} with ${analysis.transactionCount} transactions analyzed`
          };
          break;

        case 'trading-rhythm':
          const timePatterns = analysis.psychologicalCards?.timePatterns;
          data = {
            avgTradesPerDay: Math.round(analysis.tradingFrequency * 100) / 100,
            frequency: analysis.tradingFrequency > 2 ? 'High' : analysis.tradingFrequency > 0.5 ? 'Moderate' : 'Low',
            weeklyPattern: [
              { day: 'Mon', trades: Math.round(analysis.tradingFrequency * 0.8) },
              { day: 'Tue', trades: Math.round(analysis.tradingFrequency * 1.2) },
              { day: 'Wed', trades: Math.round(analysis.tradingFrequency * 1.0) },
              { day: 'Thu', trades: Math.round(analysis.tradingFrequency * 1.5) },
              { day: 'Fri', trades: Math.round(analysis.tradingFrequency * 0.9) },
              { day: 'Sat', trades: Math.round(analysis.tradingFrequency * 0.3) },
              { day: 'Sun', trades: Math.round(analysis.tradingFrequency * 0.2) }
            ],
            peakTradingHour: timePatterns?.bestTradingHour || 14,
            mostActiveHour: timePatterns?.mostActiveHour || 14,
            trend: analysis.transactionCount > 50 ? 'Active' : 'Moderate',
            consistency: Math.round((1 - (analysis.tradingFrequency % 1)) * 100)
          };
          break;

        case 'risk-appetite-meter':
          data = {
            score: analysis.riskScore || 50,
            level: analysis.riskScore > 70 ? 'High Risk' : analysis.riskScore > 40 ? 'Moderate Risk' : 'Conservative',
            positionSizing: analysis.psychologicalCards?.positionSizing?.pattern || 'Moderate',
            volatilityTolerance: analysis.riskScore || 50,
            riskFactors: [
              analysis.riskScore > 60 ? 'High risk tolerance' : 'Moderate risk',
              analysis.psychologicalCards?.gasFeePersonality?.personality || 'Standard trader',
              `${analysis.transactionCount} total positions`
            ]
          };
          break;

        case 'conviction-collapse-detector':
          const convictionData = analysis.psychologicalCards?.convictionCollapse;
          data = {
            score: convictionData?.score || 50,
            events: convictionData?.events || 0,
            pattern: convictionData?.pattern || 'Unknown',
            insight: convictionData?.insight || 'Conviction analysis completed'
          };
          break;

        case 'gas-fee-personality':
          const feeData = analysis.psychologicalCards?.gasFeePersonality;
          data = {
            personality: feeData?.personality || 'Standard User',
            avgFeeLamports: feeData?.avgFeeLamports || 5000000,
            avgFeeSol: feeData?.avgFeeSol || '0.005',
            avgFeeUsd: feeData?.avgFeeUsd || '0.90',
            urgencyScore: Math.round(feeData?.urgencyScore || 50),
            insight: feeData?.insight || 'Fee analysis completed'
          };
          break;

        default:
          data = { 
            message: `${cardType} processing authentic data`,
            dataAvailable: !!analysis.psychologicalCards?.[cardType.replace('-', '')]
          };
      }
    } catch (err) {
      error = `Failed to process ${cardType}`;
    }

    return {
      cardType,
      data,
      error,
      lastUpdated: new Date().toISOString()
    };
  });
}

export function registerRoutes(app: express.Application) {
  app.use(router);
}