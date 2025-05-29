// Test Supabase connection and wallet login tracking
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Test basic connection
    const { data, error } = await supabase
      .from('wallet_logins')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase connection working!');

    // Test wallet login recording for your wallet
    const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';
    
    const { data: loginResult, error: loginError } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: testWallet,
        login_timestamp: new Date().toISOString(),
        session_id: `session_${Date.now()}`,
        updated_at: new Date().toISOString()
      })
      .select();

    if (loginError) {
      console.log('❌ Wallet login recording error:', loginError.message);
    } else {
      console.log('✅ Wallet login recorded successfully:', loginResult);
    }

    // Check if wallet exists in database
    const { data: walletCheck, error: checkError } = await supabase
      .from('wallet_logins')
      .select('*')
      .eq('wallet_address', testWallet);

    if (checkError) {
      console.log('❌ Wallet check error:', checkError.message);
    } else {
      console.log(`✅ Found ${walletCheck.length} login records for your wallet`);
    }

    return true;

  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    return false;
  }
}

testSupabaseConnection();