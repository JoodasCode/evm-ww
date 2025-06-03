// Force insert a wallet profile into Supabase
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials from .env.local
const supabaseUrl = 'https://ncqecpowuzvkgjfgrphz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWVjcG93dXp2a2dqZmdycGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzYxMjY1NCwiZXhwIjoyMDYzMTg4NjU0fQ.LVTzTREeNN9yONGjwg_ed6LeiOemDYc5LSnpNtHzMCA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Service Key (first 10 chars):', supabaseServiceKey.substring(0, 10) + '...');

// Create Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceInsertWalletProfile() {
  console.log('Using Supabase URL:', supabaseUrl);
  console.log('Attempting to force insert wallet profile...');
  
  try {
    // Create a wallet profile with the user's actual wallet address
    const walletProfile = {
      wallet_address: '0xB8a9FB148c43550ea62C427044D63f53e906A63d'.toLowerCase(), // Convert to lowercase for consistency
      blockchain_type: 'evm',
      is_primary: true,
      is_verified: true,
      verification_signature: 'force_inserted_signature',
      standalone_wallet: true,
      display_name: 'Your Wallet 0xB8a9...A63d',
      avatar_seed: encode(digest('0xB8a9FB148c43550ea62C427044D63f53e906A63d'.toLowerCase(), 'hex')),
      preferences: {
        theme: 'dark',
        notifications: true
      }
    };
    
    // Helper function to simulate the avatar_seed generation
    function encode(str) {
      return str || '307842386139464231343863343335353065613632433432373034344436336635336539303641363364';
    }
    
    function digest(str, format) {
      return str;
    }
    
    // Check if wallet profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', walletProfile.wallet_address)
      .single();
    
    if (!checkError && existingProfile) {
      console.log('Wallet profile already exists:', existingProfile);
      console.log('Deleting existing profile to recreate it...');
      
      // Delete existing profile
      const { error: deleteError } = await supabase
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', walletProfile.wallet_address);
      
      if (deleteError) {
        console.error('Error deleting existing wallet profile:', deleteError);
        return;
      }
    }
    
    // Insert the wallet profile
    const { data: insertedProfile, error: insertError } = await supabase
      .from('wallet_profiles')
      .insert(walletProfile)
      .select();
    
    if (insertError) {
      console.error('Error inserting wallet profile:', insertError);
    } else {
      console.log('Successfully inserted wallet profile:', insertedProfile);
    }
    
    // Create an activity log for the wallet connection
    const activityLog = {
      wallet_address: walletProfile.wallet_address,
      activity_type: 'WALLET_CONNECT',
      blockchain_type: 'evm',
      details: {
        success: true,
        timestamp: new Date().toISOString(),
        standalone: true,
        first_connection: true
      }
    };
    
    const { data: insertedActivity, error: activityError } = await supabase
      .from('user_activity')
      .insert(activityLog)
      .select();
    
    if (activityError) {
      console.error('Error inserting activity log:', activityError);
    } else {
      console.log('Successfully inserted activity log:', insertedActivity);
    }
    
    // Check if the wallet profile was inserted correctly
    const { data: allProfiles, error: fetchError } = await supabase
      .from('wallet_profiles')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching wallet profiles:', fetchError);
    } else {
      console.log('All wallet profiles:', allProfiles);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the force insert
forceInsertWalletProfile();
