import { createClient } from '@supabase/supabase-js';
import { prisma } from './prisma';
import { ethers } from 'ethers';
import env from './env';

// Use type inference from the prisma instance instead of direct imports
type User = Awaited<ReturnType<typeof prisma.user.findUnique>> & {
  wallets?: WalletProfile[];
};
type WalletProfile = Awaited<ReturnType<typeof prisma.walletProfile.findUnique>>;

// Initialize Supabase client with fallback
let supabase;

try {
  // Get Supabase credentials from our env module which loads from .env.local
  const supabaseUrl = env.supabase.url;
  const supabaseAnonKey = env.supabase.anonKey;
  const supabaseServiceKey = env.supabase.serviceKey;

  // Log the actual URL we're using (for debugging)
  console.log(`Initializing Supabase with URL: ${supabaseUrl || 'undefined'}`);
  
  if (supabaseUrl && (supabaseAnonKey || supabaseServiceKey)) {
    // Use service role key if available for server-side operations
    const key = supabaseServiceKey || supabaseAnonKey;
    
    // Ensure we have a valid key (TypeScript check)
    if (!key) {
      throw new Error('No valid Supabase key available');
    }
    
    console.log(`Using Supabase key type: ${supabaseServiceKey ? 'SERVICE_KEY' : 'ANON_KEY'}`);
    
    // Create the Supabase client with the URL and key
    supabase = createClient(supabaseUrl, key);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Missing Supabase credentials. Using mock Supabase client.');
    // Create a mock Supabase client for development/testing
    supabase = createMockSupabaseClient();
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Fallback to mock Supabase client
  supabase = createMockSupabaseClient();
}

/**
 * Creates a mock Supabase client that implements the basic methods
 * used in this application but doesn't actually connect to Supabase.
 * This is used as a fallback when Supabase is not available.
 */
function createMockSupabaseClient(): any {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signIn: async () => ({ data: null, error: new Error('Mock Supabase: Auth not available') }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => null
        })
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null })
    })
  };
}

export { supabase };

// Supported blockchain types
export enum BlockchainType {
  EVM = 'evm'
  // SOLANA = 'solana' - to be added later
}

// This export is kept for backward compatibility
export function generateAuthMessage(walletAddress: string, userId?: string): string {
  const authService = new AuthService();
  return authService.generateAuthMessage(walletAddress, userId);
}

/**
 * Authentication service for Wallet Whisperer
 * Implements hybrid auth flow with WalletConnect and Google OAuth
 */
export class AuthService {
  /**
   * Generate a standardized authentication message for wallet signature
   * @param walletAddress The wallet address to include in the message
   * @param userId Optional user ID to include in the message
   * @returns A formatted authentication message string
   */
  generateAuthMessage(walletAddress: string, userId?: string): string {
    const timestamp = new Date().toISOString();
    const normalizedAddress = walletAddress.toLowerCase();
    let message = `Sign this message to verify your wallet ownership: ${normalizedAddress}\nTimestamp: ${timestamp}`;
    
    if (userId) {
      message += `\nUser ID: ${userId}`;
    }
    
    return message;
  }
  
  /**
   * Verify wallet ownership by validating the signature
   * @param walletAddress The wallet address to verify
   * @param signature The signature to verify
   * @param message The message that was signed
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns True if the wallet ownership is verified, false otherwise
   */
  async verifyWalletOwnership(
    walletAddress: string, 
    signature: string, 
    message: string, 
    blockchainType: BlockchainType
  ): Promise<boolean> {
    if (!walletAddress || !signature || !message) {
      console.error('Missing required parameters for wallet ownership verification');
      return false;
    }
    
    try {
      // Normalize the wallet address
      const normalizedAddress = walletAddress.toLowerCase();
      
      // Verify the signature based on blockchain type
      return this.verifyWalletSignature(message, signature, normalizedAddress, blockchainType);
    } catch (error) {
      console.error('Error verifying wallet ownership:', error);
      return false;
    }
  }
  
  /**
   * Link a wallet to a user account
   * @param userId The user ID to link the wallet to
   * @param walletAddress The wallet address to link
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns The created or updated wallet profile
   */
  async linkWalletToUser(userId: string, walletAddress: string, blockchainType: BlockchainType): Promise<WalletProfile> {
    try {
      return this.createOrUpdateWalletProfile(walletAddress, userId, blockchainType);
    } catch (error) {
      console.error('Error linking wallet to user:', error);
      throw error;
    }
  }
  
  /**
   * Get a user by their ID with all linked wallets
   * @param userId The user ID to look up
   * @returns The user with their wallets, or null if not found
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return null;

      // Get wallets separately
      const wallets = await prisma.walletProfile.findMany({
        where: { userId: userId }
      });

      // Add wallets to user object
      return {
        ...user,
        wallets: wallets
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Get user by wallet address
   * @param walletAddress The wallet address to look up
   * @returns The user associated with the wallet address, or null if not found
   */
  async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      
      // Find the wallet profile
      const walletProfile = await prisma.walletProfile.findUnique({
        where: { walletAddress: normalizedAddress },
        include: { user: true }
      });
      
      if (!walletProfile) return null;
      
      // Get the associated user with wallets
      const user = walletProfile.user;
      if (!user) return null;
      
      // Get all wallets for this user
      const wallets = await prisma.walletProfile.findMany({
        where: { userId: user.id }
      });
      
      return {
        ...user,
        wallets
      };
    } catch (error) {
      console.error(`Error getting user by wallet address ${walletAddress}:`, error);
      return null;
    }
  }

  /**
   * Check if a user has premium access
   * @param userId The user ID to check
   * @returns True if the user has premium access, false otherwise
   */
  async hasPremiumAccess(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPremium: true }
      });
      
      return !!user?.isPremium;
    } catch (error) {
      console.error(`Error checking premium access for user ${userId}:`, error);
      return false;
    }
  }
  
  /**
   * Upgrade a user to premium status
   * @param userId The user ID to upgrade
   * @returns True if the upgrade was successful, false otherwise
   */
  async upgradeToPremium(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true }
      });
      
      console.log(`User ${userId} upgraded to premium`);
      return true;
    } catch (error) {
      console.error(`Error upgrading user ${userId} to premium:`, error);
      return false;
    }
  }
  /**
   * Verify an EVM wallet signature using ethers.js
   * @param message The message that was signed
   * @param signature The signature to verify
   * @param walletAddress The wallet address that supposedly signed the message
   * @returns True if the signature is valid, false otherwise
   */
  async verifyEvmSignature(message: string, signature: string, walletAddress: string): Promise<boolean> {
    if (!message || !signature || !walletAddress) {
      console.error('Missing required parameters for signature verification');
      return false;
    }
    
    try {
      // Normalize the wallet address to lowercase for comparison
      const normalizedWalletAddress = walletAddress.toLowerCase();
      
      // Log the inputs for debugging
      console.log('Verifying EVM signature with:', {
        message,
        signature,
        walletAddress: normalizedWalletAddress
      });
      
      // Use ethers.js to recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      const normalizedRecoveredAddress = recoveredAddress.toLowerCase();
      
      console.log('Recovered address:', normalizedRecoveredAddress);
      
      // Compare the recovered address with the provided wallet address
      const isValid = normalizedRecoveredAddress === normalizedWalletAddress;
      
      if (!isValid) {
        console.warn(`Signature verification failed: recovered address ${normalizedRecoveredAddress} does not match provided address ${normalizedWalletAddress}`);
      } else {
        console.log('Signature verification successful!');
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying EVM signature:', error);
      return false;
    }
  }

  /**
   * Verify a Solana wallet signature - TO BE IMPLEMENTED LATER
   * This is a placeholder for future Solana support as per project requirements
   * Currently focusing only on EVM wallets
   * 
   * @param message The message that was signed
   * @param signature The signature to verify
   * @param walletAddress The wallet address that supposedly signed the message
   * @returns False since Solana verification is not implemented yet
   */
  async verifySolanaSignature(message: string, signature: string, walletAddress: string): Promise<boolean> {
    console.warn('Solana signature verification not implemented yet - focusing on EVM wallets only');
    // When implementing, will need to use ed25519 verification via tweetnacl or similar library
    return false;
  }

  /**
   * Verify a wallet signature based on the blockchain type
   * @param message The message that was signed
   * @param signature The signature to verify
   * @param walletAddress The wallet address that supposedly signed the message
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns True if the signature is valid, false otherwise
   * @throws Error if the signature or message format is invalid
   */
  async verifyWalletSignature(
    message: string,
    signature: string,
    walletAddress: string,
    blockchainType: BlockchainType
  ): Promise<boolean> {
    if (!message || !signature || !walletAddress) {
      throw new Error('Message, signature, and wallet address are required for verification');
    }
    
    if (blockchainType === BlockchainType.EVM) {
      return this.verifyEvmSignature(message, signature, walletAddress);
    }
    
    // Support for other blockchain types will be added later
    console.warn(`Signature verification for ${blockchainType} not implemented yet`);
    return false;
  }

  /**
   * Get all wallets verified and linked to a specific user
   * @param userId The user ID to get wallets for
   * @returns Array of wallet profiles for the user
   */
  async getUserWallets(userId: string): Promise<WalletProfile[]> {
    try {
      const wallets = await prisma.walletProfile.findMany({
        where: { userId },
        orderBy: { lastUpdated: 'desc' }
      });
      
      return wallets;
    } catch (error) {
      console.error(`Error getting wallets for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Remove a wallet from a user's account
   * @param userId The user ID who owns the wallet
   * @param walletAddress The wallet address to remove
   * @returns True if the wallet was removed, false otherwise
   */
  async removeWallet(userId: string, walletAddress: string): Promise<boolean> {
    try {
      // Check if the wallet belongs to the user
      const wallet = await prisma.walletProfile.findFirst({
        where: {
          userId,
          walletAddress: walletAddress.toLowerCase()
        }
      });

      if (!wallet) {
        return false; // Wallet not found or doesn't belong to user
      }

      // Delete the wallet profile
      await prisma.walletProfile.delete({
        where: { id: wallet.id }
      });

      console.log(`Wallet ${walletAddress} removed for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error removing wallet:', error);
      return false;
    }
  }

  /**
   * Merge a wallet session with an existing user account
   * @param userId The user ID to merge with
   * @param walletAddress The wallet address to link
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns True if the merge was successful, false otherwise
   */
  async mergeWalletSession(userId: string, walletAddress: string, blockchainType: BlockchainType): Promise<boolean> {
    if (!userId || !walletAddress) {
      console.error('Missing required parameters for mergeWalletSession');
      return false;
    }
    
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      
      const existingWallet = await prisma.walletProfile.findUnique({
        where: { walletAddress: normalizedAddress }
      });

      if (existingWallet) {
        // If wallet already exists and belongs to a different user, update it
        if (existingWallet.userId !== userId) {
          await prisma.walletProfile.update({
            where: { id: existingWallet.id },
            data: { userId }
          });
          console.log(`Wallet ${normalizedAddress} transferred to user ${userId}`);
        } else {
          console.log(`Wallet ${normalizedAddress} already belongs to user ${userId}`);
        }
        return true;
      } else {
        // Create a new wallet profile
        await prisma.walletProfile.create({
          data: {
            userId,
            walletAddress: normalizedAddress,
            blockchainType
          }
        });
        console.log(`New wallet ${normalizedAddress} created for user ${userId}`);
        return true;
      }
    } catch (error) {
      console.error('Error merging wallet session:', error);
      return false;
    }
  }

  /**
   * Create or update a wallet profile for a user
   * @param walletAddress The wallet address to link
   * @param userId The user ID to link the wallet to
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns The created or updated wallet profile
   */
  async createOrUpdateWalletProfile(walletAddress: string, userId: string, blockchainType: BlockchainType): Promise<WalletProfile> {
    try {
      const existingWallet = await prisma.walletProfile.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() }
      });

      if (existingWallet) {
        // Update the existing wallet profile
        return prisma.walletProfile.update({
          where: { id: existingWallet.id },
          data: { userId, blockchainType }
        });
      } else {
        // Create a new wallet profile
        return prisma.walletProfile.create({
          data: {
            walletAddress: walletAddress.toLowerCase(),
            userId,
            blockchainType
          }
        });
      }
    } catch (error) {
      console.error('Error creating/updating wallet profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AuthService();
