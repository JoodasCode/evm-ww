/**
 * API Routes for Wallet Whisperer
 */

import express from 'express';
import { createServer } from 'http';
import { fetchTransactionSignatures, fetchTransactionDetails, fetchTokenBalances } from './services/heliusClient';
import { fetchTokenMetadata, fetchTokenPrice } from './services/moralisClient';
import { getTokenBalances } from './services/tokenBalanceService';
import { calculateWhispererScore } from './services/whispererScoreService';
import { getCachedData, setCachedData } from './services/redisService';
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

// Get wallet overview data
router.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Get token balances with enriched data
    const balances = await getTokenBalances(address);
    
    // Calculate portfolio value
    const portfolioValue = balances.reduce((total, token) => total + token.usdValue, 0);
    
    // Get recent transactions
    const transactions = await fetchTransactionSignatures(address, 10);
    
    res.json({
      success: true,
      data: {
        address,
        portfolioValue: portfolioValue.toFixed(2),
        tokenCount: balances.length,
        recentTransactions: transactions.length,
        balances: balances.slice(0, 10), // Top 10 tokens
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get detailed token balances
router.get('/api/wallet/:address/balances', async (req, res) => {
  try {
    const { address } = req.params;
    const balances = await getTokenBalances(address);
    
    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    console.error('Error fetching token balances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token balances',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get transaction history
router.get('/api/wallet/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const transactions = await fetchTransactionSignatures(address, limit);
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get psychometric analysis using real Whisperer Score calculation
router.get('/api/wallet/:address/psychometrics', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Calculate real Whisperer Score using authentic wallet data
    const whispererScore = await calculateWhispererScore(address);
    
    const psychometrics = {
      whispererScore,
      behavioralAvatar: whispererScore.total > 80 ? 'Expert Trader' : 
                       whispererScore.total > 60 ? 'Strategic Trader' : 
                       whispererScore.total > 40 ? 'Developing Trader' : 'Novice Trader',
      currentMood: whispererScore.timing > 70 ? 'Optimistic' : 
                   whispererScore.timing > 50 ? 'Neutral' : 'Cautious',
      riskProfile: whispererScore.riskManagement > 70 ? 'Conservative' : 
                   whispererScore.riskManagement > 50 ? 'Moderate' : 'Aggressive',
      tradingFrequency: whispererScore.discipline > 70 ? 'Disciplined' : 
                       whispererScore.discipline > 50 ? 'Active' : 'Impulsive',
      lastAnalyzed: whispererScore.lastCalculated
    };
    
    res.json({
      success: true,
      data: psychometrics
    });
  } catch (error) {
    console.error('Error fetching psychometrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch psychometric analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Automated wallet analysis endpoint - triggers complete pipeline
router.post('/api/wallet/:address/analyze', async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`🚀 Starting automated analysis for wallet: ${address}`);
    
    // Import and run the automated pipeline
    const { walletAnalysisPipeline } = await import('./walletAnalysisPipeline');
    
    const analysis = await walletAnalysisPipeline.analyzeWallet(address);
    
    res.json({
      success: true,
      data: analysis,
      message: 'Automated wallet analysis completed successfully'
    });
    
  } catch (error) {
    console.error('Automated analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Automated analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get complete wallet analysis (from database)
router.get('/api/wallet/:address/complete', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Import the pipeline to get existing analysis
    const { walletAnalysisPipeline } = await import('./walletAnalysisPipeline');
    
    const analysis = await walletAnalysisPipeline.analyzeWallet(address);
    
    res.json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    console.error('Error fetching complete analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get analytics data
router.get('/api/wallet/:address/analytics', async (req, res) => {
  try {
    const { address } = req.params;
    
    // This is where your trading analytics would run
    const analytics = {
      riskAppetite: {
        score: 65,
        label: 'Moderate Risk'
      },
      tradingPatterns: [
        { name: 'Active Trading', frequency: 'High' },
        { name: 'Token Diversity', score: 75 }
      ],
      timingAccuracy: {
        overallScore: 72,
        entryTiming: 75,
        exitTiming: 68
      },
      portfolioComposition: {
        memePercentage: 25,
        defiPercentage: 45,
        nftPercentage: 15,
        stablePercentage: 15
      },
      holdingPatterns: {
        averageMinutes: 1440, // 24 hours
        shortTermTrades: 60,
        longTermHolds: 25
      },
      missedOpportunities: [],
      lastAnalyzed: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export function registerRoutes(app: express.Application) {
  app.use(router);
  return createServer(app);
}

export default router;