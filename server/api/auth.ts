import express from 'express';
import authService, { supabase, BlockchainType } from '../lib/auth';

const router = express.Router();

/**
 * Helper function to extract user from authorization header
 * @param authHeader Authorization header from request
 * @returns User object if authenticated, null otherwise
 */
async function getUserFromAuth(authHeader?: string): Promise<any> {
  if (!authHeader) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
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
    const { walletAddress, signature } = req.body;
    let { message, blockchainType = BlockchainType.EVM } = req.body;
    
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please sign in.'
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
    
    // Link wallet to user
    const wallet = await authService.linkWalletToUser(user.id, walletAddress, blockchainType);
    
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

export default router;
