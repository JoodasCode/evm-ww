import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service key (admin access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkRecentActivity() {
  console.log('Checking recent activity in user_activity table...');
  
  // Get recent activity, last 10 entries
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching activity logs:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No activity logs found in the database.');
    return;
  }
  
  console.log(`Found ${data.length} recent activity logs:`);
  data.forEach((activity, index) => {
    console.log(`\nActivity #${index + 1}:`);
    console.log(`  ID: ${activity.id}`);
    console.log(`  Type: ${activity.activity_type}`);
    console.log(`  User ID: ${activity.user_id || 'N/A'}`);
    console.log(`  Wallet Address: ${activity.wallet_address || 'N/A'}`);
    console.log(`  Created: ${activity.timestamp}`);
    console.log(`  Details: ${JSON.stringify(activity.details, null, 2)}`);
  });
}

// Run the check
checkRecentActivity().catch(console.error);
