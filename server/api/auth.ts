import express from 'express';
import authService, { supabase, BlockchainType } from '../lib/auth';
import WalletProfileService from '../lib/wallet-profile-service';
import ActivityLogService from '../lib/activity-log-service';

const router = express.Router();

/**
 * Helper function to extract user from authorization header
 * @param authHeader Authorization header from request
 * @returns User object if authenticated, null otherwise
 */
async function getUserFromAuth(authHeader?: string): Promise<any> {
  if (!authHeader) {
    console.error('No authorization header provided');
    return null;
  }
  
  try {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.error('Invalid authorization header format');
      return null;
    }
    
    const token = parts[1];
    if (!token) {
      console.error('No token found in authorization header');
      return null;
    }
    
    console.log('Verifying token with Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Error verifying token:', error);
      return null;
    }
    
    if (!user) {
      console.error('No user found for token');
      return null;
    }
    
    console.log('User authenticated successfully:', { id: user.id, email: user.email });
    return user;
  } catch (error) {
    console.error('Error extracting user from auth header:', error);
    return null;
  }
}

/**
 * Link wallet to user account
 * POST /api/auth/link-wallet
 * Body: { walletAddress, signature, message (optional), blockchainType (optional) }
 * Requires: Authentication
 */
router.post('/link-wallet', async (req, res) => {
  try {
    console.log('Received link-wallet request:', {
      body: req.body,
      headers: {
        authorization: req.headers.authorization ? 'Present (hidden)' : 'Missing'
      }
    });
    
    const { walletAddress, signature } = req.body;
    let { message, blockchainType = BlockchainType.EVM } = req.body;
    
    if (!walletAddress || !signature) {
      console.error('Missing required parameters:', { walletAddress: !!walletAddress, signature: !!signature });
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: walletAddress and signature are required'
      });
    }
    
    // Get user from session
    console.log('Getting user from auth token...');
    const { data: { user }, error: userError } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (userError) {
      console.error('Error getting user from auth token:', userError);
      return res.status(401).json({
        success: false,
        error: 'Authentication error: ' + userError.message
      });
    }
    
    if (!user) {
      console.error('No user found in session');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    console.log('User found:', { id: user.id, email: user.email });
    
    // Validate blockchain type
    if (!Object.values(BlockchainType).includes(blockchainType)) {
      console.error('Invalid blockchain type:', blockchainType);
      return res.status(400).json({
        success: false,
        error: `Invalid blockchain type. Must be one of: ${Object.values(BlockchainType).join(', ')}` 
      });
    }
    
    // Generate standard message if not provided
    if (!message) {
      console.log('No message provided, generating standard auth message');
      message = authService.generateAuthMessage(walletAddress, user.id);
      console.log('Generated message:', message);
    }
    
    // Verify wallet ownership
    console.log('Verifying wallet ownership...');
    const isVerified = await authService.verifyWalletOwnership(walletAddress, signature, message, blockchainType);
    
    if (!isVerified) {
      console.error('Wallet ownership verification failed');
      return res.status(403).json({
        success: false,
        error: 'Wallet ownership verification failed. Signature does not match the expected wallet address.'
      });
    }
    
    console.log('Wallet ownership verified successfully!');
    
    // Link wallet to user
    console.log('Linking wallet to user...');
    const wallet = await authService.linkWalletToUser(user.id, walletAddress, blockchainType);
    console.log('Wallet linked successfully:', wallet);
    
    res.json({
      success: true,
      data: wallet,
      meta: {
        userId: user.id,
        blockchainType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error linking wallet:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Get user profile
 * GET /api/auth/profile
 * Requires: Authentication
 */
router.get('/profile', async (req, res) => {
  try {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // Get full user profile with wallets
    const profile = await authService.getUserById(user.id);
    
    res.json({
      success: true,
      data: profile,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Get user wallets
 * GET /api/auth/wallets
 * Requires: Authentication
 */
router.get('/wallets', async (req, res) => {
  try {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // Get user wallets
    const wallets = await authService.getUserWallets(user.id);
    
    res.json({
      success: true,
      data: wallets,
      meta: {
        count: wallets.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting wallets:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Check premium status
 * GET /api/auth/premium
 * Requires: Authentication
 */
router.get('/premium', async (req, res) => {
  try {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // Check if user has premium access
    const hasPremium = await authService.hasPremiumAccess(user.id);
    
    res.json({
      success: true,
      data: { isPremium: hasPremium },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Upgrade to premium
 * POST /api/auth/upgrade
 * Requires: Authentication
 */
router.post('/upgrade', async (req, res) => {
  try {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // In a real app, this would process payment
    // For now, just upgrade the user
    const success = await authService.upgradeToPremium(user.id);
    
    res.json({
      success: true,
      data: { isPremium: success },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error upgrading to premium:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Merge wallet session with authenticated user
 * POST /api/auth/merge-wallet
 * Body: { walletAddress, signature, message (optional), blockchainType (optional) }
 * Requires: Authentication
 */
router.post('/merge-wallet', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    let { message, blockchainType = BlockchainType.EVM } = req.body;
    
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in with Google/Email first.'
      });
    }
    
    // Validate blockchain type
    if (!Object.values(BlockchainType).includes(blockchainType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid blockchain type. Must be one of: ${Object.values(BlockchainType).join(', ')}`
      });
    }
    
    // Generate standard message if not provided
    if (!message) {
      message = authService.generateAuthMessage(walletAddress, user.id);
    }
    
    // Verify wallet ownership
    const isVerified = await authService.verifyWalletOwnership(walletAddress, signature, message, blockchainType);
    
    if (!isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Wallet ownership verification failed. Signature does not match the expected wallet address.'
      });
    }
    
    // Merge wallet session with user
    const wallet = await authService.mergeWalletSession(user.id, walletAddress, blockchainType);
    
    res.json({
      success: true,
      data: wallet,
      meta: {
        userId: user.id,
        blockchainType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error merging wallet session:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Generate authentication message for wallet verification
 * GET /api/auth/message/:wallet
 */
router.get('/message/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    // Get user from session if authenticated
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
      userId = user?.id;
    }
    
    // Generate message
    const message = authService.generateAuthMessage(wallet, userId);
    
    res.json({
      success: true,
      data: { message },
      meta: {
        walletAddress: wallet,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating auth message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});


/**
 * Get all verified wallets for a user
 * GET /api/auth/wallets
 * Requires: Authentication
 */
router.get('/wallets', async (req, res) => {
  try {
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // Get all wallets for the user
    const wallets = await authService.getUserWallets(user.id);
    
    res.json({
      success: true,
      data: wallets,
      meta: {
        userId: user.id,
        walletCount: wallets.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting user wallets:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Remove a wallet from a user's account
 * DELETE /api/auth/wallets/:walletAddress
 * Requires: Authentication
 */
router.delete('/wallets/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
      });
    }
    
    // Remove the wallet
    const success = await authService.removeWallet(user.id, walletAddress);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found or does not belong to this user'
      });
    }
    
    res.json({
      success: true,
      data: {
        walletAddress,
        removed: true
      },
      meta: {
        userId: user.id,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error removing wallet:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Wallet-only authentication
 * POST /api/auth/wallet-auth
 * Body: { walletAddress, signature, message, blockchainType, displayName }
 */
router.post('/wallet-auth', async (req, res) => {
  console.log('🔵 [WALLET-AUTH] Request received:', {
    hasWalletAddress: !!req.body.walletAddress,
    hasSignature: !!req.body.signature,
    hasMessage: !!req.body.message,
    blockchainType: req.body.blockchainType || 'evm',
    hasDisplayName: !!req.body.displayName,
    timestamp: new Date().toISOString()
  });

  try {
    const { walletAddress, signature, message, blockchainType = 'evm', displayName } = req.body;

    if (!walletAddress || !signature || !message) {
      console.warn('🟠 [WALLET-AUTH] Missing required parameters');
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: walletAddress, signature, and message are required'
      });
    }

    // Normalize wallet address for consistency
    const normalizedWallet = walletAddress.toLowerCase();
    console.log(`🔵 [WALLET-AUTH] Processing wallet: ${normalizedWallet}`);

    // Verify signature
    console.log('🔵 [WALLET-AUTH] Verifying signature...');
    const isSignatureValid = await authService.verifyEvmSignature(message, signature, normalizedWallet);
    if (!isSignatureValid) {
      console.warn(`🟠 [WALLET-AUTH] Invalid signature for wallet: ${normalizedWallet}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    console.log('🟢 [WALLET-AUTH] Signature verified successfully');

    // Check if wallet profile exists
    console.log(`🔵 [WALLET-AUTH] Checking if wallet profile exists for: ${normalizedWallet}`);
    const { data: existingWallet, error: walletError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedWallet)
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('🔴 [WALLET-AUTH] Error checking wallet profile:', walletError);
      return res.status(500).json({
        success: false,
        error: 'Error checking wallet profile'
      });
    }

    let walletProfile;
    let isNewProfile = false;

    if (!existingWallet) {
      // Create new wallet profile
      console.log(`🔵 [WALLET-AUTH] No existing wallet profile found, creating new profile for: ${normalizedWallet}`);
      isNewProfile = true;
      
      const newWalletData = {
        wallet_address: normalizedWallet,
        blockchain_type: blockchainType,
        is_primary: true,
        is_verified: true,
        verification_signature: signature,
        standalone_wallet: true,
        display_name: displayName || `Wallet ${normalizedWallet.substring(0, 6)}`,
        avatar_seed: Buffer.from(normalizedWallet).toString('hex'),
        preferences: {}
      };
      
      console.log('🔵 [WALLET-AUTH] Inserting new wallet profile with data:', {
        wallet_address: newWalletData.wallet_address,
        blockchain_type: newWalletData.blockchain_type,
        display_name: newWalletData.display_name
      });
      
      const { data: newWallet, error: createError } = await supabase
        .from('wallet_profiles')
        .insert([newWalletData])
        .select('*')
        .single();

      if (createError) {
        console.error('🔴 [WALLET-AUTH] Error creating wallet profile:', createError);
        return res.status(500).json({
          success: false,
          error: 'Error creating wallet profile'
        });
      }

      console.log('🟢 [WALLET-AUTH] New wallet profile created successfully:', {
        id: newWallet.id,
        wallet_address: newWallet.wallet_address,
        display_name: newWallet.display_name
      });
      walletProfile = newWallet;
    } else {
      // Update existing wallet profile
      console.log(`🔵 [WALLET-AUTH] Existing wallet profile found, updating profile for: ${normalizedWallet}`);
      console.log('🔵 [WALLET-AUTH] Existing profile:', {
        id: existingWallet.id,
        wallet_address: existingWallet.wallet_address,
        display_name: existingWallet.display_name,
        first_seen: existingWallet.first_seen
      });
      
      const updateData = {
        is_verified: true,
        verification_signature: signature,
        last_updated: new Date().toISOString(),
        display_name: displayName || existingWallet.display_name
      };
      
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallet_profiles')
        .update(updateData)
        .eq('wallet_address', normalizedWallet)
        .select()
        .single();
      
      console.log(`[DEBUG] Update result:`, {
        success: !!updatedWallet,
        error: updateError ? updateError.message : null,
        updatedWallet: updatedWallet || null
      });
      
      if (updateError) {
        console.error('Error updating wallet profile:', updateError);
        return res.status(500).json({
          success: false,
          error: 'Error updating wallet profile: ' + updateError.message
        });
      }
      
      walletProfile = updatedWallet;
      
      // Log wallet connection
      await supabase.from('user_activity').insert({
        user_id: walletProfile.user_id,
        wallet_address: normalizedWallet,
        blockchain_type: blockchainType,
        activity_type: 'WALLET_CONNECT',
        details: {
          standalone: walletProfile.standalone_wallet,
          success: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: walletProfile,
      meta: {
        walletAddress: normalizedWallet,
        blockchainType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in wallet authentication:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Logout wallet
 * POST /api/auth/logout
 * Body: { walletAddress }
 */
router.post('/logout', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    // Normalize wallet address to lowercase
    const normalizedWallet = walletAddress.toLowerCase();
    
    // Find the wallet profile
    const { data: walletProfile, error: walletError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedWallet)
      .single();
    
    if (!walletError && walletProfile) {
      // Log the logout activity to the activity_logs table
      try {
        await supabase.from('user_activity').insert({
          user_id: walletProfile.user_id,
          activity_type: 'WALLET_DISCONNECT',
          wallet_address: normalizedWallet,
          details: {
            blockchainType: walletProfile.blockchain_type || 'evm',
            standalone: walletProfile.standalone_wallet || false,
            success: true,
            timestamp: new Date().toISOString()
          }
        });
      } catch (logError) {
        // Non-critical error, just log it
        console.warn('Error logging wallet disconnect activity:', logError);
      }
    }
    
    // Always return success, even if wallet wasn't found
    // This ensures the client can complete the logout flow
    return res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
      meta: {
        walletAddress: normalizedWallet,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Test wallet profile endpoint - DO NOT USE IN PRODUCTION
 * Creates or updates a wallet profile without signature verification
 * POST /api/auth/test-wallet-profile
 * Body: { wallet_address }
 */
router.post('/test-wallet-profile', async (req, res) => {
  try {
    const { wallet_address } = req.body;
    
    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        error: 'Missing wallet_address in request body'
      });
    }
    
    console.log('[Test] Creating wallet profile for', wallet_address);
    
    // Get the wallet profile service instance
    const walletProfileService = WalletProfileService.getInstance();
    
    // Create a new wallet profile without verification
    const walletProfile = await walletProfileService.createOrUpdateWalletProfile(
      wallet_address.toLowerCase(),
      'evm'
    );
    
    // Log the test activity
    try {
      const activityLogService = ActivityLogService.getInstance();
      await activityLogService.logActivity({
        activity_type: 'TEST',
        wallet_address: wallet_address.toLowerCase(),
        wallet_profile_id: walletProfile.id,
        details: {
          method: 'test_endpoint'
        },
        blockchain_type: 'evm'
      });
    } catch (logError) {
      console.error('Error logging test activity:', logError);
    }
    
    return res.status(200).json({
      success: true,
      data: walletProfile,
      message: 'Wallet profile created/updated successfully'
    });
  } catch (error) {
    console.error('Error in test wallet profile endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Diagnostic Wallet Authentication Endpoint
 * For debugging wallet connection issues
 * POST /api/auth/diag-wallet-auth
 * Body: { walletAddress, signature, message, blockchainType }
 */
router.post('/diag-wallet-auth', async (req, res) => {
  try {
    console.log('[DIAG] STEP 1: Incoming request body:', req.body);
    
    const { walletAddress, signature, message, blockchainType = BlockchainType.EVM } = req.body;
    
    if (!walletAddress || !signature || !message) {
      console.error('[DIAG] ❌ Missing one or more required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: walletAddress, signature, and message are required'
      });
    }
    
    console.log('[DIAG] STEP 2: Verifying signature...');
    const isValid = await authService.verifyWalletOwnership(walletAddress, signature, message, blockchainType);
    
    if (!isValid) {
      console.error('[DIAG] ❌ Signature verification failed');
      return res.status(401).json({
        success: false,
        error: 'Invalid signature. Wallet ownership verification failed.'
      });
    }
    
    console.log('[DIAG] ✅ Signature verified for:', walletAddress);
    
    console.log('[DIAG] STEP 3: Creating or updating wallet profile...');
    const walletProfileService = WalletProfileService.getInstance();
    const walletProfile = await walletProfileService.createOrUpdateWalletProfile(
      walletAddress.toLowerCase(),
      blockchainType
    );
    
    console.log('[DIAG] ✅ Wallet profile created/updated:', walletProfile);
    
    console.log('[DIAG] STEP 4: Logging activity...');
    try {
      const activityLogService = ActivityLogService.getInstance();
      await activityLogService.logActivity({
        activity_type: 'WALLET_CONNECT',
        wallet_address: walletAddress.toLowerCase(),
        wallet_profile_id: walletProfile.id || null,
        details: {
          method: 'diag_endpoint'
        },
        blockchain_type: blockchainType
      });
      console.log('[DIAG] ✅ Activity logged.');
    } catch (logError) {
      console.error('[DIAG] ❌ Error logging activity:', logError);
    }
    
    console.log('[DIAG] STEP 5: Generating JWT token...');
    const token = authService.generateJwtToken({
      walletAddress: walletAddress.toLowerCase(),
      walletProfileId: walletProfile.id,
      timestamp: new Date().toISOString()
    });
    console.log('[DIAG] ✅ JWT generated:', token?.slice(0, 25) + '...');
    
    return res.status(200).json({
      success: true,
      data: {
        token,
        walletProfile
      },
      meta: {
        walletAddress: walletAddress.toLowerCase(),
        blockchainType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[DIAG] ❌ Unexpected error in diag-wallet-auth:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    });
  }
});

export default router;
