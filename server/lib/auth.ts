import { supabase } from './supabase';
import supabaseAdmin from './supabase-admin';
import { prisma } from './prisma';
import { ethers } from 'ethers';
import env from './env';
import jwt from 'jsonwebtoken';
import mockWalletProfileService, { MockWalletProfile } from './mock-wallet-profile';
import { ActivityLogService } from './activity-log-service';



// Use type inference from the prisma instance instead of direct imports
// Define types based on Prisma schema
type User = Awaited<ReturnType<typeof prisma.user.findUnique>> & {
  wallets?: WalletProfile[];
};

// Extended WalletProfile type to include all fields from both Prisma and Mock implementations
type WalletProfile = Awaited<ReturnType<typeof prisma.walletProfile.findUnique>> & {
  displayName?: string;
  avatarSeed?: string;
  isPrimary?: boolean;
  isVerified?: boolean;
  standaloneWallet?: boolean;
  preferences?: Record<string, any>;
};

// Log the Supabase configuration status
console.log('Auth service: Using Supabase clients from imports');

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
   * Generate a JWT token for authenticated users
   * @param payload Data to include in the JWT token
   * @param expiresIn Token expiration time (default: 24h)
   * @returns JWT token string
   */
  generateJwtToken(payload: Record<string, any>, expiresIn: string = '24h'): string {
    try {
      // Get the secret key from environment or use a default for development
      const jwtSecret = process.env.JWT_SECRET || 'wallet-whisperer-jwt-secret-dev-only';
      
      // Use a more direct approach to avoid TypeScript errors
      // This is safe because we know the types are correct at runtime
      return jwt.sign(payload, jwtSecret, { expiresIn } as any);
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw error;
    }
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
   * Link a wallet to a user account (wallet-only authentication, userId is ignored)
   * @param userId The user ID (ignored in wallet-only auth)
   * @param walletAddress The wallet address to link
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @returns The created or updated wallet profile
   */
  async linkWalletToUser(userId: string, walletAddress: string, blockchainType: BlockchainType): Promise<WalletProfile> {
    try {
      // In wallet-only authentication, we ignore the userId parameter
      return this.createOrUpdateWalletProfile(walletAddress, blockchainType);
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
      
      // Use ethers.js v5 to recover the address from the signature
      // ethers.utils.verifyMessage is the correct API for v5
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
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
   * Create or update a wallet profile
   * @param walletAddress The wallet address to create or update
   * @param blockchainType The type of blockchain (EVM or Solana)
   * @param displayName Optional display name for the wallet
   * @returns The created or updated wallet profile
   */
  async createOrUpdateWalletProfile(
    walletAddress: string, 
    blockchainType: BlockchainType,
    displayName?: string
  ): Promise<WalletProfile | MockWalletProfile> {
    // Always normalize wallet address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();
    console.log(`Creating/updating wallet profile for address: ${normalizedAddress}`);
    
    try {
      // First try using Prisma (our primary data access method)
      // Use the correct field mapping as defined in the Prisma schema
      // The Prisma schema maps walletAddress to wallet_address in the database
      const existingWallet = await prisma.walletProfile.findUnique({
        where: { walletAddress: normalizedAddress }
      });

      console.log('Existing wallet check result:', existingWallet ? 'Found' : 'Not found');
      
      let result;
      if (existingWallet) {
        // Update the existing wallet profile
        console.log(`Updating existing wallet profile with ID: ${existingWallet.id}`);
        result = await prisma.walletProfile.update({
          where: { id: existingWallet.id },
          data: {
            // These field names match the Prisma schema which maps to snake_case in DB
            blockchainType: blockchainType,
            isVerified: true,
            verificationSignature: 'verified',
            displayName: displayName || (existingWallet as any).displayName
          } as any
        });
        console.log('Update result:', result);
      } else {
        // Create a new wallet profile
        console.log('Creating new wallet profile');
        result = await prisma.walletProfile.create({
          data: {
            // These field names match the Prisma schema which maps to snake_case in DB
            walletAddress: normalizedAddress,
            blockchainType: blockchainType,
            verificationSignature: 'verified',
            standaloneWallet: true,
            isPrimary: true,
            isVerified: true,
            displayName
          } as any
        });
        
        console.log('Created new wallet profile:', result);
      }
      
      // Log the wallet activity
      try {
        // First try using ActivityLogService
        const activityLogService = ActivityLogService.getInstance();
        await activityLogService.logActivity({
          wallet_address: normalizedAddress,
          activity_type: existingWallet ? 'WALLET_UPDATE' : 'WALLET_CREATE',
          user_id: null,
          details: { blockchainType }
        });
      } catch (logError) {
        console.warn('Failed to log wallet activity with service:', logError);
        
        // Fallback to direct Supabase logging if service fails
        try {
          console.log('Attempting direct activity logging with Supabase...');
          await supabaseAdmin
            .from('activity_logs')
            .insert({
              wallet_address: normalizedAddress,
              activity_type: existingWallet ? 'WALLET_UPDATE' : 'WALLET_CREATE',
              details: { blockchainType },
              timestamp: new Date().toISOString(),
              blockchain_type: blockchainType
            });
          console.log('Successfully logged activity directly with Supabase');
        } catch (directLogError) {
          console.warn('Failed to log activity directly with Supabase:', directLogError);
          // Non-critical error, continue execution
        }
      }
      
      return result;
    } catch (prismaError) {
      console.error('Error creating/updating wallet profile with Prisma:', prismaError);
      
      // Try direct Supabase connection as a second fallback
      try {
        console.log('Attempting direct Supabase connection...');
        const { data: existingWallet, error: findError } = await supabaseAdmin
          .from('wallet_profiles')
          .select('*')
          .eq('wallet_address', normalizedAddress)
          .single();
        
        if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw findError;
        }
        
        let result;
        if (existingWallet) {
          // Update existing wallet
          console.log(`Updating wallet profile with direct Supabase: ${existingWallet.id}`);
          const { data: updatedWallet, error: updateError } = await supabaseAdmin
            .from('wallet_profiles')
            .update({
              blockchain_type: blockchainType,
              is_verified: true,
              verification_signature: 'verified',
              display_name: displayName || existingWallet.display_name,
              last_updated: new Date().toISOString()
            })
            .eq('id', existingWallet.id)
            .select()
            .single();
          
          if (updateError) throw updateError;
          result = updatedWallet;
        } else {
          // Create new wallet
          console.log('Creating new wallet profile with direct Supabase');
          const { data: newWallet, error: insertError } = await supabaseAdmin
            .from('wallet_profiles')
            .insert({
              wallet_address: normalizedAddress,
              blockchain_type: blockchainType,
              is_verified: true,
              verification_signature: 'verified',
              standalone_wallet: true,
              is_primary: true,
              display_name: displayName,
              first_seen: new Date().toISOString(),
              last_updated: new Date().toISOString()
            })
            .select()
            .single();
          
          if (insertError) throw insertError;
          result = newWallet;
        }
        
        // Convert Supabase snake_case to camelCase for consistency
        const camelCaseResult = {
          id: result.id,
          walletAddress: result.wallet_address,
          blockchainType: result.blockchain_type,
          userId: null,
          isPrimary: result.is_primary,
          isVerified: result.is_verified,
          verificationSignature: result.verification_signature,
          firstSeen: new Date(result.first_seen),
          lastUpdated: new Date(result.last_updated),
          standaloneWallet: result.standalone_wallet,
          displayName: result.display_name,
          avatarSeed: result.avatar_seed,
          preferences: result.preferences || {}
        };
        
        return camelCaseResult as WalletProfile;
      } catch (supabaseError) {
        console.error('Error with direct Supabase connection:', supabaseError);
        
        // Final fallback to mock wallet profile service
        console.log('Falling back to mock wallet profile service...');
        const mockProfile = await mockWalletProfileService.createOrUpdateWalletProfile(
          normalizedAddress,
          blockchainType,
          displayName
        );
        
        return mockProfile;
      }
    }
  }
}

// Export singleton instance
export default new AuthService();
