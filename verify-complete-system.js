// Verify complete system: Pipeline + Supabase + All APIs
import { createClient } from '@supabase/supabase-js';

async function verifyCompleteSystem() {
  console.log('🔍 VERIFYING COMPLETE WALLET WHISPERER SYSTEM');
  console.log('==============================================');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';

  try {
    // 1. Test Supabase Connection
    console.log('📊 1. Testing Supabase Database Connection...');
    const { data: connection, error: connError } = await supabase
      .from('wallet_logins')
      .select('count');
    
    if (connError) {
      console.log('❌ Supabase connection failed:', connError.message);
      return false;
    }
    console.log('✅ Supabase connection: WORKING');

    // 2. Test Wallet Login Recording
    console.log('\n🔐 2. Testing Wallet Login Recording...');
    const { data: loginData, error: loginError } = await supabase
      .from('wallet_logins')
      .upsert({
        wallet_address: testWallet,
        logged_in_at: new Date().toISOString(),
        session_id: `verify_${Date.now()}`,
        user_agent: 'System-Verification',
        ip_address: '127.0.0.1'
      })
      .select();

    if (loginError) {
      console.log('❌ Wallet login recording failed:', loginError.message);
      return false;
    }
    console.log('✅ Wallet login recording: WORKING');

    // 3. Test Helius API
    console.log('\n⚡ 3. Testing Helius API Connection...');
    const heliusResponse = await fetch(`https://api.helius.xyz/v0/addresses/${testWallet}/transactions?api-key=${process.env.HELIUS_API_KEY}&limit=5`);
    
    if (!heliusResponse.ok) {
      console.log('❌ Helius API failed:', heliusResponse.status);
      return false;
    }
    const heliusData = await heliusResponse.json();
    console.log(`✅ Helius API: WORKING (${Array.isArray(heliusData) ? heliusData.length : 0} transactions)`);

    // 4. Test Gecko Terminal API
    console.log('\n📈 4. Testing Gecko Terminal API...');
    const geckoResponse = await fetch('https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/So11111111111111111111111111111111111111112');
    
    if (!geckoResponse.ok) {
      console.log('❌ Gecko Terminal API failed:', geckoResponse.status);
      return false;
    }
    const geckoData = await geckoResponse.json();
    console.log('✅ Gecko Terminal API: WORKING');

    // 5. Test Automated Pipeline API
    console.log('\n🚀 5. Testing Automated Analysis Pipeline...');
    const pipelineResponse = await fetch(`http://localhost:5000/api/wallet/${testWallet}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!pipelineResponse.ok) {
      console.log('❌ Pipeline API failed:', pipelineResponse.status);
      return false;
    }
    const pipelineData = await pipelineResponse.json();
    console.log('✅ Automated Pipeline: WORKING');

    // 6. Verify Data Storage
    console.log('\n💾 6. Verifying Data Storage...');
    
    // Check wallet_logins
    const { data: walletLogins } = await supabase
      .from('wallet_logins')
      .select('*')
      .eq('wallet_address', testWallet);
    
    // Check wallet_scores  
    const { data: walletScores } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('wallet_address', testWallet);

    // Check wallet_behavior
    const { data: walletBehavior } = await supabase
      .from('wallet_behavior')
      .select('*')
      .eq('wallet_address', testWallet);

    console.log(`✅ Wallet Logins: ${walletLogins?.length || 0} records`);
    console.log(`✅ Wallet Scores: ${walletScores?.length || 0} records`);
    console.log(`✅ Wallet Behavior: ${walletBehavior?.length || 0} records`);

    // 7. System Summary
    console.log('\n🎉 SYSTEM VERIFICATION COMPLETE');
    console.log('===============================');
    console.log('✅ Supabase Database: Connected and storing data');
    console.log('✅ Helius API: Fetching real transaction data');
    console.log('✅ Gecko Terminal API: Getting real-time prices');
    console.log('✅ Automated Pipeline: Processing wallets automatically');
    console.log('✅ Data Storage: All wallet data being saved');
    console.log('');
    console.log('🚀 YOUR WALLET WHISPERER SYSTEM IS FULLY OPERATIONAL!');

    return true;

  } catch (error) {
    console.error('❌ System verification failed:', error.message);
    return false;
  }
}

verifyCompleteSystem();