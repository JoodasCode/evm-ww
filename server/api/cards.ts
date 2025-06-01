import express, { Request, Response, NextFunction } from 'express';
import cardController from '../lib/cards';
import authService from '../lib/auth';
import { supabase } from '../lib/supabase';

const router = express.Router();

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify wallet ownership
 * This ensures users can only analyze wallets they've verified ownership of
 */
async function verifyWalletOwnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Skip verification for card types endpoint
    if (req.path === '/types') {
      return next();
    }
    
    const walletAddress = req.params.wallet;
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    // Get user from session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to analyze wallets'
      });
    }
    
    const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token'
      });
    }
    
    // Check if user has verified ownership of this wallet
    const hasVerified = await authService.hasVerifiedWallet(user.id, walletAddress);
    if (!hasVerified) {
      return res.status(403).json({
        success: false,
        error: 'You can only analyze wallets you have verified ownership of',
        meta: {
          walletAddress,
          userId: user.id
        }
      });
    }
    
    // Add user to request for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in wallet ownership verification middleware:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Apply middleware to all routes except explicitly excluded ones
router.use(verifyWalletOwnership);

/**
 * Get all cards for a wallet
 * GET /api/cards/:wallet
 */
router.get('/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const forceRefresh = req.query.refresh === 'true';
    
    const cards = await cardController.getAllCards(wallet, forceRefresh);
    
    res.json({
      success: true,
      data: cards,
      meta: {
        walletAddress: wallet,
        cardCount: cards.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Get specific card for a wallet
 * GET /api/cards/:wallet/:cardType
 */
router.get('/:wallet/:cardType', async (req, res) => {
  try {
    const { wallet, cardType } = req.params;
    const forceRefresh = req.query.refresh === 'true';
    
    const card = await cardController.getCard(wallet, cardType, forceRefresh);
    
    res.json({
      success: true,
      data: card,
      meta: {
        walletAddress: wallet,
        cardType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error fetching card ${req.params.cardType}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Get multiple cards for a wallet
 * POST /api/cards/:wallet/batch
 * Body: { cardTypes: string[] }
 */
router.post('/:wallet/batch', async (req, res) => {
  try {
    const { wallet } = req.params;
    const { cardTypes } = req.body;
    const forceRefresh = req.query.refresh === 'true';
    
    if (!Array.isArray(cardTypes) || cardTypes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid cardTypes. Must be a non-empty array.'
      });
    }
    
    const cards = await cardController.getCards(wallet, cardTypes, forceRefresh);
    
    res.json({
      success: true,
      data: cards,
      meta: {
        walletAddress: wallet,
        requestedTypes: cardTypes,
        cardCount: cards.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching batch cards:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

/**
 * Get available card types
 * GET /api/cards/types
 */
router.get('/types', (req, res) => {
  try {
    const cardTypes = cardController.getAvailableCardTypes();
    
    res.json({
      success: true,
      data: cardTypes,
      meta: {
        count: cardTypes.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching card types:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;
