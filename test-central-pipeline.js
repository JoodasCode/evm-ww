import { CentralDataPipeline, WalletDataConsumer } from './server/centralDataPipeline.js';

async function testCentralizedPipeline() {
  console.log('🔥 TESTING CENTRALIZED DATA PIPELINE');
  console.log('===================================');
  console.log('[Helius + Moralis] → Pipeline → [Redis + Postgres] → Consumer');
  console.log('');
  
  const pipeline = new CentralDataPipeline();
  const consumer = new WalletDataConsumer();
  
  const testWallets = [
    { address: 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o', name: 'Cented' },
    { address: 'BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd', name: 'dV' }
  ];
  
  for (const wallet of testWallets) {
    console.log(`🎯 Testing ${wallet.name}: ${wallet.address}`);
    console.log('─'.repeat(70));
    
    const startTime = Date.now();
    
    try {
      // Step 1: Fire the central pipeline
      console.log('📡 Stage 1: Central pipeline ingestion...');
      const result = await pipeline.ingestWallet(wallet.address, wallet.name);
      
      if (!result.success) {
        console.log(`❌ Pipeline failed: ${result.error}`);
        continue;
      }
      
      console.log('✅ Pipeline completed successfully');
      
      // Step 2: Test consumer interface (should hit Redis first)
      console.log('⚡ Stage 2: Consumer interface test...');
      const consumerStartTime = Date.now();
      
      const transactions = await consumer.getCleanTransactions(wallet.address);
      const analysis = await consumer.getPsychologicalAnalysis(wallet.address);
      const summary = await consumer.getWalletSummary(wallet.address);
      
      const consumerTime = Date.now() - consumerStartTime;
      
      // Step 3: Data verification
      console.log('📊 PIPELINE RESULTS:');
      console.log(`Total cleaned transactions: ${transactions?.length || 0}`);
      console.log(`Redis fetch time: ${consumerTime}ms`);
      
      if (analysis) {
        console.log(`Archetype: ${analysis.archetype}`);
        console.log(`Whisperer Score: ${analysis.whisperer_score}/100`);
        console.log(`Degen Score: ${analysis.degen_score}/100`);
      }
      
      // Step 4: Token categorization breakdown
      if (transactions && transactions.length > 0) {
        const categories = {};
        transactions.forEach(tx => {
          const cat = tx.category || 'Unknown';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        
        console.log('🏷️ TOKEN CATEGORIES:');
        Object.entries(categories).forEach(([cat, count]) => {
          console.log(`  ${cat}: ${count} transactions`);
        });
      }
      
      const totalTime = Date.now() - startTime;
      console.log(`⏱️ Total pipeline time: ${totalTime}ms`);
      
    } catch (error) {
      console.error(`💥 Test failed for ${wallet.name}:`, error.message);
    }
    
    console.log('');
  }
  
  // Step 5: Test Redis caching efficiency
  console.log('⚡ REDIS CACHE TEST:');
  console.log('─'.repeat(30));
  
  const cacheTestStart = Date.now();
  const cachedData = await consumer.getCleanTransactions('CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o');
  const cacheTime = Date.now() - cacheTestStart;
  
  console.log(`Redis cache hit time: ${cacheTime}ms`);
  console.log(`Cached transactions: ${cachedData?.length || 0}`);
  
  console.log('');
  console.log('🎯 PIPELINE VERIFICATION COMPLETE');
  console.log('Ready for LLM Whisperer integration');
}

testCentralizedPipeline().catch(console.error);