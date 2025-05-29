// Deep analysis of Cented's wallet with detailed transaction breakdown
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

async function getDetailedTransactionAnalysis() {
  console.log('🔍 CENTED WALLET DEEP ANALYSIS REPORT');
  console.log('=====================================');
  console.log(`Wallet Address: ${WALLET_ADDRESS}`);
  console.log(`Analysis Date: ${new Date().toLocaleString()}`);
  console.log('');

  try {
    // Get comprehensive transaction signatures
    const sigResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 50 }]
      })
    });

    const sigData = await sigResponse.json();
    
    if (!sigData.result) {
      console.log('❌ No transaction data available');
      return;
    }

    const signatures = sigData.result;
    console.log(`📊 TRANSACTION OVERVIEW`);
    console.log(`Total Transactions Analyzed: ${signatures.length}`);
    console.log('');

    // Analyze transaction patterns
    const now = Date.now() / 1000;
    const timeframes = {
      last24h: signatures.filter(tx => (now - tx.blockTime) < 86400),
      last7days: signatures.filter(tx => (now - tx.blockTime) < 604800),
      last30days: signatures.filter(tx => (now - tx.blockTime) < 2592000)
    };

    console.log(`📈 ACTIVITY PATTERNS`);
    console.log(`Last 24 hours: ${timeframes.last24h.length} transactions`);
    console.log(`Last 7 days: ${timeframes.last7days.length} transactions`);
    console.log(`Last 30 days: ${timeframes.last30days.length} transactions`);
    console.log('');

    // Success/Error analysis
    const errors = signatures.filter(tx => tx.err !== null);
    const successRate = ((signatures.length - errors.length) / signatures.length) * 100;
    
    console.log(`✅ SUCCESS METRICS`);
    console.log(`Successful Transactions: ${signatures.length - errors.length}`);
    console.log(`Failed Transactions: ${errors.length}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log('');

    // Get detailed data for recent transactions
    const recentSigs = signatures.slice(0, 10).map(tx => tx.signature);
    
    const detailResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getParsedTransactions',
        params: [recentSigs]
      })
    });

    const detailData = await detailResponse.json();
    
    if (detailData.result) {
      console.log(`🔍 RECENT TRANSACTION DETAILS`);
      console.log('');
      
      detailData.result.forEach((tx, index) => {
        if (tx && tx.meta) {
          const date = new Date(signatures[index].blockTime * 1000);
          const solTransfer = tx.meta.preBalances && tx.meta.postBalances ? 
            (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9 : 0;
          
          console.log(`Transaction #${index + 1}:`);
          console.log(`  Signature: ${signatures[index].signature.substring(0, 20)}...`);
          console.log(`  Date: ${date.toLocaleString()}`);
          console.log(`  SOL Change: ${solTransfer > 0 ? '+' : ''}${solTransfer.toFixed(4)} SOL`);
          console.log(`  Fee: ${(tx.meta.fee / 1e9).toFixed(6)} SOL`);
          console.log(`  Status: ${tx.meta.err ? 'Failed' : 'Success'}`);
          
          // Analyze program interactions
          if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
            const programs = tx.transaction.message.instructions.map(inst => {
              const programId = tx.transaction.message.accountKeys[inst.programIdIndex];
              return programId;
            }).filter((v, i, a) => a.indexOf(v) === i);
            
            console.log(`  Programs: ${programs.length > 0 ? programs.join(', ') : 'System transfer'}`);
          }
          console.log('');
        }
      });
    }

    // Behavioral analysis
    console.log(`🧠 BEHAVIORAL ANALYSIS`);
    console.log('');
    
    const avgTxPerDay = timeframes.last30days.length / 30;
    const recentActivity = timeframes.last7days.length;
    
    // Risk assessment
    let riskLevel = 'Low';
    if (avgTxPerDay > 5) riskLevel = 'High';
    else if (avgTxPerDay > 2) riskLevel = 'Medium';
    
    // Trading style assessment
    let tradingStyle = 'Conservative';
    if (recentActivity > 15) tradingStyle = 'Aggressive';
    else if (recentActivity > 7) tradingStyle = 'Active';
    
    // Patience indicator
    const patience = Math.max(0, 100 - (avgTxPerDay * 15));
    
    console.log(`Trading Frequency: ${avgTxPerDay.toFixed(1)} transactions/day`);
    console.log(`Risk Profile: ${riskLevel}`);
    console.log(`Trading Style: ${tradingStyle}`);
    console.log(`Patience Score: ${patience.toFixed(0)}/100`);
    console.log(`Conviction Level: ${successRate > 95 ? 'High' : successRate > 85 ? 'Medium' : 'Low'}`);
    console.log('');

    // Whale classification
    console.log(`🐋 WHALE CLASSIFICATION`);
    console.log('');
    
    // Get current balance
    const balanceResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [WALLET_ADDRESS]
      })
    });

    const balanceData = await balanceResponse.json();
    const balance = balanceData.result ? balanceData.result.value / 1e9 : 0;
    
    let whaleStatus = 'Standard';
    if (balance > 1000) whaleStatus = 'Mega Whale';
    else if (balance > 500) whaleStatus = 'Large Whale';
    else if (balance > 100) whaleStatus = 'Whale';
    else if (balance > 50) whaleStatus = 'Dolphin';
    
    console.log(`Current Balance: ${balance.toFixed(2)} SOL`);
    console.log(`Wallet Classification: ${whaleStatus}`);
    console.log('');

    // Summary and recommendations
    console.log(`📋 SUMMARY & INSIGHTS`);
    console.log('');
    console.log(`Cented demonstrates ${tradingStyle.toLowerCase()} trading behavior with ${riskLevel.toLowerCase()} risk tolerance.`);
    console.log(`With a ${successRate.toFixed(1)}% success rate across ${signatures.length} transactions, this wallet shows`);
    console.log(`${successRate > 95 ? 'exceptional' : 'solid'} execution skills and ${patience > 70 ? 'patient' : 'active'} market timing.`);
    console.log('');
    console.log(`The ${balance.toFixed(0)} SOL balance classifies this as a ${whaleStatus.toLowerCase()}, indicating`);
    console.log(`significant market presence and potential influence on token prices.`);
    console.log('');
    
    return {
      totalTx: signatures.length,
      successRate: successRate,
      balance: balance,
      riskLevel: riskLevel,
      tradingStyle: tradingStyle,
      whaleStatus: whaleStatus,
      avgTxPerDay: avgTxPerDay
    };

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  }
}

getDetailedTransactionAnalysis();