// Test the corrected wallet login tracking
import { createClient } from '@supabase/supabase-js';

async function testFixedLogin() {
  console.log('🔍 Testing corrected wallet login tracking...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';
  
  try {
    const { data, error } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: testWallet,
        logged_in_at: new Date().toISOString(),
        session_id: `session_${Date.now()}`,
        user_agent: 'Wallet-Whisperer-Pipeline',
        ip_address: '127.0.0.1'
      })
      .select();

    if (error) {
      console.log('❌ Error:', error);
    } else {
      console.log('✅ Wallet login recorded successfully!');
    }

    // Check wallet logins
    const { data: logins } = await supabase
      .from('wallet_logins')
      .select('*')
      .eq('wallet_address', testWallet)
      .order('logged_in_at', { ascending: false });

    console.log(`✅ Found ${logins?.length || 0} login records for your wallet`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFixedLogin();