import { BlockchainType } from './auth';

// Mock in-memory storage for wallet profiles
const mockWalletProfiles = new Map<string, MockWalletProfile>();

// Mock wallet profile type
export interface MockWalletProfile {
  id: string;
  walletAddress: string;
  blockchainType: string;
  userId: string | null;  // Add userId field to match Prisma schema
  isPrimary: boolean;
  isVerified: boolean;
  verificationSignature?: string;
  firstSeen: Date;
  lastUpdated: Date;
  standaloneWallet: boolean;
  displayName?: string;
  avatarSeed?: string;
  preferences: Record<string, any>;
}

/**
 * Mock Wallet Profile Service
 * Provides fallback functionality when database is not available
 */
export class MockWalletProfileService {
  /**
   * Find a wallet profile by address
   * @param walletAddress The wallet address to find
   * @returns The wallet profile or null if not found
   */
  async findWalletProfile(walletAddress: string): Promise<MockWalletProfile | null> {
    const normalizedAddress = walletAddress.toLowerCase();
    return mockWalletProfiles.get(normalizedAddress) || null;
  }

  /**
   * Create a new wallet profile
   * @param walletAddress The wallet address
   * @param blockchainType The blockchain type
   * @param displayName Optional display name
   * @returns The created wallet profile
   */
  async createWalletProfile(
    walletAddress: string, 
    blockchainType: BlockchainType,
    displayName?: string
  ): Promise<MockWalletProfile> {
    const normalizedAddress = walletAddress.toLowerCase();
    const now = new Date();
    
    const newProfile: MockWalletProfile = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      walletAddress: normalizedAddress,
      blockchainType,
      userId: null, // Wallet-only authentication doesn't require a user ID
      isPrimary: true,
      isVerified: true,
      verificationSignature: 'verified',
      firstSeen: now,
      lastUpdated: now,
      standaloneWallet: true,
      displayName,
      preferences: {}
    };
    
    mockWalletProfiles.set(normalizedAddress, newProfile);
    console.log(`[MOCK] Created wallet profile for ${normalizedAddress}`);
    return newProfile;
  }

  /**
   * Update an existing wallet profile
   * @param id The wallet profile ID
   * @param data The data to update
   * @returns The updated wallet profile
   */
  async updateWalletProfile(
    walletAddress: string,
    data: Partial<MockWalletProfile>
  ): Promise<MockWalletProfile> {
    const normalizedAddress = walletAddress.toLowerCase();
    const existingProfile = mockWalletProfiles.get(normalizedAddress);
    
    if (!existingProfile) {
      throw new Error(`Wallet profile not found for address: ${normalizedAddress}`);
    }
    
    const updatedProfile = {
      ...existingProfile,
      ...data,
      lastUpdated: new Date()
    };
    
    mockWalletProfiles.set(normalizedAddress, updatedProfile);
    console.log(`[MOCK] Updated wallet profile for ${normalizedAddress}`);
    return updatedProfile;
  }

  /**
   * Create or update a wallet profile
   * @param walletAddress The wallet address
   * @param blockchainType The blockchain type
   * @param displayName Optional display name
   * @returns The created or updated wallet profile
   */
  async createOrUpdateWalletProfile(
    walletAddress: string,
    blockchainType: BlockchainType,
    displayName?: string
  ): Promise<MockWalletProfile> {
    const normalizedAddress = walletAddress.toLowerCase();
    const existingProfile = await this.findWalletProfile(normalizedAddress);
    
    if (existingProfile) {
      return this.updateWalletProfile(normalizedAddress, {
        blockchainType,
        isVerified: true,
        verificationSignature: 'verified',
        displayName: displayName || existingProfile.displayName
      });
    } else {
      return this.createWalletProfile(normalizedAddress, blockchainType, displayName);
    }
  }

  /**
   * Log wallet activity
   * @param walletAddress The wallet address
   * @param activityType The type of activity
   * @param details Additional details
   */
  async logActivity(
    walletAddress: string,
    activityType: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    const normalizedAddress = walletAddress.toLowerCase();
    console.log(`[MOCK] Activity logged for ${normalizedAddress}: ${activityType}`, details);
    // In a real implementation, this would save to the activity_logs table
  }
}

// Export singleton instance
export const mockWalletProfileService = new MockWalletProfileService();
export default mockWalletProfileService;
