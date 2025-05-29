// Get actual transaction details for GMGN comparison
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

async function getCentedTransactionDetails() {
  console.log('🔍 CENTED TRANSACTION DETAILS FOR GMGN COMPARISON');
  console.log('================================================');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // First get the signatures
    const sigResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 20 }]
      })
    });

    const sigData = await sigResponse.json();
    
    if (!sigData.result || sigData.result.length === 0) {
      console.log('❌ No transactions found');
      return;
    }

    const signatures = sigData.result;
    console.log(`📋 FOUND ${signatures.length} RECENT TRANSACTIONS`);
    console.log('');

    // Display each transaction with key details
    for (let i = 0; i < Math.min(signatures.length, 15); i++) {
      const tx = signatures[i];
      const date = new Date(tx.blockTime * 1000);
      
      console.log(`🔸 Transaction ${i + 1}:`);
      console.log(`   Signature: ${tx.signature}`);
      console.log(`   Date: ${date.toLocaleString()}`);
      console.log(`   Time: ${date.toISOString()}`);
      console.log(`   Block Time: ${tx.blockTime}`);
      console.log(`   Status: ${tx.err ? '❌ Failed' : '✅ Success'}`);
      console.log(`   Slot: ${tx.slot}`);
      console.log(`   Confirmation: ${tx.confirmationStatus || 'finalized'}`);
      
      if (tx.err) {
        console.log(`   Error: ${JSON.stringify(tx.err)}`);
      }
      
      console.log('');
    }

    // Now try to get detailed transaction info using Helius enhanced API
    console.log('🔍 GETTING DETAILED TRANSACTION DATA...');
    console.log('');

    const recentSigs = signatures.slice(0, 5).map(tx => tx.signature);
    
    for (const sig of recentSigs) {
      try {
        const txResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTransaction',
            params: [sig, { 
              encoding: 'jsonParsed',
              maxSupportedTransactionVersion: 0 
            }]
          })
        });

        const txData = await txResponse.json();
        
        if (txData.result) {
          const tx = txData.result;
          console.log(`📄 Transaction: ${sig.substring(0, 20)}...`);
          
          // Balance changes
          if (tx.meta && tx.meta.preBalances && tx.meta.postBalances) {
            const solChange = (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
            console.log(`   SOL Change: ${solChange > 0 ? '+' : ''}${solChange.toFixed(6)} SOL`);
            console.log(`   Fee: ${(tx.meta.fee / 1e9).toFixed(6)} SOL`);
          }

          // Token transfers
          if (tx.meta && tx.meta.postTokenBalances && tx.meta.preTokenBalances) {
            console.log(`   Token Activity: ${tx.meta.postTokenBalances.length} tokens involved`);
          }

          // Programs involved
          if (tx.transaction && tx.transaction.message && tx.transaction.message.accountKeys) {
            const programs = tx.transaction.message.instructions?.map(inst => {
              const accountKey = tx.transaction.message.accountKeys[inst.programIdIndex];
              return accountKey?.pubkey || accountKey;
            }).filter(p => p) || [];
            
            if (programs.length > 0) {
              console.log(`   Programs: ${programs.slice(0, 3).map(p => p.substring(0, 8) + '...').join(', ')}`);
            }
          }

          console.log('');
        }
        
        // Small delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.log(`   ❌ Could not parse transaction ${sig.substring(0, 8)}...`);
      }
    }

    // Summary for GMGN comparison
    console.log('📊 SUMMARY FOR GMGN VERIFICATION');
    console.log('================================');
    
    const successfulTxs = signatures.filter(tx => !tx.err).length;
    const failedTxs = signatures.length - successfulTxs;
    const successRate = (successfulTxs / signatures.length) * 100;
    
    console.log(`Total Transactions: ${signatures.length}`);
    console.log(`Successful: ${successfulTxs}`);
    console.log(`Failed: ${failedTxs}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log('');
    
    // Time analysis
    const now = Date.now() / 1000;
    const oldest = Math.min(...signatures.map(tx => tx.blockTime));
    const newest = Math.max(...signatures.map(tx => tx.blockTime));
    const timespan = (newest - oldest) / 86400; // days
    
    console.log(`Time Range: ${timespan.toFixed(1)} days`);
    console.log(`First TX: ${new Date(oldest * 1000).toLocaleString()}`);
    console.log(`Latest TX: ${new Date(newest * 1000).toLocaleString()}`);
    console.log(`Avg per day: ${(signatures.length / Math.max(timespan, 1)).toFixed(1)} transactions`);
    console.log('');
    
    console.log('🔗 TRANSACTION HASHES FOR GMGN VERIFICATION:');
    console.log('(Copy these to check on gmgn.ai)');
    console.log('');
    signatures.slice(0, 10).forEach((tx, i) => {
      const date = new Date(tx.blockTime * 1000);
      console.log(`${i + 1}. ${tx.signature}`);
      console.log(`   ${date.toLocaleString()} - ${tx.err ? 'Failed' : 'Success'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getCentedTransactionDetails();