// Test different Helius API endpoints to find the correct one for transactions
const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

async function testHeliusEndpoints() {
  console.log('🔍 Testing different Helius API endpoints...');
  
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.error('❌ Helius API key missing');
    return;
  }

  // Test different endpoint patterns based on Helius docs
  const endpoints = [
    // getSignaturesForAddress endpoint
    {
      name: 'getSignaturesForAddress',
      url: `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions?api-key=${apiKey}`,
      method: 'GET'
    },
    // RPC endpoint for getSignaturesForAddress
    {
      name: 'RPC getSignaturesForAddress',
      url: `https://rpc.helius.xyz/?api-key=${apiKey}`,
      method: 'POST',
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [WALLET_ADDRESS, { limit: 10 }]
      }
    },
    // Enhanced transactions endpoint
    {
      name: 'Enhanced Transactions',
      url: `https://api.helius.xyz/v0/transactions?api-key=${apiKey}`,
      method: 'POST',
      body: {
        transactions: [WALLET_ADDRESS]
      }
    },
    // Parsed transactions endpoint
    {
      name: 'Parsed Transactions',
      url: `https://api.helius.xyz/v0/transactions/parsed?api-key=${apiKey}`,
      method: 'POST',
      body: {
        transactions: []
      }
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🔄 Testing ${endpoint.name}...`);
    
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(endpoint.url, options);
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Response type:`, typeof data);
        console.log(`Response keys:`, Object.keys(data));
        
        if (Array.isArray(data)) {
          console.log(`Array length: ${data.length}`);
          if (data.length > 0) {
            console.log(`First item keys:`, Object.keys(data[0]));
          }
        }
        
        // If this is the RPC response, check for result
        if (data.result) {
          console.log(`RPC result type:`, typeof data.result);
          if (Array.isArray(data.result)) {
            console.log(`RPC result length: ${data.result.length}`);
          }
        }
        
        return { endpoint: endpoint.name, data };
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testHeliusEndpoints();