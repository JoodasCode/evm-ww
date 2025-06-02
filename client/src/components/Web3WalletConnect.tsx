import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useConfig } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { ActivityType } from '@/services/ActivityLogService';
import activityLogService from '@/services/ActivityLogService';

// Define wallet types
export type WalletType = 'metamask' | 'coinbase' | 'walletconnect' | 'okx';

// Use the existing activity logger singleton
// Use the existing Supabase client from lib/supabase

export interface Web3WalletConnectProps {
  className?: string;
  showDisconnect?: boolean;
}

const Web3WalletConnect: React.FC<Web3WalletConnectProps> = ({
  className = '',
  showDisconnect = true,
}) => {
  // In wagmi v2, useAccount returns the first address if multiple are connected
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get or create user profile in Supabase when wallet connects
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (isConnected && address) {
        try {
          setIsLoading(true);
          
          // Check if wallet exists in database
          const { data: existingWallet, error: walletError } = await supabase
            .from('wallet_profiles')
            .select('user_id, address')
            .eq('address', address.toLowerCase())
            .single();
            
          if (walletError && walletError.code !== 'PGRST116') {
            console.error('Error checking wallet:', walletError);
            return;
          }
          
          if (existingWallet) {
            // Wallet exists, use the associated user
            setUserId(existingWallet.user_id);
            activityLogService.log(
              ActivityType.WALLET_CONNECT,
              existingWallet.user_id,
              address,
              { blockchainType: 'evm', walletType: getWalletType(), success: true }
            );
          } else {
            // Create new user profile if wallet doesn't exist
            const { data: newUser, error: userError } = await supabase
              .from('user_profiles')
              .insert([{ is_premium: false }])
              .select('id')
              .single();
              
            if (userError) {
              console.error('Error creating user profile:', userError);
              throw userError;
            }
            
            // Link wallet to user profile
            const { error: linkError } = await supabase
              .from('wallet_profiles')
              .insert([{ user_id: newUser.id, address: address.toLowerCase(), is_verified: true }]);
              
            if (linkError) {
              console.error('Error linking wallet to profile:', linkError);
              throw linkError;
            }
            
            setUserId(newUser.id);
            activityLogService.log(
              ActivityType.WALLET_CONNECT,
              newUser.id,
              address,
              { blockchainType: 'evm', walletType: getWalletType(), success: true }
            );
          }
        } catch (err) {
          console.error('Error handling wallet connection:', err);
          activityLogService.log(
            ActivityType.WALLET_CONNECT,
            null,
            address,
            { blockchainType: 'evm', error: (err as Error).message, success: false }
          );
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleWalletConnection();
  }, [isConnected, address]);

  // Handle wallet disconnection
  const handleDisconnect = () => {
    if (userId) {
      activityLogService.log(
        ActivityType.WALLET_DISCONNECT,
        userId,
        address as string,
        { blockchainType: 'evm', walletType: getWalletType() }
      );
    }
    disconnect();
    setUserId(null);
  };

  // Helper function to determine wallet type
  const getWalletType = (): WalletType => {
    // In wagmi v2, we can't directly access the provider properties
    // This is a simplified detection that works with most common wallets
    if (typeof window !== 'undefined' && window.ethereum) {
      // Need to use any type since ethereum providers have non-standard properties
      const ethereum = window.ethereum as any;
      if (ethereum.isMetaMask) return 'metamask';
      if (ethereum.isCoinbaseWallet) return 'coinbase';
      if (ethereum.isOKXWallet) return 'okx';
    }
    return 'walletconnect';
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          // Note: In RainbowKit v2, authenticationStatus is removed
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
              className={`flex items-center gap-2 ${className}`}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow hover:bg-destructive/90"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    {showDisconnect && (
                      <button
                        onClick={handleDisconnect}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow hover:bg-destructive/90"
                      >
                        Disconnect
                      </button>
                    )}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80"
                    >
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default Web3WalletConnect;
