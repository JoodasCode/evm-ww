// Check what tables exist in the database
import { createClient } from '@supabase/supabase-js';

async function checkExistingTables() {
  console.log('🔍 Checking existing tables in your database...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA";
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Try to query information_schema using a raw SQL query
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `
    });
    
    if (error) {
      console.log('Direct query failed, trying alternative approach...');
      
      // Try to access some common table names directly
      const testTables = ['profiles', 'wallet_analytics', 'transactions', 'users'];
      
      for (const tableName of testTables) {
        const { data: testData, error: testError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!testError) {
          console.log(`✅ Found table: ${tableName}`);
          console.log(`   Sample data structure:`, Object.keys(testData?.[0] || {}));
        }
      }
    } else {
      console.log('✅ Tables found:', data);
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

checkExistingTables();