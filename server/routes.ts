/**
 * API Routes for Wallet Whisperer
 * 
 * Centralized routing configuration for the Wallet Whisperer backend.
 * Implements a clean API structure with domain-specific routes.
 * Focused on the new modular psychoanalytic card system.
 */

import express from 'express';
import { createServer } from 'http';
import config from './config';

// Import API routes
import cardsRoutes from './api/cards';
import authRoutes from './api/auth';

const router = express.Router();

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      supabase: !!config.supabase.url,
      redis: !!process.env.UPSTASH_REDIS_URL,
      dune: !!process.env.DUNE_API_KEY
    }
  });
});

// Register API routes
router.use('/api/cards', cardsRoutes);
router.use('/api/auth', authRoutes);

/**
 * Register all routes with the Express application
 */
export function registerRoutes(app: express.Express) {
  app.use(router);
  return createServer(app);
}