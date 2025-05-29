// Get detailed transaction data for Cented to compare with GMGN
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

async function getDetailedTransactions() {
  console.log('🔍 CENTED DETAILED TRANSACTION ANALYSIS');
  console.log('======================================');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // Get transaction signatures
    const sigResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 30 }]
      })
    });

    const sigData = await sigResponse.json();
    
    if (!sigData.result) {
      console.log('❌ No transaction data available');
      return;
    }

    const signatures = sigData.result;
    console.log(`📋 TRANSACTION LIST (${signatures.length} transactions)`);
    console.log('');

    // Get detailed data for each transaction
    const allSigs = signatures.map(tx => tx.signature);
    
    // Process in batches of 10 to avoid API limits
    const batchSize = 10;
    const transactions = [];
    
    for (let i = 0; i < allSigs.length; i += batchSize) {
      const batch = allSigs.slice(i, i + batchSize);
      
      const detailResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getParsedTransactions',
          params: [batch]
        })
      });

      const detailData = await detailResponse.json();
      
      if (detailData.result) {
        transactions.push(...detailData.result);
      }
      
      // Small delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ Retrieved detailed data for ${transactions.length} transactions`);
    console.log('');

    // Analyze each transaction
    transactions.forEach((tx, index) => {
      if (tx && tx.meta && signatures[index]) {
        const sig = signatures[index];
        const date = new Date(sig.blockTime * 1000);
        
        console.log(`🔸 Transaction #${index + 1}`);
        console.log(`   Hash: ${sig.signature}`);
        console.log(`   Date: ${date.toLocaleString()}`);
        console.log(`   Block: ${tx.slot}`);
        console.log(`   Status: ${tx.meta.err ? '❌ Failed' : '✅ Success'}`);
        console.log(`   Fee: ${(tx.meta.fee / 1e9).toFixed(6)} SOL`);
        
        // Calculate SOL balance changes
        if (tx.meta.preBalances && tx.meta.postBalances) {
          const solChange = (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
          console.log(`   SOL Change: ${solChange > 0 ? '+' : ''}${solChange.toFixed(6)} SOL`);
        }

        // Analyze token transfers
        if (tx.meta.preTokenBalances && tx.meta.postTokenBalances) {
          const tokenChanges = [];
          
          // Compare pre and post token balances
          tx.meta.postTokenBalances.forEach(postBalance => {
            const preBalance = tx.meta.preTokenBalances.find(
              pre => pre.mint === postBalance.mint && pre.owner === WALLET_ADDRESS
            );
            
            if (preBalance) {
              const change = parseFloat(postBalance.uiTokenAmount.uiAmountString) - 
                           parseFloat(preBalance.uiTokenAmount.uiAmountString);
              
              if (Math.abs(change) > 0.000001) {
                tokenChanges.push({
                  mint: postBalance.mint,
                  change: change,
                  symbol: postBalance.uiTokenAmount.uiAmountString ? 'TOKEN' : 'UNKNOWN'
                });
              }
            }
          });

          if (tokenChanges.length > 0) {
            console.log(`   Token Changes:`);
            tokenChanges.forEach(token => {
              console.log(`     ${token.mint.substring(0, 8)}... : ${token.change > 0 ? '+' : ''}${token.change.toFixed(6)}`);
            });
          }
        }

        // Analyze program interactions
        if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
          const programs = new Set();
          tx.transaction.message.instructions.forEach(inst => {
            if (tx.transaction.message.accountKeys && tx.transaction.message.accountKeys[inst.programIdIndex]) {
              programs.add(tx.transaction.message.accountKeys[inst.programIdIndex]);
            }
          });
          
          const programList = Array.from(programs);
          console.log(`   Programs: ${programList.length > 0 ? programList.map(p => p.substring(0, 8) + '...').join(', ') : 'System'}`);
        }

        // Transaction type classification
        let txType = 'Transfer';
        if (tx.meta.logMessages) {
          const logs = tx.meta.logMessages.join(' ');
          if (logs.includes('swap') || logs.includes('trade')) txType = 'Swap/Trade';
          else if (logs.includes('stake')) txType = 'Staking';
          else if (logs.includes('mint')) txType = 'Mint';
          else if (logs.includes('burn')) txType = 'Burn';
        }
        console.log(`   Type: ${txType}`);
        
        console.log('');
      }
    });

    // Summary statistics
    const successful = transactions.filter((tx, i) => tx && !signatures[i].err).length;
    const failed = transactions.length - successful;
    const totalFees = transactions.reduce((sum, tx) => sum + (tx?.meta?.fee || 0), 0) / 1e9;
    
    console.log(`📊 SUMMARY FOR GMGN COMPARISON`);
    console.log(`============================`);
    console.log(`Total Transactions: ${transactions.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((successful / transactions.length) * 100).toFixed(1)}%`);
    console.log(`Total Fees Paid: ${totalFees.toFixed(6)} SOL`);
    console.log(`Avg Fee per TX: ${(totalFees / transactions.length).toFixed(6)} SOL`);
    console.log('');
    
    // Recent activity pattern
    const now = Date.now() / 1000;
    const last24h = signatures.filter(tx => (now - tx.blockTime) < 86400).length;
    const last7d = signatures.filter(tx => (now - tx.blockTime) < 604800).length;
    
    console.log(`📈 ACTIVITY PATTERN`);
    console.log(`Last 24h: ${last24h} transactions`);
    console.log(`Last 7d: ${last7d} transactions`);
    console.log(`Average per day: ${(last7d / 7).toFixed(1)} transactions`);
    console.log('');
    
    console.log(`🔗 For GMGN comparison, check these transaction hashes:`);
    signatures.slice(0, 5).forEach((sig, i) => {
      console.log(`${i + 1}. ${sig.signature}`);
    });

  } catch (error) {
    console.error('❌ Error fetching transactions:', error.message);
  }
}

getDetailedTransactions();