import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const walletScores = pgTable("wallet_scores", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  whispererScore: integer("whisperer_score").notNull().default(50),
  degenScore: integer("degen_score").notNull().default(50),
  roiScore: integer("roi_score").notNull().default(50),
  portfolioValue: decimal("portfolio_value", { precision: 18, scale: 8 }).notNull().default("0"),
  dailyChange: decimal("daily_change", { precision: 10, scale: 4 }).notNull().default("0"),
  weeklyChange: decimal("weekly_change", { precision: 10, scale: 4 }).notNull().default("0"),
  currentMood: text("current_mood").notNull().default("Neutral"),
  tradingFrequency: text("trading_frequency").notNull().default("Low"),
  riskLevel: text("risk_level").notNull().default("Medium"),
  avgTradeSize: decimal("avg_trade_size", { precision: 18, scale: 8 }).notNull().default("0"),
  dailyTrades: integer("daily_trades").notNull().default(0),
  profitLoss: decimal("profit_loss", { precision: 18, scale: 8 }).notNull().default("0"),
  influenceScore: integer("influence_score").notNull().default(50),
  archetype: text("archetype").default("Novice"),
  isSimulated: boolean("is_simulated").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tokenBalances = pgTable("token_balances", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  mint: text("mint").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  decimals: integer("decimals").notNull(),
  usdValue: decimal("usd_value", { precision: 18, scale: 8 }).notNull().default("0"),
  logo: text("logo"),
  category: text("category"),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tradingActivity = pgTable("trading_activity", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  signature: text("signature").notNull().unique(),
  type: text("type").notNull(), // 'buy', 'sell', 'swap'
  tokenIn: text("token_in"),
  tokenOut: text("token_out"),
  amountIn: decimal("amount_in", { precision: 18, scale: 8 }),
  amountOut: decimal("amount_out", { precision: 18, scale: 8 }),
  usdValue: decimal("usd_value", { precision: 18, scale: 8 }),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWalletScoreSchema = createInsertSchema(walletScores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTokenBalanceSchema = createInsertSchema(tokenBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradingActivitySchema = createInsertSchema(tradingActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WalletScore = typeof walletScores.$inferSelect;
export type InsertWalletScore = z.infer<typeof insertWalletScoreSchema>;
export type TokenBalance = typeof tokenBalances.$inferSelect;
export type InsertTokenBalance = z.infer<typeof insertTokenBalanceSchema>;
export type TradingActivity = typeof tradingActivity.$inferSelect;
export type InsertTradingActivity = z.infer<typeof insertTradingActivitySchema>;
