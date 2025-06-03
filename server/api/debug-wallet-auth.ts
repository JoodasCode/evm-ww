import express from 'express';
import authService, { supabase, BlockchainType } from '../lib/auth';
import WalletProfileService from '../lib/wallet-profile-service';
import ActivityLogService from '../lib/activity-log-service';

const router = express.Router();

/**
 * Debug endpoint to test wallet authentication flow
 * POST /api/debug/test-wallet-auth
 * Body: { walletAddress, signature, message, blockchainType, displayName }
 */
router.post('/test-wallet-auth', async (req, res) => {
  const results = {
    steps: [],
    success: false,
    walletProfile: null,
    errors: []
  };

  try {
    // Step 1: Validate input parameters
    results.steps.push({ step: 1, name: 'Validating input parameters', status: 'running' });
    
    const { walletAddress, signature, message, displayName } = req.body;
    let { blockchainType = BlockchainType.EVM } = req.body;
    
    if (!walletAddress || !signature || !message) {
      const error = 'Missing required parameters: walletAddress, signature, and message are required';
      results.steps[0].status = 'failed';
      results.steps[0].error = error;
      results.errors.push(error);
      return res.status(400).json({
        success: false,
        results
      });
    }
    
    // Normalize wallet address
    const normalizedWallet = walletAddress.toLowerCase();
    results.steps[0].status = 'success';
    results.steps[0].data = { normalizedWallet, hasSignature: !!signature, hasMessage: !!message };
    
    // Step 2: Verify wallet ownership
    results.steps.push({ step: 2, name: 'Verifying wallet ownership', status: 'running' });
    
    try {
      const isVerified = await authService.verifyWalletOwnership(normalizedWallet, signature, message, blockchainType);
      
      if (!isVerified) {
        const error = 'Wallet ownership verification failed. Signature does not match the expected wallet address.';
        results.steps[1].status = 'failed';
        results.steps[1].error = error;
        results.errors.push(error);
        return res.status(403).json({
          success: false,
          results
        });
      }
      
      results.steps[1].status = 'success';
      results.steps[1].data = { isVerified };
    } catch (verifyError) {
      results.steps[1].status = 'failed';
      results.steps[1].error = verifyError instanceof Error ? verifyError.message : String(verifyError);
      results.errors.push(results.steps[1].error);
      return res.status(500).json({
        success: false,
        results
      });
    }
    
    // Step 3: Check if wallet profile exists
    results.steps.push({ step: 3, name: 'Checking if wallet profile exists', status: 'running' });
    
    try {
      const { data: existingWallet, error: walletError } = await supabase
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', normalizedWallet)
        .single();
      
      results.steps[2].status = walletError ? 'info' : 'success';
      results.steps[2].data = { 
        exists: !!existingWallet,
        error: walletError ? walletError.message : null,
        profile: existingWallet
      };
      
      // Step 4: Create or update wallet profile
      if (walletError || !existingWallet) {
        results.steps.push({ step: 4, name: 'Creating new wallet profile', status: 'running' });
        
        try {
          const walletData = {
            wallet_address: normalizedWallet,
            blockchain_type: blockchainType,
            is_primary: true,
            is_verified: true,
            standalone_wallet: true,
            display_name: displayName || `Wallet ${normalizedWallet.substring(0, 4)}...${normalizedWallet.substring(normalizedWallet.length - 4)}`,
            avatar_seed: Buffer.from(normalizedWallet).toString('hex'),
            verification_signature: signature
          };
          
          const { data: newWallet, error: createError } = await supabase
            .from('wallet_profiles')
            .insert(walletData)
            .select()
            .single();
          
          if (createError) {
            results.steps[3].status = 'failed';
            results.steps[3].error = createError.message;
            results.steps[3].data = { attemptedData: walletData };
            results.errors.push(createError.message);
            return res.status(500).json({
              success: false,
              results
            });
          }
          
          results.steps[3].status = 'success';
          results.steps[3].data = { newWallet };
          results.walletProfile = newWallet;
          
          // Log activity
          results.steps.push({ step: 5, name: 'Logging activity', status: 'running' });
          
          try {
            await supabase.from('user_activity').insert({
              wallet_address: normalizedWallet,
              blockchain_type: blockchainType,
              activity_type: 'WALLET_CONNECT',
              details: {
                standalone: true,
                first_connection: true,
                success: true,
                timestamp: new Date().toISOString()
              }
            });
            
            results.steps[4].status = 'success';
          } catch (logError) {
            results.steps[4].status = 'warning';
            results.steps[4].error = logError instanceof Error ? logError.message : String(logError);
            // Don't fail the whole process for logging errors
          }
        } catch (createError) {
          results.steps[3].status = 'failed';
          results.steps[3].error = createError instanceof Error ? createError.message : String(createError);
          results.errors.push(results.steps[3].error);
          return res.status(500).json({
            success: false,
            results
          });
        }
      } else {
        // Update existing wallet profile
        results.steps.push({ step: 4, name: 'Updating existing wallet profile', status: 'running' });
        
        try {
          const updateData = {
            last_updated: new Date().toISOString(),
            verification_signature: signature,
            ...(displayName && existingWallet.standalone_wallet ? { display_name: displayName } : {})
          };
          
          const { data: updatedWallet, error: updateError } = await supabase
            .from('wallet_profiles')
            .update(updateData)
            .eq('wallet_address', normalizedWallet)
            .select()
            .single();
          
          if (updateError) {
            results.steps[3].status = 'failed';
            results.steps[3].error = updateError.message;
            results.steps[3].data = { attemptedData: updateData };
            results.errors.push(updateError.message);
            return res.status(500).json({
              success: false,
              results
            });
          }
          
          results.steps[3].status = 'success';
          results.steps[3].data = { updatedWallet };
          results.walletProfile = updatedWallet;
          
          // Log activity
          results.steps.push({ step: 5, name: 'Logging activity', status: 'running' });
          
          try {
            await supabase.from('user_activity').insert({
              user_id: updatedWallet.user_id,
              wallet_address: normalizedWallet,
              blockchain_type: blockchainType,
              activity_type: 'WALLET_CONNECT',
              details: {
                standalone: updatedWallet.standalone_wallet,
                success: true,
                timestamp: new Date().toISOString()
              }
            });
            
            results.steps[4].status = 'success';
          } catch (logError) {
            results.steps[4].status = 'warning';
            results.steps[4].error = logError instanceof Error ? logError.message : String(logError);
            // Don't fail the whole process for logging errors
          }
        } catch (updateError) {
          results.steps[3].status = 'failed';
          results.steps[3].error = updateError instanceof Error ? updateError.message : String(updateError);
          results.errors.push(results.steps[3].error);
          return res.status(500).json({
            success: false,
            results
          });
        }
      }
    } catch (checkError) {
      results.steps[2].status = 'failed';
      results.steps[2].error = checkError instanceof Error ? checkError.message : String(checkError);
      results.errors.push(results.steps[2].error);
      return res.status(500).json({
        success: false,
        results
      });
    }
    
    // Step 6: Generate JWT token
    results.steps.push({ step: 6, name: 'Generating JWT token', status: 'running' });
    
    try {
      const token = authService.generateJwtToken({
        walletAddress: normalizedWallet,
        walletProfileId: results.walletProfile.id,
        timestamp: new Date().toISOString()
      });
      
      results.steps[5].status = 'success';
      results.steps[5].data = { tokenGenerated: !!token };
      
      // Final success response
      results.success = true;
      return res.status(200).json({
        success: true,
        data: {
          token,
          walletProfile: results.walletProfile
        },
        results
      });
    } catch (tokenError) {
      results.steps[5].status = 'failed';
      results.steps[5].error = tokenError instanceof Error ? tokenError.message : String(tokenError);
      results.errors.push(results.steps[5].error);
      return res.status(500).json({
        success: false,
        results
      });
    }
  } catch (error) {
    results.errors.push(error instanceof Error ? error.message : String(error));
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      results
    });
  }
});

export default router;
