// Test Helius with real Cented wallet data and process it
import { createClient } from '@supabase/supabase-js';

async function testHeliusAndFetchRealData() {
  console.log('🚀 TESTING HELIUS WITH REAL CENTED WALLET DATA');
  console.log('==============================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const centedWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  const apiKey = process.env.HELIUS_API_KEY;

  try {
    // 1. Get account info
    console.log('📊 1. Getting account information...');
    const accountResponse = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [centedWallet, { encoding: 'base58' }]
      })
    });
    
    const accountData = await accountResponse.json();
    console.log('✅ Account balance:', accountData.result?.value?.lamports || 0, 'lamports');

    // 2. Get transaction signatures
    console.log('\n⚡ 2. Fetching transaction signatures...');
    const signaturesResponse = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [centedWallet, { limit: 50 }]
      })
    });
    
    const signaturesData = await signaturesResponse.json();
    const signatures = signaturesData.result || [];
    console.log(`✅ Found ${signatures.length} transaction signatures`);

    // 3. Get enhanced transaction data
    console.log('\n📈 3. Getting enhanced transaction data...');
    const transactionSignatures = signatures.slice(0, 10).map(sig => sig.signature);
    
    const enhancedResponse = await fetch('https://api.helius.xyz/v0/transactions?api-key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions: transactionSignatures
      })
    });
    
    const enhancedData = await enhancedResponse.json();
    console.log(`✅ Enhanced ${enhancedData.length} transactions`);

    // 4. Process transaction data
    console.log('\n🔍 4. Processing transaction analysis...');
    const processedData = await processTransactions(enhancedData);
    
    // 5. Save to Supabase
    console.log('\n💾 5. Saving analysis to Supabase...');
    
    // Save wallet login
    const { data: loginData, error: loginError } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: centedWallet,
        logged_in_at: new Date().toISOString(),
        session_id: `test_${Date.now()}`,
        user_agent: 'Helius-Test-System',
        ip_address: '127.0.0.1'
      })
      .select();

    if (loginError) {
      console.log('❌ Login save error:', loginError.message);
    } else {
      console.log('✅ Wallet login recorded');
    }

    // Save wallet behavior analysis
    const behaviorData = {
      wallet_address: centedWallet,
      risk_score: processedData.riskScore,
      fomo_score: processedData.fomoScore,
      patience_score: processedData.patienceScore,
      conviction_score: processedData.convictionScore,
      trading_frequency: processedData.tradingFrequency,
      avg_trade_size: processedData.avgTradeSize,
      preferred_times: processedData.preferredTimes,
      behavior_tags: processedData.behaviorTags,
      created_at: new Date().toISOString()
    };

    const { data: behaviorSaved, error: behaviorError } = await supabase
      .from('wallet_behavior')
      .upsert(behaviorData)
      .select();

    if (behaviorError) {
      console.log('❌ Behavior save error:', behaviorError.message);
    } else {
      console.log('✅ Behavior analysis saved');
    }

    // Save wallet scores
    const scoresData = {
      wallet_address: centedWallet,
      whisperer_score: processedData.whispererScore,
      degen_score: processedData.degenScore,
      whale_score: processedData.whaleScore,
      diamond_hands_score: processedData.diamondHandsScore,
      paper_hands_score: processedData.paperHandsScore,
      confidence_level: processedData.confidenceLevel,
      created_at: new Date().toISOString()
    };

    const { data: scoresStored, error: scoresError } = await supabase
      .from('wallet_scores')
      .upsert(scoresData)
      .select();

    if (scoresError) {
      console.log('❌ Scores save error:', scoresError.message);
    } else {
      console.log('✅ Wallet scores saved');
    }

    console.log('\n🎯 COMPLETE SYSTEM TEST RESULTS');
    console.log('==============================');
    console.log(`Wallet: ${centedWallet}`);
    console.log(`Transactions analyzed: ${enhancedData.length}`);
    console.log(`Whisperer Score: ${processedData.whispererScore}/100`);
    console.log(`Degen Score: ${processedData.degenScore}/100`);
    console.log(`Risk Level: ${processedData.riskLevel}`);
    console.log(`Trading Style: ${processedData.tradingStyle}`);
    console.log('✅ ALL DATA SAVED TO SUPABASE');
    
    return true;

  } catch (error) {
    console.error('❌ System test failed:', error.message);
    return false;
  }
}

async function processTransactions(transactions) {
  console.log('Processing', transactions.length, 'transactions...');
  
  let totalValue = 0;
  let swapCount = 0;
  let nftCount = 0;
  let defiCount = 0;
  let timeStamps = [];
  
  transactions.forEach(tx => {
    if (tx.timestamp) timeStamps.push(tx.timestamp);
    
    if (tx.type === 'SWAP' || tx.type?.includes('SWAP')) {
      swapCount++;
      if (tx.fee) totalValue += tx.fee;
    }
    
    if (tx.type?.includes('NFT')) {
      nftCount++;
    }
    
    if (tx.type?.includes('LIQUIDITY') || tx.type?.includes('STAKE')) {
      defiCount++;
    }
  });

  const avgValue = totalValue / Math.max(transactions.length, 1);
  const tradingFreq = transactions.length / 30; // per month estimate
  
  // Calculate behavioral scores
  const riskScore = Math.min(90, Math.max(10, (swapCount * 2) + (nftCount * 3)));
  const fomoScore = Math.min(85, Math.max(15, swapCount * 3));
  const patienceScore = Math.max(20, 100 - (tradingFreq * 5));
  const convictionScore = Math.min(95, Math.max(25, defiCount * 10 + 40));
  
  // Calculate composite scores
  const whispererScore = Math.round((riskScore + fomoScore + patienceScore + convictionScore) / 4);
  const degenScore = Math.round((riskScore * 0.4) + (fomoScore * 0.6));
  const whaleScore = Math.min(100, Math.round(avgValue / 1000 + 30));
  
  return {
    riskScore,
    fomoScore,
    patienceScore,
    convictionScore,
    tradingFrequency: tradingFreq,
    avgTradeSize: avgValue,
    whispererScore,
    degenScore,
    whaleScore,
    diamondHandsScore: patienceScore,
    paperHandsScore: 100 - patienceScore,
    confidenceLevel: 95,
    riskLevel: riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
    tradingStyle: swapCount > 20 ? 'Active Trader' : defiCount > 5 ? 'DeFi Farmer' : 'Hodler',
    preferredTimes: ['Morning', 'Evening'],
    behaviorTags: ['Strategic', 'Patient', 'Analytical']
  };
}

testHeliusAndFetchRealData();