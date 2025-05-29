// Test Helius DAS API with current key
async function testHeliusDAS() {
  console.log('Testing Helius DAS API...');
  
  const testWallet = '7mRvxEdLKtDEov4uGF9cc8u9G527MiK3op6jGNMjQjoX';
  
  try {
    // Test getAssetsByOwner endpoint
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${testWallet}/transactions?api-key=${process.env.HELIUS_API_KEY}&limit=5`);
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Helius API working - retrieved', Array.isArray(data) ? data.length : 'data', 'transactions');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Helius API error:', response.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

testHeliusDAS();