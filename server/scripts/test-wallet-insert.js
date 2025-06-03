import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';

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

// Test wallet address - using your wallet address
const testWalletAddress = '0xb8a9fb148c43550ea62c427044d63f53e906a63d'; // Lowercase version

async function testWalletInsert() {
  console.log('Testing wallet profile insertion...');
  
  try {
    // First, check if the wallet profile already exists
    console.log(`Checking if wallet profile exists for address: ${testWalletAddress}`);
    const { data: existingProfile, error: fetchError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', testWalletAddress)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching wallet profile:', fetchError);
      return;
    }
    
    if (existingProfile) {
      console.log('Wallet profile already exists:', existingProfile);
    } else {
      console.log('Wallet profile does not exist. Creating...');
      
      // Create a new wallet profile
      const newProfileData = {
        wallet_address: testWalletAddress,
        blockchain_type: 'evm',
        is_verified: false,
        is_primary: true,
        standalone_wallet: true,
        display_name: `0x${testWalletAddress.substring(2, 6)}...${testWalletAddress.substring(testWalletAddress.length - 4)}`,
        avatar_seed: Buffer.from(testWalletAddress).toString('hex'),
        verification_signature: null,
        preferences: { theme: 'dark', notifications: true }
      };
      
      const { data: newProfile, error: insertError } = await supabase
        .from('wallet_profiles')
        .insert(newProfileData)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating wallet profile:', insertError);
      } else {
        console.log('Wallet profile created successfully:', newProfile);
      }
    }
    
    // Now verify the wallet profile exists
    console.log('\nVerifying wallet profile exists...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', testWalletAddress)
      .maybeSingle();
    
    if (verifyError) {
      console.error('Error verifying wallet profile:', verifyError);
    } else if (verifyProfile) {
      console.log('Wallet profile verified:', verifyProfile);
    } else {
      console.log('Wallet profile still does not exist after insertion attempt!');
    }
    
    // Log an activity for this wallet
    console.log('\nLogging test activity...');
    const activityData = {
      wallet_address: testWalletAddress,
      wallet_profile_id: verifyProfile?.id || null,
      activity_type: 'TEST_ACTIVITY',
      details: {
        test: true,
        timestamp: new Date().toISOString()
      },
      blockchain_type: 'evm'
    };
    
    const { data: activityLog, error: activityError } = await supabase
      .from('activity_logs')
      .insert(activityData)
      .select()
      .single();
    
    if (activityError) {
      console.error('Error logging activity:', activityError);
    } else {
      console.log('Activity logged successfully:', activityLog);
    }
    
    // Verify activity log exists
    console.log('\nVerifying activity log exists...');
    const { data: verifyActivity, error: verifyActivityError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('wallet_address', testWalletAddress)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (verifyActivityError) {
      console.error('Error verifying activity log:', verifyActivityError);
    } else if (verifyActivity) {
      console.log('Activity log verified:', verifyActivity);
    } else {
      console.log('Activity log does not exist after insertion attempt!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the function
testWalletInsert();
