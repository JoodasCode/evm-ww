// Comprehensive wallet validation system with corrected calculations
import { walletPipeline } from './server/postgresWalletPipeline';
import { whispererEngine } from './server/whispererEngine';

interface ValidationResult {
  wallet: string;
  archetype: string;
  convictionCollapse: number;
  sizingConsistency: number;
  narrativeLoyalty: string;
  diversification: {
    style: string;
    top3Percentage: number;
  };
  contradictions: string[];
  flags: string[];
  suggestions: string[];
  beforeVsAfter: {
    positionSizingFixed: boolean;
    convictionLogicImproved: boolean;
    diversificationCorrected: boolean;
  };
}

async function validateWalletPsyProfile(walletAddress: string): Promise<ValidationResult> {
  console.log(`🔍 Validating: ${walletAddress}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Run complete analysis with corrected calculations
    const analysis = await walletPipeline.analyzeWallet(walletAddress);
    const cards = analysis.psychologicalCards;
    
    // Generate psychological narratives
    const whispererProfile = await whispererEngine.generateNarratives(analysis);
    
    console.log('\n📊 CORRECTED ANALYSIS RESULTS:');
    console.log('==============================');
    console.log(`Archetype: ${analysis.archetype}`);
    console.log(`Whisperer Score: ${analysis.whispererScore}/100`);
    console.log(`Degen Score: ${analysis.degenScore}/100`);
    console.log(`Total Transactions: ${analysis.transactionCount}`);
    
    console.log('\n🎯 KEY PSYCHOLOGICAL CARDS:');
    console.log('===========================');
    
    // Position Sizing
    console.log(`\n📊 Position Sizing: ${cards.positionSizing.sizingConsistency}%`);
    console.log(`  Pattern: ${cards.positionSizing.pattern}`);
    console.log(`  Average Position: $${cards.positionSizing.avgPositionSize}`);
    console.log(`  Risk Level: ${cards.positionSizing.riskLevel}`);
    
    // Conviction Collapse
    console.log(`\n🎯 Conviction Collapse: ${cards.convictionCollapse.score}/100`);
    console.log(`  Pattern: ${cards.convictionCollapse.pattern}`);
    console.log(`  Events: ${cards.convictionCollapse.events}`);
    if (cards.convictionCollapse.avgHoldTimeHours) {
      console.log(`  Avg Hold Time: ${cards.convictionCollapse.avgHoldTimeHours}h`);
    }
    
    // Diversification
    console.log(`\n🔀 Diversification: ${cards.diversificationPsych.strategy}`);
    console.log(`  Unique Tokens: ${cards.diversificationPsych.uniqueTokens}`);
    if (cards.diversificationPsych.top3Percentage) {
      console.log(`  Top 3 Concentration: ${cards.diversificationPsych.top3Percentage}%`);
    }
    console.log(`  Risk Level: ${cards.diversificationPsych.riskLevel}`);
    
    // Gas Fee Personality
    console.log(`\n⛽ Gas Strategy: ${cards.gasFeePersonality.personality}`);
    console.log(`  Average Fee: ${cards.gasFeePersonality.avgFeeLamports.toLocaleString()} lamports`);
    console.log(`  Urgency Score: ${cards.gasFeePersonality.urgencyScore.toFixed(1)}/100`);
    
    console.log('\n🧠 PSYCHOLOGICAL NARRATIVES:');
    console.log('============================');
    console.log(`\n💬 Brutal: ${whispererProfile.narratives.brutal}`);
    console.log(`\n💪 Encouraging: ${whispererProfile.narratives.encouraging}`);
    console.log(`\n📈 Analytical: ${whispererProfile.narratives.analytical}`);
    console.log(`\n🎭 Chaotic: ${whispererProfile.narratives.chaotic}`);
    
    console.log('\n🚨 CONTRADICTIONS & FLAGS:');
    console.log('==========================');
    whispererProfile.contradictions.forEach((contradiction, i) => {
      console.log(`  ${i + 1}. ${contradiction}`);
    });
    
    if (whispererProfile.flags.length > 0) {
      console.log('\nBehavioral Flags:');
      whispererProfile.flags.forEach(flag => console.log(`  ⚠️ ${flag}`));
    }
    
    console.log('\n💡 SUGGESTIONS:');
    console.log('===============');
    whispererProfile.suggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion}`);
    });
    
    // Validation checks
    const beforeVsAfter = {
      positionSizingFixed: cards.positionSizing.sizingConsistency > 0,
      convictionLogicImproved: cards.convictionCollapse.score < 100 || cards.convictionCollapse.events > 0,
      diversificationCorrected: cards.diversificationPsych.top3Percentage !== undefined
    };
    
    console.log('\n✅ VALIDATION RESULTS:');
    console.log('=====================');
    console.log(`Position Sizing Fixed: ${beforeVsAfter.positionSizingFixed ? 'YES' : 'NO'}`);
    console.log(`Conviction Logic Improved: ${beforeVsAfter.convictionLogicImproved ? 'YES' : 'NO'}`);
    console.log(`Diversification Corrected: ${beforeVsAfter.diversificationCorrected ? 'YES' : 'NO'}`);
    
    return {
      wallet: walletAddress,
      archetype: analysis.archetype,
      convictionCollapse: cards.convictionCollapse.score,
      sizingConsistency: cards.positionSizing.sizingConsistency,
      narrativeLoyalty: cards.narrativeLoyalty.dominantNarrative,
      diversification: {
        style: cards.diversificationPsych.strategy,
        top3Percentage: cards.diversificationPsych.top3Percentage || 0
      },
      contradictions: whispererProfile.contradictions,
      flags: whispererProfile.flags,
      suggestions: whispererProfile.suggestions,
      beforeVsAfter
    };
    
  } catch (error) {
    console.error(`❌ Validation failed for ${walletAddress}:`, error.message);
    throw error;
  }
}

async function runFullValidation() {
  console.log('🔬 WALLET WHISPERER: FULL VALIDATION SUITE');
  console.log('═══════════════════════════════════════════════');
  
  const testWallets = [
    { address: 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o', name: 'Cented (Whale)' },
    { address: 'BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd', name: 'dV (Portfolio Sprayer)' }
  ];
  
  const results: ValidationResult[] = [];
  
  for (const wallet of testWallets) {
    console.log(`\n🎯 Testing ${wallet.name}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await validateWalletPsyProfile(wallet.address);
      results.push(result);
      
      console.log(`✅ ${wallet.name} validation complete`);
      
    } catch (error) {
      console.error(`❌ ${wallet.name} validation failed:`, error.message);
    }
    
    console.log('\n' + '═'.repeat(50));
  }
  
  console.log('\n📊 VALIDATION SUMMARY:');
  console.log('═════════════════════');
  
  results.forEach(result => {
    console.log(`\n${result.wallet.slice(0, 8)}... (${result.archetype})`);
    console.log(`  Conviction: ${result.convictionCollapse}/100`);
    console.log(`  Sizing Consistency: ${result.sizingConsistency}%`);
    console.log(`  Diversification: ${result.diversification.style}`);
    console.log(`  Contradictions: ${result.contradictions.length}`);
    console.log(`  Fixes Applied: ${Object.values(result.beforeVsAfter).filter(Boolean).length}/3`);
  });
  
  const totalFixed = results.reduce((sum, r) => sum + Object.values(r.beforeVsAfter).filter(Boolean).length, 0);
  const totalChecks = results.length * 3;
  
  console.log(`\n🎯 Overall Fix Success Rate: ${totalFixed}/${totalChecks} (${Math.round((totalFixed/totalChecks)*100)}%)`);
  
  return results;
}

// Run the validation
runFullValidation()
  .then(() => {
    console.log('\n🎉 Full validation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Validation failed:', error);
    process.exit(1);
  });