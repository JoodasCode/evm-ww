import express from 'express';
import authService, { supabase, BlockchainType } from '../lib/auth';

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
  try {
    const { walletAddress, signature, message, displayName } = req.body;
    let { blockchainType = BlockchainType.EVM } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: walletAddress, signature, and message are required'
      });
    }
    
    // Normalize wallet address to lowercase
    const normalizedWallet = walletAddress.toLowerCase();
    
    // Verify wallet ownership
    console.log('Verifying wallet ownership...');
    const isVerified = await authService.verifyWalletOwnership(normalizedWallet, signature, message, blockchainType);
    
    if (!isVerified) {
      console.error('Wallet ownership verification failed');
      return res.status(403).json({
        success: false,
        error: 'Wallet ownership verification failed. Signature does not match the expected wallet address.'
      });
    }
    
    // Check if wallet profile exists
    const { data: existingWallet, error: walletError } = await supabase
      .from('wallet_profiles')
      .select('*')
      .eq('wallet_address', normalizedWallet)
      .single();
    
    let walletProfile;
    
    if (walletError || !existingWallet) {
      // Create new standalone wallet profile
      const { data: newWallet, error: createError } = await supabase
        .from('wallet_profiles')
        .insert({
          wallet_address: normalizedWallet,
          blockchain_type: blockchainType,
          is_primary: true,
          is_verified: true,
          standalone_wallet: true,
          display_name: displayName || `Wallet ${normalizedWallet.substring(0, 4)}...${normalizedWallet.substring(normalizedWallet.length - 4)}`,
          avatar_seed: Buffer.from(normalizedWallet).toString('hex'),
          verification_signature: signature
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating wallet profile:', createError);
        return res.status(500).json({
          success: false,
          error: 'Error creating wallet profile: ' + createError.message
        });
      }
      
      walletProfile = newWallet;
      
      // Log first wallet connection
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
    } else {
      // Update existing wallet profile
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallet_profiles')
        .update({
          last_updated: new Date().toISOString(),
          verification_signature: signature,
          // Only update display name if provided and wallet is standalone
          ...(displayName && existingWallet.standalone_wallet ? { display_name: displayName } : {})
        })
        .eq('wallet_address', normalizedWallet)
        .select()
        .single();
      
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

export default router;
