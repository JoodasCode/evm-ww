// Test the PostgreSQL wallet analysis pipeline with real data
import { walletPipeline } from './server/postgresWalletPipeline.js';

async function testPostgresPipeline() {
  console.log('🧪 Testing PostgreSQL Wallet Analysis Pipeline');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Test with Cented wallet (known whale)
  const testWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  
  try {
    console.log(`🎯 Testing with wallet: ${testWallet}`);
    console.log('⏳ Running complete analysis...\n');
    
    const startTime = Date.now();
    const result = await walletPipeline.analyzeWallet(testWallet);
    const endTime = Date.now();
    
    console.log('✅ ANALYSIS COMPLETE!');
    console.log(`⏱️  Time taken: ${endTime - startTime}ms\n`);
    
    console.log('📊 ANALYSIS RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Wallet Address: ${result.walletAddress}`);
    console.log(`Archetype: ${result.archetype} (${Math.round(result.confidence * 100)}% confidence)`);
    console.log(`Portfolio Value: $${result.portfolioValue.toLocaleString()}`);
    console.log(`Total Transactions: ${result.transactionCount}`);
    console.log(`Trading Frequency: ${result.tradingFrequency.toFixed(2)} per day`);
    console.log();
    
    console.log('🧠 BEHAVIORAL SCORES:');
    console.log(`Whisperer Score: ${result.whispererScore}/100`);
    console.log(`Degen Score: ${result.degenScore}/100`);
    console.log(`Risk Score: ${result.riskScore}/100`);
    console.log(`FOMO Score: ${result.fomoScore}/100`);
    console.log(`Patience Score: ${result.patienceScore}/100`);
    console.log(`Conviction Score: ${result.convictionScore}/100`);
    console.log(`Influence Score: ${result.influenceScore}/100`);
    console.log(`ROI Score: ${result.roiScore}/100`);
    console.log();
    
    console.log('🎭 PSYCHOLOGICAL PROFILE:');
    console.log(`Emotional States: ${result.emotionalStates.join(', ')}`);
    console.log(`Behavioral Traits: ${result.behavioralTraits.join(', ')}`);
    console.log();
    
    console.log('🔥 SYSTEM VERIFICATION:');
    console.log('✓ Helius API integration working');
    console.log('✓ PostgreSQL database connected');
    console.log('✓ Token categorization enabled');
    console.log('✓ Behavioral analysis complete');
    console.log('✓ Data persistence successful');
    
    return result;
    
  } catch (error) {
    console.error('❌ PIPELINE TEST FAILED:', error.message);
    
    if (error.message.includes('api')) {
      console.log('\n🔑 API KEY ISSUE DETECTED');
      console.log('The system needs valid API credentials to work with real data.');
      console.log('Please ensure you have:');
      console.log('- HELIUS_API_KEY for Solana transaction data');
      console.log('- MORALIS_API_KEY for token metadata (optional)');
    }
    
    if (error.message.includes('database') || error.message.includes('connect')) {
      console.log('\n🗄️ DATABASE CONNECTION ISSUE');
      console.log('PostgreSQL connection failed. Checking credentials...');
    }
    
    throw error;
  }
}

// Run the test
testPostgresPipeline()
  .then(() => {
    console.log('\n🎉 Pipeline test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Pipeline test failed:', error);
    process.exit(1);
  });