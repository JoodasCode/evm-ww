// Test wallet login recording with ES modules
import { createClient } from '@supabase/supabase-js';

async function testWalletLogin() {
  console.log('🔍 Testing wallet login recording...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';
  
  try {
    // Record wallet login
    const { data, error } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: testWallet,
        login_timestamp: new Date().toISOString(),
        session_id: `session_${Date.now()}`,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.log('❌ Error recording wallet login:', error);
    } else {
      console.log('✅ Wallet login recorded successfully!');
    }

    // Check for existing logins
    const { data: existing, error: checkError } = await supabase
      .from('wallet_logins')
      .select('*')
      .eq('wallet_address', testWallet)
      .order('login_timestamp', { ascending: false })
      .limit(5);

    if (checkError) {
      console.log('❌ Error checking wallet logins:', checkError);
    } else {
      console.log(`✅ Found ${existing.length} login records for your wallet`);
      existing.forEach(login => {
        console.log(`   Login: ${new Date(login.login_timestamp).toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWalletLogin();