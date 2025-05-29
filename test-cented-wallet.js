// Test Cented whale wallet analytics
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

// Test Helius API for transaction data
async function fetchHeliusTransactions() {
  console.log('🔄 Fetching Cented transactions from Helius...');
  
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.error('❌ Helius API key missing');
    return null;
  }

  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions?api-key=${apiKey}&limit=50`);
    
    if (!response.ok) {
      console.error('❌ Helius API failed:', response.status, response.statusText);
      return null;
    }
    
    const transactions = await response.json();
    console.log(`✅ Retrieved ${transactions.length} transactions from Helius`);
    
    return transactions;
  } catch (error) {
    console.error('❌ Helius error:', error.message);
    return null;
  }
}

// Test Moralis API for enriched data
async function fetchMoralisData() {
  console.log('🔄 Fetching Cented data from Moralis...');
  
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) {
    console.error('❌ Moralis API key missing');
    return null;
  }

  try {
    const response = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${WALLET_ADDRESS}/balance`, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error('❌ Moralis API failed:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Retrieved Moralis balance data:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Moralis error:', error.message);
    return null;
  }
}

// Calculate behavioral analytics from real data
function calculateBehavioralMetrics(transactions) {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  // Analyze transaction patterns
  const recentTxs = transactions.filter(tx => 
    (now - (tx.timestamp * 1000)) < weekMs
  );

  const tradingFrequency = recentTxs.length / 7; // transactions per day
  const avgTradeSize = recentTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0) / recentTxs.length;

  // Calculate behavioral scores
  const riskScore = Math.min(100, tradingFrequency * 15); // High frequency = high risk
  const fomoScore = recentTxs.filter(tx => tx.type === 'buy').length / recentTxs.length * 100;
  const patienceScore = 100 - Math.min(100, tradingFrequency * 10); // Less frequency = more patience
  const convictionScore = Math.min(100, avgTradeSize / 1000); // Larger trades = more conviction

  return {
    riskScore: Math.round(riskScore),
    fomoScore: Math.round(fomoScore || 0),
    patienceScore: Math.round(patienceScore),
    convictionScore: Math.round(convictionScore || 50),
    tradingFrequency: Math.round(tradingFrequency * 10) / 10,
    avgTradeSize: Math.round(avgTradeSize || 0)
  };
}

// Store analytics in database
async function storeAnalytics(walletAddress, metrics, transactions) {
  console.log('💾 Storing Cented analytics in database...');

  try {
    // Store wallet behavior
    const { error: behaviorError } = await supabase
      .from('wallet_behavior')
      .upsert({
        wallet_address: walletAddress,
        risk_score: metrics.riskScore,
        fomo_score: metrics.fomoScore,
        patience_score: metrics.patienceScore,
        conviction_score: metrics.convictionScore,
        updated_at: new Date().toISOString()
      });

    if (behaviorError) {
      console.error('❌ Error storing behavior:', behaviorError.message);
    } else {
      console.log('✅ Behavioral analytics stored');
    }

    // Store wallet scores (using correct column name 'address')
    const whispererScore = Math.round((metrics.patienceScore + metrics.convictionScore) / 2);
    const degenScore = Math.round((metrics.riskScore + metrics.fomoScore) / 2);

    const { error: scoresError } = await supabase
      .from('wallet_scores')
      .upsert({
        address: walletAddress,
        whisperer_score: whispererScore,
        degen_score: degenScore,
        trading_frequency: metrics.tradingFrequency,
        avg_trade_size: metrics.avgTradeSize,
        current_mood: degenScore > 70 ? 'aggressive' : 'conservative',
        risk_level: metrics.riskScore > 70 ? 'high' : 'medium',
        updated_at: new Date().toISOString()
      });

    if (scoresError) {
      console.error('❌ Error storing scores:', scoresError.message);
    } else {
      console.log('✅ Wallet scores stored');
    }

    // Store recent transactions
    if (transactions && transactions.length > 0) {
      const recentTxs = transactions.slice(0, 5).map(tx => ({
        wallet_address: walletAddress,
        transaction_hash: tx.signature || `tx_${Date.now()}_${Math.random()}`,
        token: tx.tokenTransfers?.[0]?.mint || 'SOL',
        type: tx.type || 'transfer',
        amount: tx.amount || 0,
        value: tx.amount || 0,
        timestamp: new Date(tx.timestamp * 1000).toISOString(),
        created_at: new Date().toISOString()
      }));

      const { error: tradesError } = await supabase
        .from('wallet_trades')
        .upsert(recentTxs);

      if (tradesError) {
        console.error('❌ Error storing trades:', tradesError.message);
      } else {
        console.log(`✅ ${recentTxs.length} recent transactions stored`);
      }
    }

  } catch (error) {
    console.error('❌ Database storage error:', error.message);
  }
}

// Run complete test
async function runCentedAnalysis() {
  console.log('🐋 Starting Cented whale analysis...');
  console.log(`Wallet: ${WALLET_ADDRESS}`);

  // Fetch data from APIs
  const transactions = await fetchHeliusTransactions();
  const moralisData = await fetchMoralisData();

  if (!transactions) {
    console.log('⚠️  No transaction data available for analysis');
    return;
  }

  // Calculate behavioral metrics
  const metrics = calculateBehavioralMetrics(transactions);
  
  if (metrics) {
    console.log('\n📊 Cented Behavioral Analysis:');
    console.log(`Risk Score: ${metrics.riskScore}/100`);
    console.log(`FOMO Score: ${metrics.fomoScore}/100`);
    console.log(`Patience Score: ${metrics.patienceScore}/100`);
    console.log(`Conviction Score: ${metrics.convictionScore}/100`);
    console.log(`Trading Frequency: ${metrics.tradingFrequency} trades/day`);
    console.log(`Avg Trade Size: ${metrics.avgTradeSize}`);

    // Store in database
    await storeAnalytics(WALLET_ADDRESS, metrics, transactions);
  }

  console.log('\n🎉 Cented analysis complete!');
}

runCentedAnalysis();