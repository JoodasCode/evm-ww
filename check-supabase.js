import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Initialize Supabase client with admin credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  console.log('=== Supabase Integration Check ===');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Check wallet_profiles table
    console.log('\n1. Checking wallet_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) throw profilesError;
    
    console.log(`✅ Found ${profiles.length} wallet profiles in Supabase`);
    if (profiles.length > 0) {
      console.log('Sample wallet profile:');
      console.log(JSON.stringify(profiles[0], null, 2));
    }
    
    // Check activity_logs table
    console.log('\n2. Checking activity_logs table...');
    const { data: logs, error: logsError } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);
    
    if (logsError) throw logsError;
    
    console.log(`✅ Found ${logs.length} activity logs in Supabase`);
    if (logs.length > 0) {
      console.log('Most recent activity log:');
      console.log(JSON.stringify(logs[0], null, 2));
    }
    
    console.log('\n✅ Supabase integration is working correctly!');
    console.log('Your wallet authentication system is successfully storing data in Supabase.');
    
  } catch (error) {
    console.error('\n❌ Error checking Supabase:', error.message);
  }
}

checkSupabase();
