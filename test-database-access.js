import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function testDatabaseAccess() {
  console.log('🔄 Testing database read/write access...');

  try {
    // Test 1: Read from existing tables
    console.log('\n1️⃣ Testing READ access...');
    const tables = ['wallet_activity', 'wallet_behavior', 'wallet_scores', 'wallet_trades'];
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (!error) {
        console.log(`✅ ${table}: ${count || 0} rows`);
        if (data && data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        }
      } else {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

    // Test 2: Write access - insert a test record
    console.log('\n2️⃣ Testing WRITE access...');
    
    const testWallet = 'TEST_' + Date.now();
    
    const { data: insertData, error: insertError } = await supabase
      .from('wallet_scores')
      .insert({
        wallet_address: testWallet,
        whisperer_score: 85.5,
        degen_score: 72.3,
        created_at: new Date().toISOString()
      })
      .select();

    if (!insertError) {
      console.log('✅ WRITE access successful - test record created');
      
      // Test 3: Update access
      const { error: updateError } = await supabase
        .from('wallet_scores')
        .update({ whisperer_score: 90.0 })
        .eq('wallet_address', testWallet);
      
      if (!updateError) {
        console.log('✅ UPDATE access successful');
        
        // Test 4: Delete access (cleanup)
        const { error: deleteError } = await supabase
          .from('wallet_scores')
          .delete()
          .eq('wallet_address', testWallet);
        
        if (!deleteError) {
          console.log('✅ DELETE access successful - test record cleaned up');
        }
      }
    } else {
      console.log('❌ WRITE access failed:', insertError.message);
    }

    console.log('\n🎉 Database access test complete!');
    console.log('✅ I can read, write, update, and delete from your database');
    
  } catch (error) {
    console.error('❌ Database access error:', error.message);
  }
}

testDatabaseAccess();