// Test Label Engine with Cented's whale data
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function generateWalletLabels() {
  console.log('🏷️  ACTIVATING LABEL ENGINE FOR CENTED WHALE');
  console.log('');

  try {
    // Get Cented's stored behavioral data
    const { data: behaviorData } = await supabase
      .from('wallet_behavior')
      .select('*')
      .eq('wallet_address', WALLET_ADDRESS)
      .single();

    const { data: scoresData } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('address', WALLET_ADDRESS)
      .single();

    if (!behaviorData || !scoresData) {
      console.log('❌ Need Cented data first - run whale analysis');
      return;
    }

    console.log('📊 Analyzing Cented behavioral patterns...');
    
    // Generate psychological archetype based on scores
    const archetype = generateArchetype(scoresData, behaviorData);
    const emotionalStates = generateEmotionalStates(behaviorData);
    const behavioralTraits = generateBehavioralTraits(behaviorData);

    // Create comprehensive label profile
    const labelProfile = {
      wallet_address: WALLET_ADDRESS,
      archetype: archetype.name,
      archetype_confidence: archetype.confidence,
      emotional_states: emotionalStates,
      behavioral_traits: behavioralTraits,
      risk_classification: classifyRiskLevel(behaviorData.risk_score),
      trading_style: classifyTradingStyle(behaviorData),
      psychological_profile: generatePsychProfile(scoresData, behaviorData),
      generated_at: new Date().toISOString()
    };

    console.log('🧠 CENTED WHALE LABEL PROFILE:');
    console.log(`   Archetype: ${labelProfile.archetype} (${labelProfile.archetype_confidence}% confidence)`);
    console.log(`   Trading Style: ${labelProfile.trading_style}`);
    console.log(`   Risk Classification: ${labelProfile.risk_classification}`);
    console.log(`   Emotional States: ${labelProfile.emotional_states.join(', ')}`);
    console.log(`   Behavioral Traits: ${labelProfile.behavioral_traits.join(', ')}`);
    console.log(`   Psychological Profile: ${labelProfile.psychological_profile}`);

    // Store label profile
    const { data: labelData, error: labelError } = await supabase
      .from('wallet_labels')
      .upsert(labelProfile, { onConflict: 'wallet_address' });

    if (labelError) {
      console.log('⚠️  Creating wallet_labels table...');
      // Table might not exist, create it
      await createLabelsTable();
      
      // Try again
      const { error: retryError } = await supabase
        .from('wallet_labels')
        .upsert(labelProfile, { onConflict: 'wallet_address' });
        
      if (!retryError) {
        console.log('✅ Label profile stored successfully');
      }
    } else {
      console.log('✅ Label profile stored successfully');
    }

    // Generate insights based on labels
    console.log('');
    console.log('💡 LABEL-BASED INSIGHTS:');
    generateInsights(labelProfile);

  } catch (error) {
    console.error('❌ Label Engine error:', error.message);
  }
}

function generateArchetype(scores, behavior) {
  const whispererScore = scores.whisperer_score;
  const riskScore = behavior.risk_score;
  const patienceScore = behavior.patience_score;
  const convictionScore = behavior.conviction_score;

  // Strategic Whale archetype
  if (whispererScore > 85 && patienceScore > 80 && convictionScore > 85) {
    return { name: 'Strategic Whale', confidence: 95 };
  }
  
  // Diamond Hands archetype
  if (patienceScore > 90 && convictionScore > 80) {
    return { name: 'Diamond Hands', confidence: 88 };
  }
  
  // Alpha Trader archetype
  if (whispererScore > 75 && riskScore > 60) {
    return { name: 'Alpha Trader', confidence: 82 };
  }
  
  // Smart Money archetype
  if (whispererScore > 70 && behavior.fomo_score < 50) {
    return { name: 'Smart Money', confidence: 78 };
  }
  
  return { name: 'Calculated Trader', confidence: 70 };
}

function generateEmotionalStates(behavior) {
  const states = [];
  
  if (behavior.fomo_score < 40) states.push('Disciplined');
  if (behavior.patience_score > 80) states.push('Patient');
  if (behavior.conviction_score > 85) states.push('Confident');
  if (behavior.risk_score > 70 && behavior.risk_score < 85) states.push('Strategic');
  
  return states.length > 0 ? states : ['Neutral'];
}

function generateBehavioralTraits(behavior) {
  const traits = [];
  
  if (behavior.patience_score > 85) traits.push('Long-term Holder');
  if (behavior.conviction_score > 80) traits.push('High Conviction');
  if (behavior.fomo_score < 40) traits.push('FOMO Resistant');
  if (behavior.risk_score > 65) traits.push('Risk Calculated');
  if (behavior.trading_frequency < 5) traits.push('Low Frequency');
  
  return traits.length > 0 ? traits : ['Balanced'];
}

function classifyRiskLevel(riskScore) {
  if (riskScore < 30) return 'Conservative';
  if (riskScore < 60) return 'Moderate';
  if (riskScore < 80) return 'Strategic Risk';
  return 'High Risk';
}

function classifyTradingStyle(behavior) {
  const freq = behavior.trading_frequency || 0;
  const patience = behavior.patience_score || 0;
  
  if (freq < 3 && patience > 80) return 'Accumulator';
  if (freq > 10) return 'Active Trader';
  if (patience > 70) return 'Position Trader';
  return 'Swing Trader';
}

function generatePsychProfile(scores, behavior) {
  const whisperer = scores.whisperer_score;
  const patience = behavior.patience_score;
  const conviction = behavior.conviction_score;
  
  if (whisperer > 90 && patience > 85 && conviction > 85) {
    return 'Elite psychological profile with exceptional emotional control and strategic thinking';
  }
  
  return 'Strong psychological foundation with disciplined trading approach';
}

function generateInsights(profile) {
  console.log(`   🎯 ${profile.archetype} archetype suggests sophisticated market understanding`);
  console.log(`   💪 ${profile.risk_classification} approach indicates measured decision-making`);
  console.log(`   🧘 Emotional states (${profile.emotional_states.join(', ')}) show strong psychological control`);
  console.log(`   ⚡ ${profile.trading_style} style optimized for current market conditions`);
}

async function createLabelsTable() {
  // This would typically be done via migration, but for demo we'll note it
  console.log('📋 Note: wallet_labels table structure needed in Supabase');
  console.log('   Columns: wallet_address, archetype, archetype_confidence, emotional_states, behavioral_traits, etc.');
}

generateWalletLabels();