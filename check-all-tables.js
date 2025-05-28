import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function checkAllTables() {
  console.log('🔍 Checking all existing tables in your database...');

  // Try multiple common table names
  const possibleTables = [
    'profiles', 'users', 'wallets', 'wallet_analytics', 'wallet_data',
    'transactions', 'transaction_history', 'trading_data', 'behavioral_data',
    'token_metadata', 'tokens', 'analytics', 'scores', 'insights',
    'alerts', 'notifications', 'market_data', 'price_history'
  ];

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
      }
    } catch (e) {
      // Table doesn't exist or no access
    }
  }

  if (foundTables.length > 0) {
    console.log(`✅ Found ${foundTables.length} tables:`);
    foundTables.forEach(table => {
      console.log(`\n📋 Table: ${table.name}`);
      console.log(`   Rows: ${table.count}`);
      if (table.columns.length > 0) {
        console.log(`   Columns: ${table.columns.join(', ')}`);
      }
    });
  } else {
    console.log('❌ No tables found or accessible');
  }

  return foundTables;
}

checkAllTables();