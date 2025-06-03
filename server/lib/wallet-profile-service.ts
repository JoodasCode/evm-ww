import supabaseAdmin from './supabase-admin';
import ActivityLogService from './activity-log-service.js';

/**
 * Interface for wallet profile update data
 */
export interface WalletProfileUpdateData {
  display_name?: string;
  avatar_seed?: string;
  is_primary?: boolean;
  preferences?: Record<string, any>;
  standalone_wallet?: boolean;
}

/**
 * Service for managing wallet profiles in the Wallet Whisperer application
 */
export class WalletProfileService {
  private static instance: WalletProfileService;

  private constructor() {}

  /**
   * Get the singleton instance of WalletProfileService
   */
  public static getInstance(): WalletProfileService {
    if (!WalletProfileService.instance) {
      WalletProfileService.instance = new WalletProfileService();
    }
    return WalletProfileService.instance;
  }

  /**
   * Create or update a wallet profile
   * @param walletAddress The wallet address to create or update
   * @param blockchainType The blockchain type (default: 'evm')
   * @param userId Optional user ID to associate with the wallet profile
   * @returns The created or updated wallet profile
   */
  public async createOrUpdateWalletProfile(
    walletAddress: string,
    blockchainType: string = 'evm'
  ): Promise<any> {
    try {
      console.log('[WalletAuth] Creating/updating wallet profile for', walletAddress);
      console.log('[WalletAuth] Supabase URL:', process.env.SUPABASE_URL || 'Not set');
      console.log('[WalletAuth] Supabase Service Key (trimmed):', 
        process.env.SUPABASE_SERVICE_KEY ? 
        `${process.env.SUPABASE_SERVICE_KEY.slice(0, 6)}...` : 
        'Not set');
      
      // Normalize wallet address to lowercase
      const normalizedWalletAddress = walletAddress.toLowerCase();
      console.log('[WalletAuth] Normalized wallet address:', normalizedWalletAddress);

      // Check if wallet profile exists
      console.log('[WalletAuth] Checking if wallet profile exists in Supabase...');
      const { data: existingProfile, error: fetchError } = await supabaseAdmin
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', normalizedWalletAddress)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[WalletAuth] Error fetching wallet profile:', fetchError);
        console.error('[WalletAuth] Full error details:', JSON.stringify(fetchError));
        throw fetchError;
      }
      
      console.log('[WalletAuth] Existing profile check result:', existingProfile ? 'Found' : 'Not found');

      if (existingProfile) {
        // Update existing profile
        const updateData: Record<string, any> = {};
        
        // No user_id field in schema, so we don't need to update it
        // Only update other fields if needed in the future
        
        // Only perform update if there are changes to make
        if (Object.keys(updateData).length > 0) {
          const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('wallet_profiles')
            .update(updateData)
            .eq('wallet_address', normalizedWalletAddress)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating wallet profile:', updateError);
            throw updateError;
          }

          // Log the wallet update activity
          try {
            const activityLogService = ActivityLogService.getInstance();
            await activityLogService.logActivity({
              activity_type: 'WALLET_UPDATE',
              user_id: null,
              wallet_address: normalizedWalletAddress,
              wallet_profile_id: updatedProfile.id,
              details: {
                blockchain_type: blockchainType,
                changes: Object.keys(updateData)
              }
            });
          } catch (logError) {
            // Non-blocking error handling for activity logging
            console.error('Error logging wallet update activity:', logError);
          }

          return updatedProfile;
        }
        
        return existingProfile;
      } else {
        // Create new profile with all required fields
        console.log('[WalletAuth] Creating new wallet profile...');
        const displayName = `${blockchainType === 'evm' ? '0x' : ''}${normalizedWalletAddress.substring(0, 4)}...${normalizedWalletAddress.substring(normalizedWalletAddress.length - 4)}`;
        
        const newProfileData = {
          wallet_address: normalizedWalletAddress,
          blockchain_type: blockchainType,
          is_verified: false,
          is_primary: true,
          standalone_wallet: true,
          display_name: displayName,
          avatar_seed: Buffer.from(normalizedWalletAddress).toString('hex'),
          verification_signature: null,
          preferences: { theme: 'dark', notifications: true }
          // first_seen and last_updated will be set by default values in the database
        };

        console.log('[WalletAuth] Inserting new wallet profile with data:', {
          wallet_address: normalizedWalletAddress,
          blockchain_type: blockchainType,
          display_name: displayName
        });
        
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from('wallet_profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (insertError) {
          console.error('[WalletAuth] Error creating wallet profile:', insertError);
          console.error('[WalletAuth] Full error details:', JSON.stringify(insertError));
          throw insertError;
        }
        
        console.log('[WalletAuth] Successfully created new wallet profile:', newProfile);

        // Log the wallet creation activity
        try {
          const activityLogService = ActivityLogService.getInstance();
          await activityLogService.logActivity({
            activity_type: 'WALLET_CONNECT',
            user_id: null,
            wallet_address: normalizedWalletAddress,
            wallet_profile_id: newProfile.id,
            details: {
              blockchain_type: blockchainType,
              is_new_profile: true
            }
          });
        } catch (logError) {
          // Non-blocking error handling for activity logging
          console.error('Error logging wallet creation activity:', logError);
        }

        return newProfile;
      }
    } catch (error) {
      console.error('[WalletAuth] Failed to create/update wallet profile:', error);
      console.error('[WalletAuth] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[WalletAuth] Error stack:', error.stack);
      }
      console.error('Error in createOrUpdateWalletProfile:', error);
      throw error;
    }
  }

  /**
   * Update a wallet profile with new data
   * @param walletProfileId The ID of the wallet profile to update
   * @param updateData The data to update
   * @returns The updated wallet profile
   */
  public async updateWalletProfile(
    walletProfileId: string,
    updateData: WalletProfileUpdateData
  ): Promise<any> {
    try {
      // Update the wallet profile
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('wallet_profiles')
        .update(updateData)
        .eq('id', walletProfileId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating wallet profile:', updateError);
        throw updateError;
      }

      // Log the wallet update activity
      try {
        const activityLogService = ActivityLogService.getInstance();
        await activityLogService.logActivity({
          activity_type: 'WALLET_UPDATE',
          user_id: updatedProfile.user_id || null,
          wallet_address: updatedProfile.wallet_address,
          details: {
            blockchain_type: updatedProfile.blockchain_type,
            wallet_profile_id: updatedProfile.id,
            changes: Object.keys(updateData)
          }
        });
      } catch (logError) {
        // Non-blocking error handling for activity logging
        console.error('Error logging wallet update activity:', logError);
      }

      return updatedProfile;
    } catch (error) {
      console.error('[WalletAuth] Failed to create/update wallet profile:', error);
      console.error('[WalletAuth] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[WalletAuth] Error stack:', error.stack);
      }
      console.error('Error in updateWalletProfile:', error);
      throw error;
    }
  }

  /**
   * Mark a wallet profile as verified
   * @param walletAddress The wallet address to verify
   * @param signature The verification signature
   * @returns The updated wallet profile
   */
  public async verifyWalletProfile(
    walletAddress: string,
    signature: string
  ): Promise<any> {
    try {
      // Normalize wallet address to lowercase
      const normalizedWalletAddress = walletAddress.toLowerCase();

      // Update the wallet profile
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('wallet_profiles')
        .update({
          is_verified: true,
          verification_signature: signature
        })
        .eq('wallet_address', normalizedWalletAddress)
        .select()
        .single();

      if (updateError) {
        console.error('Error verifying wallet profile:', updateError);
        throw updateError;
      }

      // Log the wallet verification activity
      try {
        const activityLogService = ActivityLogService.getInstance();
        await activityLogService.logActivity({
          activity_type: 'WALLET_VERIFY',
          user_id: updatedProfile.user_id || null,
          wallet_address: normalizedWalletAddress,
          details: {
            blockchain_type: updatedProfile.blockchain_type,
            wallet_profile_id: updatedProfile.id
          }
        });
      } catch (logError) {
        // Non-blocking error handling for activity logging
        console.error('Error logging wallet verification activity:', logError);
      }

      return updatedProfile;
    } catch (error) {
      console.error('[WalletAuth] Failed to create/update wallet profile:', error);
      console.error('[WalletAuth] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[WalletAuth] Error stack:', error.stack);
      }
      console.error('Error in verifyWalletProfile:', error);
      throw error;
    }
  }

  /**
   * Get a wallet profile by address
   * @param walletAddress The wallet address to get
   * @returns The wallet profile or null if not found
   */
  public async getWalletProfile(walletAddress: string): Promise<any | null> {
    try {
      // Normalize wallet address to lowercase
      const normalizedWalletAddress = walletAddress.toLowerCase();

      // Get the wallet profile
      const { data: walletProfile, error: fetchError } = await supabaseAdmin
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', normalizedWalletAddress)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No profile found
          return null;
        }
        console.error('Error fetching wallet profile:', fetchError);
        throw fetchError;
      }

      return walletProfile;
    } catch (error) {
      console.error('[WalletAuth] Failed to create/update wallet profile:', error);
      console.error('[WalletAuth] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[WalletAuth] Error stack:', error.stack);
      }
      console.error('Error in getWalletProfile:', error);
      throw error;
    }
  }
}

export default WalletProfileService;
