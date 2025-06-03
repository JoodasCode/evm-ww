import axios from 'axios';
import { ethers } from 'ethers';
import supabaseAdmin from '../lib/supabase-admin';

// Test wallets (don't use real wallets with funds)
const TEST_WALLETS = [
  '0x0123456789012345678901234567890123456789012345678901234567890123',
  '0x1123456789012345678901234567890123456789012345678901234567890123',
  '0x2123456789012345678901234567890123456789012345678901234567890123',
];

async function testMultipleWalletAuth() {
  console.log('=== MULTI-WALLET AUTH DIAGNOSTIC TEST ===');
  
  // First, check wallet_profiles table schema
  console.log('\n1. Checking wallet_profiles table schema...');
  try {
    const { data: columnsInfo } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'wallet_profiles');
      
    if (columnsInfo) {
      console.log('Column information:');
      console.table(columnsInfo);
    }
  } catch (schemaError) {
    console.error('Error checking schema:', schemaError);
  }
  
  // Test each wallet
  for (let i = 0; i < TEST_WALLETS.length; i++) {
    const privateKey = TEST_WALLETS[i];
    const wallet = new ethers.Wallet(privateKey);
    
    console.log(`\n=== Testing Wallet ${i+1}: ${wallet.address} ===`);
    
    try {
      // Clean up any existing test wallet
      await supabaseAdmin
        .from('wallet_profiles')
        .delete()
        .eq('wallet_address', wallet.address.toLowerCase());
        
      console.log(`Deleted any existing test wallet: ${wallet.address.toLowerCase()}`);
      
      // Step 1: Get auth message
      console.log('\n1. Requesting auth message...');
      const messageResponse = await axios.get(`http://localhost:5002/api/auth/message/${wallet.address}`);
      const message = messageResponse.data.data.message;
      console.log('Auth message:', message);
      
      // Step 2: Sign message
      console.log('\n2. Signing message...');
      const signature = await wallet.signMessage(message);
      console.log('Signature:', signature.substring(0, 20) + '...');
      
      // Step 3: Authenticate
      console.log('\n3. Sending authentication request...');
      const authResponse = await axios.post('http://localhost:5002/api/auth/wallet-auth', {
        walletAddress: wallet.address,
        signature,
        message,
        displayName: `Test Wallet ${i+1}`
      });
      
      console.log('Auth response status:', authResponse.status);
      console.log('Auth response data:', {
        success: authResponse.data.success,
        walletAddress: authResponse.data.data?.wallet_address,
        isNewProfile: authResponse.data.data?.isNewProfile,
        tokenReceived: !!authResponse.data.data?.token
      });
      
      if (authResponse.data.success) {
        console.log('\n✅ WALLET AUTH SUCCESSFUL!');
        
        // Step 4: Verify profile in database
        console.log('\n4. Verifying wallet profile in database...');
        const { data: walletProfile } = await supabaseAdmin
          .from('wallet_profiles')
          .select('*')
          .eq('wallet_address', wallet.address.toLowerCase())
          .single();
          
        if (walletProfile) {
          console.log('Wallet profile found in database:', {
            id: walletProfile.id,
            wallet_address: walletProfile.wallet_address,
            display_name: walletProfile.display_name,
            is_verified: walletProfile.is_verified,
            last_updated: walletProfile.last_updated
          });
        } else {
          console.log('❌ Wallet profile NOT found in database!');
        }
        
        // Step 5: Test logout
        console.log('\n5. Testing logout...');
        const logoutResponse = await axios.post('http://localhost:5002/api/auth/logout', {
          walletAddress: wallet.address
        });
        
        console.log('Logout response:', {
          success: logoutResponse.data.success,
          message: logoutResponse.data.data?.message
        });
      } else {
        console.log('\n❌ WALLET AUTH FAILED!');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Error testing wallet ${i+1}:`, error.response.data);
      } else if (error instanceof Error) {
        console.error(`Error testing wallet ${i+1}:`, error.message);
      } else {
        console.error(`Error testing wallet ${i+1}:`, error);
      }
    }
  }
  
  console.log('\n=== MULTI-WALLET TEST COMPLETE ===');
}

// Run test
testMultipleWalletAuth().catch(console.error);
