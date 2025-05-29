// Check if Cented's data was stored in Supabase
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function checkCentedData() {
  console.log('🔍 Checking Supabase for Cented wallet data...');
  console.log(`Looking for: ${WALLET_ADDRESS}`);
  console.log('');

  try {
    // Check wallet_scores table
    console.log('📊 Checking wallet_scores table...');
    const { data: scores, error: scoresError } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('address', WALLET_ADDRESS);

    if (scoresError) {
      console.log('❌ Error querying wallet_scores:', scoresError.message);
    } else if (scores && scores.length > 0) {
      console.log('✅ Found in wallet_scores:');
      scores.forEach(score => {
        console.log(`   Whisperer Score: ${score.whisperer_score}`);
        console.log(`   Degen Score: ${score.degen_score}`);
        console.log(`   Mood: ${score.current_mood}`);
        console.log(`   Updated: ${score.updated_at}`);
      });
    } else {
      console.log('❌ No data found in wallet_scores');
    }
    console.log('');

    // Check wallet_behavior table
    console.log('🧠 Checking wallet_behavior table...');
    const { data: behavior, error: behaviorError } = await supabase
      .from('wallet_behavior')
      .select('*')
      .eq('wallet_address', WALLET_ADDRESS);

    if (behaviorError) {
      console.log('❌ Error querying wallet_behavior:', behaviorError.message);
    } else if (behavior && behavior.length > 0) {
      console.log('✅ Found in wallet_behavior:');
      behavior.forEach(b => {
        console.log(`   Risk Score: ${b.risk_score}`);
        console.log(`   FOMO Score: ${b.fomo_score}`);
        console.log(`   Patience Score: ${b.patience_score}`);
        console.log(`   Conviction Score: ${b.conviction_score}`);
        console.log(`   Updated: ${b.updated_at}`);
      });
    } else {
      console.log('❌ No data found in wallet_behavior');
    }
    console.log('');

    // Check wallet_activity table
    console.log('📈 Checking wallet_activity table...');
    const { data: activity, error: activityError } = await supabase
      .from('wallet_activity')
      .select('*')
      .eq('wallet_address', WALLET_ADDRESS);

    if (activityError) {
      console.log('❌ Error querying wallet_activity:', activityError.message);
    } else if (activity && activity.length > 0) {
      console.log('✅ Found in wallet_activity:');
      activity.forEach(a => {
        console.log(`   Time Range: ${a.time_range}`);
        console.log(`   Activity Data:`, JSON.stringify(a.activity_data, null, 2));
        console.log(`   Updated: ${a.updated_at}`);
      });
    } else {
      console.log('❌ No data found in wallet_activity');
    }
    console.log('');

    // Check all tables for any wallet data
    console.log('🔍 Searching all tables for any wallet entries...');
    
    const tables = ['wallet_scores', 'wallet_behavior', 'wallet_activity', 'wallet_trades'];
    
    for (const table of tables) {
      try {
        const { data, count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(5);

        if (error) {
          console.log(`❌ Error checking ${table}:`, error.message);
        } else {
          console.log(`📋 ${table}: ${count || 0} total rows`);
          if (data && data.length > 0) {
            console.log(`   Sample entry:`, Object.keys(data[0]));
            // Check if any entries match our wallet
            const match = data.find(row => 
              row.address === WALLET_ADDRESS || 
              row.wallet_address === WALLET_ADDRESS
            );
            if (match) {
              console.log(`   ✅ Found Cented data in ${table}!`);
            }
          }
        }
      } catch (err) {
        console.log(`⚠️ Could not check ${table}`);
      }
    }

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkCentedData();