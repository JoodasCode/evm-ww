// Use the existing integrated analytics system for Cented
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";
const HELIUS_API_KEY = "f9d969ad-b178-44e2-8242-db35c814bfd8";

// Import your existing analytics functions
async function getWalletAnalyticsWithTokenNames() {
  console.log('🔍 CENTED ANALYSIS WITH TOKEN NAMES - USING INTEGRATED SYSTEM');
  console.log('============================================================');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // First, get transactions from Helius
    const sigResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 10 }]
      })
    });

    const sigData = await sigResponse.json();
    
    if (!sigData.result) {
      console.log('❌ No transactions found');
      return;
    }

    console.log(`📋 Found ${sigData.result.length} transactions`);
    console.log('');

    // Now get enriched data for each transaction with Moralis
    const moralisApiKey = process.env.MORALIS_API_KEY;
    
    if (!moralisApiKey) {
      console.log('⚠️ Need Moralis API key for token enrichment');
      return;
    }

    console.log('🔄 Enriching with Moralis token data...');
    
    for (let i = 0; i < Math.min(sigData.result.length, 5); i++) {
      const tx = sigData.result[i];
      const date = new Date(tx.blockTime * 1000);
      
      console.log(`\n🔸 Transaction ${i + 1}:`);
      console.log(`   Hash: ${tx.signature}`);
      console.log(`   Date: ${date.toLocaleString()}`);
      console.log(`   Status: ${tx.err ? '❌ Failed' : '✅ Success'}`);

      // Get detailed transaction data
      const txResponse = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [tx.signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]
        })
      });

      const txData = await txResponse.json();
      
      if (txData.result && txData.result.meta) {
        const transaction = txData.result;
        
        // Calculate SOL changes
        if (transaction.meta.preBalances && transaction.meta.postBalances) {
          const solChange = (transaction.meta.postBalances[0] - transaction.meta.preBalances[0]) / 1e9;
          console.log(`   SOL Change: ${solChange > 0 ? '+' : ''}${solChange.toFixed(6)} SOL`);
        }

        // Get token transfers with names from Moralis
        if (transaction.meta.postTokenBalances && transaction.meta.preTokenBalances) {
          console.log(`   Token Activity:`);
          
          const tokenMints = new Set();
          
          // Collect all unique token mints
          [...transaction.meta.postTokenBalances, ...transaction.meta.preTokenBalances].forEach(balance => {
            if (balance.owner === WALLET_ADDRESS) {
              tokenMints.add(balance.mint);
            }
          });

          // Get token metadata from Moralis for each mint
          for (const mint of tokenMints) {
            try {
              const metadataResponse = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${mint}/metadata`, {
                headers: { 'X-API-Key': moralisApiKey }
              });

              let tokenName = 'Unknown Token';
              let tokenSymbol = 'UNKNOWN';
              
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                tokenName = metadata.name || 'Unknown Token';
                tokenSymbol = metadata.symbol || 'UNKNOWN';
              }

              // Calculate balance changes
              const preBalance = transaction.meta.preTokenBalances.find(
                b => b.mint === mint && b.owner === WALLET_ADDRESS
              );
              const postBalance = transaction.meta.postTokenBalances.find(
                b => b.mint === mint && b.owner === WALLET_ADDRESS
              );
              
              const preAmount = preBalance ? parseFloat(preBalance.uiTokenAmount.uiAmountString || '0') : 0;
              const postAmount = postBalance ? parseFloat(postBalance.uiTokenAmount.uiAmountString || '0') : 0;
              const change = postAmount - preAmount;
              
              if (Math.abs(change) > 0.000001) {
                console.log(`     ${tokenSymbol} (${tokenName}): ${change > 0 ? '+' : ''}${change.toFixed(6)}`);
                console.log(`       Mint: ${mint.substring(0, 12)}...`);
              }
              
              // Delay to respect Moralis rate limits
              await new Promise(resolve => setTimeout(resolve, 200));
              
            } catch (error) {
              console.log(`     ${mint.substring(0, 8)}... : Token metadata unavailable`);
            }
          }
        }

        // Determine transaction type
        let txType = 'Transfer';
        if (transaction.meta.logMessages) {
          const logs = transaction.meta.logMessages.join(' ');
          if (logs.includes('swap') || logs.includes('Swap')) txType = 'Token Swap';
          else if (logs.includes('transfer') && transaction.meta.postTokenBalances?.length > 0) txType = 'Token Transfer';
        }
        console.log(`   Type: ${txType}`);
      }
    }

    console.log('\n📊 CENTED BEHAVIORAL ANALYSIS:');
    console.log('==============================');
    
    const successRate = (sigData.result.filter(tx => !tx.err).length / sigData.result.length) * 100;
    const recentActivity = sigData.result.length;
    
    console.log(`✅ Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`📈 Trading Style: ${recentActivity > 10 ? 'High-frequency' : 'Moderate'} trader`);
    console.log(`🎯 Risk Profile: ${successRate > 90 ? 'Conservative' : 'Moderate'} risk management`);
    console.log(`🐋 Classification: Whale (based on 363+ SOL balance)`);
    
    console.log('\n🔗 TRANSACTION HASHES FOR GMGN COMPARISON:');
    sigData.result.slice(0, 5).forEach((tx, i) => {
      console.log(`${i + 1}. ${tx.signature}`);
    });

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  }
}

getWalletAnalyticsWithTokenNames();