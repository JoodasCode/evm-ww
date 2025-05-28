import { createClient } from '@supabase/supabase-js';
import { prismaService as prismaServiceInstance } from './prismaService';

/**
 * SupabaseService provides methods for authenticating with the Solana wallet
 * and interacting with the Supabase database.
 */
class SupabaseService {
  private supabaseUrl: string;

  private supabaseKey: string;

  private supabaseClient: any;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdcsjcpzhdocnkbxxxwf.supabase.co';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODM3MzYsImV4cCI6MjA2MzU1OTczNn0.uOkuZSDa-bYODRKanApWUJIUOCliGgPQAc4ad_jlUME';
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  }

  /**
   * Get the Supabase client instance
   */
  getClient() {
    return this.supabaseClient;
  }

  /**
   * Authenticate with Solana wallet
   */
  async authenticateWithWallet(walletAddress: string, signature: string, message: string) {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email: `${walletAddress}@wallet-whisperer.io`,
        password: signature,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error authenticating with wallet:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await this.supabaseClient.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Get wallet scores for a specific wallet address
   * @param walletAddress - The wallet address to fetch scores for
   * @returns The wallet scores data or null if not found
   */
  async getWalletScores(walletAddress: string) {
    try {
      // Query the wallet_scores table with clean error handling
      const { data, error } = await this.supabaseClient
        .from('wallet_scores')
        .select('*')
        .eq('address', walletAddress)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - not necessarily an error
          console.log(`No wallet scores found for address: ${walletAddress}`);
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting wallet scores:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletScores(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return null;
      }
    }
  }

  /**
   * Get wallet holdings for a specific wallet address
   * @param walletAddress - The wallet address to fetch holdings for
   * @returns Array of wallet holdings or empty array if none found
   */
  async getWalletHoldings(walletAddress: string) {
    try {
      // Query the wallet_holdings table with improved error handling
      const { data, error } = await this.supabaseClient
        .from('wallet_holdings')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('value', { ascending: false });

      if (error) {
        console.error(`Supabase error fetching holdings for ${walletAddress}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting wallet holdings:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletHoldings(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }

  /**
   * Get wallet trades for a specific wallet address
   * @param walletAddress - The wallet address to fetch trades for
   * @param limit - Maximum number of trades to return (default: 50)
   * @returns Array of wallet trades sorted by most recent first
   */
  async getWalletTrades(walletAddress: string, limit = 50) {
    try {
      // Query the wallet_trades table with improved error handling
      const { data, error } = await this.supabaseClient
        .from('wallet_trades')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`Supabase error fetching trades for ${walletAddress}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting wallet trades:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletTrades(walletAddress, limit);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }

  /**
   * Get wallet behavior tags directly from Supabase
   */
  async getWalletBehaviorTags(walletAddress: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallet_behavior_tags')
        .select('*')
        .eq('wallet_address', walletAddress);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wallet behavior tags:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletBehaviorTags(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }

  /**
   * Get wallet behavior directly from Supabase
   */
  async getWalletBehavior(walletAddress: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallet_behavior')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wallet behavior:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletBehavior(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return null;
      }
    }
  }

  /**
   * Get wallet connections directly from Supabase
   */
  async getWalletConnections(walletAddress: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallet_connections')
        .select('*')
        .eq('wallet_address', walletAddress);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wallet connections:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletConnections(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }

  /**
   * Get wallet activity directly from Supabase
   */
  async getWalletActivity(walletAddress: string, days = 30) {
    try {
      // Calculate the date from 'days' ago
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await this.supabaseClient
        .from('wallet_activity')
        .select('*')
        .eq('wallet_address', walletAddress)
        .gte('date', fromDate.toISOString())
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wallet activity:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletActivity(walletAddress, days);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }

  /**
   * Get wallet network directly from Supabase
   */
  async getWalletNetwork(walletAddress: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallet_network')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wallet network:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getWalletNetwork(walletAddress);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return null;
      }
    }
  }

  /**
   * Get top wallets by whisperer score
   * @param limit - Maximum number of wallets to return (default: 10)
   * @returns Array of top-performing wallets sorted by whisperer score
   */
  async getTopWallets(limit = 10) {
    try {
      // Query the wallet_scores table with improved error handling
      const { data, error } = await this.supabaseClient
        .from('wallet_scores')
        .select('*')
        .order('whisperer_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase error fetching top wallets:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting top wallets:', error);
      // Fall back to PrismaService if available
      try {
        return await prismaServiceInstance.getTopWallets(limit);
      } catch (prismaError) {
        console.error('Prisma fallback also failed:', prismaError);
        return [];
      }
    }
  }
  
  /**
   * Get wallet label profile from Supabase
   * @param walletAddress - The wallet address to fetch label profile for
   * @returns The wallet label profile or null if not found
   */
  async getWalletLabelProfile(walletAddress: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallet_labels')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - not necessarily an error
          console.log(`No wallet label profile found for address: ${walletAddress}`);
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting wallet label profile:', error);
      return null;
    }
  }
  
  /**
   * Update wallet label profile in Supabase
   * @param walletAddress - The wallet address to update label profile for
   * @param labelProfile - The label profile data to update
   * @returns The updated wallet label profile or null if update failed
   */
  async updateWalletLabelProfile(walletAddress: string, labelProfile: any) {
    try {
      // Check if profile exists first
      const existingProfile = await this.getWalletLabelProfile(walletAddress);
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await this.supabaseClient
          .from('wallet_labels')
          .update({
            archetype: labelProfile.archetype,
            mood: labelProfile.mood,
            traits: labelProfile.traits,
            last_updated: new Date().toISOString(),
          })
          .eq('wallet_address', walletAddress)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new profile
        const { data, error } = await this.supabaseClient
          .from('wallet_labels')
          .insert({
            wallet_address: walletAddress,
            archetype: labelProfile.archetype,
            mood: labelProfile.mood,
            traits: labelProfile.traits,
            last_updated: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating wallet label profile:', error);
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();
