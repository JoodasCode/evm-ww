// Test Cented using the existing integrated system
import { getIntegratedWalletData } from './attached_assets/dataIntegrationService.js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

async function testIntegratedAnalysis() {
  console.log('🔍 TESTING CENTED WITH INTEGRATED HELIUS/MORALIS SYSTEM');
  console.log('======================================================');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    console.log('🚀 Using your integrated data service...');
    
    // Use the existing integrated system
    const integratedData = await getIntegratedWalletData(WALLET_ADDRESS, {
      useCache: false,
      forceRefresh: true,
      includeTradingActivity: true,
      includeLabels: true,
      limit: 20
    });

    console.log('✅ Data retrieved successfully!');
    console.log('');
    
    console.log('📊 INTEGRATED ANALYSIS RESULTS:');
    console.log('===============================');
    console.log(`Processing Time: ${integratedData.processingTime}ms`);
    console.log(`Data Providers:`);
    console.log(`  - Transactions: ${integratedData.dataProviders.transactions}`);
    console.log(`  - Token Metadata: ${integratedData.dataProviders.tokenMetadata}`);
    console.log(`  - Token Prices: ${integratedData.dataProviders.tokenPrices}`);
    console.log('');
    
    // Trading Activity Analysis
    if (integratedData.tradingActivity) {
      console.log('📈 TRADING ACTIVITY (with token names):');
      console.log(JSON.stringify(integratedData.tradingActivity, null, 2));
      console.log('');
    }
    
    // Label Data Analysis
    if (integratedData.labelData) {
      console.log('🏷️ BEHAVIORAL LABELS:');
      console.log(JSON.stringify(integratedData.labelData, null, 2));
      console.log('');
    }
    
    console.log('🎯 This should show token names, not just addresses!');
    
  } catch (error) {
    console.error('❌ Error with integrated system:', error.message);
    console.log('');
    console.log('💡 The integrated system might need the services to be set up properly.');
    console.log('Let me check what dependencies are missing...');
  }
}

testIntegratedAnalysis();