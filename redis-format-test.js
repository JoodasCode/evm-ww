// Test different Redis URL formats based on documentation
import { createClient } from 'redis';

async function testRedisFormats() {
  console.log('📚 TESTING REDIS CONNECTION FORMATS');
  console.log('');

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log('❌ No Redis URL found');
    return;
  }

  console.log('Original URL format detected');
  
  // Test different connection formats based on Redis docs
  const formats = [
    // Format 1: As-is (maybe already correct)
    { name: 'Original format', config: { url: redisUrl } },
    
    // Format 2: Add redis:// prefix if missing
    { name: 'With redis:// prefix', config: { url: redisUrl.startsWith('redis') ? redisUrl : `redis://${redisUrl}` } },
    
    // Format 3: Force rediss:// for SSL
    { name: 'With rediss:// (SSL)', config: { url: redisUrl.replace(/^redis:\/\//, 'rediss://') } },
    
    // Format 4: No protocol, just connection params
    { name: 'Connection object', config: parseRedisUrl(redisUrl) },
    
    // Format 5: Handle special cloud formats
    { name: 'Cloud format', config: { url: redisUrl, socket: { tls: redisUrl.includes('rediss') || redisUrl.includes('ssl') } } }
  ];

  for (const format of formats) {
    console.log(`🔄 Testing: ${format.name}...`);
    
    try {
      const client = createClient(format.config);
      
      // Set up minimal error handling
      client.on('error', () => {}); // Silent for testing
      
      // Try to connect with 5 second timeout
      const connectPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      
      console.log('✅ SUCCESS! Connection established');
      
      // Quick test operation
      await client.set('test_key', 'test_value', { EX: 10 });
      const testValue = await client.get('test_key');
      
      if (testValue === 'test_value') {
        console.log('✅ Redis operations working perfectly!');
        console.log('');
        console.log('🎉 REDIS LIVE CACHING ACTIVATED!');
        console.log(`   Format: ${format.name}`);
        console.log('   Status: Fully operational');
        
        // Clean up test key
        await client.del('test_key');
      }
      
      await client.quit();
      return; // Success! Exit the loop
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 50)}...`);
    }
  }
  
  console.log('');
  console.log('💡 All formats tested. Redis URL might need adjustment.');
  console.log('   Common Redis URL formats:');
  console.log('   • redis://username:password@host:port');
  console.log('   • rediss://username:password@host:port (SSL)');
  console.log('   • redis://host:port');
}

function parseRedisUrl(url) {
  try {
    // Try to parse as URL and extract components
    const urlObj = new URL(url.startsWith('redis') ? url : `redis://${url}`);
    
    return {
      socket: {
        host: urlObj.hostname,
        port: parseInt(urlObj.port) || 6379,
        tls: urlObj.protocol === 'rediss:'
      },
      ...(urlObj.username && { username: urlObj.username }),
      ...(urlObj.password && { password: urlObj.password })
    };
  } catch {
    // Fallback if URL parsing fails
    return { url: url };
  }
}

testRedisFormats();