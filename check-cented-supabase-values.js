// Check Cented's data in Supabase and identify zero values
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkCentedValues() {
  console.log('🔍 CHECKING CENTED DATA IN SUPABASE FOR ZERO VALUES');
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // Check all tables for Cented's data
    console.log('📊 Checking wallet_scores table...');
    const { data: scoresData, error: scoresError } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('address', WALLET_ADDRESS);

    if (scoresError) {
      console.log('❌ Error reading wallet_scores:', scoresError.message);
    } else if (scoresData && scoresData.length > 0) {
      const scores = scoresData[0];
      console.log('✅ wallet_scores data found:');
      
      Object.keys(scores).forEach(key => {
        const value = scores[key];
        if (value === 0 || value === null) {
          console.log(`   ⚠️  ${key}: ${value} (ZERO/NULL VALUE)`);
        } else {
          console.log(`   ✅ ${key}: ${value}`);
        }
      });
    } else {
      console.log('❌ No data found in wallet_scores');
    }

    console.log('');
    console.log('🧠 Checking wallet_behavior table...');
    const { data: behaviorData, error: behaviorError } = await supabase
      .from('wallet_behavior')
      .select('*')
      .eq('wallet_address', WALLET_ADDRESS);

    if (behaviorError) {
      console.log('❌ Error reading wallet_behavior:', behaviorError.message);
    } else if (behaviorData && behaviorData.length > 0) {
      const behavior = behaviorData[0];
      console.log('✅ wallet_behavior data found:');
      
      Object.keys(behavior).forEach(key => {
        const value = behavior[key];
        if (value === 0 || value === null) {
          console.log(`   ⚠️  ${key}: ${value} (ZERO/NULL VALUE)`);
        } else {
          console.log(`   ✅ ${key}: ${value}`);
        }
      });
    } else {
      console.log('❌ No data found in wallet_behavior');
    }

    console.log('');
    console.log('📈 Checking wallet_activity table...');
    const { data: activityData, error: activityError } = await supabase
      .from('wallet_activity')
      .select('*')
      .eq('wallet_address', WALLET_ADDRESS);

    if (activityError) {
      console.log('❌ Error reading wallet_activity:', activityError.message);
    } else if (activityData && activityData.length > 0) {
      console.log(`✅ wallet_activity data found (${activityData.length} records):`);
      
      activityData.forEach((activity, index) => {
        console.log(`   Record ${index + 1} (${activity.time_range}):`);
        Object.keys(activity).forEach(key => {
          const value = activity[key];
          if (value === 0 || value === null) {
            console.log(`     ⚠️  ${key}: ${value} (ZERO/NULL VALUE)`);
          } else if (typeof value === 'object') {
            console.log(`     📊 ${key}: [Object with ${Object.keys(value).length} properties]`);
          } else {
            console.log(`     ✅ ${key}: ${value}`);
          }
        });
      });
    } else {
      console.log('❌ No data found in wallet_activity');
    }

    // Analyze why values might be zero
    console.log('');
    console.log('🔍 ANALYZING ZERO VALUES...');
    
    if (behaviorData && behaviorData.length > 0) {
      const behavior = behaviorData[0];
      
      // Check for missing avg_transaction_value
      if (!behavior.avg_transaction_value || behavior.avg_transaction_value === 0) {
        console.log('   ❓ avg_transaction_value is missing/zero');
        console.log('     Reason: Column might not exist in schema or calculation failed');
      }
      
      // Check trading_frequency
      if (!behavior.trading_frequency || behavior.trading_frequency === 0) {
        console.log('   ❓ trading_frequency is zero');
        console.log('     Reason: Either no transactions found or calculation error');
      }
      
      // Check for timing_score (if it exists)
      if (behavior.timing_score === 0) {
        console.log('   ❓ timing_score is zero');
        console.log('     Reason: Default value or calculation not implemented');
      }
    }

    // Suggest fixes
    console.log('');
    console.log('💡 SUGGESTED FIXES:');
    console.log('   1. Check if schema has all required columns');
    console.log('   2. Verify calculation logic for zero values');
    console.log('   3. Update data with correct calculations');
    console.log('   4. Add missing fields if schema is incomplete');

  } catch (error) {
    console.error('❌ Error checking Cented data:', error.message);
  }
}

checkCentedValues();