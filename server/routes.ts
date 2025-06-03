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
import healthRoutes from './api/health';
import debugRoutes from './api/debug';

const router = express.Router();

// Register API routes
router.use('/api/health', healthRoutes);
router.use('/api/debug', debugRoutes);

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