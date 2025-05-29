// Test if Helius API is working now and fetch Cented's real data
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

async function testHeliusAndFetchRealData() {
  console.log('🔗 TESTING HELIUS API CONNECTION');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // Test the correct Helius endpoint format
    console.log('📊 Fetching Cented transaction data from Helius...');
    
    const url = `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=100`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      
      // Try alternative endpoint format
      console.log('🔄 Trying RPC endpoint...');
      
      const rpcUrl = `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions`;
      const rpcResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'api-key': HELIUS_API_KEY,
          'limit': 100
        })
      });
      
      if (rpcResponse.ok) {
        const transactions = await rpcResponse.json();
        console.log(`✅ Success with RPC endpoint! Found ${transactions.length} transactions`);
        await processTransactions(transactions);
      } else {
        throw new Error('Both endpoints failed');
      }
    } else {
      const transactions = await response.json();
      console.log(`✅ Success! Found ${transactions.length} transactions`);
      await processTransactions(transactions);
    }

  } catch (error) {
    console.error('❌ Helius test failed:', error.message);
    console.log('');
    console.log('💡 This means we need to use calculated values based on behavioral analysis');
    console.log('   The zero values exist because we need authentic transaction data');
  }
}

async function processTransactions(transactions) {
  console.log('');
  console.log('📈 PROCESSING REAL TRANSACTION DATA...');
  
  if (!transactions || transactions.length === 0) {
    console.log('❌ No transactions found');
    return;
  }

  // Calculate real metrics from transaction data
  let totalTransactionValue = 0;
  let transactionCount = transactions.length;
  let largeTransactions = 0;
  let tradingDays = new Set();
  
  console.log(`   Analyzing ${transactionCount} transactions...`);
  
  transactions.forEach(tx => {
    // Extract transaction value (this would need proper parsing based on Helius response format)
    if (tx.amount || tx.nativeTransfers) {
      const amount = tx.amount || (tx.nativeTransfers && tx.nativeTransfers[0]?.amount) || 0;
      totalTransactionValue += amount;
      
      if (amount > 10000000000) { // > 10 SOL
        largeTransactions++;
      }
    }
    
    // Track trading days
    if (tx.blockTime) {
      const date = new Date(tx.blockTime * 1000).toDateString();
      tradingDays.add(date);
    }
  });

  const avgTradeSize = totalTransactionValue / transactionCount;
  const activeTradingDays = tradingDays.size;
  const dailyTradingFreq = transactionCount / Math.max(activeTradingDays, 1);

  console.log('✅ CALCULATED REAL METRICS:');
  console.log(`   Total Transaction Value: ${totalTransactionValue}`);
  console.log(`   Average Trade Size: ${avgTradeSize.toFixed(2)}`);
  console.log(`   Large Transactions (>10 SOL): ${largeTransactions}`);
  console.log(`   Active Trading Days: ${activeTradingDays}`);
  console.log(`   Daily Trading Frequency: ${dailyTradingFreq.toFixed(2)}`);
  console.log('');
  console.log('🎯 These values should replace the zeros in Supabase!');
}

testHeliusAndFetchRealData();