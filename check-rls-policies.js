// Check RLS policies in Supabase
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials from .env.local
const supabaseUrl = 'https://ncqecpowuzvkgjfgrphz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWVjcG93dXp2a2dqZmdycGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzYxMjY1NCwiZXhwIjoyMDYzMTg4NjU0fQ.LVTzTREeNN9yONGjwg_ed6LeiOemDYc5LSnpNtHzMCA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Service Key (first 10 chars):', supabaseServiceKey.substring(0, 10) + '...');

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRlsPolicies() {
  console.log('Checking RLS policies...');
  
  try {
    // Check if the wallet_profiles table exists
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'wallet_profiles' });
    
    if (tableError) {
      console.error('Error checking table info:', tableError);
      console.log('Trying alternative approach...');
      
      // Alternative: Try to query the pg_tables system table
      const { data: tables, error: tablesError } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('schemaname', 'public')
        .eq('tablename', 'wallet_profiles');
      
      if (tablesError) {
        console.error('Error checking tables:', tablesError);
      } else {
        console.log('Table information:', tables);
      }
    } else {
      console.log('Table info:', tableInfo);
    }
    
    // Try to query the pg_policies system table to check policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');
    
    if (policiesError) {
      console.error('Error checking policies:', policiesError);
      
      // Try a different approach - query information_schema
      const { data: infoSchema, error: infoSchemaError } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_schema', 'public')
        .eq('table_name', 'wallet_profiles');
      
      if (infoSchemaError) {
        console.error('Error querying information_schema:', infoSchemaError);
      } else {
        console.log('Information schema data:', infoSchema);
      }
    } else {
      console.log('Policies:', policies);
    }
    
    // Check if the handle_wallet_auth function exists
    const { data: functions, error: functionsError } = await supabase
      .rpc('get_function_info', { function_name: 'handle_wallet_auth' });
    
    if (functionsError) {
      console.error('Error checking function info:', functionsError);
    } else {
      console.log('Function info:', functions);
    }
    
    // Direct check: Try to insert a wallet profile with a different method
    const testWallet = {
      wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
      blockchain_type: 'evm',
      is_primary: true,
      is_verified: true,
      standalone_wallet: true,
      display_name: 'Test Wallet 2',
      avatar_seed: 'test_seed_2',
      verification_signature: 'test_signature_2'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('wallet_profiles')
      .insert(testWallet)
      .select();
    
    if (insertError) {
      console.error('Error inserting test wallet profile:', insertError);
    } else {
      console.log('Successfully inserted test wallet profile:', insertData);
    }
    
    // Check if the SQL migration was properly applied
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', 'wallet_profiles');
    
    if (columnsError) {
      console.error('Error checking columns:', columnsError);
    } else {
      console.log('Wallet profiles columns:', columns.map(col => col.column_name));
      
      // Check specifically for the new columns
      const newColumns = ['standalone_wallet', 'display_name', 'avatar_seed', 'preferences'];
      for (const col of newColumns) {
        const found = columns.some(c => c.column_name === col);
        console.log(`Column '${col}': ${found ? '✅ Found' : '❌ Missing'}`);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the check
checkRlsPolicies();
