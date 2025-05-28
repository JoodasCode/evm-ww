// Test database connection using the app's setup
import { createClient } from '@supabase/supabase-js';

async function testDatabaseConnection() {
  console.log('🔄 Testing database connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try a simple query to test connection
    const { data, error } = await supabase
      .rpc('version'); // PostgreSQL version function
    
    if (error) {
      console.log('RPC error:', error.message);
      
      // Try alternative test - check auth users (this should work with service key)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ Auth test failed:', authError.message);
      } else {
        console.log('✅ Database connection working via auth endpoint');
        console.log('User count:', authData.users?.length || 0);
      }
    } else {
      console.log('✅ Database connection successful');
      console.log('PostgreSQL version:', data);
    }
    
    // Try to list tables using a different approach
    const { data: tables, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tableError) {
      console.log('Table query error:', tableError.message);
    } else {
      console.log('✅ Tables found:', tables?.map(t => t.tablename) || []);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testDatabaseConnection();