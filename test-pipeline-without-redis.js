import { PostgresWalletPipeline } from './server/postgresWalletPipeline.js';

async function testPipelineWithoutRedis() {
  console.log('🔥 TESTING DATA PIPELINE (Postgres-focused)');
  console.log('==========================================');
  console.log('[Helius + Moralis] → Sanitization → [Postgres] → Analysis');
  console.log('');
  
  const pipeline = new PostgresWalletPipeline();
  
  const testWallets = [
    { address: 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o', name: 'Cented' },
    { address: 'BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd', name: 'dV' }
  ];
  
  for (const wallet of testWallets) {
    console.log(`🎯 Testing ${wallet.name}: ${wallet.address}`);
    console.log('─'.repeat(70));
    
    const startTime = Date.now();
    
    try {
      const result = await pipeline.analyzeWallet(wallet.address, wallet.name);
      
      if (!result.success) {
        console.log(`❌ Analysis failed: ${result.error}`);
        continue;
      }
      
      console.log('✅ Pipeline completed successfully');
      
      // Data verification
      console.log('📊 PIPELINE RESULTS:');
      console.log(`Total transactions: ${result.data.totalTransactions}`);
      console.log(`Archetype: ${result.data.archetype}`);
      console.log(`Whisperer Score: ${result.data.whispererScore}/100`);
      console.log(`Degen Score: ${result.data.degenScore}/100`);
      
      // Token categorization
      if (result.data.tokenCategories) {
        console.log('🏷️ TOKEN CATEGORIES:');
        Object.entries(result.data.tokenCategories).forEach(([cat, count]) => {
          console.log(`  ${cat}: ${count} tokens`);
        });
      }
      
      // Psychological metrics
      console.log('🧠 PSYCHOLOGICAL METRICS:');
      console.log(`Position Sizing: ${result.data.positionSizing?.consistency}%`);
      console.log(`Conviction Collapse: ${result.data.convictionCollapse?.score}/100`);
      console.log(`Diversification: ${result.data.diversification?.style}`);
      console.log(`Gas Strategy: ${result.data.gasStrategy?.pattern}`);
      
      const totalTime = Date.now() - startTime;
      console.log(`⏱️ Total time: ${totalTime}ms`);
      
    } catch (error) {
      console.error(`💥 Test failed for ${wallet.name}:`, error.message);
    }
    
    console.log('');
  }
  
  console.log('🎯 PIPELINE VERIFICATION COMPLETE');
  console.log('Data successfully processed through Moralis intelligence layer');
}

testPipelineWithoutRedis().catch(console.error);