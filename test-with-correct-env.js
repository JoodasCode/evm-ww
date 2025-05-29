import { createClient } from '@supabase/supabase-js';

// Use the correct environment variables you provided
const supabaseUrl = "https://xdcsjcpzhdocnkbxxxwf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODM3MzYsImV4cCI6MjA2MzU1OTczNn0.uOkuZSDa-bYODRKanApWUJIUOCliGgPQAc4ad_jlUME";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA";

async function testWithCorrectCredentials() {
  console.log('🔄 Testing with your exact credentials...');
  
  // Test with service key for admin access
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test basic connection
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('User count:', authData.users?.length || 0);
    
    // Now check for tables using a comprehensive approach
    const possibleTables = [
      'profiles', 'users', 'wallets', 'wallet_analytics', 'wallet_data',
      'transactions', 'transaction_history', 'trading_data', 'behavioral_data',
      'token_metadata', 'tokens', 'analytics', 'scores', 'insights',
      'alerts', 'notifications', 'market_data', 'price_history', 'trades'
    ];

    console.log('\n🔍 Scanning for existing tables...');
    const foundTables = [];

    for (const tableName of possibleTables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);

        if (!error) {
          foundTables.push({
            name: tableName,
            count: count || 0,
            columns: data && data.length > 0 ? Object.keys(data[0]) : []
          });
          console.log(`✅ Found table: ${tableName} (${count || 0} rows)`);
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    if (foundTables.length > 0) {
      console.log(`\n🎉 Found ${foundTables.length} tables in your database:`);
      foundTables.forEach(table => {
        console.log(`\n📋 ${table.name}:`);
        console.log(`   └─ Rows: ${table.count}`);
        if (table.columns.length > 0) {
          console.log(`   └─ Columns: ${table.columns.join(', ')}`);
        }
      });
    } else {
      console.log('\n📝 No tables found - your database is ready for setup!');
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testWithCorrectCredentials();