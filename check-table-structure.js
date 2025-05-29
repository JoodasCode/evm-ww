// Check current table structure and update if needed
import { createClient } from '@supabase/supabase-js';

async function checkTableStructure() {
  console.log('🔍 CHECKING DATABASE TABLE STRUCTURE');
  console.log('====================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // Check wallet_behavior table structure
    console.log('📊 Checking wallet_behavior table...');
    const { data: behaviorCols, error: behaviorError } = await supabase
      .rpc('get_table_columns', { table_name: 'wallet_behavior' })
      .select();

    if (behaviorError) {
      console.log('⚠️ Cannot check behavior table structure:', behaviorError.message);
    } else {
      console.log('Current wallet_behavior columns:', behaviorCols?.map(col => col.column_name) || 'Unable to fetch');
    }

    // Check wallet_scores table structure  
    console.log('\n📈 Checking wallet_scores table...');
    const { data: scoresCols, error: scoresError } = await supabase
      .rpc('get_table_columns', { table_name: 'wallet_scores' })
      .select();

    if (scoresError) {
      console.log('⚠️ Cannot check scores table structure:', scoresError.message);
    } else {
      console.log('Current wallet_scores columns:', scoresCols?.map(col => col.column_name) || 'Unable to fetch');
    }

    // Try direct table queries to see what exists
    console.log('\n🔍 Testing direct table access...');
    
    const { data: behaviorTest, error: behaviorTestError } = await supabase
      .from('wallet_behavior')
      .select('*')
      .limit(1);
      
    if (behaviorTestError) {
      console.log('wallet_behavior error:', behaviorTestError.message);
    } else {
      console.log('wallet_behavior sample columns:', Object.keys(behaviorTest?.[0] || {}));
    }

    const { data: scoresTest, error: scoresTestError } = await supabase
      .from('wallet_scores')
      .select('*')
      .limit(1);
      
    if (scoresTestError) {
      console.log('wallet_scores error:', scoresTestError.message);
    } else {
      console.log('wallet_scores sample columns:', Object.keys(scoresTest?.[0] || {}));
    }

    return true;

  } catch (error) {
    console.error('❌ Table check failed:', error.message);
    return false;
  }
}

checkTableStructure();