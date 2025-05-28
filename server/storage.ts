import { users, walletScores, tokenBalances, tradingActivity, type User, type InsertUser, type WalletScore, type InsertWalletScore, type TokenBalance, type InsertTokenBalance, type TradingActivity, type InsertTradingActivity } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWalletScore(address: string): Promise<WalletScore | undefined>;
  createWalletScore(score: InsertWalletScore): Promise<WalletScore>;
  updateWalletScore(address: string, updates: Partial<InsertWalletScore>): Promise<WalletScore | undefined>;
  
  getTokenBalances(walletAddress: string): Promise<TokenBalance[]>;
  createTokenBalance(balance: InsertTokenBalance): Promise<TokenBalance>;
  updateTokenBalance(id: number, updates: Partial<InsertTokenBalance>): Promise<TokenBalance | undefined>;
  deleteTokenBalances(walletAddress: string): Promise<void>;
  
  getTradingActivity(walletAddress: string, limit?: number): Promise<TradingActivity[]>;
  createTradingActivity(activity: InsertTradingActivity): Promise<TradingActivity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private walletScores: Map<string, WalletScore>;
  private tokenBalances: Map<string, TokenBalance[]>;
  private tradingActivities: Map<string, TradingActivity[]>;
  private currentUserId: number;
  private currentScoreId: number;
  private currentBalanceId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.walletScores = new Map();
    this.tokenBalances = new Map();
    this.tradingActivities = new Map();
    this.currentUserId = 1;
    this.currentScoreId = 1;
    this.currentBalanceId = 1;
    this.currentActivityId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWalletScore(address: string): Promise<WalletScore | undefined> {
    return this.walletScores.get(address);
  }

  async createWalletScore(score: InsertWalletScore): Promise<WalletScore> {
    const id = this.currentScoreId++;
    const now = new Date();
    const walletScore: WalletScore = {
      ...score,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.walletScores.set(score.address, walletScore);
    return walletScore;
  }

  async updateWalletScore(address: string, updates: Partial<InsertWalletScore>): Promise<WalletScore | undefined> {
    const existing = this.walletScores.get(address);
    if (!existing) return undefined;
    
    const updated: WalletScore = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.walletScores.set(address, updated);
    return updated;
  }

  async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
    return this.tokenBalances.get(walletAddress) || [];
  }

  async createTokenBalance(balance: InsertTokenBalance): Promise<TokenBalance> {
    const id = this.currentBalanceId++;
    const now = new Date();
    const tokenBalance: TokenBalance = {
      ...balance,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    const existing = this.tokenBalances.get(balance.walletAddress) || [];
    existing.push(tokenBalance);
    this.tokenBalances.set(balance.walletAddress, existing);
    
    return tokenBalance;
  }

  async updateTokenBalance(id: number, updates: Partial<InsertTokenBalance>): Promise<TokenBalance | undefined> {
    for (const [address, balances] of this.tokenBalances.entries()) {
      const index = balances.findIndex(b => b.id === id);
      if (index !== -1) {
        const updated = {
          ...balances[index],
          ...updates,
          updatedAt: new Date(),
        };
        balances[index] = updated;
        return updated;
      }
    }
    return undefined;
  }

  async deleteTokenBalances(walletAddress: string): Promise<void> {
    this.tokenBalances.delete(walletAddress);
  }

  async getTradingActivity(walletAddress: string, limit = 50): Promise<TradingActivity[]> {
    const activities = this.tradingActivities.get(walletAddress) || [];
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createTradingActivity(activity: InsertTradingActivity): Promise<TradingActivity> {
    const id = this.currentActivityId++;
    const now = new Date();
    const tradingActivity: TradingActivity = {
      ...activity,
      id,
      createdAt: now,
    };
    
    const existing = this.tradingActivities.get(activity.walletAddress) || [];
    existing.push(tradingActivity);
    this.tradingActivities.set(activity.walletAddress, existing);
    
    return tradingActivity;
  }
}

export const storage = new MemStorage();
