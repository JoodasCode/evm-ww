// Complete Cented analysis with proper Helius endpoints and increased transaction limit
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getCentedCompleteAnalysis() {
  console.log('🐋 CENTED WHALE ANALYSIS - COMPREHENSIVE DATA PULL');
  console.log(`Analyzing wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // Step 1: Get transaction signatures with increased limit
    console.log('📋 Fetching transaction signatures (last 1000)...');
    
    const signaturesUrl = `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions`;
    const signaturesResponse = await fetch(signaturesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "api-key": HELIUS_API_KEY,
        "limit": 1000,
        "before": null
      })
    });

    if (!signaturesResponse.ok) {
      throw new Error(`Signatures API error: ${signaturesResponse.status}`);
    }

    const signatures = await signaturesResponse.json();
    console.log(`✅ Found ${signatures.length} transactions`);

    // Step 2: Get detailed parsed transactions
    console.log('📊 Fetching detailed transaction data...');
    
    const parsedTxUrl = `https://api.helius.xyz/v0/transactions`;
    const parsedResponse = await fetch(parsedTxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "api-key": HELIUS_API_KEY,
        "transactions": signatures.slice(0, 100).map(sig => sig.signature)
      })
    });

    if (!parsedResponse.ok) {
      throw new Error(`Parsed transactions API error: ${parsedResponse.status}`);
    }

    const parsedTransactions = await parsedResponse.json();
    console.log(`✅ Parsed ${parsedTransactions.length} detailed transactions`);

    // Step 3: Get wallet balances and token holdings
    console.log('💰 Fetching current balances...');
    
    const balancesUrl = `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/balances`;
    const balancesResponse = await fetch(balancesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "api-key": HELIUS_API_KEY
      })
    });

    let balances = {};
    if (balancesResponse.ok) {
      balances = await balancesResponse.json();
      console.log(`✅ Current portfolio: ${balances.tokens?.length || 0} tokens`);
    }

    // Step 4: Advanced behavioral analysis
    console.log('🧠 Calculating advanced whale psychology...');
    
    const analytics = calculateAdvancedMetrics(signatures, parsedTransactions, balances);
    
    console.log('📈 CENTED WHALE ANALYSIS RESULTS:');
    console.log(`   Total Transactions: ${analytics.totalTransactions}`);
    console.log(`   Whisperer Score: ${analytics.whispererScore}/100`);
    console.log(`   Degen Score: ${analytics.degenScore}/100`);
    console.log(`   Risk Profile: ${analytics.riskProfile}`);
    console.log(`   Trading Style: ${analytics.tradingStyle}`);
    console.log(`   Psychological State: ${analytics.psychologicalState}`);
    console.log('');

    // Step 5: Store comprehensive data in Supabase
    console.log('💾 Storing complete whale analysis...');
    
    // Save wallet scores
    const { data: scoresData, error: scoresError } = await supabase
      .from('wallet_scores')
      .upsert({
        address: WALLET_ADDRESS,
        whisperer_score: analytics.whispererScore,
        degen_score: analytics.degenScore,
        current_mood: analytics.psychologicalState,
        classification: 'Whale',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'address'
      });

    if (scoresError) {
      console.log('❌ Error saving scores:', scoresError.message);
    } else {
      console.log('✅ Wallet scores saved');
    }

    // Save behavioral metrics
    const { data: behaviorData, error: behaviorError } = await supabase
      .from('wallet_behavior')
      .upsert({
        wallet_address: WALLET_ADDRESS,
        risk_score: analytics.riskScore,
        fomo_score: analytics.fomoScore,
        patience_score: analytics.patienceScore,
        conviction_score: analytics.convictionScore,
        trading_frequency: analytics.tradingFrequency,
        avg_transaction_value: analytics.avgTransactionValue,
        psychological_profile: analytics.tradingStyle,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'wallet_address'
      });

    if (behaviorError) {
      console.log('❌ Error saving behavior:', behaviorError.message);
    } else {
      console.log('✅ Behavioral data saved');
    }

    // Save activity data
    const { data: activityData, error: activityError } = await supabase
      .from('wallet_activity')
      .upsert({
        wallet_address: WALLET_ADDRESS,
        time_range: 'comprehensive',
        activity_data: {
          totalTransactions: analytics.totalTransactions,
          timeSpanDays: analytics.timeSpanDays,
          avgTransactionValue: analytics.avgTransactionValue,
          tradingFrequency: analytics.tradingFrequency,
          portfolioTokens: balances.tokens?.length || 0,
          analysisTimestamp: new Date().toISOString(),
          dataSource: 'helius_comprehensive'
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'wallet_address,time_range'
      });

    if (activityError) {
      console.log('❌ Error saving activity:', activityError.message);
    } else {
      console.log('✅ Activity data saved');
    }

    // Step 6: Verify everything was saved
    console.log('');
    console.log('🔍 Final verification...');
    
    const { data: finalCheck, error: checkError } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('address', WALLET_ADDRESS);

    if (checkError) {
      console.log('❌ Verification failed:', checkError.message);
    } else if (finalCheck && finalCheck.length > 0) {
      console.log('🎉 SUCCESS! CENTED WHALE DATA CONFIRMED IN DATABASE');
      console.log('');
      console.log('📊 FINAL STORED RESULTS:');
      console.log(`   Wallet: ${finalCheck[0].address}`);
      console.log(`   Whisperer Score: ${finalCheck[0].whisperer_score}/100`);
      console.log(`   Degen Score: ${finalCheck[0].degen_score}/100`);
      console.log(`   Classification: ${finalCheck[0].classification}`);
      console.log(`   Mood: ${finalCheck[0].current_mood}`);
      console.log(`   Last Updated: ${finalCheck[0].updated_at}`);
      console.log('');
      console.log('✅ Check your Supabase dashboard - Cented\'s whale data is now saved!');
    } else {
      console.log('❌ No data found in final check');
    }

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  }
}

function calculateAdvancedMetrics(signatures, parsedTxs, balances) {
  const totalTxs = signatures.length;
  
  // Calculate time span
  const oldestTx = signatures[signatures.length - 1];
  const newestTx = signatures[0];
  const timeSpanDays = oldestTx && newestTx ? 
    (newestTx.blockTime - oldestTx.blockTime) / (24 * 60 * 60) : 30;
  
  // Trading frequency (transactions per day)
  const tradingFrequency = totalTxs / Math.max(timeSpanDays, 1);
  
  // Analyze transaction values
  let totalValue = 0;
  let largeTransactions = 0;
  
  parsedTxs.forEach(tx => {
    if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
      tx.nativeTransfers.forEach(transfer => {
        if (transfer.amount) {
          totalValue += transfer.amount / 1e9; // Convert lamports to SOL
          if (transfer.amount > 1e9) largeTransactions++; // > 1 SOL
        }
      });
    }
  });
  
  const avgTransactionValue = totalValue / Math.max(parsedTxs.length, 1);
  
  // Calculate behavioral scores
  const riskScore = Math.min(100, tradingFrequency * 5 + (largeTransactions / totalTxs) * 50);
  const fomoScore = Math.min(100, tradingFrequency * 3); // High frequency = higher FOMO
  const patienceScore = Math.min(100, 100 - (tradingFrequency * 2)); // Lower frequency = higher patience
  const convictionScore = Math.min(100, (largeTransactions / totalTxs) * 100 + avgTransactionValue);
  
  // Whale scoring algorithm
  const whispererScore = Math.round(
    (convictionScore * 0.3) + 
    (patienceScore * 0.25) + 
    ((100 - fomoScore) * 0.2) + 
    (Math.min(avgTransactionValue * 10, 100) * 0.25)
  );
  
  const degenScore = Math.round(
    (fomoScore * 0.4) + 
    (riskScore * 0.3) + 
    (tradingFrequency * 3) + 
    (Math.min(totalTxs / 10, 30))
  );
  
  // Determine psychological profile
  let psychologicalState, tradingStyle, riskProfile;
  
  if (whispererScore > 80) {
    psychologicalState = 'Strategic';
    tradingStyle = 'Whale Accumulator';
  } else if (whispererScore > 60) {
    psychologicalState = 'Calculated';
    tradingStyle = 'Smart Money';
  } else {
    psychologicalState = 'Opportunistic';
    tradingStyle = 'Active Trader';
  }
  
  if (riskScore > 70) {
    riskProfile = 'High Risk';
  } else if (riskScore > 40) {
    riskProfile = 'Moderate Risk';
  } else {
    riskProfile = 'Conservative';
  }
  
  return {
    totalTransactions: totalTxs,
    timeSpanDays: Math.round(timeSpanDays),
    tradingFrequency: Math.round(tradingFrequency * 100) / 100,
    avgTransactionValue: Math.round(avgTransactionValue * 100) / 100,
    riskScore: Math.round(riskScore),
    fomoScore: Math.round(fomoScore),
    patienceScore: Math.round(patienceScore),
    convictionScore: Math.round(convictionScore),
    whispererScore: Math.max(1, Math.min(100, whispererScore)),
    degenScore: Math.max(1, Math.min(100, degenScore)),
    psychologicalState,
    tradingStyle,
    riskProfile
  };
}

getCentedCompleteAnalysis();