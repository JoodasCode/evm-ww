// Test scoring differentiation with smaller wallets + fix token filtering
import { createClient } from '@supabase/supabase-js';

class EnhancedWalletAnalyzer {
  constructor() {
    this.walletCache = new Map();
    this.debugMode = true;
  }

  async analyzeWallet(address, walletName, heliusData, moralisData) {
    console.log(`\n🔧 ANALYZING ${walletName.toUpperCase()} WITH ENHANCED FILTERING`);
    console.log('='.repeat(60));
    
    // Extract behavioral patterns with value filtering
    const patterns = this.extractFilteredBehavioralPatterns(heliusData, moralisData);
    console.log('📊 Filtered Patterns:', JSON.stringify(patterns, null, 2));
    
    // Calculate scores with wealth-tier awareness
    const scores = this.calculateTieredScores(patterns, walletName);
    console.log('🧮 Tiered Score Breakdown:', JSON.stringify(scores.breakdown, null, 2));
    
    // Generate behavioral fingerprint
    const fingerprint = this.generateEnhancedFingerprint(patterns, scores);
    console.log('🔍 Enhanced Fingerprint:', JSON.stringify(fingerprint, null, 2));
    
    return {
      address,
      walletName,
      patterns,
      scores,
      fingerprint
    };
  }

  extractFilteredBehavioralPatterns(heliusData, moralisData) {
    const { balance, transactions } = heliusData;
    const { enrichedTokens, tokenMetadata, walletPortfolio } = moralisData;
    
    // Filter meaningful token positions (value-based filtering)
    const meaningfulTokens = this.filterMeaningfulTokens(walletPortfolio, balance);
    const valueBasedTokenCount = meaningfulTokens.length;
    
    console.log(`🔍 Token Filtering: ${walletPortfolio.length} total → ${valueBasedTokenCount} meaningful (>${balance * 0.01} SOL each)`);
    
    // Transaction analysis
    let swaps = 0, transfers = 0, unknown = 0;
    let totalFees = 0, feeList = [];
    let protocolSet = new Set();
    let tokenTransferCount = 0;
    let largeTransfers = 0; // Transfers > 1 SOL
    
    transactions.forEach(tx => {
      const type = tx.type || 'UNKNOWN';
      const fee = tx.fee || 0;
      
      totalFees += fee;
      feeList.push(fee);
      
      if (type.includes('SWAP')) {
        swaps++;
        // Enhanced protocol detection
        if (tx.description) {
          const desc = tx.description.toLowerCase();
          if (desc.includes('jupiter')) protocolSet.add('Jupiter');
          if (desc.includes('raydium')) protocolSet.add('Raydium');
          if (desc.includes('orca')) protocolSet.add('Orca');
          if (desc.includes('meteora')) protocolSet.add('Meteora');
        }
      } else if (type.includes('TRANSFER')) {
        transfers++;
        // Check for large transfers
        if (tx.nativeTransfers) {
          tx.nativeTransfers.forEach(transfer => {
            if (transfer.amount > 1000000000) largeTransfers++; // > 1 SOL
          });
        }
      } else {
        unknown++;
      }
      
      if (tx.tokenTransfers) {
        tokenTransferCount += tx.tokenTransfers.length;
      }
    });
    
    // Fee analysis
    const avgFee = totalFees / Math.max(transactions.length, 1);
    const maxFee = Math.max(...feeList);
    const minFee = Math.min(...feeList.filter(f => f > 0));
    
    // Wealth tier classification
    const wealthTier = balance > 500 ? 'Ultra-Whale' :
                      balance > 100 ? 'Whale' :
                      balance > 50 ? 'Large-Holder' :
                      balance > 10 ? 'Medium-Holder' : 'Small-Holder';
    
    return {
      wealthTier,
      transactionMetrics: {
        total: transactions.length,
        swaps,
        transfers,
        largeTransfers,
        unknown,
        swapRatio: swaps / Math.max(transactions.length, 1),
        largeTransferRatio: largeTransfers / Math.max(transfers, 1)
      },
      feeStrategy: {
        total: totalFees,
        average: avgFee,
        maximum: maxFee,
        minimum: minFee,
        premiumStrategy: maxFee > 5000000,
        feePerSOL: avgFee / Math.max(balance, 1), // Fee efficiency per SOL held
        wealthAdjustedFee: avgFee / Math.max(balance * 1000, 1) // Normalize by wealth
      },
      portfolioMetrics: {
        solBalance: balance,
        totalTokens: walletPortfolio.length,
        meaningfulTokens: valueBasedTokenCount,
        tokenQualityRatio: valueBasedTokenCount / Math.max(walletPortfolio.length, 1),
        metadataEnriched: Object.keys(tokenMetadata).length,
        portfolioComplexity: valueBasedTokenCount > 50 ? 'High' : 
                            valueBasedTokenCount > 10 ? 'Medium' : 'Low',
        dustTokens: walletPortfolio.length - valueBasedTokenCount
      },
      protocolInteraction: {
        protocols: Array.from(protocolSet),
        count: protocolSet.size,
        loyalty: protocolSet.size === 1 ? 'Loyal' : protocolSet.size <= 3 ? 'Selective' : 'Diversified'
      },
      meaningfulTokens
    };
  }

  filterMeaningfulTokens(portfolio, solBalance) {
    if (!portfolio || portfolio.length === 0) return [];
    
    // Define meaningful threshold based on wallet size
    const meaningfulThreshold = Math.max(
      solBalance * 0.01, // At least 1% of SOL balance
      0.1 // Minimum 0.1 SOL value
    );
    
    return portfolio.filter(token => {
      const value = parseFloat(token.usdValue || 0);
      const solValue = value / 240; // Rough SOL conversion
      return solValue >= meaningfulThreshold;
    });
  }

  calculateTieredScores(patterns, walletName) {
    const breakdown = {};
    const tier = patterns.wealthTier;
    
    // Wealth-adjusted scoring weights
    const tierMultipliers = {
      'Ultra-Whale': { risk: 0.8, fomo: 0.6, patience: 1.2 },
      'Whale': { risk: 0.9, fomo: 0.7, patience: 1.1 },
      'Large-Holder': { risk: 1.0, fomo: 1.0, patience: 1.0 },
      'Medium-Holder': { risk: 1.1, fomo: 1.2, patience: 0.9 },
      'Small-Holder': { risk: 1.3, fomo: 1.5, patience: 0.7 }
    };
    
    const multipliers = tierMultipliers[tier] || tierMultipliers['Medium-Holder'];
    
    // Risk Score with wealth adjustment
    let riskComponents = {
      baseRisk: tier === 'Ultra-Whale' ? 15 : tier === 'Whale' ? 20 : 25,
      swapActivity: Math.min(25, patterns.transactionMetrics.swaps * 1.5),
      feeStrategy: patterns.feeStrategy.premiumStrategy ? 20 : 8,
      meaningfulTokens: Math.min(20, patterns.portfolioMetrics.meaningfulTokens * 2),
      protocolDiversity: patterns.protocolInteraction.count * 4,
      largeTransfers: patterns.transactionMetrics.largeTransfers * 3
    };
    
    const rawRisk = Object.values(riskComponents).reduce((a, b) => a + b, 0);
    const riskScore = Math.min(95, Math.max(15, rawRisk * multipliers.risk));
    breakdown.riskScore = { components: riskComponents, multiplier: multipliers.risk, total: Math.round(riskScore) };
    
    // FOMO Score with wealth adjustment
    let fomoComponents = {
      baseFomo: tier === 'Ultra-Whale' ? 10 : tier === 'Whale' ? 15 : 20,
      swapFrequency: Math.min(30, patterns.transactionMetrics.swaps * 2),
      tokenDiversity: Math.min(25, patterns.portfolioMetrics.meaningfulTokens * 1.5),
      feeUrgency: patterns.feeStrategy.premiumStrategy ? 15 : 5,
      dustAccumulation: Math.min(10, patterns.portfolioMetrics.dustTokens * 0.1)
    };
    
    const rawFomo = Object.values(fomoComponents).reduce((a, b) => a + b, 0);
    const fomoScore = Math.min(90, Math.max(10, rawFomo * multipliers.fomo));
    breakdown.fomoScore = { components: fomoComponents, multiplier: multipliers.fomo, total: Math.round(fomoScore) };
    
    // Patience Score (wealth-adjusted)
    let patienceComponents = {
      basePatience: tier === 'Ultra-Whale' ? 80 : tier === 'Whale' ? 75 : 65,
      activityPenalty: -Math.min(35, patterns.transactionMetrics.total * 1.2),
      tokenQuality: patterns.portfolioMetrics.tokenQualityRatio > 0.5 ? 15 : 0,
      largeTransferBonus: patterns.transactionMetrics.largeTransfers > 0 ? 10 : 0
    };
    
    const rawPatience = Object.values(patienceComponents).reduce((a, b) => a + b, 0);
    const patienceScore = Math.max(10, Math.min(95, rawPatience * multipliers.patience));
    breakdown.patienceScore = { components: patienceComponents, multiplier: multipliers.patience, total: Math.round(patienceScore) };
    
    // Conviction Score (meaningful holdings focus)
    let convictionComponents = {
      baseConviction: 35,
      portfolioSize: Math.min(25, patterns.portfolioMetrics.solBalance > 100 ? 25 : 
                              patterns.portfolioMetrics.solBalance > 10 ? 15 : 5),
      tokenQuality: patterns.portfolioMetrics.meaningfulTokens * 2,
      protocolLoyalty: patterns.protocolInteraction.loyalty === 'Loyal' ? 15 : 
                      patterns.protocolInteraction.loyalty === 'Selective' ? 10 : 5,
      dustPenalty: -Math.min(10, patterns.portfolioMetrics.dustTokens * 0.05)
    };
    
    const convictionScore = Math.min(95, Math.max(20, Object.values(convictionComponents).reduce((a, b) => a + b, 0)));
    breakdown.convictionScore = { components: convictionComponents, total: Math.round(convictionScore) };
    
    // Timing Score
    let timingComponents = {
      baseTiming: 45,
      protocolUsage: patterns.protocolInteraction.count * 6,
      swapEfficiency: patterns.transactionMetrics.swapRatio > 0.6 ? 15 : 8,
      feeEfficiency: patterns.feeStrategy.wealthAdjustedFee < 0.1 ? 15 : -5,
      transferStrategy: patterns.transactionMetrics.largeTransferRatio > 0.5 ? 10 : 0
    };
    
    const timingScore = Math.max(15, Math.min(90, Object.values(timingComponents).reduce((a, b) => a + b, 0)));
    breakdown.timingScore = { components: timingComponents, total: Math.round(timingScore) };
    
    // Composite Scores
    const whispererScore = Math.round((riskScore + patienceScore + convictionScore + timingScore) / 4);
    const degenScore = Math.round((riskScore * 0.6) + (fomoScore * 0.4));
    
    return {
      riskScore: Math.round(riskScore),
      fomoScore: Math.round(fomoScore),
      patienceScore: Math.round(patienceScore),
      convictionScore: Math.round(convictionScore),
      timingScore: Math.round(timingScore),
      whispererScore,
      degenScore,
      wealthTier: tier,
      breakdown
    };
  }

  generateEnhancedFingerprint(patterns, scores) {
    const tier = patterns.wealthTier;
    let tradingStyle, mood, archetype;
    
    // Tier-aware classification
    if (tier === 'Ultra-Whale' || tier === 'Whale') {
      if (patterns.feeStrategy.premiumStrategy && patterns.transactionMetrics.swaps > 10) {
        tradingStyle = 'Whale Premium Executor';
        mood = 'Decisive';
      } else if (patterns.portfolioMetrics.meaningfulTokens > 20) {
        tradingStyle = 'Diversified Whale';
        mood = 'Strategic';
      } else {
        tradingStyle = 'Conservative Whale';
        mood = 'Cautious';
      }
    } else if (tier === 'Large-Holder') {
      if (patterns.transactionMetrics.swapRatio > 0.7) {
        tradingStyle = 'Active Trader';
        mood = 'Aggressive';
      } else {
        tradingStyle = 'Steady Accumulator';
        mood = 'Patient';
      }
    } else {
      if (patterns.portfolioMetrics.meaningfulTokens > 10) {
        tradingStyle = 'Small Portfolio Sprayer';
        mood = 'Opportunistic';
      } else {
        tradingStyle = 'Focused Trader';
        mood = 'Determined';
      }
    }
    
    // Enhanced archetype
    if (patterns.portfolioMetrics.tokenQualityRatio > 0.8 && tier === 'Whale') {
      archetype = 'Quality Whale';
    } else if (patterns.portfolioMetrics.dustTokens > 100) {
      archetype = 'Airdrop Farmer';
    } else if (patterns.feeStrategy.premiumStrategy) {
      archetype = 'MEV-Protected Trader';
    } else {
      archetype = 'Standard Trader';
    }
    
    return {
      tradingStyle,
      mood,
      archetype,
      wealthTier: tier,
      riskLevel: scores.riskScore > 70 ? 'High' : scores.riskScore > 40 ? 'Medium' : 'Low',
      meaningfulHoldings: patterns.portfolioMetrics.meaningfulTokens,
      dustRatio: Math.round(patterns.portfolioMetrics.dustTokens / Math.max(patterns.portfolioMetrics.totalTokens, 1) * 100)
    };
  }
}

async function testSmallerWallets() {
  console.log('🚀 TESTING SMALLER WALLETS WITH ENHANCED FILTERING');
  console.log('=================================================');
  
  const analyzer = new EnhancedWalletAnalyzer();
  
  const wallets = {
    // Original whales
    cented: 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o',
    dv: 'BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd',
    // Smaller wallets
    letterbomb: 'BtMBMPkoNbnLF9Xn552guQq528KKXcsNBNNBre3oaQtr',
    fashr: '719sfKUjiMThumTt2u39VMGn612BZyCcwbM5Pe8SqFYz',
    risk: 'BHREKFkPQgAtDs8Vb1UfLkUpjG6ScidTjHaCWFuG2AtX'
  };

  const heliusKey = process.env.HELIUS_API_KEY;
  const moralisKey = process.env.MORALIS_API_KEY;
  
  const results = [];

  for (const [name, address] of Object.entries(wallets)) {
    try {
      console.log(`\n🔍 Processing ${name.toUpperCase()}...`);
      
      const heliusData = await fetchHeliusData(address, heliusKey);
      const moralisData = await enrichWithMoralis(heliusData, moralisKey, address);
      
      const analysis = await analyzer.analyzeWallet(address, name, heliusData, moralisData);
      results.push(analysis);
      
    } catch (error) {
      console.error(`Analysis failed for ${name}:`, error.message);
    }
  }
  
  // Compare all results
  console.log('\n📊 WEALTH TIER COMPARISON');
  console.log('=========================');
  results.forEach(result => {
    console.log(`\n${result.walletName.toUpperCase()} (${result.patterns.wealthTier}):`);
    console.log(`SOL: ${result.patterns.portfolioMetrics.solBalance.toFixed(1)}`);
    console.log(`Tokens: ${result.patterns.portfolioMetrics.meaningfulTokens} meaningful / ${result.patterns.portfolioMetrics.totalTokens} total`);
    console.log(`Style: ${result.fingerprint.tradingStyle} (${result.fingerprint.mood})`);
    console.log(`Scores: W${result.scores.whispererScore}, D${result.scores.degenScore}, R${result.scores.riskScore}`);
  });
  
  return results;
}

// Reuse helper functions from previous implementation
async function fetchHeliusData(address, apiKey) {
  const balanceResponse = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [address]
    })
  });
  
  const balanceData = await balanceResponse.json();
  const balance = (balanceData.result?.value || 0) / 1000000000;

  const signaturesResponse = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getSignaturesForAddress',
      params: [address, { limit: 30 }]
    })
  });
  
  const sigData = await signaturesResponse.json();
  const signatures = sigData.result?.slice(0, 20).map(sig => sig.signature) || [];

  const enhancedResponse = await fetch('https://api.helius.xyz/v0/transactions?api-key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactions: signatures })
  });
  
  const transactions = await enhancedResponse.json();

  return { balance, transactions };
}

async function enrichWithMoralis(heliusData, moralisKey, address) {
  const uniqueTokens = new Set();
  const tokenMetadata = {};
  let walletPortfolio = [];

  heliusData.transactions.forEach(tx => {
    if (tx.tokenTransfers) {
      tx.tokenTransfers.forEach(transfer => {
        if (transfer.mint && transfer.mint !== 'So11111111111111111111111111111111111111112') {
          uniqueTokens.add(transfer.mint);
        }
      });
    }
  });

  // Get portfolio first
  try {
    const portfolioResponse = await fetch(
      `https://solana-gateway.moralis.io/account/mainnet/${address}/portfolio`,
      { headers: { 'X-API-Key': moralisKey } }
    );

    if (portfolioResponse.ok) {
      const portfolio = await portfolioResponse.json();
      walletPortfolio = portfolio.tokens || [];
      console.log(`📊 Portfolio: ${walletPortfolio.length} tokens found for ${address.substring(0, 8)}...`);
    }
  } catch (error) {
    console.log(`⚠️ Could not fetch portfolio for ${address.substring(0, 8)}...`);
  }

  // Get metadata for transaction tokens
  for (const tokenAddress of Array.from(uniqueTokens).slice(0, 10)) {
    try {
      const metadataResponse = await fetch(
        `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`,
        { headers: { 'X-API-Key': moralisKey } }
      );

      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        tokenMetadata[tokenAddress] = {
          name: metadata.name,
          symbol: metadata.symbol,
          decimals: metadata.decimals,
          logoURI: metadata.logoURI
        };
      }
    } catch (error) {
      // Skip failed metadata requests
    }
  }

  return {
    heliusData,
    enrichedTokens: Array.from(uniqueTokens),
    tokenMetadata,
    walletPortfolio
  };
}

testSmallerWallets();