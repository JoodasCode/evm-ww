import axios from 'axios';
import { ethers } from 'ethers';
import supabaseAdmin from '../lib/supabase-admin';
import { AuthService, BlockchainType } from '../lib/auth';
import { prisma } from '../lib/prisma';

// Test wallet (don't use a real wallet with funds)
const TEST_PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123';
const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);

async function testWalletAuth() {
  try {
    console.log('=== WALLET AUTH DIAGNOSTIC TEST ===');
    console.log(`Using test wallet address: ${wallet.address}`);
    
    // Step 1: Check if RLS is enabled on wallet_profiles table
    console.log('\n1. Checking RLS status on wallet_profiles table...');
    try {
      const { data: rlsData } = await supabaseAdmin.rpc('check_rls_enabled', { 
        table_name: 'wallet_profiles' 
      });
      console.log(`RLS on wallet_profiles: ${rlsData ? 'ENABLED' : 'DISABLED'}`);
    } catch (rlsError) {
      console.log('Error checking RLS status:', rlsError);
      console.log('Attempting to check RLS via direct SQL query...');
      
      try {
        const { data: rlsQueryResult } = await supabaseAdmin.from('pg_class')
          .select('relrowsecurity')
          .eq('relname', 'wallet_profiles')
          .single();
          
        console.log(`RLS on wallet_profiles: ${rlsQueryResult?.relrowsecurity ? 'ENABLED' : 'DISABLED'}`);
      } catch (directError) {
        console.log('Could not check RLS status. Assuming it might be enabled.');
      }
    }
    
    // Step 2: Check wallet_profiles table schema
    console.log('\n2. Checking wallet_profiles table schema...');
    try {
      const { data: tableInfo, error: tableError } = await supabaseAdmin
        .from('wallet_profiles')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('Error accessing wallet_profiles table:', tableError);
      } else {
        console.log('Table exists and is accessible.');
        
        // Get column information through direct query
        const { data: columnsInfo } = await supabaseAdmin
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_name', 'wallet_profiles');
          
        if (columnsInfo) {
          console.log('Column information:');
          console.table(columnsInfo);
          
          // Check if user_id is nullable
          const userIdColumn = columnsInfo.find(col => col.column_name === 'user_id');
          if (userIdColumn) {
            console.log(`user_id column is ${userIdColumn.is_nullable === 'YES' ? 'NULLABLE' : 'NOT NULL'}`);
            
            if (userIdColumn.is_nullable !== 'YES') {
              console.log('WARNING: user_id is NOT NULL which may cause issues with wallet-only auth');
            }
          }
        }
      }
    } catch (schemaError) {
      console.error('Error checking schema:', schemaError);
    }
    
    // Step 3: Test direct insert with admin client
    console.log('\n3. Testing direct insert with admin client...');
    const testWalletAddress = wallet.address.toLowerCase();
    
    // First delete any existing test wallet
    try {
      await supabaseAdmin
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', testWalletAddress);
        
      console.log(`Deleted any existing test wallet: ${testWalletAddress}`);
    } catch (deleteError) {
      console.log('Error deleting existing test wallet (may not exist):', deleteError);
    }
    
    // Try insert
    try {
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('wallet_profiles')
        .insert({
          wallet_address: testWalletAddress,
          blockchain_type: 'evm',
          is_verified: true,
          standalone_wallet: true,
          display_name: 'Test Wallet',
          first_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('Direct insert failed:', insertError);
      } else {
        console.log('Direct insert succeeded:', insertData);
      }
    } catch (insertError) {
      console.error('Exception during direct insert:', insertError);
    }
    
    // Step 4: Test the full wallet auth flow
    console.log('\n4. Testing full wallet auth flow...');
    
    try {
      // Get auth message
      console.log('Requesting auth message...');
      const messageResponse = await axios.get(`http://localhost:5002/api/auth/message/${wallet.address}`);
      const message = messageResponse.data.data.message;
      console.log('Auth message:', message);
      
      // Sign message
      console.log('Signing message...');
      const signature = await wallet.signMessage(message);
      console.log('Signature:', signature.substring(0, 20) + '...');
      
      // Authenticate
      console.log('Sending authentication request...');
      const authResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address,
        signature,
        message,
        displayName: 'Test Wallet'
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
      
      if (authResponse.data.success) {
        console.log('\n✅ WALLET AUTH SUCCESSFUL!');
        console.log('JWT Token:', authResponse.data.data.token.substring(0, 20) + '...');
      } else {
        console.log('\n❌ WALLET AUTH FAILED!');
      }
    } catch (authError: any) {
      console.error('Error during auth flow:', authError.response?.data || authError);
    }
    
    console.log('\n=== TEST COMPLETE ===');
    return true;
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

// Test the updated createOrUpdateWalletProfile method with wallet-only authentication
async function testWalletOnlyAuth() {
  try {
    console.log('=== WALLET-ONLY AUTH TEST ===');
    console.log(`Using test wallet address: ${wallet.address}`);
    
    // Initialize AuthService
    const authService = new AuthService();
    
    // Step 1: Test createOrUpdateWalletProfile method
    console.log('\n1. Testing createOrUpdateWalletProfile method...');
    const testWalletAddress = wallet.address.toLowerCase();
    const displayName = 'Test Wallet Display Name';
    
    try {
      // Create or update wallet profile with display name
      const walletProfile = await authService.createOrUpdateWalletProfile(
        testWalletAddress,
        BlockchainType.EVM,
        displayName
      );
      
      console.log('Wallet profile created/updated successfully:');
      console.log(JSON.stringify(walletProfile, null, 2));
      
      // Verify the wallet profile was created with the correct fields
      // Using type assertion to access fields safely
      const profile = walletProfile as any;
      
      if (profile.walletAddress === testWalletAddress) {
        console.log('✅ Wallet address matches');
      } else {
        console.log('❌ Wallet address mismatch');
      }
      
      if (profile.blockchainType === BlockchainType.EVM) {
        console.log('✅ Blockchain type matches');
      } else {
        console.log('❌ Blockchain type mismatch');
      }
      
      if (profile.standaloneWallet === true) {
        console.log('✅ Standalone wallet flag set correctly');
      } else {
        console.log('❌ Standalone wallet flag not set correctly');
      }
      
      if (profile.displayName === displayName) {
        console.log('✅ Display name set correctly');
      } else {
        console.log('❌ Display name not set correctly');
      }
    } catch (error) {
      console.error('Error creating/updating wallet profile:', error);
    }
    
    // Step 2: Verify wallet profile in database
    console.log('\n2. Verifying wallet profile in database...');
    try {
      // First try using Prisma
      const dbWalletProfile = await prisma.walletProfile.findUnique({
        where: { walletAddress: testWalletAddress }
      });
      
      if (dbWalletProfile) {
        console.log('Wallet profile found in database via Prisma:', dbWalletProfile);
      } else {
        console.log('Wallet profile not found in database via Prisma.');
      }
    } catch (error) {
      console.error('Error querying database with Prisma:', error);
      
      // Fallback to direct Supabase query
      try {
        console.log('Attempting direct Supabase query...');
        const { data: supabaseProfile, error: queryError } = await supabaseAdmin
          .from('wallet_profiles')
          .select('*')
          .eq('wallet_address', testWalletAddress)
          .single();
        
        if (queryError) {
          console.error('Error querying Supabase directly:', queryError);
        } else if (supabaseProfile) {
          console.log('Wallet profile found in Supabase directly:');
          console.log(JSON.stringify(supabaseProfile, null, 2));
          
          // Verify key fields
          if (supabaseProfile.wallet_address === testWalletAddress) {
            console.log('✅ Supabase wallet_address matches');
          } else {
            console.log('❌ Supabase wallet_address mismatch');
          }
          
          if (supabaseProfile.blockchain_type === BlockchainType.EVM) {
            console.log('✅ Supabase blockchain_type matches');
          } else {
            console.log('❌ Supabase blockchain_type mismatch');
          }
          
          if (supabaseProfile.display_name === displayName) {
            console.log('✅ Supabase display_name matches');
          } else {
            console.log('❌ Supabase display_name mismatch');
          }
        } else {
          console.log('Wallet profile not found in Supabase directly.');
        }
      } catch (supabaseError) {
        console.error('Error with direct Supabase query:', supabaseError);
      }
    }
    
    // Step 3: Generate JWT token for the wallet
    console.log('\n3. Generating JWT token...');
    try {
      const token = authService.generateJwtToken({
        walletAddress: testWalletAddress,
        blockchainType: BlockchainType.EVM,
        isVerified: true
      });
      
      console.log('JWT token generated successfully:');
      console.log(token.substring(0, 20) + '...');
      console.log('✅ JWT TOKEN GENERATION SUCCESSFUL');
    } catch (tokenError) {
      console.error('Error generating JWT token:', tokenError);
    }
    
    console.log('\n=== WALLET-ONLY AUTH TEST COMPLETE ===');
    return true;
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

// Run tests
// Comment out the test you don't want to run
// testWalletAuth(); // Original test with full auth flow
testWalletOnlyAuth(); // New test for wallet-only auth
