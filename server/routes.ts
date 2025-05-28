import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWalletScoreSchema, insertTokenBalanceSchema, insertTradingActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Wallet score endpoints
  app.get("/api/whisperer-score/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const score = await storage.getWalletScore(wallet);
      
      if (!score) {
        // Create default score for new wallet
        const defaultScore = {
          address: wallet,
          whispererScore: 50,
          degenScore: 50,
          roiScore: 50,
          portfolioValue: "0",
          dailyChange: "0",
          weeklyChange: "0",
          currentMood: "Neutral",
          tradingFrequency: "Low",
          riskLevel: "Medium",
          avgTradeSize: "0",
          dailyTrades: 0,
          profitLoss: "0",
          influenceScore: 50,
          archetype: "Novice",
          isSimulated: req.query.simulate === "true",
        };
        
        const newScore = await storage.createWalletScore(defaultScore);
        return res.json(newScore);
      }
      
      res.json(score);
    } catch (error) {
      console.error("Error fetching whisperer score:", error);
      res.status(500).json({ error: "Failed to fetch whisperer score" });
    }
  });

  app.post("/api/whisperer-score/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const validatedData = insertWalletScoreSchema.parse({
        ...req.body,
        address: wallet,
      });
      
      const existing = await storage.getWalletScore(wallet);
      let score;
      
      if (existing) {
        score = await storage.updateWalletScore(wallet, validatedData);
      } else {
        score = await storage.createWalletScore(validatedData);
      }
      
      res.json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating whisperer score:", error);
      res.status(500).json({ error: "Failed to update whisperer score" });
    }
  });

  // Token balance endpoints
  app.get("/api/token-balances/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const balances = await storage.getTokenBalances(wallet);
      res.json(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
      res.status(500).json({ error: "Failed to fetch token balances" });
    }
  });

  app.post("/api/token-balances/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const validatedData = insertTokenBalanceSchema.parse({
        ...req.body,
        walletAddress: wallet,
      });
      
      const balance = await storage.createTokenBalance(validatedData);
      res.json(balance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating token balance:", error);
      res.status(500).json({ error: "Failed to create token balance" });
    }
  });

  app.delete("/api/token-balances/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      await storage.deleteTokenBalances(wallet);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting token balances:", error);
      res.status(500).json({ error: "Failed to delete token balances" });
    }
  });

  // Trading activity endpoints
  app.get("/api/trading-activity/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getTradingActivity(wallet, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching trading activity:", error);
      res.status(500).json({ error: "Failed to fetch trading activity" });
    }
  });

  app.post("/api/trading-activity/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const validatedData = insertTradingActivitySchema.parse({
        ...req.body,
        walletAddress: wallet,
      });
      
      const activity = await storage.createTradingActivity(validatedData);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating trading activity:", error);
      res.status(500).json({ error: "Failed to create trading activity" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
