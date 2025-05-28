/**
 * API Routes for Wallet Whisperer
 */

import express from 'express';
import { fetchTransactionSignatures, fetchTransactionDetails, fetchTokenBalances } from './services/heliusClient';
import { fetchTokenMetadata, fetchTokenPrice } from './services/moralisClient';
import { getTokenBalances } from './services/tokenBalanceService';
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

// Get psychometric analysis (placeholder for your analytics)
router.get('/api/wallet/:address/psychometrics', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Check cache first
    const cacheKey = `${config.cache.prefix.psychometric}${address}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json({
        success: true,
        data: JSON.parse(cachedData),
        cached: true
      });
    }
    
    // This is where your sophisticated psychological analysis would run
    // For now, return a basic structure that your frontend expects
    const psychometrics = {
      whispererScore: {
        total: 75,
        discipline: 80,
        timing: 70,
        riskManagement: 75
      },
      behavioralAvatar: 'Strategic Trader',
      currentMood: 'Optimistic',
      riskProfile: 'Moderate',
      tradingFrequency: 'Active',
      lastAnalyzed: new Date().toISOString()
    };
    
    // Cache the result
    await setCachedData(cacheKey, JSON.stringify(psychometrics), 3600);
    
    res.json({
      success: true,
      data: psychometrics,
      cached: false
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

export default router;