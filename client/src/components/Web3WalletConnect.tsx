import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { ActivityLogService, ActivityType } from '@/services/ActivityLogService';

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
  const { isConnected, address } = useAccount();
  const { walletProfile, isLoading, connectWallet, disconnectWallet } = useWalletAuth();

  // Effect to handle wallet connection
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (isConnected && address && !walletProfile && !isLoading) {
        console.log('🔵 Wallet connected, triggering authentication flow');
        try {
          // Generate a display name from the address
          const displayName = `Wallet ${address.substring(0, 6)}`;
          
          // Call our connectWallet function to authenticate
          const result = await connectWallet(displayName);
          
          if (result) {
            console.log('🟢 Wallet authenticated successfully:', result.id);
            // Log activity
            ActivityLogService.getInstance().log(
              ActivityType.WALLET_CONNECT,
              null,
              address.toLowerCase(),
              {
                blockchainType: 'evm',
                success: true,
                source: 'Web3WalletConnect'
              }
            );
          } else {
            console.error('🔴 Wallet authentication failed');
          }
        } catch (error) {
          console.error('🔴 Error authenticating wallet:', error);
        }
      }
    };
    
    handleWalletConnection();
  }, [isConnected, address, walletProfile, isLoading, connectWallet]);
  
  // Handle wallet connection when button is clicked
  const handleConnect = async () => {
    // The actual connection will be handled by RainbowKit
    // Our useWalletAuth hook will handle the authentication in the background via the useEffect
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('🔴 Error disconnecting wallet:', error);
    }
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
                        disabled={isLoading}
                      >
                        {isLoading ? 'Disconnecting...' : 'Disconnect'}
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
