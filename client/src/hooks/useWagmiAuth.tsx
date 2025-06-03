import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import ActivityLogService, { ActivityType } from '../services/ActivityLogService';

// Define wallet profile type with wallet-first schema additions
interface WalletProfile {
  id: string;
  user_id?: string;
  wallet_address: string;
  blockchain_type: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_signature?: string;
  first_seen: string;
  last_updated: string;
  standalone_wallet?: boolean;
  display_name?: string;
  avatar_seed?: string;
  preferences?: Record<string, any>;
}

export interface User {
  id: string;
  email?: string | null;
  wallet_profiles: WalletProfile[];
}

/**
 * Hook for wallet authentication using wagmi
 */
export function useWagmiAuth() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [walletProfile, setWalletProfile] = useState<WalletProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activityLogger = ActivityLogService;

  // Fetch wallet profile whenever the address changes
  useEffect(() => {
    if (isConnected && address) {
      console.log('🔵 Wallet connected:', address);
      
      const handleWalletConnection = async () => {
        try {
          // First try to fetch the existing profile
          const normalizedAddress = address.toLowerCase();
          console.log('🔵 Looking for wallet profile with address:', normalizedAddress);
          
          const { data, error } = await supabase
            .from('wallet_profiles')
            .select('*')
            .eq('wallet_address', normalizedAddress)
            .single();

          console.log('🔵 Supabase query result:', { data, error });

          if (error || !data) {
            // No profile exists, so link the wallet
            console.log('🔴 No wallet profile found, creating one for address:', normalizedAddress);
            try {
              const result = await linkWallet();
              console.log('🟢 Wallet linking result:', result);
            } catch (linkError) {
              console.error('🔴 Error linking wallet:', linkError);
            }
          } else {
            // Profile exists, just set it
            console.log('🟢 Existing wallet profile found:', data);
            setWalletProfile(data);
          }
        } catch (err) {
          console.error('🔴 Error handling wallet connection:', err);
        }
      };
      
      handleWalletConnection();
    } else {
      console.log('🔵 No wallet connected or disconnected');
      setWalletProfile(null);
    }
  }, [isConnected, address]);

  // Fetch wallet profile from Supabase
  const fetchWalletProfile = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      
      const { data, error } = await supabase
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', normalizedAddress)
        .single();

      if (error) {
        console.error('Error fetching wallet profile:', error);
        // If no profile exists, this might be a first-time wallet connection
        // We'll create one during the linkWallet process
      } else if (data) {
        setWalletProfile(data);
      }
    } catch (error) {
      console.error('Error fetching wallet profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get authentication message for wallet signature
  const getAuthMessage = async (walletAddress: string) => {
    try {
      // Normalize wallet address to lowercase
      const normalizedAddress = walletAddress.toLowerCase();
      
      const { data } = await axios.get(`/api/auth/message/${normalizedAddress}`);
      return data.data.message;
    } catch (error) {
      console.error('Error getting auth message:', error);
      throw new Error('Failed to get authentication message');
    }
  };

  // Link wallet to user account - now supports wallet-first authentication
  const linkWallet = async () => {
    if (!address) {
      throw new Error('No wallet address available');
    }

    console.log('🔵 Starting wallet linking process for address:', address);
    setIsLoading(true);
    try {
      // Get authentication message
      console.log('🔵 Getting auth message...');
      let message;
      try {
        message = await getAuthMessage(address);
        console.log('🟢 Auth message received:', message);
      } catch (msgError) {
        console.error('🔴 Failed to get auth message:', msgError);
        throw msgError;
      }
      
      // Request signature from wallet
      console.log('🔵 Requesting signature from wallet...');
      let signature;
      try {
        signature = await signMessageAsync({ message });
        console.log('🟢 Signature received:', signature);
      } catch (signError) {
        console.error('🔴 User rejected signature request:', signError);
        throw signError;
      }
      
      // Verify signature and create wallet profile on server
      console.log('🔵 Sending signature to server for verification...');
      console.log('🔵 Payload:', {
        walletAddress: address.toLowerCase(),
        signature: signature.substring(0, 20) + '...',
        messageLength: message.length
      });
      
      let response;
      try {
        // Create a display name from the wallet address
        const displayName = `Wallet ${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
        
        // Create the complete payload with all required fields
        const payload = {
          walletAddress: address.toLowerCase(),
          signature,
          message,
          blockchainType: 'evm',
          displayName
        };
        
        console.log('🟢 Sending complete payload:', {
          ...payload,
          signature: payload.signature.substring(0, 10) + '...',
          message: payload.message.substring(0, 20) + '...'
        });
        
        response = await axios.post('/api/auth/wallet-auth', payload);
        console.log('🟢 Server response:', response.data);
      } catch (serverError: any) { // Type assertion to fix the lint error
        console.error('🔴 Server error during wallet auth:', serverError);
        console.error('🔴 Response:', serverError.response?.data);
        throw serverError;
      }
      
      // Log successful wallet connection
      console.log('🔵 Logging wallet connection activity...');
      try {
        await activityLogger.log(ActivityType.WALLET_CONNECT, null, address, { 
          blockchainType: 'evm', 
          success: true,
          standalone: true
        });
        console.log('🟢 Activity logged successfully');
      } catch (logError) {
        console.warn('🔴 Failed to log activity:', logError);
        // Non-critical error, continue
      }
      
      // Fetch updated wallet profile
      console.log('🔵 Fetching updated wallet profile...');
      try {
        await fetchWalletProfile(address);
        console.log('🟢 Wallet profile fetched successfully');
      } catch (fetchError) {
        console.error('🔴 Failed to fetch wallet profile:', fetchError);
        // Non-critical error, continue
      }
      
      return response.data.data;
    } catch (error) {
      console.error('🔴 Error linking wallet:', error);
      
      // Log failed attempt
      try {
        await activityLogger.log(ActivityType.WALLET_CONNECT, null, address, { 
          blockchainType: 'evm', 
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.warn('🔴 Failed to log failed activity:', logError);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove wallet connection
  const removeWallet = async () => {
    if (!address) {
      throw new Error('No wallet address available');
    }

    setIsLoading(true);
    try {
      // Store address for logging before disconnection
      const walletAddress = address.toLowerCase();
      
      // Disconnect wallet
      disconnect();
      
      // Clear local wallet profile state
      setWalletProfile(null);
      
      // Log wallet unlinking activity
      activityLogger.log(ActivityType.WALLET_DISCONNECT, null, walletAddress, { 
        blockchainType: 'evm', 
        success: true 
      });
      
      // Notify Supabase about disconnection (optional)
      try {
        await axios.post('/api/auth/logout', {
          walletAddress: walletAddress
        });
      } catch (logoutError) {
        // Non-critical error, just log it
        console.warn('Error logging out from server:', logoutError);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing wallet:', error);
      
      // Log failed attempt
      activityLogger.log(ActivityType.WALLET_DISCONNECT, null, address, { 
        blockchainType: 'evm', 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Upgrade to premium
  const upgradeToPremium = async () => {
    if (!address) {
      throw new Error('No wallet address available');
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        '/api/auth/upgrade',
        {
          walletAddress: address.toLowerCase()
        }
      );
      
      // Log premium upgrade activity
      activityLogger.log(ActivityType.PREMIUM_UPGRADE, null, address);
      
      // Refresh wallet profile
      await fetchWalletProfile(address);
      
      return data.data;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if wallet is premium - now supports both user-linked and standalone wallets
  const isPremium = (): boolean => {
    if (!walletProfile) return false;
    
    // Check if wallet is linked to a premium user
    if (walletProfile.user_id && walletProfile.is_verified) {
      return true;
    }
    
    // Check if standalone wallet has premium status in preferences
    if (walletProfile.standalone_wallet && walletProfile.preferences) {
      return Boolean(walletProfile.preferences.is_premium);
    }
    
    return false;
  };

  // Update wallet profile display name
  const updateWalletProfile = async (updates: Partial<Omit<WalletProfile, 'id' | 'wallet_address'>>) => {
    if (!address || !walletProfile) {
      throw new Error('No wallet profile available');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_profiles')
        .update(updates)
        .eq('wallet_address', address.toLowerCase())
        .select()
        .single();

      if (error) {
        console.error('Error updating wallet profile:', error);
        throw error;
      }

      setWalletProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating wallet profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    walletProfile,
    isLoading,
    linkWallet,
    removeWallet,
    isPremium: isPremium(),
    upgradeToPremium,
    updateWalletProfile
  };
}

export default useWagmiAuth;
