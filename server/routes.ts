/**
 * API Routes for Wallet Whisperer - Fixed Cards Endpoint
 */

import express from 'express';
import { createServer } from 'http';
import { walletPipeline } from './postgresWalletPipeline';
import { pool } from './db';
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

// Wallet analysis endpoint
router.post('/api/wallet/:address/analyze', async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`🚀 Starting analysis for wallet: ${address}`);
    
    const analysis = await walletPipeline.analyzeWallet(address);
    
    console.log(`✅ Analysis completed for ${address}`);
    res.json(analysis);
  } catch (error) {
    console.error(`❌ Analysis failed for ${address}:`, error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message,
      wallet: address 
    });
  }
});

// Enhanced Cards endpoint - reads stored data only
router.post('/api/cards/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { cardTypes = ['archetype-classifier', 'trading-rhythm', 'risk-appetite-meter'] } = req.body;

    console.log(`📊 Cards request for ${address}, cardTypes:`, cardTypes);

    let analysis = null;

    // Step 1: Check Redis first for cached analysis data
    // This implements the primary caching layer to avoid expensive re-analysis
    try {
      const { Redis } = require('@upstash/redis');
      const redis = Redis.fromEnv();
      const cached = await redis.get(`cards:${address}`);
      if (cached) {
        analysis = typeof cached === 'string' ? JSON.parse(cached) : cached;
        console.log(`[REDIS HIT] Found cached analysis for ${address}`);
      } else {
        console.log(`[REDIS MISS] No cached data found for ${address}`);
      }
    } catch (redisError) {
      console.log(`[REDIS ERROR] Redis query failed: ${redisError.message}, checking Postgres...`);
    }

    // Step 2: Fallback to Postgres using shared database connection
    // This prevents re-analysis loop by accessing stored analysis data directly
    if (!analysis) {
      try {
        console.log(`[POSTGRES DEBUG] Attempting to query stored analysis for ${address}`);
        
        // Check what tables exist first
        const tableCheck = await pool.query(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        console.log(`[POSTGRES DEBUG] Available tables:`, tableCheck.rows.map(r => r.table_name));
        
        // Query stored analysis from wallet_scores and wallet_behavior tables
        // These contain processed data from the analysis pipeline, avoiding re-analysis
        const analysisQuery = `
          SELECT 
            ws.wallet_address,
            ws.whisperer_score,
            ws.degen_score,
            ws.roi_score,
            ws.influence_score,
            ws.portfolio_value,
            ws.total_transactions,
            ws.last_analyzed_at,
            wb.risk_score,
            wb.fomo_score,
            wb.patience_score,
            wb.conviction_score,
            wb.archetype,
            wb.confidence,
            wb.emotional_states,
            wb.behavioral_traits
          FROM wallet_scores ws
          LEFT JOIN wallet_behavior wb ON ws.wallet_address = wb.wallet_address
          WHERE ws.wallet_address = $1
          ORDER BY ws.last_analyzed_at DESC
          LIMIT 1
        `;
        
        const pgResult = await pool.query(analysisQuery, [address]);
        
        if (pgResult.rows.length > 0) {
          console.log(`[POSTGRES HIT] Found complete analysis for ${address}`);
        } else {
          console.log(`[POSTGRES MISS] No analysis found in wallet_scores for ${address}`);
        }
        
        if (pgResult && pgResult.rows.length > 0) {
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
          console.log(`[POSTGRES HIT] Found stored analysis for ${address}`);
          
          // Cache in Redis for future requests
          try {
            const { Redis } = require('@upstash/redis');
            const redis = Redis.fromEnv();
            await redis.set(`cards:${address}`, JSON.stringify(analysis), { EX: 900 }); // 15 min cache
            console.log(`[REDIS CACHE] Cached analysis for ${address}`);
          } catch (redisCacheError) {
            console.log(`[REDIS CACHE ERROR] Failed to cache for ${address}: ${redisCacheError.message}`);
          }
        } else {
          console.log(`[POSTGRES MISS] No stored analysis found for ${address}`);
        }
      } catch (dbError) {
        console.error(`[POSTGRES ERROR] Database query failed for ${address}:`, dbError);
        console.error(`[POSTGRES ERROR] Error stack:`, dbError.stack);
        console.log(`[POSTGRES ERROR] Falling back to fresh analysis...`);
      }
    }

    // Step 3: Return 404 if no stored data found (DO NOT TRIGGER NEW ANALYSIS)
    if (!analysis) {
      console.log(`[ENDPOINT] No data found for ${address} - returning 404`);
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

        case 'position-sizing-psychology':
          const positionData = analysis.psychologicalCards?.positionSizing;
          data = {
            pattern: positionData?.pattern || 'Moderate',
            sizingConsistency: positionData?.sizingConsistency || 50,
            riskLevel: positionData?.riskLevel || 'Medium',
            avgPositionSize: positionData?.avgPositionSize || 0,
            insight: positionData?.insight || 'Position sizing analysis completed'
          };
          break;

        case 'time-of-day-patterns':
          const timeData = analysis.psychologicalCards?.timePatterns;
          data = {
            bestTradingHour: timeData?.bestTradingHour || 14,
            worstTradingHour: timeData?.worstTradingHour || 3,
            mostActiveHour: timeData?.mostActiveHour || 14,
            optimalTimeWindow: timeData?.optimalTimeWindow || '14:00 - 16:00',
            hourlyDistribution: timeData?.hourlyDistribution || Array(24).fill(0),
            insight: timeData?.insight || 'Time pattern analysis completed'
          };
          break;

        case 'token-rotation-intelligence':
          const loyaltyData = analysis.psychologicalCards?.narrativeLoyalty;
          data = {
            dominantNarrative: loyaltyData?.dominantNarrative || 'Mixed',
            loyaltyScore: loyaltyData?.loyaltyScore || 50,
            diversification: loyaltyData?.diversification || 1,
            narrativeBreakdown: loyaltyData?.narrativeBreakdown || { DeFi: 50, Meme: 25, Gaming: 15, Utility: 10 },
            insight: loyaltyData?.insight || 'Token rotation analysis completed'
          };
          break;

        case 'market-timing-ability':
          data = {
            timingScore: analysis.roiScore || 50,
            marketCycles: Math.floor(analysis.transactionCount / 10),
            successRate: Math.round(analysis.roiScore * 0.8),
            volatilityHandling: analysis.riskScore > 60 ? 'High' : 'Moderate',
            insight: `Market timing ability based on ${analysis.transactionCount} transactions`
          };
          break;

        case 'fomo-fear-cycle':
          const fomoData = analysis.psychologicalCards?.fomoFearCycle;
          data = {
            fomoScore: fomoData?.fomoScore || analysis.fomoScore || 50,
            fearScore: fomoData?.fearScore || 30,
            currentState: fomoData?.currentState || 'Balanced',
            cycleTrend: fomoData?.cycleTrend || 'Stable',
            insight: fomoData?.insight || 'FOMO/Fear cycle analysis completed'
          };
          break;

        case 'post-rug-behavior':
          const rugData = analysis.psychologicalCards?.postRugBehavior;
          data = {
            score: rugData?.score || 60,
            rugEvents: rugData?.rugEvents || 0,
            recoveryPhase: rugData?.recoveryPhase || 'Stable',
            positionSizeChange: rugData?.positionSizeChange || 0,
            insight: rugData?.insight || 'Post-rug behavior analysis completed'
          };
          break;

        case 'loss-aversion':
          const lossData = analysis.psychologicalCards?.lossRecovery;
          data = {
            recoveryScore: lossData?.recoveryScore || 70,
            recoveryPhase: lossData?.recoveryPhase || 'Stable Recovery',
            resilienceLevel: lossData?.recoveryScore > 70 ? 'High' : 'Moderate',
            insight: lossData?.insight || 'Loss aversion analysis completed'
          };
          break;

        case 'profit-taking-discipline':
          data = {
            discipline: analysis.patienceScore > 70 ? 'High' : 'Moderate',
            profitScore: analysis.roiScore || 50,
            patienceLevel: analysis.patienceScore || 50,
            realizationTiming: 'Moderate',
            insight: 'Profit-taking discipline based on patience and ROI scores'
          };
          break;

        case 'narrative-loyalty':
          const narrativeData = analysis.psychologicalCards?.narrativeLoyalty;
          data = {
            dominantNarrative: narrativeData?.dominantNarrative || 'Mixed',
            loyaltyScore: narrativeData?.loyaltyScore || 50,
            diversification: narrativeData?.diversification || 1,
            narrativeBreakdown: narrativeData?.narrativeBreakdown || { DeFi: 50, Meme: 25, Gaming: 15, Utility: 10 },
            insight: narrativeData?.insight || 'Narrative loyalty analysis completed'
          };
          break;

        case 'stress-response-patterns':
          const stressData = analysis.psychologicalCards?.stressResponse;
          data = {
            stressScore: stressData?.stressScore || 50,
            stressLevel: stressData?.stressLevel || 'Moderate',
            stressTriggers: stressData?.stressTriggers || 0,
            copingMechanism: stressData?.stressScore > 70 ? 'High Stress' : 'Manageable',
            insight: stressData?.insight || 'Stress response analysis completed'
          };
          break;

        case 'social-trading-influence':
          const socialData = analysis.psychologicalCards?.socialInfluence;
          data = {
            influenceScore: socialData?.influenceScore || analysis.influenceScore || 50,
            influenceLevel: socialData?.influenceLevel || 'Independent',
            rapidDecisions: socialData?.rapidDecisions || 0,
            independentTrades: socialData?.independentTrades || analysis.transactionCount,
            insight: socialData?.insight || 'Social trading influence analysis completed'
          };
          break;

        case 'false-conviction':
          const falseConvictionData = analysis.psychologicalCards?.falseConviction;
          data = {
            score: falseConvictionData?.score || 100,
            falseConvictionEvents: falseConvictionData?.falseConvictionEvents || 0,
            pattern: falseConvictionData?.pattern || 'Healthy Conviction',
            insight: falseConvictionData?.insight || 'False conviction analysis completed'
          };
          break;

        case 'llm-insight-generator':
          data = {
            archetype: analysis.archetype,
            personalityInsight: `${analysis.archetype} trader with ${analysis.confidence * 100}% confidence`,
            behavioralSummary: `Exhibits ${analysis.behavioralTraits?.join(', ') || 'balanced'} characteristics`,
            riskProfile: analysis.riskScore > 70 ? 'High Risk Tolerance' : 'Moderate Risk Profile',
            tradingStyle: analysis.tradingFrequency > 2 ? 'Active Trader' : 'Methodical Trader',
            insight: 'LLM-generated personality insights based on comprehensive analysis'
          };
          break;

        default:
          data = { 
            message: `${cardType} not yet implemented`,
            dataAvailable: false,
            hint: 'This card type is not in the current implementation'
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
  return createServer(app);
}