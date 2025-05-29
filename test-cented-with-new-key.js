// Test Cented whale wallet with correct Helius API key
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

async function fetchCentedTransactions() {
  console.log('🐋 Fetching Cented transactions with correct API key...');
  
  try {
    // Use RPC endpoint which is more reliable
    const response = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 20 }]
      })
    });
    
    if (!response.ok) {
      console.error('❌ Helius API failed:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ RPC error:', data.error.message);
      return null;
    }
    
    console.log(`✅ Retrieved ${data.result?.length || 0} transaction signatures`);
    
    // Now get detailed transaction data for the first few
    if (data.result && data.result.length > 0) {
      const signatures = data.result.slice(0, 5).map(tx => tx.signature);
      
      const detailResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getParsedTransactions',
          params: [signatures]
        })
      });
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        console.log(`✅ Retrieved detailed data for ${detailData.result?.length || 0} transactions`);
        return { signatures: data.result, details: detailData.result };
      }
    }
    
    return { signatures: data.result, details: [] };
    
  } catch (error) {
    console.error('❌ Helius error:', error.message);
    return null;
  }
}

function analyzeCentedBehavior(transactionData) {
  if (!transactionData || !transactionData.signatures) {
    return null;
  }

  const signatures = transactionData.signatures;
  const details = transactionData.details || [];
  
  console.log('\n📊 Analyzing Cented\'s trading behavior...');
  
  // Calculate time-based metrics
  const now = Date.now() / 1000;
  const recentTxs = signatures.filter(tx => (now - tx.blockTime) < (7 * 24 * 60 * 60)); // Last 7 days
  
  const tradingFrequency = recentTxs.length / 7; // per day
  const totalTransactions = signatures.length;
  
  // Analyze transaction patterns
  const errorCount = signatures.filter(tx => tx.err !== null).length;
  const successRate = ((totalTransactions - errorCount) / totalTransactions) * 100;
  
  // Calculate behavioral scores based on real patterns
  const riskScore = Math.min(100, tradingFrequency * 12); // High frequency = higher risk
  const patienceScore = Math.max(0, 100 - (tradingFrequency * 8)); // Lower frequency = more patience
  const convictionScore = Math.min(100, successRate); // High success rate = conviction
  const fomoScore = recentTxs.length > 10 ? Math.min(100, recentTxs.length * 5) : 30; // Recent activity
  
  return {
    riskScore: Math.round(riskScore),
    fomoScore: Math.round(fomoScore),
    patienceScore: Math.round(patienceScore),
    convictionScore: Math.round(convictionScore),
    tradingFrequency: Math.round(tradingFrequency * 10) / 10,
    totalTransactions,
    recentActivity: recentTxs.length,
    successRate: Math.round(successRate)
  };
}

async function storeCentedAnalytics(metrics) {
  console.log('\n💾 Storing Cented analytics in database...');

  try {
    // Store behavioral analysis
    const { error: behaviorError } = await supabase
      .from('wallet_behavior')
      .upsert({
        wallet_address: WALLET_ADDRESS,
        risk_score: metrics.riskScore,
        fomo_score: metrics.fomoScore,
        patience_score: metrics.patienceScore,
        conviction_score: metrics.convictionScore,
        updated_at: new Date().toISOString()
      });

    if (!behaviorError) {
      console.log('✅ Behavioral data stored');
    }

    // Calculate and store wallet scores
    const whispererScore = Math.round((metrics.patienceScore + metrics.convictionScore) / 2);
    const degenScore = Math.round((metrics.riskScore + metrics.fomoScore) / 2);
    
    const mood = degenScore > 70 ? 'aggressive' : whispererScore > 70 ? 'confident' : 'conservative';
    const riskLevel = metrics.riskScore > 70 ? 'high' : metrics.riskScore > 40 ? 'medium' : 'low';

    const { error: scoresError } = await supabase
      .from('wallet_scores')
      .upsert({
        address: WALLET_ADDRESS,
        whisperer_score: whispererScore,
        degen_score: degenScore,
        trading_frequency: metrics.tradingFrequency,
        current_mood: mood,
        risk_level: riskLevel,
        daily_trades: Math.round(metrics.tradingFrequency),
        updated_at: new Date().toISOString()
      });

    if (!scoresError) {
      console.log('✅ Wallet scores stored');
    }

    console.log('\n🎯 Cented Analysis Results:');
    console.log(`Whisperer Score: ${whispererScore}/100`);
    console.log(`Degen Score: ${degenScore}/100`);
    console.log(`Risk Level: ${riskLevel}`);
    console.log(`Current Mood: ${mood}`);
    console.log(`Trading Frequency: ${metrics.tradingFrequency} trades/day`);
    console.log(`Success Rate: ${metrics.successRate}%`);

  } catch (error) {
    console.error('❌ Storage error:', error.message);
  }
}

async function runCentedAnalysis() {
  console.log('🚀 Starting complete Cented whale analysis...');
  console.log(`Analyzing wallet: ${WALLET_ADDRESS}`);

  const transactionData = await fetchCentedTransactions();
  
  if (!transactionData) {
    console.log('❌ Failed to fetch transaction data');
    return;
  }

  const metrics = analyzeCentedBehavior(transactionData);
  
  if (metrics) {
    await storeCentedAnalytics(metrics);
    console.log('\n🎉 Cented analysis complete and stored in database!');
  }
}

runCentedAnalysis();