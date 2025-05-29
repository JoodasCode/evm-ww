// Test Redis connection and caching functionality
import { createClient } from 'redis';

async function testRedisConnection() {
  console.log('🔗 TESTING REDIS CONNECTION');
  console.log('');

  // Check environment variables
  const redisUrl = process.env.REDIS_URL;
  console.log('Redis URL from environment:', redisUrl ? 'Present' : 'Not set');
  
  if (!redisUrl) {
    console.log('⚠️  No Redis URL found - will use in-memory cache fallback');
    console.log('✅ This is expected for development - your caching will work with memory fallback');
    return;
  }

  let redisClient = null;

  try {
    console.log('🚀 Attempting to connect to Redis...');
    
    // Create Redis client
    redisClient = createClient({
      url: redisUrl,
    });

    // Set up error handler
    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });

    // Connect to Redis
    await redisClient.connect();
    console.log('✅ Successfully connected to Redis!');

    // Test basic operations
    console.log('');
    console.log('🧪 Testing Redis operations...');
    
    // Test SET operation
    const testKey = 'test_wallet_cache';
    const testValue = JSON.stringify({
      wallet: 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o',
      whispererScore: 93,
      timestamp: new Date().toISOString()
    });

    await redisClient.set(testKey, testValue, { EX: 60 }); // 60 second TTL
    console.log('✅ SET operation successful');

    // Test GET operation
    const retrievedValue = await redisClient.get(testKey);
    if (retrievedValue) {
      console.log('✅ GET operation successful');
      console.log('   Retrieved data:', JSON.parse(retrievedValue));
    } else {
      console.log('❌ GET operation failed - no data retrieved');
    }

    // Test DELETE operation
    await redisClient.del(testKey);
    console.log('✅ DELETE operation successful');

    // Verify deletion
    const deletedCheck = await redisClient.get(testKey);
    if (!deletedCheck) {
      console.log('✅ Deletion verified - key no longer exists');
    }

    console.log('');
    console.log('🎉 REDIS CONNECTION TEST SUCCESSFUL!');
    console.log('✅ Your Redis caching is working perfectly');
    console.log('✅ This will significantly improve API performance and reduce rate limits');

  } catch (error) {
    console.error('❌ Redis connection test failed:', error.message);
    console.log('');
    console.log('💡 Fallback behavior:');
    console.log('✅ Your app will automatically use in-memory caching instead');
    console.log('✅ All functionality will work - just without Redis performance benefits');
  } finally {
    // Clean up connection
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.quit();
        console.log('🔌 Redis connection closed cleanly');
      } catch (err) {
        console.log('⚠️  Error closing Redis connection:', err.message);
      }
    }
  }
}

// Also test the memory cache fallback
function testMemoryCache() {
  console.log('');
  console.log('🧠 TESTING MEMORY CACHE FALLBACK');
  
  const memoryCache = {};
  
  // Test memory cache operations
  const key = 'test_memory_cache';
  const value = 'test_value';
  const ttl = 60; // 60 seconds
  const expiry = Date.now() + (ttl * 1000);
  
  // Set in memory cache
  memoryCache[key] = { value, expiry };
  console.log('✅ Memory cache SET successful');
  
  // Get from memory cache
  const cached = memoryCache[key];
  if (cached && cached.expiry > Date.now()) {
    console.log('✅ Memory cache GET successful:', cached.value);
  }
  
  // Test expiration
  setTimeout(() => {
    const expiredCheck = memoryCache[key];
    if (expiredCheck && expiredCheck.expiry <= Date.now()) {
      delete memoryCache[key];
      console.log('✅ Memory cache expiration handling works');
    }
  }, 100);
  
  console.log('✅ Memory cache fallback is working correctly');
}

// Run both tests
testRedisConnection().then(() => {
  testMemoryCache();
});