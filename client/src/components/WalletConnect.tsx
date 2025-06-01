import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { ActivityType, logAuthActivity } from '@/services/ActivityLogService';

export const WalletConnect: React.FC = () => {
  const { linkWallet, getAuthMessage, wallets, removeWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];

      if (!walletAddress) {
        throw new Error('No wallet address found. Please try again.');
      }

      // Get authentication message from the server
      const message = await getAuthMessage(walletAddress);

      // Request signature from the user
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Link wallet to the user account
      await linkWallet(walletAddress, signature, message, 'evm');

      // Log wallet connection success
      logAuthActivity(
        ActivityType.WALLET_CONNECT,
        null,
        walletAddress,
        { blockchainType: 'evm', success: true }
      );

      // Success!
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
      
      // Log wallet connection failure
      logAuthActivity(
        ActivityType.WALLET_CONNECT,
        null,
        null,
        { error: errorMessage, success: false }
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveWallet = async (walletAddress: string) => {
    try {
      const success = await removeWallet(walletAddress);
      
      // Log wallet disconnect
      logAuthActivity(
        ActivityType.WALLET_DISCONNECT,
        null,
        walletAddress,
        { success }
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove wallet. Please try again.';
      setError(errorMessage);
      
      // Log wallet disconnect failure
      logAuthActivity(
        ActivityType.WALLET_DISCONNECT,
        null,
        walletAddress,
        { error: errorMessage, success: false }
      );
    }
  };
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">EVM Wallets</h2>
        
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-whisper-accent hover:bg-whisper-accent/80 text-whisper-text"
          size="sm"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-gray-500 mb-2">Connected wallets</div>
          <ul className="space-y-2">
            {wallets.map((wallet) => (
              <li key={wallet.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-mono text-sm">{formatAddress(wallet.walletAddress)}</span>
                </div>
                <Button
                  onClick={() => handleRemoveWallet(wallet.walletAddress)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
