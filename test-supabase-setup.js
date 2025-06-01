// Test script for Supabase setup
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection by checking if we can access the database
    const { data, error } = await supabase.rpc('get_service_role');
    
    if (error) {
      // If the RPC fails, try a simpler query
      const { error: tableError } = await supabase.from('user_profiles').select('id').limit(1);
      
      if (tableError) {
        console.error('Error connecting to Supabase:', tableError.message);
        return false;
      }
    }
    
    console.log('✅ Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('\nChecking required tables...');
  
  const requiredTables = [
    'user_profiles',
    'wallet_profiles',
    'user_activity'
  ];
  
  for (const table of requiredTables) {
    try {
      // Use count() to get the number of rows
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists with ${count || 0} rows`);
      }
    } catch (err) {
      console.error(`❌ Error checking table '${table}':`, err.message);
    }
  }
}

async function testInsert() {
  console.log('\nTesting insert operations...');
  
  try {
    // Test inserting activity log
    const { data, error } = await supabase.from('user_activity').insert({
      activity_type: 'TEST',
      details: { test: true, timestamp: new Date().toISOString() }
    }).select();
    
    if (error) {
      console.error('❌ Error inserting test activity:', error.message);
    } else {
      console.log('✅ Successfully inserted test activity log');
      console.log(data);
    }
  } catch (err) {
    console.error('❌ Error testing insert:', err.message);
  }
}

async function runTests() {
  const connected = await testSupabaseConnection();
  
  if (connected) {
    await checkTables();
    await testInsert();
  }
  
  console.log('\nTests completed.');
}

runTests();
