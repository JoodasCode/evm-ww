import { PostgresWalletPipeline } from './server/postgresWalletPipeline.js';
import { WhispererEngine } from './server/whispererEngine.js';

async function testSingleWallet() {
  console.log('🧠 Testing Wallet Whisperer with corrected calculations and Groq narratives');
  console.log('═════════════════════════════════════════════════════════════════════');
  
  const pipeline = new PostgresWalletPipeline();
  const whisperer = new WhispererEngine();
  
  // Test Cented wallet
  const walletAddress = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  const walletName = 'Cented';
  
  console.log(`🎯 Analyzing ${walletName}: ${walletAddress}`);
  console.log('─'.repeat(70));
  
  try {
    // Run complete analysis
    const result = await pipeline.analyzeWallet(walletAddress, walletName);
    
    if (result.success) {
      console.log('✅ Analysis completed successfully');
      console.log(`📊 Total transactions: ${result.data.totalTransactions}`);
      console.log(`💰 SOL balance: ${result.data.solBalance} SOL`);
      console.log(`🏷️ Archetype: ${result.data.archetype}`);
      console.log(`📈 Whisperer Score: ${result.data.whispererScore}/100`);
      console.log(`🎲 Degen Score: ${result.data.degenScore}/100`);
      
      console.log('\n🎯 PSYCHOLOGICAL CARDS:');
      console.log('═'.repeat(50));
      
      // Position Sizing
      console.log(`📊 Position Sizing: ${result.data.positionSizing.consistency}%`);
      console.log(`  Pattern: ${result.data.positionSizing.pattern}`);
      console.log(`  Risk Level: ${result.data.positionSizing.riskLevel}`);
      
      // Conviction Collapse  
      console.log(`🎯 Conviction Collapse: ${result.data.convictionCollapse.score}/100`);
      console.log(`  Pattern: ${result.data.convictionCollapse.pattern}`);
      console.log(`  Events: ${result.data.convictionCollapse.events}`);
      
      // Diversification
      console.log(`🔀 Diversification: ${result.data.diversification.style}`);
      console.log(`  Unique Tokens: ${result.data.diversification.uniqueTokens}`);
      console.log(`  Top 3 Concentration: ${result.data.diversification.top3Concentration}%`);
      
      // Gas Strategy
      console.log(`⛽ Gas Strategy: ${result.data.gasStrategy.pattern}`);
      console.log(`  Average Fee: ${result.data.gasStrategy.avgFee} lamports`);
      console.log(`  Urgency Score: ${result.data.gasStrategy.urgencyScore}/100`);
      
      console.log('\n🧠 PSYCHOLOGICAL NARRATIVES:');
      console.log('═'.repeat(50));
      
      if (result.data.narratives) {
        console.log(`💬 Brutal: ${result.data.narratives.brutal}`);
        console.log(`💪 Encouraging: ${result.data.narratives.encouraging}`);
        console.log(`📈 Analytical: ${result.data.narratives.analytical}`);
        console.log(`🎭 Chaotic: ${result.data.narratives.chaotic}`);
      } else {
        console.log('⚠️ Narratives not generated (using fallback)');
      }
      
      console.log('\n🚨 BEHAVIORAL FLAGS:');
      console.log('═'.repeat(50));
      
      if (result.data.contradictions?.length > 0) {
        result.data.contradictions.forEach((contradiction, i) => {
          console.log(`  ${i + 1}. ${contradiction}`);
        });
      }
      
      if (result.data.flags?.length > 0) {
        result.data.flags.forEach((flag, i) => {
          console.log(`  🚩 ${flag}`);
        });
      }
      
    } else {
      console.log('❌ Analysis failed:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testSingleWallet();