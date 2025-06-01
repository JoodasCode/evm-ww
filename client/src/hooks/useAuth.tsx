import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import axios, { AxiosError } from 'axios';
import { ActivityType, logAuthActivity } from '@/services/ActivityLogService';

// Types
interface User {
  id: string;
  email: string;
  isPremium: boolean;
  walletProfiles: WalletProfile[];
}

interface WalletProfile {
  id: string;
  walletAddress: string;
  userId: string | null;
  firstSeen: string;
  lastUpdated: string;
  blockchainType: string;
}

interface AuthContextType {
  user: User | null;
  wallets: WalletProfile[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  linkWallet: (walletAddress: string, signature: string, message: string, blockchainType: string) => Promise<WalletProfile>;
  removeWallet: (walletAddress: string) => Promise<boolean>;
  upgradeToPremium: () => Promise<void>;
  getAuthMessage: (walletAddress: string) => Promise<string>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile from our API
          const { data } = await axios.get('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          
          setUser(data.data);
          
          // Log successful authentication
          logAuthActivity(ActivityType.LOGIN, data.data.id, null, { method: 'session_restore' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Fetch user profile from our API
            const { data } = await axios.get('/api/auth/profile', {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
            
            setUser(data.data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            
            // Log successful authentication
            logAuthActivity(ActivityType.LOGIN, data.data.id, null, { method: 'auth_state_change' });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    logAuthActivity(ActivityType.LOGIN, null, null, { method: 'google' });
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };
  
  // Sign out
  const signOut = async () => {
    if (user) {
      logAuthActivity(ActivityType.LOGOUT, user.id, null);
    }
    await supabase.auth.signOut();
    setUser(null);
  };
  
  // Link wallet to user account
  const linkWallet = async (walletAddress: string, signature: string, message: string, blockchainType: string = 'evm') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be signed in to link a wallet');
      }
      
      // Normalize wallet address to lowercase
      const normalizedAddress = walletAddress.toLowerCase();
      
      const { data } = await axios.post(
        '/api/auth/link-wallet',
        { walletAddress: normalizedAddress, signature, message, blockchainType },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Log wallet linking activity
      logAuthActivity(ActivityType.WALLET_LINK, user?.id, normalizedAddress, { blockchainType });
      
      return data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Invalid signature. Please try again.');
      } else if (axiosError.response?.status === 403) {
        throw new Error('Not authorized to link this wallet.');
      }
      console.error('Error linking wallet:', error);
      throw new Error('Failed to link wallet. Please try again.');
    }
  };
  
  // Remove wallet from user account
  const removeWallet = async (walletAddress: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be signed in to remove a wallet');
      }
      
      // Normalize wallet address to lowercase
      const normalizedAddress = walletAddress.toLowerCase();
      
      const { data } = await axios.delete(
        `/api/auth/wallets/${normalizedAddress}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Log wallet unlinking activity
      logAuthActivity(ActivityType.WALLET_UNLINK, user?.id, normalizedAddress);
      
      return data.success;
    } catch (error) {
      console.error('Error removing wallet:', error);
      return false;
    }
  };
  
  // Get authentication message for wallet signature
  const getAuthMessage = async (walletAddress: string) => {
    try {
      // Normalize wallet address to lowercase
      const normalizedAddress = walletAddress.toLowerCase();
      
      const { data } = await axios.get(`/api/auth/message/${normalizedAddress}`);
      // Handle the standardized API response format
      return data.data.message;
    } catch (error) {
      console.error('Error getting auth message:', error);
      throw new Error('Failed to get authentication message');
    }
  };
  
  // Upgrade to premium
  const upgradeToPremium = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be signed in to upgrade');
    }
    
    await axios.post(
      '/api/auth/upgrade',
      {},
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    );
    
    // Refresh user data
    queryClient.invalidateQueries({ queryKey: ['user'] });
    
    // Log premium upgrade activity
    logAuthActivity(ActivityType.PREMIUM_UPGRADE, user?.id, null);
    
    // Update local state
    if (user) {
      setUser({
        ...user,
        isPremium: true
      });
    }
  };
  
  const value = {
    user,
    wallets: user?.walletProfiles || [],
    isLoading,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false,
    signInWithGoogle,
    signOut,
    linkWallet,
    removeWallet,
    upgradeToPremium,
    getAuthMessage
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
