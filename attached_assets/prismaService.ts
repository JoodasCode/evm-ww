import { PrismaClient } from '@prisma/client';
import { getMockDataForWallet, mockWalletScores } from '../mocks/walletData';

/**
 * PrismaService provides methods for interacting with the Supabase database
 * using Prisma ORM for the Wallet Whisperer application.
 */
class PrismaService {
  private prisma: any;

  private useMockData: boolean;

  constructor() {
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
                      || process.env.DISABLE_DIRECT_DB_ACCESS === 'true';

    // Only initialize Prisma if direct DB access is not disabled
    if (!this.useMockData) {
      try {
        this.prisma = new PrismaClient();
      } catch (error) {
        console.error('Error initializing PrismaClient:', error);
        this.prisma = null;
        this.useMockData = true;
      }
    } else {
      this.prisma = null;
    }
  }

  /**
   * Get wallet scores for a specific wallet address
   */
  async getWalletScores(walletAddress: string) {
    try {
      if (this.useMockData) {
        // Return mock data when direct DB access is disabled
        const mockData = getMockDataForWallet(walletAddress);
        return mockData.scores;
      }

      if (!this.prisma) {
        throw new Error('Prisma client is not initialized');
      }

      return await this.prisma.walletScore.findUnique({
        where: { wallet_address: walletAddress },
      });
    } catch (error) {
      console.error('Error getting wallet scores:', error);
      if (this.useMockData) {
        // Return mock data if there's an error and we're using mock data
        const mockData = getMockDataForWallet(walletAddress);
        return mockData.scores;
      }
      throw error;
    }
  }

  /**
   * Update wallet scores for a specific wallet address
   */
  async updateWalletScores(walletAddress: string, data: any) {
    try {
      return await this.prisma.walletScore.upsert({
        where: { wallet_address: walletAddress },
        update: data,
        create: {
          wallet_address: walletAddress,
          ...data,
        },
      });
    } catch (error) {
      console.error('Error updating wallet scores:', error);
      throw error;
    }
  }

  /**
   * Get wallet holdings for a specific wallet address
   */
  async getWalletHoldings(walletAddress: string) {
    try {
      return await this.prisma.walletHolding.findMany({
        where: { wallet_address: walletAddress },
        orderBy: { value: 'desc' },
      });
    } catch (error) {
      console.error('Error getting wallet holdings:', error);
      throw error;
    }
  }

  /**
   * Update wallet holdings for a specific wallet address
   */
  async updateWalletHoldings(walletAddress: string, holdings: any[]) {
    try {
      // First delete existing holdings
      await this.prisma.walletHolding.deleteMany({
        where: { wallet_address: walletAddress },
      });

      // Then create new holdings
      const createPromises = holdings.map((holding) => this.prisma.walletHolding.create({
        data: {
          ...holding,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      }));

      return await Promise.all(createPromises);
    } catch (error) {
      console.error('Error updating wallet holdings:', error);
      throw error;
    }
  }

  /**
   * Get wallet trades for a specific wallet address
   */
  async getWalletTrades(walletAddress: string, limit = 50) {
    try {
      return await this.prisma.walletTrade.findMany({
        where: { wallet_address: walletAddress },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting wallet trades:', error);
      throw error;
    }
  }

  /**
   * Add wallet trades for a specific wallet address
   */
  async addWalletTrades(walletAddress: string, trades: any[]) {
    try {
      const createPromises = trades.map((trade) => this.prisma.walletTrade.create({
        data: {
          ...trade,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      }));

      return await Promise.all(createPromises);
    } catch (error) {
      console.error('Error adding wallet trades:', error);
      throw error;
    }
  }

  /**
   * Get wallet behavior tags for a specific wallet address
   */
  async getWalletBehaviorTags(walletAddress: string) {
    try {
      return await this.prisma.walletBehaviorTag.findMany({
        where: { wallet_address: walletAddress },
        orderBy: { confidence: 'desc' },
      });
    } catch (error) {
      console.error('Error getting wallet behavior tags:', error);
      throw error;
    }
  }

  /**
   * Update wallet behavior tags for a specific wallet address
   */
  async updateWalletBehaviorTags(walletAddress: string, tags: any[]) {
    try {
      // First delete existing tags
      await this.prisma.walletBehaviorTag.deleteMany({
        where: { wallet_address: walletAddress },
      });

      // Then create new tags
      const createPromises = tags.map((tag) => this.prisma.walletBehaviorTag.create({
        data: {
          ...tag,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      }));

      return await Promise.all(createPromises);
    } catch (error) {
      console.error('Error updating wallet behavior tags:', error);
      throw error;
    }
  }

  /**
   * Get wallet behavior for a specific wallet address
   */
  async getWalletBehavior(walletAddress: string) {
    try {
      return await this.prisma.walletBehavior.findUnique({
        where: { wallet_address: walletAddress },
      });
    } catch (error) {
      console.error('Error getting wallet behavior:', error);
      throw error;
    }
  }

  /**
   * Update wallet behavior for a specific wallet address
   */
  async updateWalletBehavior(walletAddress: string, data: any) {
    try {
      return await this.prisma.walletBehavior.upsert({
        where: { wallet_address: walletAddress },
        update: data,
        create: {
          wallet_address: walletAddress,
          ...data,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      });
    } catch (error) {
      console.error('Error updating wallet behavior:', error);
      throw error;
    }
  }

  /**
   * Get wallet connections for a specific wallet address
   */
  async getWalletConnections(walletAddress: string) {
    try {
      return await this.prisma.walletConnection.findMany({
        where: { wallet_address: walletAddress },
        orderBy: { connection_strength: 'desc' },
      });
    } catch (error) {
      console.error('Error getting wallet connections:', error);
      throw error;
    }
  }

  /**
   * Update wallet connections for a specific wallet address
   */
  async updateWalletConnections(walletAddress: string, connections: any[]) {
    try {
      // First delete existing connections
      await this.prisma.walletConnection.deleteMany({
        where: { wallet_address: walletAddress },
      });

      // Then create new connections
      const createPromises = connections.map((connection) => this.prisma.walletConnection.create({
        data: {
          ...connection,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      }));

      return await Promise.all(createPromises);
    } catch (error) {
      console.error('Error updating wallet connections:', error);
      throw error;
    }
  }

  /**
   * Get wallet activity for a specific wallet address
   */
  async getWalletActivity(walletAddress: string, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await this.prisma.walletActivity.findMany({
        where: {
          wallet_address: walletAddress,
          date: { gte: startDate },
        },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      console.error('Error getting wallet activity:', error);
      throw error;
    }
  }

  /**
   * Add wallet activity for a specific wallet address
   */
  async addWalletActivity(walletAddress: string, activity: any) {
    try {
      return await this.prisma.walletActivity.create({
        data: {
          ...activity,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      });
    } catch (error) {
      console.error('Error adding wallet activity:', error);
      throw error;
    }
  }

  /**
   * Get wallet network for a specific wallet address
   */
  async getWalletNetwork(walletAddress: string) {
    try {
      return await this.prisma.walletNetwork.findUnique({
        where: { wallet_address: walletAddress },
      });
    } catch (error) {
      console.error('Error getting wallet network:', error);
      throw error;
    }
  }

  /**
   * Update wallet network for a specific wallet address
   */
  async updateWalletNetwork(walletAddress: string, data: any) {
    try {
      return await this.prisma.walletNetwork.upsert({
        where: { wallet_address: walletAddress },
        update: data,
        create: {
          wallet_address: walletAddress,
          ...data,
          wallet: { connect: { wallet_address: walletAddress } },
        },
      });
    } catch (error) {
      console.error('Error updating wallet network:', error);
      throw error;
    }
  }

  /**
   * Get top wallets by whisperer score
   */
  async getTopWallets(limit = 10) {
    if (this.useMockData) {
      // Get all mock wallets and sort by whisperer_score
      const wallets = Object.values(mockWalletScores);
      return wallets
        .sort((a: any, b: any) => b.whisperer_score - a.whisperer_score)
        .slice(0, limit);
    }

    try {
      return await this.prisma.walletScore.findMany({
        orderBy: { whisperer_score: 'desc' },
        take: limit,
        include: {
          behavior_tags: true,
          behavior: true,
        },
      });
    } catch (error) {
      console.error('Error getting top wallets:', error);
      throw error;
    }
  }
}

const prismaServiceInstance = new PrismaService();

export const prismaService = prismaServiceInstance;
