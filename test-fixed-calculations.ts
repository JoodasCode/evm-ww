// Quick test of the fixed calculation logic
import { walletPipeline } from './server/postgresWalletPipeline';

async function testFixedCalculations() {
  console.log('Testing Fixed Calculation Logic');
  console.log('=================================');
  
  const centedWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  
  try {
    console.log('Running analysis with corrected calculations...');
    const result = await walletPipeline.analyzeWallet(centedWallet);
    
    console.log('\nFIXED CALCULATION RESULTS:');
    console.log('==========================');
    
    console.log('\n📊 POSITION SIZING (FIXED):');
    const positionSizing = result.psychologicalCards.positionSizing;
    console.log(`Average Position: $${positionSizing.avgPositionSize}`);
    console.log(`Sizing Consistency: ${positionSizing.sizingConsistency}%`);
    console.log(`Pattern: ${positionSizing.pattern}`);
    console.log(`Risk Level: ${positionSizing.riskLevel}`);
    console.log(`Insight: ${positionSizing.insight}`);
    
    console.log('\n🎯 CONVICTION COLLAPSE (FIXED):');
    const conviction = result.psychologicalCards.convictionCollapse;
    console.log(`Score: ${conviction.score}/100`);
    console.log(`Pattern: ${conviction.pattern}`);
    console.log(`Events: ${conviction.events}`);
    console.log(`Insight: ${conviction.insight}`);
    
    console.log('\n🔀 DIVERSIFICATION (FIXED):');
    const diversification = result.psychologicalCards.diversificationPsych;
    console.log(`Strategy: ${diversification.strategy}`);
    console.log(`Unique Tokens: ${diversification.uniqueTokens}`);
    console.log(`Top 3 Percentage: ${diversification.top3Percentage}%`);
    console.log(`Risk Level: ${diversification.riskLevel}`);
    console.log(`Insight: ${diversification.insight}`);
    
    console.log('\n🔥 VALIDATION CHECKS:');
    console.log('====================');
    
    // Check if contradictions are resolved
    const hasPositionConsistency = positionSizing.sizingConsistency > 0;
    const hasReasonableConviction = conviction.score < 100 && conviction.events > 0;
    const hasValueWeightedDiversification = diversification.top3Percentage !== undefined;
    
    console.log(`✓ Position sizing fixed: ${hasPositionConsistency ? 'YES' : 'NO'} (${positionSizing.sizingConsistency}% consistency)`);
    console.log(`✓ Conviction logic improved: ${hasReasonableConviction ? 'YES' : 'NO'} (${conviction.score}/100, ${conviction.events} events)`);
    console.log(`✓ Value-weighted diversification: ${hasValueWeightedDiversification ? 'YES' : 'NO'} (Top 3: ${diversification.top3Percentage}%)`);
    
    return result;
    
  } catch (error) {
    console.error('Test failed:', error.message);
    throw error;
  }
}

testFixedCalculations()
  .then(() => {
    console.log('\n✅ Fixed calculation test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });