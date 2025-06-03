/**
 * Test script to verify RLS policies are working correctly
 * 
 * This script tests:
 * 1. Public read access to wallet_profiles
 * 2. Public read access to user_activity
 * 3. Public read access to user_profiles
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', SUPABASE_URL);
console.log('Anon Key available:', !!SUPABASE_ANON_KEY);
console.log('Service Key available:', !!SUPABASE_SERVICE_KEY);

// Create Supabase clients
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testRlsPolicies() {
  console.log('\n🧪 Testing RLS policies...');
  
  // Test 1: Check if we can read wallet_profiles with anon key
  console.log('\n🔍 Testing public read access to wallet_profiles...');
  const { data: walletProfiles, error: walletProfilesError } = await supabaseAnon
    .from('wallet_profiles')
    .select('*')
    .limit(5);
  
  if (walletProfilesError) {
    console.error('❌ Error reading wallet_profiles with anon key:', walletProfilesError);
  } else {
    console.log('✅ Successfully read wallet_profiles with anon key');
    console.log(`   Found ${walletProfiles.length} wallet profiles`);
    if (walletProfiles.length > 0) {
      console.log('   First wallet profile:', walletProfiles[0]);
    }
  }
  
  // Test 2: Check if we can read user_activity with anon key
  console.log('\n🔍 Testing public read access to user_activity...');
  const { data: userActivity, error: userActivityError } = await supabaseAnon
    .from('user_activity')
    .select('*')
    .limit(5);
  
  if (userActivityError) {
    console.error('❌ Error reading user_activity with anon key:', userActivityError);
  } else {
    console.log('✅ Successfully read user_activity with anon key');
    console.log(`   Found ${userActivity.length} activity records`);
    if (userActivity.length > 0) {
      console.log('   First activity record:', userActivity[0]);
    }
  }
  
  // Test 3: Check if we can read user_profiles with anon key
  console.log('\n🔍 Testing public read access to user_profiles...');
  const { data: userProfiles, error: userProfilesError } = await supabaseAnon
    .from('user_profiles')
    .select('*')
    .limit(5);
  
  if (userProfilesError) {
    console.error('❌ Error reading user_profiles with anon key:', userProfilesError);
  } else {
    console.log('✅ Successfully read user_profiles with anon key');
    console.log(`   Found ${userProfiles.length} user profiles`);
    if (userProfiles.length > 0) {
      console.log('   First user profile:', userProfiles[0]);
    }
  }
  
  // Test 4: Create a test wallet profile using service key
  console.log('\n🔍 Creating a test wallet profile with service key...');
  const testWalletAddress = '0x' + Math.random().toString(16).substring(2, 42);
  
  const { data: newWalletProfile, error: createError } = await supabaseService
    .from('wallet_profiles')
    .insert({
      wallet_address: testWalletAddress,
      blockchain_type: 'evm',
      is_verified: true,
      display_name: 'Test Wallet'
    })
    .select()
    .single();
  
  if (createError) {
    console.error('❌ Error creating test wallet profile:', createError);
  } else {
    console.log('✅ Successfully created test wallet profile:', newWalletProfile);
    
    // Test 5: Read the newly created wallet profile with anon key
    console.log('\n🔍 Reading newly created wallet profile with anon key...');
    const { data: readWalletProfile, error: readError } = await supabaseAnon
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', testWalletAddress)
      .single();
    
    if (readError) {
      console.error('❌ Error reading newly created wallet profile with anon key:', readError);
    } else {
      console.log('✅ Successfully read newly created wallet profile with anon key:', readWalletProfile);
    }
    
    // Clean up - delete the test wallet profile
    console.log('\n🧹 Cleaning up - deleting test wallet profile...');
    const { error: deleteError } = await supabaseService
      .from('wallet_profiles')
      .delete()
      .eq('wallet_address', testWalletAddress);
    
    if (deleteError) {
      console.error('❌ Error deleting test wallet profile:', deleteError);
    } else {
      console.log('✅ Successfully deleted test wallet profile');
    }
  }
  
  console.log('\n🎉 RLS policy testing completed!');
}

// Run the tests
testRlsPolicies();
