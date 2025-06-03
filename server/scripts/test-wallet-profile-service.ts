import WalletProfileService from '../lib/wallet-profile-service';
import ActivityLogService from '../lib/activity-log-service';
import { ethers } from 'ethers';

/**
 * Test script for the WalletProfileService and wallet authentication flow
 */
async function testWalletProfileService() {
  console.log('=== TESTING WALLET PROFILE SERVICE ===');
  
  try {
    // Generate a test wallet
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    console.log(`Test wallet address: ${walletAddress}`);
    
    // Get service instances
    const walletProfileService = WalletProfileService.getInstance();
    const activityLogService = ActivityLogService.getInstance();
    
    console.log('\n1. Creating a new wallet profile...');
    const walletProfile = await walletProfileService.createOrUpdateWalletProfile(
      walletAddress,
      'evm'
    );
    console.log('Wallet profile created:', walletProfile);
    
    // Generate a test message and signature
    const message = `Sign this message to authenticate with Wallet Whisperer: ${Date.now()}`;
    const signature = await wallet.signMessage(message);
    console.log(`\nSigned message: ${message}`);
    console.log(`Signature: ${signature}`);
    
    console.log('\n2. Verifying the wallet profile...');
    const verifiedProfile = await walletProfileService.verifyWalletProfile(
      walletAddress,
      signature
    );
    console.log('Wallet profile verified:', verifiedProfile);
    
    console.log('\n3. Updating the wallet profile...');
    const updatedProfile = await walletProfileService.updateWalletProfile(
      verifiedProfile.id,
      {
        display_name: 'Test Wallet',
        avatar_seed: 'test_seed',
        is_primary: true
      }
    );
    console.log('Wallet profile updated:', updatedProfile);
    
    console.log('\n4. Retrieving the wallet profile...');
    const retrievedProfile = await walletProfileService.getWalletProfile(walletAddress);
    console.log('Retrieved wallet profile:', retrievedProfile);
    
    console.log('\n5. Logging wallet activity...');
    await activityLogService.logActivity({
      activity_type: 'WALLET_CONNECT',
      user_id: null,
      wallet_address: walletAddress,
      details: {
        blockchain_type: 'evm',
        wallet_profile_id: retrievedProfile.id,
        test: true
      }
    });
    console.log('Activity logged successfully');
    
    console.log('\n6. Retrieving activity logs...');
    const activityLogs = await activityLogService.getActivityLogs(
      null,
      walletAddress
    );
    console.log('Activity logs:', activityLogs);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('Error in wallet profile service test:', error);
  }
}

// Run the test
testWalletProfileService().catch(console.error);
