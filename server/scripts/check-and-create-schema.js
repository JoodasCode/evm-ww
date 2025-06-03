import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
config({ path: '.env.local' });

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateSchema() {
  console.log('Checking Supabase schema...');
  
  try {
    // Check if wallet_profiles table exists
    const { data: walletProfilesExists, error: walletProfilesError } = await supabase
      .from('wallet_profiles')
      .select('id')
      .limit(1);
    
    if (walletProfilesError && walletProfilesError.code === '42P01') {
      console.log('wallet_profiles table does not exist. Creating schema...');
      
      // Read the schema SQL file
      const schemaPath = path.join(__dirname, 'wallet-profiles-schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute the schema SQL
      const { error: createError } = await supabase.rpc('exec_sql', { sql: schemaSql });
      
      if (createError) {
        console.error('Error creating schema:', createError);
        
        // Try alternative method if RPC fails
        console.log('Trying alternative method to create tables...');
        
        // Create wallet_profiles table
        const { error: createWalletProfilesError } = await supabase
          .rpc('exec_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS wallet_profiles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_address TEXT UNIQUE NOT NULL,
                blockchain_type TEXT NOT NULL DEFAULT 'evm',
                is_primary BOOLEAN NOT NULL DEFAULT true,
                is_verified BOOLEAN NOT NULL DEFAULT false,
                verification_signature TEXT,
                first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
                last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
                standalone_wallet BOOLEAN NOT NULL DEFAULT true,
                display_name TEXT,
                avatar_seed TEXT,
                preferences JSONB DEFAULT '{}'
              );
              
              CREATE INDEX IF NOT EXISTS idx_wallet_address ON wallet_profiles(wallet_address);
            `
          });
        
        if (createWalletProfilesError) {
          console.error('Error creating wallet_profiles table:', createWalletProfilesError);
        } else {
          console.log('wallet_profiles table created successfully');
        }
        
        // Create activity_logs table
        const { error: createActivityLogsError } = await supabase
          .rpc('exec_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS activity_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_address TEXT NOT NULL,
                wallet_profile_id UUID REFERENCES wallet_profiles(id) ON DELETE CASCADE,
                activity_type TEXT NOT NULL,
                details JSONB DEFAULT '{}',
                timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
                session_id TEXT,
                ip_address TEXT,
                user_agent TEXT,
                blockchain_type TEXT DEFAULT 'evm'
              );
              
              CREATE INDEX IF NOT EXISTS idx_activity_wallet ON activity_logs(wallet_address);
              CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_logs(activity_type);
              CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_logs(timestamp);
            `
          });
        
        if (createActivityLogsError) {
          console.error('Error creating activity_logs table:', createActivityLogsError);
        } else {
          console.log('activity_logs table created successfully');
        }
      } else {
        console.log('Schema created successfully');
      }
    } else if (walletProfilesError) {
      console.error('Error checking wallet_profiles table:', walletProfilesError);
    } else {
      console.log('wallet_profiles table exists');
      
      // Check if activity_logs table exists
      const { data: activityLogsExists, error: activityLogsError } = await supabase
        .from('activity_logs')
        .select('id')
        .limit(1);
      
      if (activityLogsError && activityLogsError.code === '42P01') {
        console.log('activity_logs table does not exist. Creating...');
        
        // Create activity_logs table
        const { error: createActivityLogsError } = await supabase
          .rpc('exec_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS activity_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_address TEXT NOT NULL,
                wallet_profile_id UUID REFERENCES wallet_profiles(id) ON DELETE CASCADE,
                activity_type TEXT NOT NULL,
                details JSONB DEFAULT '{}',
                timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
                session_id TEXT,
                ip_address TEXT,
                user_agent TEXT,
                blockchain_type TEXT DEFAULT 'evm'
              );
              
              CREATE INDEX IF NOT EXISTS idx_activity_wallet ON activity_logs(wallet_address);
              CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_logs(activity_type);
              CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_logs(timestamp);
            `
          });
        
        if (createActivityLogsError) {
          console.error('Error creating activity_logs table:', createActivityLogsError);
        } else {
          console.log('activity_logs table created successfully');
        }
      } else if (activityLogsError) {
        console.error('Error checking activity_logs table:', activityLogsError);
      } else {
        console.log('activity_logs table exists');
      }
    }
    
    // List all tables to verify
    console.log('\nListing all tables in the database:');
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `
      });
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log(tables);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the function
checkAndCreateSchema();
