// Test script to verify all API connections
import { createClient } from '@supabase/supabase-js';

// Test Supabase connection
async function testSupabase() {
  console.log('🔄 Testing Supabase connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by trying to fetch from a simple query
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is ok for now
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

// Test CoinGecko API
async function testCoinGecko() {
  console.log('🔄 Testing CoinGecko API...');
  
  const apiKey = process.env.COINGECKO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ CoinGecko API key missing');
    return false;
  }
  
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/ping', {
      headers: {
        'x-cg-demo-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error('❌ CoinGecko API failed:', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ CoinGecko API successful:', data);
    return true;
  } catch (error) {
    console.error('❌ CoinGecko API error:', error.message);
    return false;
  }
}

// Test Helius API
async function testHelius() {
  console.log('🔄 Testing Helius API...');
  
  const apiKey = process.env.HELIUS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Helius API key missing');
    return false;
  }
  
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/addresses?api-key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addresses: ['11111111111111111111111111111111'] // System program address for testing
      })
    });
    
    if (!response.ok) {
      console.error('❌ Helius API failed:', response.status, response.statusText);
      return false;
    }
    
    console.log('✅ Helius API successful');
    return true;
  } catch (error) {
    console.error('❌ Helius API error:', error.message);
    return false;
  }
}

// Test Moralis API
async function testMoralis() {
  console.log('🔄 Testing Moralis API...');
  
  const apiKey = process.env.MORALIS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Moralis API key missing');
    return false;
  }
  
  try {
    const response = await fetch('https://solana-gateway.moralis.io/account/mainnet/11111111111111111111111111111111/balance', {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error('❌ Moralis API failed:', response.status, response.statusText);
      return false;
    }
    
    console.log('✅ Moralis API successful');
    return true;
  } catch (error) {
    console.error('❌ Moralis API error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API connection tests...\n');
  
  const results = {
    supabase: await testSupabase(),
    coingecko: await testCoinGecko(),
    helius: await testHelius(),
    moralis: await testMoralis()
  };
  
  console.log('\n📊 Test Results:');
  Object.entries(results).forEach(([service, success]) => {
    console.log(`${success ? '✅' : '❌'} ${service.toUpperCase()}: ${success ? 'Connected' : 'Failed'}`);
  });
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed - check the logs above'}`);
  
  return results;
}

// Export for use in other files
export { testSupabase, testCoinGecko, testHelius, testMoralis, runAllTests };

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}