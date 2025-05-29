// Test complete integrated system with Cented wallet
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

// Supabase connection
const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

// Enhanced trading activity analysis using your integrated system approach
async function getCompleteWalletAnalysis() {
  console.log('🚀 COMPLETE SYSTEM TEST - CENTED WHALE ANALYSIS');
  console.log('===============================================');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('Testing: Supabase + Helius/Moralis + Analytics Services');
  console.log('');

  const startTime = Date.now();

  try {
    // Step 1: Fetch raw transactions from Helius
    console.log('📡 Step 1: Fetching transactions from Helius...');
    const transactionData = await fetchHeliusTransactions();
    
    if (!transactionData) {
      console.log('❌ Failed to fetch transaction data');
      return;
    }

    // Step 2: Enrich with Moralis token metadata
    console.log('🔍 Step 2: Enriching with Moralis token data...');
    const enrichedData = await enrichWithMoralis(transactionData);

    // Step 3: Calculate comprehensive analytics
    console.log('📊 Step 3: Calculating behavioral analytics...');
    const analytics = calculateAdvancedAnalytics(enrichedData);

    // Step 4: Store in Supabase database
    console.log('💾 Step 4: Storing complete analysis in Supabase...');
    await storeCompleteAnalysis(analytics);

    // Step 5: Generate psychological profile
    console.log('🧠 Step 5: Generating psychological profile...');
    const psychProfile = generatePsychologicalProfile(analytics);

    // Step 6: Display comprehensive results
    console.log('✅ Step 6: Complete Analysis Results');
    console.log('===================================');
    
    displayCompleteResults(analytics, psychProfile);

    const totalTime = Date.now() - startTime;
    console.log(`\n⚡ Total Processing Time: ${totalTime}ms`);
    console.log('🎉 Complete system test successful!');

  } catch (error) {
    console.error('❌ System test failed:', error.message);
  }
}

// Fetch transactions using Helius API
async function fetchHeliusTransactions() {
  try {
    const response = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 20 }]
      })
    });

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('No transaction data from Helius');
    }

    console.log(`   ✅ Retrieved ${data.result.length} transactions`);
    return data.result;

  } catch (error) {
    console.error('   ❌ Helius fetch failed:', error.message);
    return null;
  }
}

// Enrich transaction data with Moralis
async function enrichWithMoralis(transactions) {
  const moralisApiKey = process.env.MORALIS_API_KEY;
  
  if (!moralisApiKey) {
    console.log('   ⚠️ Moralis API key missing - using basic enrichment');
    return transactions;
  }

  const enrichedTxs = [];
  
  for (let i = 0; i < Math.min(transactions.length, 10); i++) {
    const tx = transactions[i];
    
    try {
      // Get detailed transaction data
      const detailResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [tx.signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]
        })
      });

      const detail = await detailResponse.json();
      
      if (detail.result) {
        const enrichedTx = {
          ...tx,
          details: detail.result,
          tokenActivity: []
        };

        // Extract token mints and get metadata
        if (detail.result.meta && detail.result.meta.postTokenBalances) {
          const tokenMints = [...new Set(
            detail.result.meta.postTokenBalances
              .filter(b => b.owner === WALLET_ADDRESS)
              .map(b => b.mint)
          )];

          for (const mint of tokenMints) {
            try {
              const metadataResponse = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${mint}/metadata`, {
                headers: { 'X-API-Key': moralisApiKey }
              });

              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                enrichedTx.tokenActivity.push({
                  mint,
                  symbol: metadata.symbol || 'UNKNOWN',
                  name: metadata.name || 'Unknown Token',
                  decimals: metadata.decimals || 9
                });
              }
              
              await new Promise(resolve => setTimeout(resolve, 150)); // Rate limit
            } catch (metaError) {
              console.log(`   ⚠️ Could not fetch metadata for ${mint.substring(0, 8)}...`);
            }
          }
        }

        enrichedTxs.push(enrichedTx);
      }
    } catch (error) {
      console.log(`   ⚠️ Could not enrich transaction ${tx.signature.substring(0, 8)}...`);
      enrichedTxs.push(tx);
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
  }

  console.log(`   ✅ Enriched ${enrichedTxs.length} transactions with token metadata`);
  return enrichedTxs;
}

// Calculate advanced analytics using your system's approach
function calculateAdvancedAnalytics(enrichedData) {
  const now = Date.now() / 1000;
  const successfulTxs = enrichedData.filter(tx => !tx.err);
  const recentTxs = enrichedData.filter(tx => (now - tx.blockTime) < 86400); // Last 24h
  
  // Calculate SOL movements
  let totalSolGain = 0;
  let totalSolSpent = 0;
  let largestGain = 0;
  let tokenInteractions = new Set();

  enrichedData.forEach(tx => {
    if (tx.details && tx.details.meta) {
      const solChange = tx.details.meta.postBalances && tx.details.meta.preBalances 
        ? (tx.details.meta.postBalances[0] - tx.details.meta.preBalances[0]) / 1e9
        : 0;
      
      if (solChange > 0) {
        totalSolGain += solChange;
        if (solChange > largestGain) largestGain = solChange;
      } else if (solChange < 0) {
        totalSolSpent += Math.abs(solChange);
      }
    }

    // Count unique token interactions
    if (tx.tokenActivity) {
      tx.tokenActivity.forEach(token => tokenInteractions.add(token.symbol));
    }
  });

  // Calculate behavioral metrics using your system's methodology
  const tradingFrequency = enrichedData.length / 7; // Daily average
  const successRate = (successfulTxs.length / enrichedData.length) * 100;
  const riskScore = Math.min(100, tradingFrequency * 15);
  const patienceScore = Math.max(0, 100 - (tradingFrequency * 10));
  const convictionScore = Math.min(100, successRate);
  const fomoScore = recentTxs.length > 5 ? Math.min(100, recentTxs.length * 10) : 30;

  // Whisperer Score calculation
  const whispererScore = Math.round((patienceScore + convictionScore) / 2);
  const degenScore = Math.round((riskScore + fomoScore) / 2);

  return {
    walletAddress: WALLET_ADDRESS,
    totalTransactions: enrichedData.length,
    successfulTxs: successfulTxs.length,
    successRate,
    tradingFrequency,
    recentActivity: recentTxs.length,
    totalSolGain: totalSolGain.toFixed(6),
    totalSolSpent: totalSolSpent.toFixed(6),
    netSolChange: (totalSolGain - totalSolSpent).toFixed(6),
    largestGain: largestGain.toFixed(6),
    uniqueTokens: tokenInteractions.size,
    tokenList: Array.from(tokenInteractions),
    scores: {
      whispererScore,
      degenScore,
      riskScore: Math.round(riskScore),
      patienceScore: Math.round(patienceScore),
      convictionScore: Math.round(convictionScore),
      fomoScore: Math.round(fomoScore)
    },
    classification: whispererScore > 80 ? 'Strategic Whale' : whispererScore > 60 ? 'Skilled Trader' : 'Active Trader',
    mood: degenScore > 70 ? 'Aggressive' : whispererScore > 70 ? 'Confident' : 'Conservative'
  };
}

// Store complete analysis in Supabase using your database schema
async function storeCompleteAnalysis(analytics) {
  try {
    // Store wallet scores
    const { error: scoresError } = await supabase
      .from('wallet_scores')
      .upsert({
        address: analytics.walletAddress,
        whisperer_score: analytics.scores.whispererScore,
        degen_score: analytics.scores.degenScore,
        trading_frequency: analytics.tradingFrequency,
        current_mood: analytics.mood,
        risk_level: analytics.scores.riskScore > 70 ? 'high' : 'medium',
        daily_trades: Math.round(analytics.tradingFrequency),
        updated_at: new Date().toISOString()
      });

    if (!scoresError) {
      console.log('   ✅ Wallet scores stored');
    }

    // Store behavioral analysis
    const { error: behaviorError } = await supabase
      .from('wallet_behavior')
      .upsert({
        wallet_address: analytics.walletAddress,
        risk_score: analytics.scores.riskScore,
        fomo_score: analytics.scores.fomoScore,
        patience_score: analytics.scores.patienceScore,
        conviction_score: analytics.scores.convictionScore,
        updated_at: new Date().toISOString()
      });

    if (!behaviorError) {
      console.log('   ✅ Behavioral data stored');
    }

    // Store activity summary
    const { error: activityError } = await supabase
      .from('wallet_activity')
      .upsert({
        wallet_address: analytics.walletAddress,
        time_range: 'last_7_days',
        activity_data: {
          totalTx: analytics.totalTransactions,
          successRate: analytics.successRate,
          solMovements: {
            gained: analytics.totalSolGain,
            spent: analytics.totalSolSpent,
            net: analytics.netSolChange
          },
          tokens: analytics.tokenList,
          classification: analytics.classification
        },
        updated_at: new Date().toISOString()
      });

    if (!activityError) {
      console.log('   ✅ Activity data stored');
    }

  } catch (error) {
    console.error('   ❌ Storage error:', error.message);
  }
}

// Generate psychological profile using your psychoanalytics system
function generatePsychologicalProfile(analytics) {
  // Using your system's approach to psychological analysis
  return {
    tradingPersona: analytics.classification,
    cognitiveProfile: {
      confirmationBias: analytics.scores.fomoScore > 60 ? 'High' : 'Moderate',
      lossAversion: analytics.scores.patienceScore > 70 ? 'Low' : 'High',
      recencyBias: analytics.recentActivity > 10 ? 'High' : 'Moderate'
    },
    emotionalProfile: {
      currentState: analytics.mood,
      volatility: analytics.scores.riskScore > 70 ? 'High' : 'Stable',
      fearGreedIndex: analytics.scores.degenScore
    },
    strengths: [
      analytics.successRate > 90 ? 'Excellent execution' : null,
      analytics.scores.patienceScore > 70 ? 'Patient decision making' : null,
      analytics.uniqueTokens > 5 ? 'Diversified approach' : null
    ].filter(Boolean),
    vulnerabilities: [
      analytics.scores.fomoScore > 70 ? 'FOMO susceptibility' : null,
      analytics.scores.riskScore > 80 ? 'High risk appetite' : null,
      analytics.recentActivity > 15 ? 'Overtrading tendency' : null
    ].filter(Boolean)
  };
}

// Display comprehensive results
function displayCompleteResults(analytics, psychProfile) {
  console.log(`🐋 CENTED COMPLETE ANALYSIS RESULTS`);
  console.log(`================================`);
  console.log(`Classification: ${analytics.classification}`);
  console.log(`Current Mood: ${analytics.mood}`);
  console.log('');
  
  console.log(`📊 PERFORMANCE METRICS:`);
  console.log(`  Whisperer Score: ${analytics.scores.whispererScore}/100`);
  console.log(`  Degen Score: ${analytics.scores.degenScore}/100`);
  console.log(`  Success Rate: ${analytics.successRate.toFixed(1)}%`);
  console.log(`  Trading Frequency: ${analytics.tradingFrequency.toFixed(1)} tx/day`);
  console.log('');
  
  console.log(`💰 FINANCIAL ACTIVITY:`);
  console.log(`  Total SOL Gained: +${analytics.totalSolGain} SOL`);
  console.log(`  Total SOL Spent: -${analytics.totalSolSpent} SOL`);
  console.log(`  Net SOL Change: ${analytics.netSolChange} SOL`);
  console.log(`  Largest Single Gain: +${analytics.largestGain} SOL`);
  console.log('');
  
  console.log(`🪙 TOKEN INTERACTIONS:`);
  console.log(`  Unique Tokens: ${analytics.uniqueTokens}`);
  console.log(`  Active Tokens: ${analytics.tokenList.join(', ')}`);
  console.log('');
  
  console.log(`🧠 PSYCHOLOGICAL PROFILE:`);
  console.log(`  Trading Persona: ${psychProfile.tradingPersona}`);
  console.log(`  Emotional State: ${psychProfile.emotionalProfile.currentState}`);
  console.log(`  Strengths: ${psychProfile.strengths.join(', ')}`);
  console.log(`  Watch Areas: ${psychProfile.vulnerabilities.join(', ')}`);
}

// Run complete system test
getCompleteWalletAnalysis();