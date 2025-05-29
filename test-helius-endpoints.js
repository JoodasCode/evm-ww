// Test all the Helius endpoints you provided
async function testHeliusEndpoints() {
  console.log('🔍 TESTING ALL HELIUS ENDPOINTS WITH CURRENT KEY');
  console.log('================================================');
  
  const testWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o'; // Cented wallet
  const apiKey = process.env.HELIUS_API_KEY;
  
  const tests = [
    {
      name: 'Enhanced Transactions API',
      test: async () => {
        const response = await fetch('https://api.helius.xyz/v0/transactions?api-key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactions: ['4jzQxVTaJ4Fe4Fct9y1aaT9hmVyEjpCqE2bL8JMnuLZbzHZwaL4kZZvNEZ6bEj6fGmiAdCPjmNQHCf8v994PAgDf']
          })
        });
        return { status: response.status, data: response.ok ? await response.json() : await response.text() };
      }
    },
    {
      name: 'getAccountInfo RPC',
      test: async () => {
        const response = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getAccountInfo',
            params: [testWallet, { encoding: 'base58' }]
          })
        });
        return { status: response.status, data: response.ok ? await response.json() : await response.text() };
      }
    },
    {
      name: 'getSignaturesForAddress',
      test: async () => {
        const response = await fetch('https://mainnet.helius-rpc.com/?api-key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getSignaturesForAddress',
            params: [testWallet, { limit: 5 }]
          })
        });
        return { status: response.status, data: response.ok ? await response.json() : await response.text() };
      }
    },
    {
      name: 'Direct Transaction Endpoint',
      test: async () => {
        const response = await fetch(`https://api.helius.xyz/v0/addresses/${testWallet}/transactions?api-key=${apiKey}&limit=5`);
        return { status: response.status, data: response.ok ? await response.json() : await response.text() };
      }
    },
    {
      name: 'Webhook Create (Test)',
      test: async () => {
        const response = await fetch('https://api.helius.xyz/v0/webhooks?api-key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookURL: 'https://test.example.com/webhook',
            transactionTypes: ['SWAP'],
            accountAddresses: [testWallet],
            webhookType: 'enhanced'
          })
        });
        return { status: response.status, data: response.ok ? await response.json() : await response.text() };
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n📡 Testing ${test.name}...`);
    try {
      const result = await test.test();
      console.log(`Status: ${result.status}`);
      
      if (result.status === 200) {
        console.log('✅ SUCCESS');
        if (typeof result.data === 'object') {
          console.log('Response keys:', Object.keys(result.data));
        }
      } else if (result.status === 401) {
        console.log('❌ AUTHENTICATION FAILED');
        console.log('Error:', result.data);
      } else {
        console.log('⚠️ UNEXPECTED RESPONSE');
        console.log('Response:', result.data);
      }
    } catch (error) {
      console.log('❌ CONNECTION ERROR:', error.message);
    }
  }

  console.log('\n🎯 TESTING COMPLETE');
}

testHeliusEndpoints();