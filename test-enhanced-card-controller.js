// Test Enhanced Card Controller with Real Wallet Data
import { CardController } from './server/cardController.js';

async function testEnhancedCardController() {
  console.log('🧠 Testing Enhanced Card Controller System');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const testWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o'; // Cented wallet
  const cardController = new CardController();
  
  try {
    console.log(`🎯 Testing wallet: ${testWallet}`);
    console.log('⏳ Fetching cards from enhanced controller...\n');
    
    // Test Cognitive Snapshot Cards
    console.log('💳 COGNITIVE SNAPSHOT CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const snapshotCards = await cardController.getCards({
      walletAddress: testWallet,
      cardTypes: ['archetype-classifier', 'trading-rhythm', 'risk-appetite-meter'],
      forceRefresh: false
    });
    
    snapshotCards.forEach(card => {
      console.log(`\n📊 ${card.cardType.toUpperCase()}`);
      console.log(`Status: ${card.loading ? 'Loading...' : card.error ? 'Error' : 'Success'}`);
      console.log(`Staleness: ${card.staleness}`);
      console.log(`Last Updated: ${new Date(card.lastUpdated).toLocaleString()}`);
      
      if (card.error) {
        console.log(`Error: ${card.error}`);
      } else if (card.data) {
        console.log('Data:', JSON.stringify(card.data, null, 2));
      }
    });
    
    // Test Cognitive Patterns Cards
    console.log('\n\n💳 COGNITIVE PATTERNS CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const patternsCards = await cardController.getCards({
      walletAddress: testWallet,
      cardTypes: ['position-sizing-psychology', 'time-of-day-patterns', 'gas-fee-personality'],
      forceRefresh: false
    });
    
    patternsCards.forEach(card => {
      console.log(`\n📈 ${card.cardType.toUpperCase()}`);
      console.log(`Status: ${card.loading ? 'Loading...' : card.error ? 'Error' : 'Success'}`);
      
      if (card.error) {
        console.log(`Error: ${card.error}`);
      } else if (card.data) {
        console.log('Data:', JSON.stringify(card.data, null, 2));
      }
    });
    
    // Test Insights Cards
    console.log('\n\n💳 INSIGHTS CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const insightsCards = await cardController.getCards({
      walletAddress: testWallet,
      cardTypes: ['conviction-collapse-detector', 'fomo-fear-cycle', 'post-rug-behavior'],
      forceRefresh: false
    });
    
    insightsCards.forEach(card => {
      console.log(`\n🔍 ${card.cardType.toUpperCase()}`);
      console.log(`Status: ${card.loading ? 'Loading...' : card.error ? 'Error' : 'Success'}`);
      
      if (card.error) {
        console.log(`Error: ${card.error}`);
      } else if (card.data) {
        console.log('Data:', JSON.stringify(card.data, null, 2));
      }
    });
    
    console.log('\n✅ Enhanced Card Controller test completed!');
    console.log('\n📊 SYSTEM HEALTH CHECK:');
    console.log(`- Pipeline Integration: ${snapshotCards.length > 0 ? '✅ Connected' : '❌ Failed'}`);
    console.log(`- Cache System: ${snapshotCards.some(c => c.staleness === 'fresh') ? '✅ Working' : '⚠️ Cold cache'}`);
    console.log(`- Card Calculations: ${snapshotCards.some(c => !c.error) ? '✅ Processing' : '❌ Failed'}`);
    console.log(`- Error Handling: ${snapshotCards.some(c => c.error) ? '⚠️ Some errors' : '✅ Clean'}`);
    
  } catch (error) {
    console.error('❌ Card Controller test failed:', error);
    console.log('\n🔧 Troubleshooting suggestions:');
    console.log('1. Check if central pipeline is running');
    console.log('2. Verify Redis connection');
    console.log('3. Ensure wallet has transaction data');
    console.log('4. Check API credentials');
  }
}

// Run the test
testEnhancedCardController().catch(console.error);