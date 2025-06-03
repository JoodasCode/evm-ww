import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { ActivityLogService, ActivityType } from '../services/ActivityLogService';

// Define types
interface WalletProfile {
  id: string;
  user_id: string | null;
  wallet_address: string;
  blockchain_type: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_signature: string | null;
  first_seen: string;
  last_updated: string;
  standalone_wallet: boolean;
  display_name: string;
  avatar_seed: string;
  preferences: Record<string, any>;
}

interface WalletAuthContextType {
  walletProfile: WalletProfile | null;
  isLoading: boolean;
  error: Error | null;
  token: string | null;
  connectWallet: (displayName?: string) => Promise<WalletProfile | null>;
  disconnectWallet: () => void;
  fetchWalletProfile: (walletAddress: string) => Promise<WalletProfile | null>;
}

// Create context
const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined);

export const WalletAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [walletProfile, setWalletProfile] = useState<WalletProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Helper function to get consistent localStorage key for wallet JWT token
  const getWalletTokenKey = useCallback(() => {
    return 'wallet_whisperer.auth.token';
  }, []);

  // Function to get authentication message
  const getAuthMessage = useCallback(async (walletAddress: string) => {
    try {
      console.log(`Getting auth message for wallet: ${walletAddress}`);
      const response = await axios.get(`/api/auth/message/${walletAddress}`);
      console.log('Auth message received:', response.data);
      return response.data.data.message;
    } catch (err) {
      console.error('Error getting auth message:', err);
      throw err;
    }
  }, []);

  // Function to fetch wallet profile
  const fetchWalletProfile = useCallback(async (walletAddress: string): Promise<WalletProfile | null> => {
    try {
      // Normalize wallet address for consistency
      const normalizedAddress = walletAddress.toLowerCase();
      console.log(`Fetching wallet profile for address: ${normalizedAddress}`);
      
      const response = await axios.get(`/api/wallets/${normalizedAddress}`);
      console.log('Wallet profile response:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching wallet profile:', err);
      return null;
    }
  }, []);

  // Function to authenticate wallet
  const authenticateWallet = useCallback(async (walletAddress: string, signature: string, message: string, displayName?: string) => {
    try {
      // Normalize wallet address for consistency
      const normalizedAddress = walletAddress.toLowerCase();
      
      console.log(`Authenticating wallet: ${walletAddress}`);
      
      console.log('Authenticating wallet with details:', {
        walletAddress: normalizedAddress,
        signatureLength: signature?.length,
        messagePreview: message?.substring(0, 30) + '...',
        hasDisplayName: !!displayName
      });
      
      // Clear any previous errors
      setError(null);
      setIsLoading(true);
      
      // Call the backend to verify the signature and create/update the wallet profile
      const response = await axios.post('/api/auth/wallet-auth', {
        walletAddress: normalizedAddress,
        signature,
        message,
        blockchainType: 'evm',
        displayName
      });
      
      console.log('Authentication response:', {
        success: response.data.success,
        hasToken: !!response.data.data?.token,
        walletAddress: response.data.data?.wallet_address,
        isNewProfile: response.data.data?.isNewProfile
      });
      
      if (response.data.success) {
        const { token, ...walletProfileData } = response.data.data;
        
        // Store the token in localStorage
        if (token) {
          const storageKey = getWalletTokenKey();
          localStorage.setItem(storageKey, token);
          console.log('Token stored in localStorage');
          
          // Update token state
          setToken(token);
          
          // Set Authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Authorization header set for future requests');
        } else {
          console.warn('No token received from server');
        }
        
        // Update wallet profile state
        setWalletProfile(walletProfileData);
        
        // Invalidate any cached queries
        queryClient.invalidateQueries();
        
        // Log the activity
        ActivityLogService.getInstance().log(
          ActivityType.WALLET_CONNECT,
          null,
          normalizedAddress,
          {
            blockchainType: 'evm',
            success: true,
            isNewProfile: walletProfileData.isNewProfile
          }
        );
        
        return walletProfileData;
      } else {
        throw new Error(response.data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Error authenticating wallet:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(new Error(errorMessage));
      
      // Log the error
      if (walletAddress) {
        ActivityLogService.getInstance().log(
          ActivityType.ERROR,
          null,
          walletAddress.toLowerCase(),
          {
            context: 'wallet_authentication',
            error: errorMessage,
            blockchainType: 'evm'
          }
        );
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getWalletTokenKey, queryClient, setToken]);

  // Function to connect wallet
  const connectWallet = useCallback(async (displayName?: string): Promise<WalletProfile | null> => {
    if (!address || !isConnected) {
      console.error('Wallet not connected');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`=== WALLET CONNECTION PROCESS STARTED ===`);
      console.log(`Connecting wallet address: ${address}`);
      console.log(`Normalized wallet address: ${address.toLowerCase()}`);
      
      // Check if wallet profile already exists
      const existingProfile = await fetchWalletProfile(address);
      
      if (existingProfile) {
        console.log('Existing wallet profile found:', {
          id: existingProfile.id,
          address: existingProfile.wallet_address,
          displayName: existingProfile.display_name
        });
        
        // Log the activity
        console.log('Logging wallet connect activity...');
        ActivityLogService.getInstance().log(
          ActivityType.WALLET_CONNECT,
          null,
          address.toLowerCase(),
          {
            blockchainType: 'evm',
            newProfile: false
          }
        );
        
        console.log('=== WALLET CONNECTION COMPLETED (EXISTING) ===');
        return existingProfile;
      }
      
      console.log('No existing wallet profile found, proceeding with authentication...');
      
      // Get authentication message from backend
      console.log('Requesting authentication message...');
      const message = await getAuthMessage(address);
      
      // Request wallet signature
      console.log('Requesting signature from wallet...');
      const signature = await signMessageAsync({ message });
      console.log('Signature received, length:', signature?.length);
      console.log('Signature first 10 chars:', signature?.substring(0, 10) + '...');
      console.log('Signature last 10 chars:', '...' + signature?.substring(signature.length - 10));
      
      // Authenticate with backend
      console.log('Sending authentication request to backend...');
      const authResult = await authenticateWallet(address.toLowerCase(), signature, message, displayName);
      
      if (authResult) {
        console.log('Authentication successful, fetching wallet profile...');
        const profile = await fetchWalletProfile(address);
        
        if (profile) {
          console.log('Wallet profile details:', {
            displayName: profile.display_name,
            isVerified: profile.is_verified,
            firstSeen: profile.first_seen
          });
          
          setWalletProfile(profile);
          console.log('Wallet profile state updated with authenticated profile');
          
          // Log the activity
          console.log('Logging wallet connect activity for authenticated profile...');
          try {
            ActivityLogService.getInstance().log(
              ActivityType.WALLET_CONNECT,
              null,
              address.toLowerCase(),
              {
                blockchainType: 'evm',
                newProfile: authResult?.isNewProfile
              },
              profile.id // Pass the wallet profile ID
            );
            console.log('Activity logged successfully with wallet profile ID:', profile.id);
          } catch (logErr) {
            console.error('Error logging activity:', logErr);
          }
          
          console.log('=== WALLET CONNECTION COMPLETED (AUTHENTICATED) ===');
          return profile;
        } else {
          console.error('Failed to fetch wallet profile after authentication');
          throw new Error('Failed to fetch wallet profile after authentication');
        }
      } else {
        console.error('Authentication failed');
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('=== WALLET CONNECTION FAILED ===');
      console.error('Error connecting wallet:', err);
      
      // Provide more detailed error information
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      } else {
        console.error('Non-Error object thrown:', err);
      }
      
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Log the error
      console.log('Logging error activity...');
      try {
        const activityLogger = ActivityLogService.getInstance();
        activityLogger.log(
          ActivityType.ERROR,
          null,
          address?.toLowerCase(),
          {
            context: 'wallet_connect',
            error: err instanceof Error ? err.message : String(err)
          }
        );
        console.log('Error activity logged successfully');
      } catch (logErr) {
        console.error('Error logging activity:', logErr);
      }
      
      return null;
    } finally {
      setIsLoading(false);
      console.log('Wallet connection loading state set to false');
    }
  }, [address, isConnected, fetchWalletProfile, getAuthMessage, signMessageAsync, authenticateWallet, setWalletProfile, setIsLoading, setError]);

  // Function to disconnect wallet
  const disconnectWallet = useCallback(() => {
    console.log('Disconnecting wallet');
    
    try {
      // Log the activity before disconnecting
      if (address) {
        const activityLogger = ActivityLogService.getInstance();
        activityLogger.log(
          ActivityType.WALLET_DISCONNECT,
          null,
          address.toLowerCase(),
          {
            blockchainType: 'evm'
          }
        );
      }
      
      // Clear wallet profile state
      setWalletProfile(null);
      
      // Clear token state
      setToken(null);
      
      // Disconnect wallet
      disconnect();
      
      // Clear any stored tokens
      localStorage.removeItem(getWalletTokenKey());
      
      // Remove Authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear any errors
      setError(null);
      
      // Invalidate queries
      queryClient.invalidateQueries();
      
      console.log('Wallet disconnected successfully');
    } catch (err) {
      console.error('Error during wallet disconnection:', err);
      // Still attempt to clean up even if there was an error
      setWalletProfile(null);
      setToken(null);
      localStorage.removeItem(getWalletTokenKey());
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [address, disconnect, queryClient, getWalletTokenKey]);

  // Effect to handle wallet connection/disconnection
  useEffect(() => {
    const autoConnect = async () => {
      if (isConnected && address && !walletProfile) {
        console.log('Wallet connected but no profile, fetching profile...');
        try {
          const profile = await fetchWalletProfile(address);
          if (profile) {
            setWalletProfile(profile);
            // Log the activity
            ActivityLogService.getInstance().log(
              ActivityType.WALLET_CONNECT,
              null,
              address.toLowerCase(),
              {
                blockchainType: 'evm',
                autoConnect: true
              }
            );
          }
        } catch (err) {
          console.error('Error in auto-connect:', err);
        }
      } else if (!isConnected && walletProfile) {
        console.log('Wallet disconnected but profile still exists, clearing profile...');
        setWalletProfile(null);
      }
    };
    
    autoConnect();
  }, [isConnected, address, walletProfile, fetchWalletProfile]);

  // Effect to initialize session from localStorage token if available
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if we have a token in localStorage
        const storageKey = getWalletTokenKey();
        const storedToken = localStorage.getItem(storageKey);
        
        if (storedToken && address) {
          console.log('Found token in localStorage, initializing session...');
          
          // Set token in state
          setToken(storedToken);
          console.log('Token state updated from localStorage');
          
          // Fetch wallet profile
          const profile = await fetchWalletProfile(address);
          if (profile) {
            setWalletProfile(profile);
            console.log('Wallet profile loaded from stored session');
            
            // Log the activity
            ActivityLogService.getInstance().log(
              ActivityType.WALLET_CONNECT,
              null,
              address.toLowerCase(),
              {
                blockchainType: 'evm',
                autoConnect: true,
                fromStoredSession: true
              }
            );
          }
        }
      } catch (err) {
        console.error('Error initializing session from localStorage:', err);
      }
    };
    
    initializeSession();
  }, [address, isConnected, fetchWalletProfile, getWalletTokenKey]);

  // Provide context value
  const contextValue: WalletAuthContextType = {
    walletProfile,
    isLoading,
    error,
    token,
    connectWallet,
    disconnectWallet,
    fetchWalletProfile
  };

  return (
    <WalletAuthContext.Provider value={contextValue}>
      {children}
    </WalletAuthContext.Provider>
  );
};

// Hook to use wallet auth context
export const useWalletAuth = () => {
  const context = useContext(WalletAuthContext);
  
  if (!context) {
    throw new Error('useWalletAuth must be used within a WalletAuthProvider');
  }
  
  return context;
};

export default useWalletAuth;
