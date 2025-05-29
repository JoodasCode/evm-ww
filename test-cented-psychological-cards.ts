// Test Cented wallet against all psychological analysis cards
import { walletPipeline } from './server/postgresWalletPipeline';

async function testCentedPsychologicalCards() {
  console.log('🧠 Testing Cented Wallet Against All Psychological Cards');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const centedWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  
  try {
    console.log(`🎯 Analyzing Cented: ${centedWallet}`);
    console.log('⏳ Running complete psychological analysis...\n');
    
    const result = await walletPipeline.analyzeWallet(centedWallet);
    const cards = result.psychologicalCards;
    
    console.log('💳 TIER 1: KILLER PSYCHOLOGICAL CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🎯 1. CONVICTION COLLAPSE DETECTOR');
    console.log(`Score: ${cards.convictionCollapse.score}/100`);
    console.log(`Pattern: ${cards.convictionCollapse.pattern}`);
    console.log(`Events: ${cards.convictionCollapse.events}`);
    console.log(`Insight: ${cards.convictionCollapse.insight}`);
    
    console.log('\n🛡️ 2. POST-RUG BEHAVIOR TRACKER');
    console.log(`Score: ${cards.postRugBehavior.score}/100`);
    console.log(`Recovery Phase: ${cards.postRugBehavior.recoveryPhase}`);
    console.log(`Rug Events: ${cards.postRugBehavior.rugEvents}`);
    console.log(`Position Size Change: ${cards.postRugBehavior.positionSizeChange}%`);
    console.log(`Insight: ${cards.postRugBehavior.insight}`);
    
    console.log('\n🎭 3. FALSE CONVICTION DETECTOR');
    console.log(`Score: ${cards.falseConviction.score}/100`);
    console.log(`Pattern: ${cards.falseConviction.pattern}`);
    console.log(`False Conviction Events: ${cards.falseConviction.falseConvictionEvents}`);
    console.log(`Insight: ${cards.falseConviction.insight}`);
    
    console.log('\n\n💳 TIER 2: COGNITIVE ANALYSIS CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n⛽ 4. GAS FEE PERSONALITY');
    console.log(`Personality: ${cards.gasFeePersonality.personality}`);
    console.log(`Average Fee: ${cards.gasFeePersonality.avgFeeLamports.toLocaleString()} lamports`);
    console.log(`Average Fee SOL: ${cards.gasFeePersonality.avgFeeSol} SOL`);
    console.log(`Average Fee USD: $${cards.gasFeePersonality.avgFeeUsd}`);
    console.log(`Urgency Score: ${cards.gasFeePersonality.urgencyScore}/100`);
    console.log(`Insight: ${cards.gasFeePersonality.insight}`);
    
    console.log('\n📊 5. POSITION SIZING PSYCHOLOGY');
    console.log(`Pattern: ${cards.positionSizing.pattern}`);
    console.log(`Risk Level: ${cards.positionSizing.riskLevel}`);
    console.log(`Sizing Consistency: ${cards.positionSizing.sizingConsistency}/100`);
    console.log(`Average Position Size: ${cards.positionSizing.avgPositionSize.toLocaleString()}`);
    console.log(`Insight: ${cards.positionSizing.insight}`);
    
    console.log('\n😱 6. FOMO VS FEAR CYCLE TRACKER');
    console.log(`Current State: ${cards.fomoFearCycle.currentState}`);
    console.log(`FOMO Score: ${cards.fomoFearCycle.fomoScore}/100`);
    console.log(`Fear Score: ${cards.fomoFearCycle.fearScore}/100`);
    console.log(`Cycle Trend: ${cards.fomoFearCycle.cycleTrend}`);
    console.log(`Insight: ${cards.fomoFearCycle.insight}`);
    
    console.log('\n📖 7. NARRATIVE LOYALTY ANALYSIS');
    console.log(`Dominant Narrative: ${cards.narrativeLoyalty.dominantNarrative}`);
    console.log(`Loyalty Score: ${cards.narrativeLoyalty.loyaltyScore}/100`);
    console.log(`Diversification: ${cards.narrativeLoyalty.diversification} narratives`);
    console.log(`Narrative Breakdown:`, cards.narrativeLoyalty.narrativeBreakdown);
    console.log(`Insight: ${cards.narrativeLoyalty.insight}`);
    
    console.log('\n\n💳 TIER 3: BEHAVIORAL PATTERN CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n⏰ 8. TIME-OF-DAY TRADING PATTERNS');
    console.log(`Best Trading Hour: ${cards.timePatterns.bestTradingHour}:00`);
    console.log(`Worst Trading Hour: ${cards.timePatterns.worstTradingHour}:00`);
    console.log(`Most Active Hour: ${cards.timePatterns.mostActiveHour}:00`);
    console.log(`Optimal Time Window: ${cards.timePatterns.optimalTimeWindow}`);
    console.log(`Insight: ${cards.timePatterns.insight}`);
    
    console.log('\n🔀 9. PORTFOLIO DIVERSIFICATION PSYCHOLOGY');
    console.log(`Strategy: ${cards.diversificationPsych.strategy}`);
    console.log(`Risk Level: ${cards.diversificationPsych.riskLevel}`);
    console.log(`Unique Tokens: ${cards.diversificationPsych.uniqueTokens}`);
    console.log(`Diversification Score: ${cards.diversificationPsych.diversificationScore}/100`);
    console.log(`Insight: ${cards.diversificationPsych.insight}`);
    
    console.log('\n👥 10. SOCIAL TRADING INFLUENCE SCORE');
    console.log(`Influence Level: ${cards.socialInfluence.influenceLevel}`);
    console.log(`Influence Score: ${cards.socialInfluence.influenceScore}/100`);
    console.log(`Rapid Decisions: ${cards.socialInfluence.rapidDecisions}`);
    console.log(`Independent Trades: ${cards.socialInfluence.independentTrades}`);
    console.log(`Insight: ${cards.socialInfluence.insight}`);
    
    console.log('\n\n💳 TIER 4: ADVANCED PSYCHOLOGICAL CARDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n💢 11. STRESS RESPONSE TRADING PATTERNS');
    console.log(`Stress Level: ${cards.stressResponse.stressLevel}`);
    console.log(`Stress Score: ${cards.stressResponse.stressScore}/100`);
    console.log(`Stress Triggers: ${cards.stressResponse.stressTriggers}`);
    console.log(`Insight: ${cards.stressResponse.insight}`);
    
    console.log('\n🏆 12. SUCCESS BIAS DETECTOR');
    console.log(`Overconfidence Risk: ${cards.successBias.overconfidenceRisk}`);
    console.log(`Bias Score: ${cards.successBias.biasScore}/100`);
    console.log(`Recent Wins: ${cards.successBias.recentWins}`);
    console.log(`Insight: ${cards.successBias.insight}`);
    
    console.log('\n💪 13. LOSS RECOVERY PSYCHOLOGY');
    console.log(`Recovery Phase: ${cards.lossRecovery.recoveryPhase}`);
    console.log(`Recovery Score: ${cards.lossRecovery.recoveryScore}/100`);
    console.log(`Insight: ${cards.lossRecovery.insight}`);
    
    console.log('\n\n🎯 CENTED\'S PSYCHOLOGICAL PROFILE SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Archetype: ${result.archetype} (${Math.round(result.confidence * 100)}% confidence)`);
    console.log(`Whisperer Score: ${result.whispererScore}/100`);
    console.log(`Degen Score: ${result.degenScore}/100`);
    console.log(`Portfolio Value: $${result.portfolioValue.toLocaleString()}`);
    console.log(`Trading Frequency: ${result.tradingFrequency.toFixed(2)} per day`);
    console.log(`Total Transactions Analyzed: ${result.transactionCount}`);
    
    console.log('\n🧠 KEY PSYCHOLOGICAL INSIGHTS:');
    console.log(`• ${cards.gasFeePersonality.personality} with ${cards.gasFeePersonality.avgFeeLamports.toLocaleString()} lamport average fees`);
    console.log(`• ${cards.convictionCollapse.pattern} conviction patterns`);
    console.log(`• ${cards.postRugBehavior.recoveryPhase} post-loss recovery style`);
    console.log(`• ${cards.diversificationPsych.strategy} portfolio approach`);
    console.log(`• ${cards.fomoFearCycle.currentState} emotional state`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Psychological analysis failed:', error.message);
    throw error;
  }
}

// Run the comprehensive test
testCentedPsychologicalCards()
  .then(() => {
    console.log('\n🎉 Complete psychological analysis completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Analysis failed:', error);
    process.exit(1);
  });