// Check actual table structure
import { createClient } from '@supabase/supabase-js';

async function checkTableStructure() {
  console.log('🔍 Checking wallet_logins table structure...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // Check what's actually in the table
    const { data, error } = await supabase
      .from('wallet_logins')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error);
    } else {
      console.log('✅ Table exists! Sample data structure:');
      if (data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
      } else {
        console.log('Table is empty, checking schema...');
      }
    }

    // Test basic insert to see what columns work
    const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';
    
    const { data: insertData, error: insertError } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: testWallet,
        updated_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.log('❌ Insert error:', insertError);
    } else {
      console.log('✅ Successfully recorded wallet login!');
      console.log('Data stored:', insertData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

checkTableStructure();